class AddSinceIdToTopics < ActiveRecord::Migration
  def change
    add_column :topics, :since_id, :varchar
  end
end
