class RedoAddHasSlideshare < ActiveRecord::Migration
  def self.up
    add_column :resources, :has_slideshare, :boolean, :null => false, :default => false
    Resource.reset_column_information
  end

  def self.down
    remove_column :resources, :has_slideshare
    Resource.reset_column_information
  end
end
