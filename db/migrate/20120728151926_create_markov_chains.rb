class CreateMarkovChains < ActiveRecord::Migration
  def change
    create_table :markov_chains do |t|
      t.string :current
      t.string :next
      t.float :probability
      t.references :topic

      t.timestamps
    end
    add_index :markov_chains, :topic_id
  end
end
