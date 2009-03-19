class KeepaliveController < ApplicationController
  def index
    render :text => 'alive'
  end
end
