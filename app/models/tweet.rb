class Tweet < ActiveRecord::Base
  belongs_to :topic
  attr_accessible :fake, :text  
end
