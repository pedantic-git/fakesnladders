Fakesnladders::Application.routes.draw do
  root :to => "home#index"
  resources :users, :only => [ :show, :edit, :update ]
  match '/auth/:provider/callback' => 'sessions#create'
  match '/signin' => 'sessions#new', :as => :signin
  match '/signout' => 'sessions#destroy', :as => :signout
  match '/auth/failure' => 'sessions#failure'
  
  namespace :api do
  	resources :users, :only => [:index, :show, :update] do
  		get 'me', :on => :collection
  	end
  	resources :choices, :only => [:new, :update]
  end
  	
end
