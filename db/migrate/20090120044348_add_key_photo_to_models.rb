class AddKeyPhotoToModels < ActiveRecord::Migration
  def self.up
    add_column :courses, 'key_resource_id', :integer
    add_column :projects, 'key_resource_id', :integer
    Course.reset_column_information
    Project.reset_column_information
  end

  def self.down
  end
end
