class AddCountToMarkovChains < ActiveRecord::Migration
  def change
    add_column :markov_chains, :count, :integer
  end
end
