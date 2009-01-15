class AddEmailColumnToCollaborators < ActiveRecord::Migration
  def self.up
    add_column :collaborators, "email", :string
    add_column :collaborators, "url", :string
    Collaborator.reset_column_information
  end

  def self.down
  end
end
