class AddOverlayToResources < ActiveRecord::Migration
  def self.up
    add_column :resources, :is_overlay, :boolean, :null => false, :default => false
    Resource.reset_column_information
  end

  def self.down
    remove_column :resources, :is_overlay
    Resource.reset_column_information
  end
end
