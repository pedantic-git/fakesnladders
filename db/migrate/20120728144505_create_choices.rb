class CreateChoices < ActiveRecord::Migration
  def change
    create_table :choices do |t|
      t.references :topic
      t.belongs_to :option_a
      t.belongs_to :option_b

      t.timestamps
    end
    add_index :choices, :topic_id
    add_index :choices, :option_a_id
    add_index :choices, :option_b_id
  end
end
