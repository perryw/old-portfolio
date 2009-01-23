class Course < ActiveRecord::Base
  has_many :projects
  has_many :deliverables, :as => :owner, :dependent => :destroy #, :through => :projects
  has_many :resources, :as => :resource_owner
  acts_as_taggable_on :tags
  def title
    "#{dept} #{courseno}"
  end
  def name
    "#{dept || ''} #{courseno || ''} #{coursename || ''}"
  end
  def collaborators
    self.projects.collaborators | self.deliverables.collaborators  # join arrays
  end
  def id_and_class
    "#{self.id},#{self.class.to_s}"
  end
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
  def ordered_projects
    projects_order = self.projects_order.split(',').collect!{ |n| n.to_i } unless self.projects_order.nil? || self.projects_order.empty?
    projects_order ||= self.project_ids
    return projects_order.collect{ |p| Project.find(p) }
  end
  def all_resources
    @all = Array.new
    self.deliverables.each do |deliv|
      @all.concat(deliv.resources)
    end
    self.projects.each do |proj|
      @all.concat(proj.all_resources)
    end
    @all.concat(self.resources)
  end
end
