class CoursesController < ApplicationController
  before_filter :login_required

  def tag_cloud
    @tags = Deliverable.tag_counts
  end
  
  # GET /courses/1
  # GET /courses/1.xml
  def show
    if request.xhr?
      @resource = Resource.find(params[:id])
      if @resource.resource_owner_type.nil?
        @course = Course.new 
      else
        @course = eval(@resource.resource_owner_type).find(@resource.resource_owner_id)
      end      
    else
      @course = Course.find(params[:id])
    end

    respond_to do |format|
      format.html { render :layout => false if request.xhr? }# show.html.erb
      format.xml  { render :xml => @course }
    end
  end
  
  def new_association

    if @num_associations.nil?
      @num_associations = Course.find(params[:id]).resources.size
    else
      @num_associations += 1
    end
    
    render :update do |page|
      page.insert_html :before, params[:div_name],
      :partial => 'courses/new_association', 
      :object => Course.find(params[:id]),
      :locals => {:resources => Resource.find(:all, :conditions => {:parent_id => nil, :resource_owner_id => nil }), :span_name => "preview_pane#{@num_associations}"}

      page.visual_effect :highlight, params[:div_name]
    end
  end
  
  def update_preview
    return if params[:selected_value].nil?
    render :update do |page|
      page.replace_html params[:span_name], image_tag(Resource.find(params[:selected_value]).public_filename(:thumb))
    end
  end
  
  # GET /courses
  # GET /courses.xml
  def index
    @courses = Course.find(:all)

    respond_to do |format|
      format.html { render :layout => false if request.xhr? }# index.html.erb
      format.xml  { render :xml => @courses }

    end
  end

  # GET /courses/new
  # GET /courses/new.xml
  def new
    @course = Course.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @course }
    end
  end

  # GET /courses/1/edit
  def edit
    @course = Course.find(params[:id])
    @members = Collaborator.find(:all)
    @num_associations = @course.resources.size
    @resources = Resource.find(:all, :conditions => { :parent_id => nil, :resource_owner_id => nil})
    @resources.concat( Resource.find(:all, :conditions => {:parent_id => nil, :resource_owner_id => params[:id]}) )
  end

  # POST /courses
  # POST /courses.xml
  def create
    @course = Course.new(params[:course])

    respond_to do |format|
      if @course.save
        flash[:notice] = 'Course was successfully created.'
        format.html { redirect_to(@course) }
        format.xml  { render :xml => @course, :status => :created, :location => @course }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @course.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /courses/1
  # PUT /courses/1.xml
  def update
    
    @course = Course.find(params[:id])
    unless params["new_association"].nil?
      resource_id_array = params["new_association"][:resource_ids]
      #params.delete("new_association")
    end
    unless resource_id_array.nil?
      #p "****** #{resource_id_array}"
      if params[:course][:resource_ids].nil?
        params[:course][:resource_ids] = resource_id_array
      else
        params[:course][:resource_ids].concat(resource_id_array)
      end
    end

    respond_to do |format|    
      if @course.update_attributes(params[:course])
        flash[:notice] = 'Course was successfully updated.'
        format.html { redirect_to(@course) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @course.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /courses/1
  # DELETE /courses/1.xml
  def destroy
    @course = Course.find(params[:id])
    @course.destroy

    respond_to do |format|
      format.html { redirect_to(courses_url) }
      format.xml  { head :ok }
    end
  end
end
