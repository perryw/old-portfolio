class DeliverablesController < ApplicationController
  before_filter :login_required
  
  for column in Deliverable.content_columns
    in_place_edit_for :deliverable, column.name.to_sym
  end
  in_place_edit_for :deliverable, :tag_list
  
  def tag_cloud
    @tags = Deliverable.tag_counts
  end
  
  # GET /deliverables
  # GET /deliverables.xml
  def index
    @deliverables = Deliverable.find(:all)
    tag_cloud
    #p "Tags are: #{@tags}"

    respond_to do |format|
      format.html { render :layout => false if request.xhr? }# index.html.erb
      format.xml  { render :xml => @deliverables }
    end
  end

  # GET /deliverables/1
  # GET /deliverables/1.xml
  def show
    @deliverable = Deliverable.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @deliverable }
    end
  end

  # GET /deliverables/new
  # GET /deliverables/new.xml
  def new
    @deliverable = Deliverable.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @deliverable }
    end
  end

  # GET /deliverables/1/edit
  def edit
    @deliverable = Deliverable.find(params[:id])
    @collaborators = Collaborator.all
    @owners = Project.all + Course.all
    @resources = Resource.all
    respond_to do |format|
      format.html { render :layout => false if request.xhr? }
    end
  end
  
  def new_association

    if @num_associations.nil?
      @num_associations = Deliverable.find(params[:id]).resources.size
    else
      @num_associations += 1
    end
    
    render :update do |page|
      page.insert_html :before, params[:div_name],
      :partial => 'shared/new_association', 
      :object => Deliverable.find(params[:id]),
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
  
  # POST /deliverables
  # POST /deliverables.xml
  def create
    @deliverable = Deliverable.new(params[:deliverable])
    
    respond_to do |format|
      if @deliverable.save
        flash[:notice] = 'Deliverable was successfully created.'
        format.html { redirect_to(@deliverable) }
        format.xml  { render :xml => @deliverable, :status => :created, :location => @deliverable }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @deliverable.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /deliverables/1
  # PUT /deliverables/1.xml
  def update
    @deliverable = Deliverable.find(params[:id])
    collaborators = params[:collaborator]
    c_array = Array.new
    collaborators.each do |k,v|
      c_array << k unless v == '0'
    end
    unless c_array.empty?
      params[:deliverable][:collaborator_ids] = c_array
    end
    unless params["new_association"].nil?
      resource_id_array = params["new_association"][:resource_ids]
      #params.delete("new_association")
    end
    unless resource_id_array.nil?
      #p "****** #{resource_id_array}"
      if params[:deliverable][:resource_ids].nil?
        params[:deliverable][:resource_ids] = resource_id_array
      else
        params[:deliverable][:resource_ids].concat(resource_id_array)
      end
    end
    respond_to do |format|
      if @deliverable.update_attributes(params[:deliverable])
        flash[:notice] = 'Deliverable was successfully updated.'
        format.html { redirect_to(@deliverable) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @deliverable.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /deliverables/1
  # DELETE /deliverables/1.xml
  def destroy
    @deliverable = Deliverable.find(params[:id])
    @deliverable.destroy

    respond_to do |format|
      format.html { redirect_to(deliverables_url) }
      format.xml  { head :ok }
    end
  end
end