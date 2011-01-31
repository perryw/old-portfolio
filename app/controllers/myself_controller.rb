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
  def download
    send_file "#{RAILS_ROOT}/public/resume-perryw-2011.#{params[:id]}", 
      {:disposition => 'attachment'}
  end
end
