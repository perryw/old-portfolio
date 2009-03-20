class AboutController < ApplicationController
  def index
    respond_to do |format|
      format.html { render :layout => false if request.xhr? } #index.html.erb
    end
  end
end
