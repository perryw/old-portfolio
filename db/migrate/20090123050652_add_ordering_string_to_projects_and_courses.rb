class AddOrderingStringToProjectsAndCourses < ActiveRecord::Migration
  def self.up
    # order is a string that's supposed to be converted back to an array that dictates the ordering of multiple elements
    #  should be of form [id1, id2, id3]
    add_column :projects,     :deliverables_order, :string
    add_column :projects,     :resources_order, :string
    add_column :courses,      :projects_order, :string
    add_column :courses,      :deliverables_order, :string
    add_column :courses,      :resources_order, :string
    add_column :deliverables, :resources_order, :string
    Deliverable.reset_column_information
    Project.reset_column_information
    Course.reset_column_information
  end

  def self.down
  end
end
