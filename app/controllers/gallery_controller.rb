class GalleryController < ApplicationController
  before_filter :login_required

  # GET /gallery
  # GET /gallery.xml
  def index
    @gallery = Resource.find(:all, :conditions => { :parent_id => nil })
    @gallery.delete_if{ |rez| !rez.image? }  # prune out non-images
    
    respond_to do |format|
      format.html { render :layout => false if request.xhr? }# index.html.erb
      format.xml  { render :xml => @gallery }
    end
  end
  def show
    @resource = Resource.find(params[:id])
    if @resource.resource_owner_type.nil?
      owner_type = 'resource'
      @resource
    else
      owner_type = @resource.resource_owner_type.downcase
      owner = eval(@resource.resource_owner_type).find(@resource.resource_owner_id)  # can also use constantize instead of eval
      eval("@#{owner_type} = owner")
    end
    if request.xhr?
      render :layout => false, :template => "#{owner_type.pluralize}/show"
    else
      render :action => 'show', :template => "#{owner_type.pluralize}/show"
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
