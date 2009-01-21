class ResourcesController < ApplicationController
  before_filter :login_prohibited, :except => [:index, :show]
  
  def tag_cloud
    @tags = Resource.tag_counts
  end
  for column in Resource.content_columns
    in_place_edit_for :resource, column.name.to_sym
    in_place_edit_for :resource, :tag_list
  end
  
  
  # GET /resources
  # GET /resources.xml
  def index
    @resources = Resource.find(:all, :conditions => {:parent_id => nil}, :order => 'created_at DESC')
    
    respond_to do |format|
      format.html { render :layout => false if request.xhr? }# index.html.erb
      format.xml  { render :xml => @resources }
    end
  end
  
  # GET /resources/1
  # GET /resources/1.xml
  def show
    @resource = Resource.find(params[:id])
    
    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @resource }
    end
  end
  
  # GET /resources/new
  # GET /resources/new.xml
  def new
    @resource = Resource.new
    
    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @resource }
    end
  end
  
  # GET /resources/1/edit
  def edit
    @resource = Resource.find(params[:id])
  end
  
  # POST /resources
  # POST /resources.xml
  def create
    @resource = Resource.new(params[:resource])

    respond_to do |format|
      if @resource.save
        flash[:notice] = 'Resource was successfully created.'
        format.html { redirect_to(@resource) }
        format.xml  { render :xml => @resource, :status => :created, :location => @resource }
        format.js do
          responds_to_parent do
            render :update do |page|
              page.insert_html :bottom, 'resources_index', :partial => 'resources/list_item', :object => @resource
              page.visual_effect :scroll_to, 'resources_index'
              page.visual_effect :slide_up, 'new_resource', :duration => 3.0
              page.visual_effect :appear, 'new_resource_JS', :duration => 1.5
              page.visual_effect :highlight, "resource_#{@resource.id}", :duration => 2.5
              page.visual_effect :fade, "resource_#{@resource.id}", :duration => 2.5, :queue => 'end'
              page.insert_html :bottom, 'resources_table_body', :partial => 'resources/resource_row', :object => @resource, :locals => {:number => Resource.find(:all, :conditions => {:parent_id => nil}).size%2}
              page.call 'Form.reset', 'resource_form'
            end
          end
        end     
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @resource.errors, :status => :unprocessable_entity }
        format.js do
          responds_to_parent do
            render :update do |page|
              # update the page with an error message

            end
          end          
        end
      end
    end
  end
  
  # PUT /resources/1
  # PUT /resources/1.xml
  def update
    @resource = Resource.find(params[:id])
    
    respond_to do |format|
      if @resource.update_attributes(params[:resource])
        flash[:notice] = 'Resource was successfully updated.'
        format.html { redirect_to(@resource) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @resource.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # DELETE /resources/1
  # DELETE /resources/1.xml
  def destroy
    @resource = Resource.find(params[:id])
    @resource.destroy
    
    respond_to do |format|
      format.html { redirect_to(resources_url) }
      format.xml  { head :ok }
      format.js
    end
  end
  
  def download
    @resource = Resource.find(params[:id])
    send_file("#{RAILS_ROOT}/public"+@resource.public_filename, 
      :disposition => 'attachment',
      :encoding => 'utf8', 
      :type => @resource.content_type,
      :filename => URI.encode(@resource.filename)) 
  end

end
