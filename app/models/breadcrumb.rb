class Breadcrumb
  
  attr_reader :controller, :action, :params # read-only
  attr_accessor :is_future, :cannot_undo, :prev, :next, :is_ajax
  attr_accessor :parent, :children
    
  def initialize( params, jsonObj = nil )
    if jsonObj.nil?
      @controller, @action, @params = params[:controller], params[:action], params
      if @controller.nil? || @action.nil?
        @controller, @action = params["controller"], params["action"]
      end
      @params.delete("authenticity_token") unless @params[:authenticity_token].nil?
      @is_future = @cannot_undo = @is_ajax = false
      @prev = @next = nil
      @parent = Array.new
      @children = Array.new
    else
      @controller, @action = jsonObj["params"]["controller"], jsonObj["params"]["action"]
      @parent, @children = jsonObj["parent"], jsonObj["children"]
      @is_future, @cannot_undo, @is_ajax = jsonObj['is_future'], jsonObj['cannot_undo'], jsonObj['is_ajax']
    end
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
    to_json(0,0)
  end
  
  def Breadcrumb._load(obj)
    loaded = JSON.parse(obj) # JSON.load doesn't work!
    b = Breadcrumb.new(loaded["params"])
    #b.controller, b.action = loaded["params"]["controller"], loaded["params"]["action"]
    b.parent, b.children = loaded["parent"], loaded["children"]
    b.is_future, b.cannot_undo, b.is_ajax = loaded['is_future'], loaded['cannot_undo'], loaded['is_ajax']
    return b
  end
  
  def to_json(arg1, arg2)
    action_controller = { 
      "parent" => @parent, 
      "children" => @children, 
      "is_future" => @is_future,
      "cannot_undo" => @cannot_undo,
      "is_ajax" => @is_ajax,
      "params" => @params }
    action_controller.to_json
  end
end
