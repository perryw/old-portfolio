class CreateResources < ActiveRecord::Migration
  def self.up
    create_table :resources do |t|
      
      # required attachment_fu columns
      t.column :parent_id,  :integer
      t.column :content_type, :string
      t.column :filename, :string    
      t.column :thumbnail, :string 
      t.column :size, :integer
      t.column :width, :integer
      t.column :height, :integer
      
      t.references :resource_owner, :polymorphic => true  # for polymorphic association
      t.string :alt_text
      t.string :url
      t.text :description

      t.timestamps
    end
  end
  
  def self.down
    drop_table :resources
  end
end
