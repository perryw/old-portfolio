class Project < ActiveRecord::Base
  belongs_to :course
  
  has_many :deliverables
  has_many :collaborators, :through => :deliverables
  
  has_many :resources, :as => :resource_owner
end
