class Api::UsersController < ApplicationController
	
	def index
		render :json => User.all.collect {|u| u.for_api}
	end
	
	def show
		render :json => User.find(params[:id]).for_api
	end
	
	def me
		if current_user
			render :json => current_user.for_api
		else
			render :json => {:error => 'please log in'}, :status => :unauthorized
		end
	end
	
	def update
		u = User.find(params[:id])
		u.position = params[:position]
		u.save!
		render :json => u.for_api
	end
	
end
