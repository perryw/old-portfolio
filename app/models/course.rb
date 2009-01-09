class Course < ActiveRecord::Base
  has_many :projects
  has_many :deliverables, :through => :projects
  has_many :resources, :as => :resource_owner
  
  def title
    "#{dept} #{courseno}"
  end
  def collaborators
    self.projects.collaborators | self.deliverables.collaborators  # join arrays
  end
end
