class User < ActiveRecord::Base
  attr_accessible :provider, :uid, :name, :email, :position, :avatar_url

  def self.create_with_omniauth(auth)
    create! do |user|
      user.provider = auth['provider']
      user.uid = auth['uid']
      if auth['info']
         user.name = auth['info']['name'] || ""
         user.email = auth['info']['email'] || ""
      end
    end
  end

  def for_api
  	{
  		:id => self.id, 
  		:avatar_url => self.avatar_url,
  	 	:position => self.position
  	}
  end
  
end
