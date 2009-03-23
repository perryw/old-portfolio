class ProjectsController < ApplicationController
  before_filter :login_required, :only => [:create, :update, :destroy, :order]

  for column in Project.content_columns
    in_place_edit_for :project, column.name.to_sym
  end
  in_place_edit_for :project, :tag_list

  def tag_cloud
    @tags = Project.tag_counts
    @tags.reject{ |tag| tag.name.first == '*'} unless logged_in?
  end

  def new_association
    @project = Project.find(params[:id])
    if @num_associations.nil?
      @num_associations = @project.resources.size
    else
      @num_associations += 1
    end
    
    render :update do |page|
      page.insert_html :before, params[:div_name],
        :partial => 'shared/new_association', 
        :object => @project,
        :locals => { :name_method => :tag_list, :resources => Resource.find(:all, :conditions => {:parent_id => nil, :resource_owner_id => nil }), :span_name => "preview_pane#{@num_associations}"}
      page.visual_effect :highlight, params[:div_name]
    end
  end

  def update_preview
    return if params[:selected_value].nil?
    rez = Resource.find(params[:selected_value])
    render :update do |page|
      if( rez.image? || rez.pdf? )
        page.replace_html params[:span_name], image_tag(rez.public_filename(:thumb))
      else
        page.replace_html params[:span_name], rez.tag_list
      end
    end
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
    @projects = Project.find(:all, :include => :tags)
    
    respond_to do |format|
      format.html { render :layout => false if request.xhr? }# index.html.erb
      format.xml  { render :xml => @projects }
    end
  end

  # GET /projects/1
  # GET /projects/1.xml
  def show
    @project = Project.find(params[:id], :include => [:resources, {:deliverables => [:resources, :tags, :collaborators]}, :tags])
    @resources_ordered = @project.ordered_resources
    @deliverables_ordered = @project.ordered_deliverables
    
    respond_to do |format|
      format.html {
        if request.xhr?
          render :layout => false
        elsif params[:ignore_layout]
          render :layout => 'ajax'  
        end
      }# show.html.erb
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
    @project = Project.find(params[:id], :include => [:resources, :tags])
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
    end unless collaborators.blank?
    
    unless c_array.empty?
      params[:project][:collaborator_ids] = c_array
    end
    
    resource_id_array = (params["new_association"].nil? ? nil : params["new_association"][:resource_ids])
    unless resource_id_array.nil?
      if params[:project][:resource_ids].nil?
        params[:project][:resource_ids] = resource_id_array
      else
        params[:project][:resource_ids].concat(resource_id_array)
      end
      params.delete(:new_association)
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
