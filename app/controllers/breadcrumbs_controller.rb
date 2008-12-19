class BreadcrumbsController < ApplicationController   
  def get_breadcrumb
    load_bct
    render :json => session['breadcrumb']
    dump_bct
  end
end
