class Collaborator < ActiveRecord::Base
  has_many :collaborations
  
  has_many :deliverables, :through => :collaborations, :source => :product,
                          :conditions => "collaborations.product_type = 'Deliverable'"
  has_many :projects, :through => :collaborations, :source => :product,
                      :conditions => "collaborations.product_type = 'Project'"
  
  has_many :resources, :as => :resource_owner
  
  def name
    "#{firstname} #{lastname}"
  end
end

#class Author < ActiveRecord::Base
#  has_many :authorships
#  has_many :articles, :through => :authorships, :source => :article,
#                      :conditions => "authorships.publication_type = 'Article'"
#  has_many :books,    :through => :authorships, :source => :book,
#                      :conditions => "authorships.publication_type = 'Book'"
#end
