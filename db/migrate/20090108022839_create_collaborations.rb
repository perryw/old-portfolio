class CreateCollaborations < ActiveRecord::Migration
  def self.up
    create_table :collaborations do |t|
      t.references :collaborator
      t.references :product, :polymorphic => true
      t.timestamps
    end
  end

  def self.down
    drop_table :collaborations
  end
end
