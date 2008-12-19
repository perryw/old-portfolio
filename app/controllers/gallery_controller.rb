class GalleryController < ApplicationController

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
