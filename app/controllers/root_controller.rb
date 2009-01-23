class RootController < ApplicationController
  before_filter :login_required

  def index
    @feed = FeedTools::Feed.open('http://redmine.wyrrep.com/repositories/revisions/portfolio?format=atom')
    
    respond_to do |format|
      format.html # index.html.erb
    end
  end

end
