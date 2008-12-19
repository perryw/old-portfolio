class Deliverable < ActiveRecord::Base
  belongs_to :project
  belongs_to :collaborator
  has_many :resources, :as => :resource_owner
  acts_as_taggable_on :tags
end
