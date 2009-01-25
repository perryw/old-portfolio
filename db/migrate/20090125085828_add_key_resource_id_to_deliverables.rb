class AddKeyResourceIdToDeliverables < ActiveRecord::Migration
  def self.up
    add_column :deliverables, :key_resource_id, :integer
    Deliverable.reset_column_information
  end

  def self.down
  end
end
