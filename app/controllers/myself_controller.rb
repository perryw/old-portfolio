class MyselfController < ApplicationController
  def index
    respond_to do |format|
      format.html { render :layout => false if request.xhr? } #index.html.erb
    end
  end
  def resume
    respond_to do |format|
      format.html { render :layout => false if request.xhr? } #resume.html.erb
    end
  end
end
