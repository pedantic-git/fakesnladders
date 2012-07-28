class Topic < ActiveRecord::Base
  attr_accessible :title
  has_many :tweets
  has_many :markov_chains
  has_many :choices
  
  validates_uniqueness_of :title
end
