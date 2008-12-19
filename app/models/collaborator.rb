class Collaborator < ActiveRecord::Base
  has_many :deliverables
  has_many :projects, :through => :deliverables
  
  has_many :resources, :as => :resource_owner
  
  def name
    "#{firstname} #{lastname}"
  end
end
