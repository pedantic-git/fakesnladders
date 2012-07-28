CREATE TABLE "choices" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "topic_id" integer, "option_a_id" integer, "option_b_id" integer, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL);
CREATE TABLE "markov_chains" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "current" varchar(255), "next" varchar(255), "topic_id" integer, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "count" integer);
CREATE TABLE "schema_migrations" ("version" varchar(255) NOT NULL);
CREATE TABLE "topics" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar(255), "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "since_id" varchar);
CREATE TABLE "tweets" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "text" varchar(255), "fake" boolean, "topic_id" integer, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "sender" varchar(255));
CREATE TABLE "users" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(255), "email" varchar(255), "provider" varchar(255), "uid" varchar(255), "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "position" integer, "avatar_url" varchar(255));
CREATE INDEX "index_choices_on_option_a_id" ON "choices" ("option_a_id");
CREATE INDEX "index_choices_on_option_b_id" ON "choices" ("option_b_id");
CREATE INDEX "index_choices_on_topic_id" ON "choices" ("topic_id");
CREATE INDEX "index_markov_chains_on_topic_id" ON "markov_chains" ("topic_id");
CREATE INDEX "index_tweets_on_topic_id" ON "tweets" ("topic_id");
CREATE UNIQUE INDEX "unique_schema_migrations" ON "schema_migrations" ("version");
INSERT INTO schema_migrations (version) VALUES ('20120728120328');

INSERT INTO schema_migrations (version) VALUES ('20120728142351');

INSERT INTO schema_migrations (version) VALUES ('20120728142729');

INSERT INTO schema_migrations (version) VALUES ('20120728143242');

INSERT INTO schema_migrations (version) VALUES ('20120728144505');

INSERT INTO schema_migrations (version) VALUES ('20120728151703');

INSERT INTO schema_migrations (version) VALUES ('20120728151926');

INSERT INTO schema_migrations (version) VALUES ('20120728152035');

INSERT INTO schema_migrations (version) VALUES ('20120728153925');

INSERT INTO schema_migrations (version) VALUES ('20120728190615');

INSERT INTO schema_migrations (version) VALUES ('20120728190824');