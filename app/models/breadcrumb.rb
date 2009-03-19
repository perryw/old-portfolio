class Breadcrumb
  
  attr_reader :controller, :action, :params # read-only
  attr_accessor :is_future, :cannot_undo, :is_ajax
  attr_accessor :parent, :children
    
  def initialize( params = nil, jsonObj = nil )
    if jsonObj.nil? && !params.nil?
      @params = params.dup
      @controller, @action = @params[:controller], @params[:action]
      if @controller.nil? || @action.nil?
        @controller, @action = params["controller"], params["action"]
      end
      @params.delete("authenticity_token") unless @params[:authenticity_token].nil?
      @params.delete("resource") if @action == 'create' and @controller == 'resources'
      @is_future = @cannot_undo = @is_ajax = false
      @parent = Array.new
      @children = Array.new
    elsif !jsonObj.nil?
      @controller, @action = jsonObj["params"]["controller"], jsonObj["params"]["action"]
      @parent, @children = jsonObj["parent"], jsonObj["children"]
      @is_future, @cannot_undo, @is_ajax = jsonObj['is_future'], jsonObj['cannot_undo'], jsonObj['is_ajax']
    end
  end
  
  def copy(c)
    @controller, @action, @params = c.controller || "root", c.action || "index", c.params || {}
    @is_future, @cannot_undo, @is_ajax = c.is_future || false, c.cannot_undo || false, c.is_ajax || false
    @parent, @children = c.parent || [], c.children || []
  end
  
  def to_s
    string = "########  BREADCRUMB ########\n"
    @params.each do |k,v|
      string += "\n#{k} => #{v}"
    end
    
    return string+"\n"
  end
  
  def ==(other)
    return !other.nil? && @controller == other.controller && @action == other.action && @params == other.params
  end
  
  def _dump(depth)
    to_json
  end
  
  def Breadcrumb._load(obj)
    loaded = JSON.parse(obj) # JSON.load doesn't work!
    b = Breadcrumb.new(loaded["params"])
    #b.controller, b.action = loaded["params"]["controller"], loaded["params"]["action"]
    b.parent, b.children = loaded["parent"], loaded["children"]
    b.is_future, b.cannot_undo, b.is_ajax = loaded['is_future'], loaded['cannot_undo'], loaded['is_ajax']
    return b
  end
  
  def to_json(arg1=nil, arg2=nil)
    action_controller = { 
      "parent" => @parent, 
      "children" => @children, 
      "is_future" => @is_future,
      "cannot_undo" => @cannot_undo,
      "is_ajax" => @is_ajax,
      "params" => @params }
    action_controller.to_json
    #JSON.dump(action_controller)
  end
end
