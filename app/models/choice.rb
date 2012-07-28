class Choice < ActiveRecord::Base
  belongs_to :topic
  belongs_to :option_a, :class_name => 'Tweet'
  belongs_to :option_b, :class_name => 'Tweet'
  # attr_accessible :title, :body
  
  def self.create_randomly(params)
  	topic = Topic.where(:title => params[:topic]).first!
  	real = Tweet.where(:topic_id => topic, :fake => false).order("RANDOM()").first
  	fake = Tweet.where(:topic_id => topic, :fake => true).order("RANDOM()").first
  	
  	a_b = [real,fake].shuffle
  	c = Choice.new
  	c.topic = topic
  	c.option_a = a_b[0]
  	c.option_b = a_b[1]
  	c.save!
  	c
  end
  
  def for_api
  	{
  	  :id => self.id,
  	  :topic => self.topic.title,
  		:a => self.option_a.text,
  		:b => self.option_b.text
  	}
  end
  
  # option is 'a' or 'b' - returns false if the fake one
  def choose(option)
  	!((option == 'a' ? self.option_a : self.option_b).fake?)
  end
  
end
