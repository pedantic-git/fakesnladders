class RemoveProbabilityFromMarkovChains < ActiveRecord::Migration
  def up
    remove_column :markov_chains, :probability
  end

  def down
    add_column :markov_chains, :probability, :float
  end
end
