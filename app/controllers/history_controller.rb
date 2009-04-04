class HistoryController < ApplicationController
  def index
    @feed = FeedTools::Feed.open('http://redmine.wyrrep.com/repositories/revisions/portfolio?format=atom')
    respond_to do |format|
      format.html { render :layout => false if request.xhr? } # index.html.erb
    end
  end
end
