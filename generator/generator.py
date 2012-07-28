#!/usr/bin/env python
import sys
import json
import urllib
import urllib2
import random
import psycopg2

DB_HOST = 'fakesnladders-50mrubberduckie.dotcloud.com'
DB_PORT = 33209
DB_NAME = 'template1'
DB_USER = 'root'
DB_PASSWORD = 'nTRhWHrqmiuHYE7lJ5ea'
SEARCH_URL = 'http://search.twitter.com/search.json?q=%(topic)s&result_type=recent&rpp=100&since_id=%(since_id)s'
HTTP_TIMEOUT = 120 # seconds

def get_recent_tweets(topic, since_id):
    try:
        r = urllib2.urlopen(SEARCH_URL % {'topic': urllib.quote_plus(topic), 'since_id': urllib.quote_plus(since_id)}, None, HTTP_TIMEOUT)
    except urllib2.URLError, e:
        print 'urllib2.urlopen failed:', e
        sys.exit(1)

    try:
        data = r.read()
    except e:
        print 'reading HTTP response failed:', e
        sys.exit(1)

    try:
        data = json.loads(data)
    except ValueError, e:
        print 'json.loads failed:', e
        sys.exit(1)

    if 'results' not in data:
        print 'json missing results list'
        sys.exit(1)

    return data

def load_topics(cursor):
    return (r[0] for r in cursor.execute('SELECT title FROM topics'))

def load_topic_id(cursor, topic):
    cursor.execute('SELECT id FROM topics WHERE title=?', (topic,))
    return cursor.fetchone()[0]

def load_since_id(cursor, topic):
    cursor.execute('SELECT since_id FROM topics WHERE title=?', (topic,))
    return cursor.fetchone()[0]

def store_since_id(cursor, topic, since_id):
    cursor.execute('UPDATE topics SET since_id=? WHERE title=?', (since_id, topic))

def load_markov_chain(cursor, topic, mc):
    for current, next_, count in cursor.execute('SELECT current, next, count FROM markov_chains WHERE topic_id=?', (load_topic_id(cursor, topic),)):
        bucket = mc.chain.get(current, {})
        bucket[next_] = count
        mc.chain[current] = bucket

def store_markov_chain(cursor, topic, mc):
    topic_id = load_topic_id(cursor, topic)

    for current in mc.chain:
        bucket = mc.chain[current]
        for next_ in bucket:
            cursor.execute('INSERT OR REPLACE INTO markov_chains (topic_id, current, next, count, created_at, updated_at) VALUES (?, ?, ?, ?, "", "")', (topic_id, current, next_, bucket[next_]))

def load_random_user(cursor, topic):
    cursor.execute('SELECT sender FROM tweets WHERE topic_id=? ORDER BY RANDOM() LIMIT 1', (load_topic_id(cursor, topic),))
    return cursor.fetchone()[0]

def store_tweet(cursor, topic, sender, text, fake):
    cursor.execute('INSERT INTO tweets (text, fake, topic_id, sender, created_at, updated_at) VALUES (?, ?, ?, ?, "", "")', (text, fake, load_topic_id(cursor, topic), sender))

class MarkovChain(object):
    def __init__(self, cardinality):
        self.cardinality = cardinality
        self.chain = {}

    def _add_tokens(self, tokens):
        for i in xrange(len(tokens) - self.cardinality):
            current = ' '.join(tokens[i:i + self.cardinality])
            next_ = tokens[i + self.cardinality]

            bucket = self.chain.get(current, {})
            val = bucket.get(next_, 0)

            bucket[next_] = val + 1
            self.chain[current] = bucket

    def add_input(self, s):
        words = s.split()
        tokens = ['@@start@@']
        for word in words:
            if word[-1] in '.!?':
                if len(word) != 1:
                    tokens.append(word[:-1])
                    tokens.append(word[-1])
                    tokens.append('@@start@@')
                    self._add_tokens(tokens)
                tokens = ['@@start@@']
            elif word[-1] in ',;:':
                tokens.append(word[:-1])
            else:
                tokens.append(word)
        if len(tokens) > 1:
            tokens.append('@@start@@')
            self._add_tokens(tokens)

    def _choose_first_tuple(self):
        return random.choice(list(c for c in self.chain if c.startswith('@@start@@')))

    def _choose_next(self, bucket):
        total = sum(bucket.values())
        choice = random.randint(0, total - 1)
        for next_ in bucket:
            choice -= bucket[next_]
            if choice <= 0:
                return next_
        raise Exception('should never get here')

    def generate(self):
        current = self._choose_first_tuple()
        sentence = ' '.join(current.split()[1:])
        while True:
            next_ = self._choose_next(self.chain[current])
            current = ' '.join(current.split()[1:] + [next_])
            if next_ == '@@start@@':
                # Try again if we only generated one word.  This happens when
                # people start and end tweets with a hash tag, and therefore
                # makes the algorithm generate just the hash tag.
                if len(sentence.split()) == 1:
                    current = self._choose_first_tuple()
                    sentence = ' '.join(current.split()[1:])
                    continue
                break
            elif next_ in '.!?,;:':
                sentence += next_
            elif sentence:
                sentence += ' ' + next_
            else:
                sentence = next_
        return sentence

conn = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)
cursor = conn.cursor()

for topic in load_topics(cursor):
    print 'Topic:', topic
    since_id = load_since_id(cursor, topic)
    data = get_recent_tweets(topic, since_id)
    store_since_id(cursor, topic, data['max_id_str'])
    print 'Got %d new tweets' % len(data['results'])

    mc = MarkovChain(1)
    load_markov_chain(cursor, topic, mc)

    for result in data['results']:
        # Skip retweets
        if result['text'].startswith('RT '):
            continue

        mc.add_input(result['text'])
        store_tweet(cursor, topic, result['from_user'], result['text'], False)

    store_markov_chain(cursor, topic, mc)

    for i in xrange(10):
        sender = load_random_user(cursor, topic)
        store_tweet(cursor, topic, sender, mc.generate(), True)

conn.commit()
