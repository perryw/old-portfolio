class Project < ActiveRecord::Base
  include ActionView::Helpers::TextHelper
  belongs_to :course
  
  has_many :deliverables, :as => :owner, :dependent => :destroy
  has_many :collaborations, :as => :product, :dependent => :destroy
  has_many :collaborators, :through => :collaborations
  
  has_many :resources, :as => :resource_owner
  acts_as_taggable_on :tags
  def ordered_resources
    resources_order = self.resources_order.split(',').collect!{ |n| n.to_i } unless self.resources_order.nil? || self.resources_order.empty? 
    resources_order ||= self.resource_ids
    return resources_order.collect{ |r| Resource.find(r) }
  end
  def ordered_deliverables
    deliverables_order = self.deliverables_order.split(',').collect!{ |n| n.to_i } unless self.deliverables_order.nil? || self.deliverables_order.empty?
    deliverables_order ||= self.deliverable_ids
    return deliverables_order.collect{ |d| Deliverable.find(d) }
  end
  def total_collaborators # every collaborator, even those who i did not directly deal with
    collabs = Array.new
    self.deliverables.each do |deliv|
      collabs |= deliv.collaborators
    end
    return collabs | self.collaborators
  end
  def id_and_class
    "#{self.id},#{self.class.to_s}"
  end
  def all_resources
    @all = Array.new
    self.deliverables.each do |deliv|
      @all.concat(deliv.resources)
    end
    @all.concat(self.resources)
  end
  def deliverable_tags
    self.deliverables.collect{ |d| d.tag_list }.flatten.uniq
  end
  def snippet
   truncate(description.gsub(/<(\/)?(blockquote).*?>/,'').gsub(/(&#8221;)|(&#8220;)/,''), :length => APP_CONFIG['settings']['snippet_length']) 
  end
end
