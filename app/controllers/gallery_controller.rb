class GalleryController < ApplicationController
  #before_filter :login_required

  # GET /gallery
  # GET /gallery.xml
  def index
    @deliverables = Deliverable.all
    @projects = Project.all
    @deliverable_tags = Deliverable.tag_counts
    @deliverable_tags.reject!{ |tag| tag.name.first == '*'} unless logged_in?
    @project_tags = Project.tag_counts
    @projects_tags.reject!{ |tag| tag.name.first == '*' } unless logged_in?
    
    respond_to do |format|
      format.html { render :layout => false if request.xhr? }# index.html.erb
      format.xml  { render :xml => @gallery }
    end
  end
  def deliverables
    @deliverables = Deliverable.all
    @deliverable_tags = Deliverable.tag_counts.reject{ |tag| tag.name.first == '*' }
    respond_to do |format|
      format.html { render :layout => false if request.xhr? }
      format.xml  { render :xml => @gallery }
    end
  end
  def projects
    @projects = Project.all
    @project_tags = Project.tag_counts.reject{ |tag| tag.name.first == '*' }
    respond_to do |format|
      format.html { render :layout => false if request.xhr? }
      format.xml  { render :xml => @gallery }
    end
  end
  def show
    owner_type, owner_id = params[:id].split('_')
    owner = owner_type.constantize.find(owner_id)  # can also use constantize instead of eval
    eval("@#{owner_type.downcase} = owner")

    if request.xhr?
      render :layout => false, :template => "#{owner_type.downcase.pluralize}/show"
    else
      render :template => "#{owner_type.downcase.pluralize}/show"
    end
  end
  
  def get_gallery
    @gallery = Resource.find(:all, :conditions => { :parent_id => nil })
    @gallery.delete_if{ |rez| !rez.image? }
    
    render :update do |page|
      page << "if( $('entire_gallery') ) {"
        page << "if( $('summary') ) {"
          page['summary'].hide
        page << "}"
        page['entire_gallery'].show
      page << "}"
      page << "else {"
        page.replace_html 'p_page', :partial => 'gallery', :locals => {:gallery => @gallery}
        page.call 'Lightview.updateViews'
      page << "}"
    end
  end
end
