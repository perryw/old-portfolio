class Collaboration < ActiveRecord::Base
  belongs_to :collaborator
  belongs_to :product, :polymorphic => true
  
  belongs_to :project, :class_name => "Project", :foreign_key => "project_id"
  belongs_to :deliverable, :class_name => "Deliverable", :foreign_key => "deliverable_id"
end

#class Authorship < ActiveRecord::Base
#  belongs_to :author
#  belongs_to :publication, :polymorphic => true
#  belongs_to :article,  :class_name => "Article",
#                        :foreign_key => "publication_id"
#  belongs_to :book,     :class_name => "Book",
#                        :foreign_key => "publication_id"
#end
#
#class Author < ActiveRecord::Base
#  has_many :authorships
#  has_many :articles, :through => :authorships, :source => :article,
#                      :conditions => "authorships.publication_type = 'Article'"
#  has_many :books,    :through => :authorships, :source => :book,
#                      :conditions => "authorships.publication_type = 'Book'"
#end