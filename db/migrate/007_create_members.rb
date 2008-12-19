class CreateMembers < ActiveRecord::Migration
  def self.up
    create_table :collaborators do |t|
      t.string :lastname
      t.string :firstname
      t.string :uniqname

      t.timestamps
    end
  end

  def self.down
    drop_table :collaborators
  end
end
