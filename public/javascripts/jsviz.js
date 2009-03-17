/**
 * @author perry wong, based on the template provided by Kyle Scholz

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	OTHER DEALINGS IN THE SOFTWARE.

 */
var jsvizObj;
function jsviz_init() {
	var TIMEDBUILD = window.location.href.indexOf("TIMEDBUILD")>0 ? true : false;
	this.divLocation = $('jsviz_div');
	var refDiv = this.divLocation.up();
	if(refDiv) {
		this.divLocation.style.width = refDiv.getWidth()+"px";
	}
	//var layout = new SnowflakeLayout( divLocation, true );  commented out because it doesn't support cyclical graphs
	this.layout  = new ForceDirectedLayout( this.divLocation, true); // doesn't properly detect SVG support in ff3
	var layout = this.layout;
	layout.view.skewBase=575;
	layout.setSize();

	/* 2) Configure the layout.
	 * 
	 * This configuration defines how we handle the addition of
	 * different kinds of nodes to the graph. For each "type" of
	 * node, we tell the layout how to create a "model" and "view"
	 * of the new node.
	 */
	layout.config._default = {

	/* The "model" defines the underlying structure of our graph.
	 * For a SnowflakeModel, we need to define the following for
	 * each node:
	 * 
	 * - childRadius: the edge length to this node's children
	 * - fanAngle: the maximum angle in which child nodes will be
	 *   layed out
	 * - rootAngle: the base angle of the graph at the origin (this
	 *   is automatically determined for all child nodes)
	 * 
	 * These parameters determine how this new node will interact
	 * with other nodes in our graph. The "model" attribute of a
	 * class in our configuration must return a JavaScript Object
	 * containing these values.
	 */
		model: function( dataNode ) {
			return {
				mass: 0.5
			};
		},

	/* The "view" defines what the nodes in our graph look like.
	 * The "view" attribute of a class must return a DOM element -- 
	 * JSViz supports most HTML and SVG elements. You can control
	 * the appearence and behavior of view elements just like any
	 * DOM element: 
	 * 
	 * CSS: Point to a CSS style sheet using the "className"
	 * attribute of the DOM element.
	 * 
	 * Contents: Indicate the node's contents, in HTML, using the
	 * "appendChild" function or by setting DOM element's innerHTML.
	 * 
	 * Behavior: Add an event handler using the EventHandler factory
	 * class. For example: 
	 * 
	 * nodeElement.onclick = new EventHandler( _caller, _handler, arg0, arg1... );
	 * 
	 * where _caller is an object instance that _handler may refer
	 * to as "this" (use "window" if the function is in the global
	 * scope), _handler is the function to be executed, and any
	 * additional arguments are passed as parameters to _handler. 
	 */
		view: function( dataNode, modelNode ) {
			if ( layout.svg ) {
				var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
				var nodeElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
				nodeElement.setAttribute('stroke', '#888888');
				nodeElement.setAttribute('stroke-width', '.25px');
				nodeElement.setAttribute('fill', dataNode.color);
				nodeElement.setAttribute('r', 6 + 'px');
				
				nodeElement.onmouseover =  new EventHandler( layout, 
                  function(dataNode, modelNode, skewX, skewY, centerX, centerY){
                      document.body.style.cursor='pointer';
                      var tt = document.getElementById("tooltip");
                      var container = document.getElementById("jsviz_div");
                      var offset = container.positionedOffset();

                      var parenString = "";
                      if (dataNode.parent) {
                          dataNode.parent.each(function(paren){
                              parenString += ", " + paren.URL
                          });
                          ;
                      }
                      tt.innerHTML="URL: " + dataNode.URL + " , # parents: " + parenString;
                      tt.style.display="block";
                      tt.style.left=(modelNode.positionX*skewX + centerX + offset.left + 5) + "px";
                      tt.style.top=(modelNode.positionY*skewY + centerY + offset.top - 25) +  "px";
                      layout.mouseHover = true;
                  }, dataNode, modelNode, 
					layout.view.skewX, layout.view.skewY, 
					layout.view.centerX, layout.view.centerY);
				
				nodeElement.onmouseout =  new EventHandler( layout, function(){
					document.getElementById("tooltip").style.display="none";
					layout.mouseHover = false;
                    document.body.style.cursor='default';
				} );

				nodeElement.onmousedown =  new EventHandler( layout, 
					function(id, domElement, event){
						layout.handleMouseDownEvent(id);
					} , modelNode.id, nodeElement );
				nodeElement.onmouseup = new EventHandler(layout, 
					function(domElement, event){
						layout.handleMouseUpEvent();
						Event.stop(event);
					}, nodeElement );
                if(!dataNode.cannot_undo){
                  nodeElement.onclick = new EventHandler( layout, 
                      function(dataNode, domElement, event){
                          Event.stop(event); // prevent propogation
                          if( layout.mouseMoved ) { layout.mouseMoved = false; Event.stop(event); return false; }
                          if( dataNode.isAjax ){
                              var paramString = "authenticity_token=" + AUTH_TOKEN;
                              new Ajax.Updater( 'p_page', dataNode.URL, {
                                  asynchronous: true,
                                  evalScripts: true,
                                  method: 'get',
                                  parameters: paramString,
                                  onLoading: function(){ $('spinner_div').show();},
                                  onComplete: function() { $('spinner_div').hide(); window.document.fire('jsviz:clicked'); }
                              });
                          } 
                          else if( dataNode['cannotUndo'] ) {	}
                          else { window.location = dataNode.URL; }
                      }, dataNode, nodeElement );
                }
					
				group.appendChild(nodeElement);
				
				if( dataNode.text && dataNode.text != "" ) {
                    var Node = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    var svgText = document.createTextNode(dataNode.text);
                    Node.setAttribute('text-anchor', 'middle');
                    Node.setAttribute('x', '0px');
                    Node.setAttribute('y', '18px');
					//Node.style.visibility='visible';
                    
                    Node.appendChild(svgText);
                    group.appendChild(Node);
				}
				
				if( dataNode.root ) { group.setAttribute('id', 'RootNode');	}
				
				return group;
			} else {
				var nodeElement = document.createElement( 'div' );
				nodeElement.style.position = "absolute";
				nodeElement.style.width = "12px";
				nodeElement.style.height = "12px";
				
				var color = dataNode.color.replace( "#", "" );
				nodeElement.style.backgroundImage = "url(http://kylescholz.com/cgi-bin/bubble.pl?title=&r=12&pt=8&b=888888&c=" + color + ")";
				nodeElement.innerHTML = '<img width="1" height="1">';
	
				nodeElement.onmouseover =  new EventHandler( window, function(dataNode, modelNode, skewX, skewY, centerX, centerY){
					var tt = document.getElementById("tooltip");
					tt.innerHTML="URL: " + dataNode.URL + " isAjax: " + dataNode.isAjax + " isCurr: " + dataNode.current;
					tt.style.display="block";
					tt.style.left=(modelNode.positionX*skewX + centerX + 5) + "px";
					tt.style.top=(modelNode.positionY*skewY + centerY + 35) +  "px";
				}, dataNode, modelNode, layout.view.skewX, layout.view.skewY, layout.view.centerX, layout.view.centerY );
				
				nodeElement.onmouseout =  new EventHandler( window, function(){
					document.getElementById("tooltip").style.display="none";
				} );
				
				nodeElement.onmousedown =  new EventHandler( layout, layout.handleMouseDownEvent, modelNode.id );
				nodeElement.onmouseup = new EventHandler( layout, 
					function(dataNode, event){
						Event.stop(event); // prevent propogation
						if( layout.mouseMoved ) { layout.mouseMoved = false; return; }
						if( dataNode.isAjax ){
							var paramString = "authenticity_token=" + AUTH_TOKEN;
							new Ajax.Updater( 'p_page', dataNode.URL, {
								asynchronous: true,
								evalScripts: true,
								parameters: paramString
							});

						} 
						else if( dataNode['cannotUndo'] )
						{
							
						}
						else{
							window.location = dataNode.URL;
						}
					}, dataNode );
				return nodeElement;
			}
		}
	}
	/* Force Directed Graphs are a simulation of different kinds of
	 * forces between particles. In JSViz, a graph edge is typically
	 * represented as an attractive "spring" force connecting
	 * two nodes.
	 * 
	 * It's often the case that parent-child relationships are
	 * represented with stricter force rules. This can help a graph
	 * organize with fewer overlapping edges.
	 */		
	layout.forces.spring._default = function( nodeA, nodeB, isParentChild ) {
		var Len = 50 + Math.floor(Math.random() * 5) * 10;
		if (isParentChild) {
			return {
				springConstant: 0.25,
				dampingConstant: 0.1,
				restLength: Len
			}
		} else {
			return {
				springConstant: 0.3,
				dampingConstant: 0.28,
				restLength: Len-20
			}
		}
	}
	
	/* Note that there is no need to include the above function in
	 * your application if you're satisfied with the default
	 * behavior.
	 * 
	 * You may wish to represent different edge weights in your
	 * graph with different edge lengths. A number of factors
	 * contribute to the actual edge length, but you can incluence
	 * the graph by applying different spring confiugrations between
	 * different kinds of edges.
	 * 
	 * For example, to apply a looser relationship beween node types
	 * 'A' and 'B', I can create a custom spring with greater
	 * elasticity:
	 */
	layout.forces.spring['A'] = {};
	layout.forces.spring['A']['B'] = function( nodeA, nodeB, isParentChild ) {
		var Len = 50 + Math.floor(Math.random() * 5) * 10;
		return {
			springConstant: 0.5,
			dampingConstant: 0.2,
			restLength: Len
		}
	}
	/* Note that these configurations are directed: The above
	 * configuration would apply to an edge from a node of type
	 * 'A' to a node of type 'B', but not from a 'B' to an 'A' ...
	 * use a additional configuration from that. 
	 */
	
	/* The other forces in our graph repel each node from another.
	 * This function should be the same for all node types.
	 */
	layout.forces.magnet = function() {
		return {
			magnetConstant: -5000,
			minimumDistance: 70
		}
	}

	/* 3) Override the default edge properties builder.
	 * 
	 * This is optional of course, but we'll create a custom edge
	 * builder that draws edges in the color of the parent node.
	 * 
	 * @return Object
	 */ 
	layout.viewEdgeBuilder = function( dataNodeSrc, dataNodeDest ) {
		if ( this.svg ) {
			return {
				'stroke': dataNodeDest.color,
				'stroke-width': '2px',
				'stroke-dasharray': '2,4'
			}
		} else {
			return {
				'pixelColor': dataNodeDest.color,
				'pixelWidth': '2px',
				'pixelHeight': '2px',
				'pixels': 8
			}
		}
	}

	/* 4) Make an loader to process the contents of our file.
	 * 
	 * Here, we're using the XMLTreeLoader. 
	 */
	this.loader = new JSONTreeLoader( layout );
	this.loader.load();
	var loader = this.loader;
	//var loader = new XMLTreeLoader( layout.dataGraph );
	//loader.load("treedata1.xml");

	/* 5a) Control the addition of nodes and edges with a timer.
	 * 
	 * This enables the graph to start organizng as data is loaded.
	 * Use a larger tick time for smoother animation, but slower
	 * build time.
	 */
	if ( TIMEDBUILD ) {
		var buildTimer = new Timer( 0 );
		buildTimer.subscribe( layout );
		buildTimer.start();

	/* 5b) Or ... Add all nodes at once.
	 * 
	 * Use a timer and simple build class to load all nodes when
	 * they are available then stop polling for new nodes.
	 */
	} else {
		var SimpleBuilder = function() {
			this.started = false;
			this.update = function() {
				var d = layout.dequeueNode();
				if ( !this.started && d ) {
					this.started=true;
					while( layout.dequeueNode() ) {};
					while( layout.dequeueRelationship() ){ }
				}
				if ( this.started && !d ) { return false; }
				//loader.toggleText();
			}
		}				
		this.buildTimer = new Timer(0);
		this.buildTimer.subscribe( new SimpleBuilder );
		this.buildTimer.start();
	}
}

Event.observe(document, 'lightview:loaded', function(event){
	$('jsviz_div').observe('click', function(event){ Event.stop(event); });
	if (typeof(window.jsvizObj) == 'undefined') {
		window.jsvizObj = new jsviz_init();
		window.jsviz_loading = false;
	}
	
	$('jsviz_div').observe('mouseover', function(event){ Event.stop(event); }); // prevent weird mouse handling errors w/ lightview
	Event.observe( document, 'jsviz:clicked', function(event) {
		if(!jsviz_loading){
			window.jsviz_loading = true;
			window.jsvizObj.loader.load();
			window.jsvizObj.buildTimer.start();
			//window.jsvizObj.loader.toggleText();
			window.jsviz_loading = false;
		}
	});
});
