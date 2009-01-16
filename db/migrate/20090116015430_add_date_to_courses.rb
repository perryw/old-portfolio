class AddDateToCourses < ActiveRecord::Migration
  def self.up
    add_column :courses, "date", :string
    Course.reset_column_information
  end

  def self.down
  end
end
