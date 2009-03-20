class CoursesController < ApplicationController
  before_filter :login_required, :only => [:create, :update, :destroy, :order]
  
  for column in Course.content_columns
    in_place_edit_for :course, column.name.to_sym
  end
  in_place_edit_for :course, :tag_list
  in_place_edit_for :course, :date

  def tag_cloud
    @tags = Course.tag_counts
    @tags.reject!{ |tag| tag.name.first == '*' } unless logged_in?
  end
  
  def order
    @course = Course.find(params[:id])
    params[:course] ||= Hash.new
    unless params[:course_resources_list].nil?
      params[:course][:resources_order] = params[:course_resources_list].join(',')
      params.delete(:course_resources_list)
    end
    unless params[:course_deliverables_list].nil?
      params[:course][:deliverables_order] = params[:course_deliverables_list].join(',')
      params.delete(:course_deliverables_list)
    end
    unless params[:course_projects_list].nil?
      params[:course][:projects_order] = params[:course_projects_list].join(',')
      params.delete(:course_projects_list)
    end
    if @course.update_attributes(params[:course])
      head :ok
    else
      head :unprocessable_entity
    end
  end
  
  # GET /courses/1
  # GET /courses/1.xml
  def show
    @course = Course.find(params[:id])
    @resources_ordered = @course.ordered_resources
    @deliverables_ordered = @course.ordered_deliverables
    @projects_ordered = @course.ordered_projects
    
    respond_to do |format|
      format.html { 
        if request.xhr? 
          render :layout => false 
        elsif params[:ignore_layout]
          render :layout => 'ajax'
        end
      }# show.html.erb
      format.xml  { render :xml => @course }
    end
  end
  
  # GET /courses/list/1
  # GET /courses/list/1.xml
  def list
    @course = Course.find(params[:id])
    @other_tags = []
    @course.projects.each do |proj|
      @other_tags += proj.tag_list
    end
    @course.deliverables.each do |deliv|
      @other_tags += deliv.tag_list
    end
    @course.resources.each do |rez|
      @other_tags += rez.tag_list
    end
    @other_tags.reject!{ |tag| tag.name.first == '*' } unless logged_in?
    @other_tags.uniq!
    @resources_ordered = @course.ordered_resources
    @deliverables_ordered = @course.ordered_deliverables
    @projects_ordered = @course.ordered_projects
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
      :partial => 'shared/new_association', 
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
    @keyable = @resources = Resource.find(:all, :conditions => { :parent_id => nil, :resource_owner_id => nil})
    @resources.concat( Resource.find(:all, :conditions => {:parent_id => nil, :resource_owner_id => params[:id]}) )
    @keyable.concat(@course.all_resources)
    @keyable.delete_if{ |rez| !rez.image? && !rez.pdf? }
  end

  # POST /courses
  # POST /courses.xml
  def create
    @course = Course.new(params[:course])

    respond_to do |format|
      if @course.save
        flash[:notice] = 'Course was successfully created.'
        format.html {
          if request.xhr?
            render :update do |page|
              page.insert_html :bottom, :courses_tbody,
                :partial => 'courses/table_row', 
                :object => @course
              page.visual_effect :highlight, "courses_table_#{@course.id}"
              page.call "document.fire", "jsviz:clicked"
            end
          else
            redirect_to(@course) 
          end
        }
        format.xml  { render :xml => @course, :status => :created, :location => @course }
      else
        format.html { 
          if request.xhr?
            head :unprocessable_entity
          else
            render :action => "new" 
          end
        }
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
      format.html { 
        if request.xhr?
          render :update do |page|
            page.remove "courses_table_#{@course.id}"
          end
        else
          redirect_to(courses_url)
        end
      }
      format.xml  { head :ok }
    end
  end
end
