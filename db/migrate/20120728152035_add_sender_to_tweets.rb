class AddSenderToTweets < ActiveRecord::Migration
  def change
    add_column :tweets, :sender, :string
  end
end
