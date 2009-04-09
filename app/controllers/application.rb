# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  layout "application"
  # AuthenticatedSystem must be included for RoleRequirement, and is provided by installing acts_as_authenticates and running 'script/generate authenticated account user'.
  include AuthenticatedSystem
  # You can move this into a different controller, if you wish.  This module gives you the require_role helpers, and others.
  include RoleRequirementSystem
  include ExceptionLoggable

  helper :all # include all helpers, all the time

  # See ActionController::RequestForgeryProtection for details
  # Uncomment the :secret if you're not using the cookie session store
  protect_from_forgery :secret => APP_CONFIG['settings']['forgery'] #'5939853d8f1a67a9a3f071bbaa926cbc'

  # See ActionController::Base for details 
  # Uncomment this to filter the contents of submitted sensitive data parameters
  # from your application log (in this case, all fields with names like "password"). 
  filter_parameter_logging :password, :password_confirmation, :old_password

  # augment rails' render method from http://jamiedubs.com/always-render-rails-views-without-the-full-layout-when-using-ajax-degradable-javascript
  def render(*args)
    unless( args[0] == :update )
      args.first[:layout] = false if request.xhr? and !args.first[:update] and args.first[:layout].nil? and !args.first[:action].nil?
    end
    super    # ruby automatically forwards *args
  end

  # Change to the location of your contact form
  def contact_site
	  root_path
  end

  def nested_layout
	  "default"
  end

  def in_beta?
	  APP_CONFIG['settings']['in_beta']
  end

  # BCT inspired by http://szeryf.wordpress.com/2008/06/13/easy-and-flexible-breadcrumbs-for-rails/
  before_filter :update_breadcrumb_trail
  
protected 
  @@skip_filters = ['create', 'destroy', 'new_association', 'tag_cloud', 'update', 'download']
  @@simple_bct = false  # if true, then system doesn't support branching (single linear path)
  
  def skip_filters
    @@skip_filters
  end
  
  # test to see if two breadcrumbs are on the same branch/trail
  # simple backwards tree search by going through each parent of the leaf
  def on_same_branch(root, leaf, firstTime = true, search_history = nil)
    return (firstTime) if(root == 0 or leaf == 0)
    return true if leaf == root
    crumbs = session['breadcrumb']
    search_history = Array.new(crumbs.size) if search_history.nil?
    return search_history[leaf] if not search_history[root].nil?
    return false if crumbs[root].nil? || crumbs[leaf].nil?
    crumbs[leaf].parent.each do |thisParent|
      if thisParent == root
        if thisParent == 0 # reached all the way to the top without sharing a parent
          search_history[thisParent] = false
          next
        else
          search_history[thisParent] = true
          return true
        end
      elsif thisParent.nil?
        search_history[thisParent] = false
        return false
      end
      return true if on_same_branch(root, thisParent, false, search_history)
    end
    return false
  end
  
  def update_breadcrumb_trail
    # url = eval(url) if url =~ /_path|_url|@/ # don't eval, handle in appropriate action  
    req_params = request.parameters
    actn = req_params[:action]
    return if actn == 'get_breadcrumb' || actn == 'eat_breadcrumbs' || actn == 'get_currcrumb_idx' || actn == 'update_preview'
    
    session['breadcrumb'] ||= []
    session['breadcrumb_index'] ||= nil   # used to mark location on the breadcrumb trail
    
    # hitting 'refresh' doesn't count as a traversal of the site, so skip all this
    unless req_params == (session['breadcrumb'].last.params rescue false)
      b = Breadcrumb.new(req_params)
      b.is_ajax = true if request.xhr?
      
      # if action cannot be undone or re-visited (IE. create, destroy), flag it
      if self.skip_filters.include?(b.action)
        b.cannot_undo = true
      end
      
      session['breadcrumb'].each do |bc|
        bc.is_future = false
      end
      
      bcSize = session['breadcrumb'].size
      bcIndex = ( @@simple_bct? nil : session['breadcrumb'].index(b) )
      
      if not bcIndex.nil?  # we're going backwards OR two pages are converging
                        # first see if we're going backwards (current page is on the same browse
                        # path as the previous page
        currIndex = session['breadcrumb_index']
        if( on_same_branch( currIndex, bcIndex ) or on_same_branch( bcIndex, currIndex) )   # jumping around in history?
          session['breadcrumb'][(bcIndex+1)..-1].each do |bc|
            bc.is_future = true
          end          
        elsif bcIndex != currIndex  # branch converges with previous branch
          parents = session['breadcrumb'][bcIndex].parent
          
          unless bcIndex == 0  # bad things happen if we delete root
            parents.delete(currIndex) # delete if exists...
            parents << currIndex   # append to end (root has no parents)
            session['breadcrumb'][currIndex].children << bcIndex unless session['breadcrumb'][currIndex].children.include?(bcIndex) 
          end
        end

        session['breadcrumb_index'] = bcIndex
      else
        bcIndex = session['breadcrumb_index']
        if bcIndex == (bcSize-1) ## we are continuing a branch
          b.parent << bcIndex

          # add only if it doesn't already exist
          unless session['breadcrumb'][bcIndex].children.include?(bcSize)
            session['breadcrumb'][bcIndex].children << bcSize
          end
        else
          ## we are starting a new branch
          unless bcIndex.nil?
            b.parent << bcIndex
            session['breadcrumb'][bcIndex].children << bcSize
          end
        end
        unless (b == session['breadcrumb'].last)
          session['breadcrumb_index'] = bcSize
          session['breadcrumb'] << b
        end
      end
    end
  end
  
  def self.update_breadcrumb_trail
    update_breadcrumb_trail
  end

  def log_processing
    super unless params[:controller] == "keepalive"
  end
end
