class RootController < ApplicationController
  before_filter :login_required

  def index

    respond_to do |format|
      format.html # index.html.erb
    end
  end

end
