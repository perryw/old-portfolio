class AddOverlayToModels < ActiveRecord::Migration
  def self.up
    add_column :courses, :overlay_id, :integer
    add_column :projects, :overlay_id, :integer
    add_column :deliverables, :overlay_id, :integer
    Course.reset_column_information
    Project.reset_column_information
    Deliverable.reset_column_information
  end

  def self.down
    remove_column :courses, :overlay_id
    remove_column :projects, :overlay_id
    remove_column :deliverables, :overlay_id
    Course.reset_column_information
    Project.reset_column_information
    Deliverable.reset_column_information
  end
end
