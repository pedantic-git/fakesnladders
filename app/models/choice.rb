class Choice < ActiveRecord::Base
  belongs_to :topic
  belongs_to :option_a, :class_name => 'Tweet'
  belongs_to :option_b, :class_name => 'Tweet'
  # attr_accessible :title, :body
end
