class AddUrlToProjects < ActiveRecord::Migration
  def self.up
    add_column :projects, :project_url, :string
    Project.reset_column_information
  end

  def self.down
    remove_column :projects, :project_url
    Project.reset_column_information
  end
end
