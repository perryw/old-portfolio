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
end
