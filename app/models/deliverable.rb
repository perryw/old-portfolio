class Deliverable < ActiveRecord::Base
  attr_accessor :key_resource
  belongs_to :owner, :polymorphic => true #project
  has_many :collaborations, :as => :product, :dependent => :destroy
  has_many :collaborators, :through => :collaborations
  has_many :resources, :as => :resource_owner
  acts_as_taggable_on :tags
  def owner_id_and_class
    "#{self.owner_id},#{self.owner.class}"
  end
end
