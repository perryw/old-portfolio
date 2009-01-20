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
