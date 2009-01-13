class Project < ActiveRecord::Base
  belongs_to :course
  
  has_many :deliverables, :as => :owner, :dependent => :destroy
  has_many :collaborations, :as => :product, :dependent => :destroy
  has_many :collaborators, :through => :collaborations
  
  has_many :resources, :as => :resource_owner
  acts_as_taggable_on :tags
  def total_collaborators # every collaborator, even those who i did not directly deal with
    collabs = Array.new
    self.deliverables.each do |deliv|
      collabs |= deliv.collaborators
    end
    return collabs | self.collaborators
  end
end
