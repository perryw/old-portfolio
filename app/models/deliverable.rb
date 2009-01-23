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
  def ordered_resources
    resources_order = self.resources_order.split(',').collect!{ |n| n.to_i } unless self.resources_order.nil? || self.resources_order.empty?
    resources_order ||= self.resource_ids
    return resources_order.collect{ |r| Resource.find(r) }
  end
end
