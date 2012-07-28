#!/usr/bin/env python
import sys
import json
import urllib
import urllib2
import random

TOPIC = '#leedshack'
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
                break
            elif next_ in '.!?,;:':
                sentence += next_
            elif sentence:
                sentence += ' ' + next_
            else:
                sentence = next_
        return sentence

mc = MarkovChain(1)

# TODO persist since_id
data = get_recent_tweets(TOPIC, '0')
#open('/tmp/twitter_data.json', 'w').write(json.dumps(data))
#data = json.loads(open('/tmp/twitter_data.json', 'r').read())
for result in data['results']:
    # Skip retweets
    if result['text'].startswith('RT '):
        continue

    mc.add_input(result['text'])
#    print '@%s' % result['from_user']
#    print result['text']

#mc.add_input('This is a test!')
#mc.add_input('This is a hack day')
#mc.add_input('Let\'s see if this works.')
#mc.add_input('Another tweet from me!')

for x in xrange(20):
    print mc.generate()
