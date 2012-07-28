# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120728153925) do

  create_table "choices", :force => true do |t|
    t.integer  "topic_id"
    t.integer  "option_a_id"
    t.integer  "option_b_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "choices", ["option_a_id"], :name => "index_choices_on_option_a_id"
  add_index "choices", ["option_b_id"], :name => "index_choices_on_option_b_id"
  add_index "choices", ["topic_id"], :name => "index_choices_on_topic_id"

  create_table "markov_chains", :force => true do |t|
    t.string   "current"
    t.string   "next"
    t.float    "probability"
    t.integer  "topic_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "markov_chains", ["topic_id"], :name => "index_markov_chains_on_topic_id"

  create_table "topics", :force => true do |t|
    t.string   "title"
    t.datetime "created_at",                :null => false
    t.datetime "updated_at",                :null => false
    t.string   "since_id",   :limit => nil
  end

  create_table "tweets", :force => true do |t|
    t.string   "text"
    t.boolean  "fake"
    t.integer  "topic_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.string   "sender"
  end

  add_index "tweets", ["topic_id"], :name => "index_tweets_on_topic_id"

  create_table "users", :force => true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "provider"
    t.string   "uid"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.integer  "position"
    t.string   "avatar_url"
  end

end
