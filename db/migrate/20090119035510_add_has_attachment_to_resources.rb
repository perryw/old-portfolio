class AddHasAttachmentToResources < ActiveRecord::Migration
  def self.up
    #add_column :resources, "has_image", :boolean
    Resource.reset_column_information
  end

  def self.down
  end
end
