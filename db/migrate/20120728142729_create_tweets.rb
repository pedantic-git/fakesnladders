class CreateTweets < ActiveRecord::Migration
  def change
    create_table :tweets do |t|
      t.string :text
      t.boolean :fake
      t.references :topic

      t.timestamps
    end
    add_index :tweets, :topic_id
  end
end
