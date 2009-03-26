class KeepaliveController < ApplicationController
  skip_filter filter_chain # skip all filters
  def index
    render :text => Time.now
  end
end
