class ProjectsController < ApplicationController
  before_filter :login_prohibited, :only => [:create, :update, :destroy, :order]

  for column in Project.content_columns
    in_place_edit_for :project, column.name.to_sym
  end
  in_place_edit_for :project, :tag_list

  def tag_cloud
    @tags = Project.tag_counts
  end

  def order
    @project = Project.find(params[:id])
    params[:project] ||= Hash.new
    unless params[:project_resources_list].nil?
      params[:project][:resources_order] = params[:project_resources_list].join(',')
      params.delete(:project_resources_list)
    end
    unless params[:deliverables_list].nil?
      params[:project][:deliverables_order] = params[:deliverables_list].join(',')
      params.delete(:deliverables_list)
    end
    if @project.update_attributes(params[:project])
      head :ok
    else
      head :unprocessable_entity
    end
  end
  
  # GET /projects
  # GET /projects.xml
  def index
    @projects = Project.find(:all)
    
    respond_to do |format|
      format.html { render :layout => false if request.xhr? }# index.html.erb
      format.xml  { render :xml => @projects }
    end
  end

  # GET /projects/1
  # GET /projects/1.xml
  def show
    @project = Project.find(params[:id])
    @resources_ordered = @project.ordered_resources
    @deliverables_ordered = @project.ordered_deliverables
    
    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @project }
    end
  end

  # GET /projects/new
  # GET /projects/new.xml
  def new
    @project = Project.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @project }
    end
  end

  # GET /projects/1/edit
  def edit
    @project = Project.find(params[:id])
    @collaborators = Collaborator.find(:all)
    @courses = Course.find(:all)
    @keyable = Resource.find(:all, :conditions => { :parent_id => nil, :resource_owner_id => nil })
    @keyable.concat(@project.all_resources)
    @keyable.delete_if{ |rez| !rez.image? && !rez.pdf? }
  end

  # POST /projects
  # POST /projects.xml
  def create
    @project = Project.new(params[:project])

    respond_to do |format|
      if @project.save
        flash[:notice] = 'Project was successfully created.'
        format.html { 
          if request.xhr?
            render :update do |page|
              page.insert_html :bottom, :projects_tbody,
                :partial => 'table_row',
                :object => @project
              page.visual_effect :highlight, "projects_table_#{@project.id}"
              page.call "document.fire", "jsviz:clicked"
            end
          else
            redirect_to(@project) 
          end
        }
        format.xml  { render :xml => @project, :status => :created, :location => @project }
      else
        format.html { 
          if request.xhr?
            head :unprocessable_entity
          else
            render :action => "new" 
          end
        }
        format.xml  { render :xml => @project.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /projects/1
  # PUT /projects/1.xml
  def update
    @project = Project.find(params[:id])
    collaborators = params[:collaborator]
    c_array = Array.new
    collaborators.each do |k,v|
      c_array << k unless v == '0'
    end
    
    unless c_array.empty?
      params[:project][:collaborator_ids] = c_array
    end
    
    respond_to do |format|
      if @project.update_attributes(params[:project])
        flash[:notice] = 'Project was successfully updated.'
        format.html { redirect_to(@project) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @project.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /projects/1
  # DELETE /projects/1.xml
  def destroy
    @project = Project.find(params[:id])
    @project.destroy

    respond_to do |format|
      format.html { 
        if request.xhr?
          render :update do |page|
            page.remove "projects_table_#{@project.id}"
          end
        else
          redirect_to(projects_url) 
        end
      }
      format.xml  { head :ok }
    end
  end
end
