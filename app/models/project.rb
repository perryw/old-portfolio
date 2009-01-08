class Project < ActiveRecord::Base
  belongs_to :course
  
  has_many :deliverables
  has_many :collaborations, :as => :product, :dependent => :destroy
  has_many :collaborators, :through => :collaborations
  
  has_many :resources, :as => :resource_owner
end
