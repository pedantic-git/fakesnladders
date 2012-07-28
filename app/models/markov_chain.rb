class MarkovChain < ActiveRecord::Base
  belongs_to :topic
  attr_accessible :current, :next, :probability
end
