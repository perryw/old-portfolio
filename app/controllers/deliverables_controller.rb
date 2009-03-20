class DeliverablesController < ApplicationController
  before_filter :login_required, :only => [:create, :update, :destroy, :order]

  for column in Deliverable.content_columns
    in_place_edit_for :deliverable, column.name.to_sym
  end
  in_place_edit_for :deliverable, :tag_list
  
  def tag_cloud
    @tags = Deliverable.tag_counts
    @tags.reject!{ |tag| tag.name.first == '*' } if logged_in?
  end
  def list
    show
  end
  def order
    @deliverable = Deliverable.find(params[:id])
    params[:deliverable] ||= Hash.new
    @order = params[:resources_list]
    params[:deliverable][:resources_order] = @order.join(',')
    params.delete(:collaborators)
    params.delete(:id)
    if @deliverable.update_attributes(params[:deliverable])
      render :partial => 'list'
    else
      #render :text => 'error occurred'
      head :unprocessable_entity
    end
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
    #@resources_ordered = @deliverable.ordered_resources
    respond_to do |format|
      format.html {
        if request.xhr?
          render :layout => false  
        elsif params[:ignore_layout]
          render :layout => 'ajax'
        end
      }# show.html.erb
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
    @resources = Resource.find(:all, :conditions => { :parent_id => nil, :resource_owner_id => nil }) + Resource.find(:all, :conditions => {:parent_id => nil, :resource_owner_id => @deliverable.id})
    #@resources = Resource.find(:all, :conditions => ["parent_id = NULL AND (resource_owner_id = NULL OR resource_owner_id = ?)", @deliverable.id])
    @keyable = Resource.find(:all, :conditions => { :parent_id => nil, :resource_owner_id => nil })
    @keyable.concat(@deliverable.resources)
    @keyable.delete_if{ |rez| !rez.image? && !rez.pdf? }
    respond_to do |format|
      format.html { render :layout => false if request.xhr? }
    end
  end
  
  def new_association
    @deliverable = Deliverable.find(params[:id])
    if @num_associations.nil?
      @num_associations = @deliverable.resources.size
    else
      @num_associations += 1
    end
    
    render :update do |page|
      page.insert_html :before, params[:div_name],
        :partial => 'shared/new_association', 
        :object => @deliverable,
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
  
  # POST /deliverables
  # POST /deliverables.xml
  def create
    @deliverable = Deliverable.new(params[:deliverable])
    
    respond_to do |format|
      if @deliverable.save
        flash[:notice] = 'Deliverable was successfully created.'
        format.html { 
          if request.xhr?
            render :update do |page|
              page.insert_html :bottom, :deliverables_tbody,
                :partial => 'table_row',
                :object => @deliverable
              page.visual_effect :highlight, "deliverables_table_#{@deliverable.id}"
              page.call "document.fire", "jsviz:clicked"
            end
          else
            redirect_to(@deliverable) 
          end
        }
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
    end unless collaborators.blank?

    params[:deliverable][:collaborator_ids] = c_array unless c_array.empty?

    resource_id_array = params["new_association"][:resource_ids] unless params["new_association"].nil?

    unless resource_id_array.nil?
      #p "****** #{resource_id_array}"
      if params[:deliverable][:resource_ids].nil?
        params[:deliverable][:resource_ids] = resource_id_array
      else
        params[:deliverable][:resource_ids].concat(resource_id_array)
      end
      params.delete(:new_association)
    end
    
    unless params[:deliverable][:owner_id_and_class].empty?
      params[:deliverable][:owner_id], params[:deliverable][:owner_type] = params[:deliverable][:owner_id_and_class].split(',')
    else
      params[:deliverable][:owner_id], params[:deliverable][:owner_type] = nil, nil
    end
    
    params[:deliverable].delete(:owner_id_and_class)
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
      format.html { 
        if request.xhr?
          render :update do |page|
            page.remove "deliverables_table_#{@deliverable.id}"
          end
        else
          redirect_to(deliverables_url) 
        end
      }
      format.xml  { head :ok }
    end
  end
end
