class CollaboratorsController < ApplicationController
    
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
  end

  # POST /collaborators
  # POST /collaborators.xml
  def create
    @collaborator = Collaborator.new(params[:collaborator])

    respond_to do |format|
      if @collaborator.save
        flash[:notice] = 'Collaborator was successfully created.'
        format.html { redirect_to(@collaborator) }
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
      format.html { redirect_to(collaborators_url) }
      format.xml  { head :ok }
    end
  end
end
