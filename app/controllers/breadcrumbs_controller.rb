class BreadcrumbsController < ApplicationController
  def get_breadcrumb
    render :json => session['breadcrumb']
    #render :text => JSON.dump(session['breadcrumb'])
  end
  def eat_breadcrumbs
    b = Breadcrumb.new
    b.copy(session['breadcrumb'][session['breadcrumb_index']])
    b.parent.clear
    b.children.clear
    session['breadcrumb'].clear
    session['breadcrumb'] << b
    session['breadcrumb_index'] = 0
    if request.xhr?
      render :layout => false, :text => 'Too full to eat the last crumb...'
    else
      flash[:notice] = "Breadcrumbs have all been eaten up"
      render :nothing => true
    end
  end
  def get_currcrumb_idx
    render :layout => false, :text => session['breadcrumb_index']
  end
  def get_yaml
    render :text => session['breadcrumb'].to_yaml
  end
end
