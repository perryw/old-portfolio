class AddSlideshareEmbedToResources < ActiveRecord::Migration
  def self.up
    add_column :resources, :embed, :text
    Resource.reset_column_information
  end

  def self.down
  end
end
