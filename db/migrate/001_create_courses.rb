class CreateCourses < ActiveRecord::Migration
  def self.up
    create_table :courses do |t|
      t.string :dept
      t.integer :courseno
      t.text :description
      t.string :coursename

      t.timestamps
    end
  end

  def self.down
    drop_table :courses
  end
end
