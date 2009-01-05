class CreateDeliverables < ActiveRecord::Migration
  def self.up
    create_table :deliverables do |t|
      t.string :name
      t.text :description
      
      t.references :project
      t.references :collaborator
      
      t.timestamps
    end
  end

  def self.down
    drop_table :deliverables
  end
end
