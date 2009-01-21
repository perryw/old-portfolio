class CollaboratorsController < ApplicationController
  before_filter :login_prohibited, :only => [:create, :update, :destroy]
  for column in Collaborator.content_columns
    in_place_edit_for :collaborator, column.name.to_sym
  end
  in_place_edit_for :collaborator, :tag_list
  in_place_edit_for :collaborator, :email
  in_place_edit_for :collaborator, :url
  
  # GET /collaborators
  # GET /collaborators.xml
  def index
    @collaborators = Collaborator.find(:all)

    respond_to do |format|
      format.html { render :layout => false if request.xhr? }# index.html.erb
      format.xml  { render :xml => @collaborators }
    end
  end

  # GET /collaborators/1
  # GET /collaborators/1.xml
  def show
    @collaborator = Collaborator.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @collaborator }
    end
  end

  # GET /collaborators/new
  # GET /collaborators/new.xml
  def new
    @collaborator = Collaborator.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @collaborator }
    end
  end

  # GET /collaborators/1/edit
  def edit
    @collaborator = Collaborator.find(params[:id])
    @resources = Resource.all
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
      :object => Collaborator.find(params[:id]),
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
  
  # POST /collaborators
  # POST /collaborators.xml
  def create
    @collaborator = Collaborator.new(params[:collaborator])

    respond_to do |format|
      if @collaborator.save
        flash[:notice] = 'Collaborator was successfully created.'
        format.html { 
          if request.xhr?
            render :update do |page|
              page.insert_html :bottom, :collaborators_tbody,
                :partial => 'table_row',
                :object => @collaborator
              page.visual_effect :highlight, "collaborators_table_#{@collaborator.id}"
              page.call "document.fire", "jsviz:clicked"
            end
          else
            redirect_to(@collaborator) 
          end
        }
        format.xml  { render :xml => @collaborator, :status => :created, :location => @collaborator }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @collaborator.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /collaborators/1
  # PUT /collaborators/1.xml
  def update
    @collaborator = Collaborator.find(params[:id])
    unless params["new_association"].nil?
      resource_id_array = params["new_association"][:resource_ids]
    end
    unless resource_id_array.nil?
      #p "****** #{resource_id_array}"
      if params[:collaborator][:resource_ids].nil?
        params[:collaborator][:resource_ids] = resource_id_array
      else
        params[:collaborator][:resource_ids].concat(resource_id_array)
      end
    end
    respond_to do |format|
      if @collaborator.update_attributes(params[:collaborator])
        flash[:notice] = 'Collaborator was successfully updated.'
        format.html { redirect_to(@collaborator) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @collaborator.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /collaborators/1
  # DELETE /collaborators/1.xml
  def destroy
    @collaborator = Collaborator.find(params[:id])
    @collaborator.destroy

    respond_to do |format|
      format.html { 
        if request.xhr?
          render :update do |page|
            page.remove "collaborators_table_#{@collaborator.id}"
          end
        else
          redirect_to(collaborators_url) 
        end
      }
      format.xml  { head :ok }
    end
  end
end
