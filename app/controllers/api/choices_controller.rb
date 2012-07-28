class Api::ChoicesController < ApplicationController
	
	def new
		if !params[:topic]
			render :json => {:error => 'no topic supplied'}, :status => :unprocessable_entity
		else
			render :json => Choice.create_randomly(:topic => params[:topic]).for_api
		end
	end
	
	def update
		c = Choice.find(params[:id])
		render :json => { :answer => (c.choose(params[:option]) ? 'real' : 'fake') }
	end
	
end
