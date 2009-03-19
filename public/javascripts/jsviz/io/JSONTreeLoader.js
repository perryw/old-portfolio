/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 *     
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * Author: Perry Wong (2008) based on work by Kyle Scholz      http://kylescholz.com/
 * Copyright: 2008, 					2006-2007
 */
/**
 * Seed DataGraph with contents of an JSON tree structure.
 * 
 * @author Kyle Scholz
 * 
 * @version 0.3
 */
var JSONTreeLoader = function( layout ) {
	this.subscribers = new Array();
	this.layout = layout;
	this.dataGraph = layout.dataGraph;
	this.lastCrumb = null; // last node is the most recent node
}

/*
 * @param {Object} subscriber
 */
JSONTreeLoader.prototype.subscribe = function( subscriber ) {
	this.subscribers.push(subscriber);	
}

/*
 * 
 */
JSONTreeLoader.prototype.notify = function() {
	for( var i=0; i<this.subscribers.length; i++ ) {
		this.subscribers[i].notify();
	}
}

/*
 * Fetch JSON data for processing
 */
JSONTreeLoader.prototype.load = function( ) {
	var localScope = this;
	new Ajax.Request( '/breadcrumbs/get_currcrumb_idx', {
		method: 'get',
		onSuccess: function(transport) {
			window.CURR_CRUMB = parseInt(transport.responseText);
		},
		onFailure: function(request) { 
			alert('failed to get current breadcrumb index with response ' + request); 
		}
	} );
	new Ajax.Request('/breadcrumbs/get_breadcrumb', {
		asynchronous:false, 
		method:'get', 
		onFailure:function(request){ alert('failed to get breadcrumb for JSViz'); }, 
		onSuccess: function(request){
			localScope.handle(request);
		}
	});
}
	
/*
 * Process JSON data in DataGraph.
 * 
 * @param {JSONHTTPRequest} request
 */
JSONTreeLoader.prototype.handle = function( request ) {
	this.JSONDoc = request.responseJSON;
	/*
  this.JSONDoc='[{"cannot_undo":false,"parent":[],"is_ajax":false,"params":{"action":"show","id":"20","controller":"deliverables"},"is_future":false,"children":[1]},{"cannot_undo":false,"parent":[0],"is_ajax":true,"params":{"action":"index","controller":"resources"},"is_future":false,"children":[2,4,38]},{"cannot_undo":false,"parent":[1,4],"is_ajax":true,"params":{"action":"index","controller":"gallery"},"is_future":true,"children":[3,12]},{"cannot_undo":false,"parent":[2,12,4],"is_ajax":true,"params":{"action":"index","controller":"projects"},"is_future":true,"children":[15,16,19,20,43,50,55,58]},{"cannot_undo":true,"parent":[1],"is_ajax":false,"params":{"format":"js","commit":"Create_from_index","action":"create","controller":"resources"},"is_future":true,"children":[5,2,3]},{"cannot_undo":false,"parent":[4],"is_ajax":true,"params":{"action":"set_resource_tag_list","id":"99","value":"apple, code analysis, author c whitespace","controller":"resources","editorId":"resource_tag_list_99_in_place_editor"},"is_future":true,"children":[6]},{"cannot_undo":false,"parent":[5],"is_ajax":true,"params":{"action":"set_resource_tag_list","id":"96","value":"apple, code analysis, app h whitespace","controller":"resources","editorId":"resource_tag_list_96_in_place_editor"},"is_future":true,"children":[7]},{"cannot_undo":false,"parent":[6],"is_ajax":true,"params":{"action":"set_resource_tag_list","id":"96","value":"apple, code analysis, m whitespace","controller":"resources","editorId":"resource_tag_list_96_in_place_editor"},"is_future":true,"children":[8]},{"cannot_undo":false,"parent":[7],"is_ajax":true,"params":{"action":"set_resource_tag_list","id":"93","value":"apple, code analysis, m app whitespace","controller":"resources","editorId":"resource_tag_list_93_in_place_editor"},"is_future":true,"children":[9]},{"cannot_undo":false,"parent":[8],"is_ajax":true,"params":{"action":"set_resource_tag_list","id":"90","value":"apple, code analysis, h whitespace","controller":"resources","editorId":"resource_tag_list_90_in_place_editor"},"is_future":true,"children":[10]},{"cannot_undo":false,"parent":[9],"is_ajax":true,"params":{"action":"set_resource_tag_list","id":"93","value":"apple, code analysis, m app","controller":"resources","editorId":"resource_tag_list_93_in_place_editor"},"is_future":true,"children":[11]},{"cannot_undo":false,"parent":[10],"is_ajax":true,"params":{"action":"set_resource_tag_list","id":"87","value":"apple, code analysis, h app whitespace","controller":"resources","editorId":"resource_tag_list_87_in_place_editor"},"is_future":true,"children":[12]},{"cannot_undo":false,"parent":[11,2],"is_ajax":true,"params":{"action":"index","controller":"deliverables"},"is_future":true,"children":[3,13]},{"cannot_undo":true,"parent":[12],"is_ajax":true,"params":{"action":"destroy","_method":"delete","id":"19","controller":"deliverables"},"is_future":true,"children":[14]},{"cannot_undo":true,"parent":[13],"is_ajax":true,"params":{"action":"destroy","_method":"delete","id":"20","controller":"deliverables"},"is_future":true,"children":[]},{"cannot_undo":false,"parent":[3],"is_ajax":false,"params":{"action":"index","controller":"root"},"is_future":true,"children":[]},{"cannot_undo":false,"parent":[3],"is_ajax":false,"params":{"action":"edit","id":"9","controller":"projects"},"is_future":true,"children":[17]},{"cannot_undo":true,"parent":[16],"is_ajax":false,"params":{"commit":"Update","action":"update","_method":"put","id":"9","project":{"name":"Questionnaire","key_resource_id":"102","description":"","course_id":"27"},"controller":"projects","collaborator":{"6":"0","11":"0","7":"0","12":"0","8":"0","13":"0","9":"0","14":"0","15":"0","16":"0","1":"0","17":"0","2":"0","3":"0","4":"0","10":"0","5":"0"}},"is_future":true,"children":[18]},{"cannot_undo":false,"parent":[17],"is_ajax":false,"params":{"action":"show","id":"9","controller":"projects"},"is_future":true,"children":[]},{"cannot_undo":false,"parent":[3],"is_ajax":false,"params":{"action":"edit","id":"11","controller":"projects"},"is_future":true,"children":[37]},{"cannot_undo":false,"parent":[3],"is_ajax":false,"params":{"action":"edit","id":"10","controller":"projects"},"is_future":true,"children":[21,36]},{"cannot_undo":true,"parent":[20],"is_ajax":true,"params":{"div_name":"new_association_link","action":"new_association","id":"10","controller":"projects"},"is_future":true,"children":[22,23,24,25,26,29,31,33,34]},{"cannot_undo":false,"parent":[21],"is_ajax":true,"params":{"span_name":"preview_pane0","action":"update_preview","selected_value":"87","controller":"projects"},"is_future":true,"children":[28]},' +
'{"cannot_undo":false,"parent":[21],"is_ajax":true,"params":{"span_name":"preview_pane0","action":"update_preview","selected_value":"90","controller":"projects"},"is_future":true,"children":[]},{"cannot_undo":false,"parent":[21,26],"is_ajax":true,"params":{"span_name":"preview_pane0","action":"update_preview","selected_value":"93","controller":"projects"},"is_future":true,"children":[27]},{"cannot_undo":false,"parent":[21],"is_ajax":true,"params":{"span_name":"preview_pane0","action":"update_preview","selected_value":"96","controller":"projects"},"is_future":true,"children":[]},{"cannot_undo":false,"parent":[21],"is_ajax":true,"params":{"span_name":"preview_pane0","action":"update_preview","selected_value":"99","controller":"projects"},"is_future":true,"children":[24]},{"cannot_undo":false,"parent":[24,28,30,32,35,36],"is_ajax":false,"params":{"action":"show","id":"10","controller":"projects"},"is_future":true,"children":[]},{"cannot_undo":true,"parent":[22],"is_ajax":false,"params":{"commit":"Update","action":"update","_method":"put","id":"10","project":{"name":"Code Analysis","key_resource_id":"","description":"","course_id":"27"},"new_association":{"resource_ids":["87"]},"controller":"projects","collaborator":{"6":"0","11":"0","7":"0","12":"0","8":"0","13":"0","9":"0","14":"0","15":"0","16":"0","1":"0","17":"0","2":"0","3":"0","4":"0","10":"0","5":"0"}},"is_future":true,"children":[27]},{"cannot_undo":false,"parent":[21],"is_ajax":true,"params":{"span_name":"preview_pane1","action":"update_preview","selected_value":"93","controller":"projects"},"is_future":true,"children":[30]},{"cannot_undo":true,"parent":[29],"is_ajax":false,"params":{"commit":"Update","action":"update","_method":"put","id":"10","project":{"name":"Code Analysis","key_resource_id":"","description":"","resource_ids":["87"],"course_id":"27"},"new_association":{"resource_ids":["93"]},"controller":"projects","collaborator":{"11":"0","6":"0","12":"0","7":"0","13":"0","8":"0","14":"0","9":"0","15":"0","16":"0","17":"0","1":"0","2":"0","3":"0","10":"0","4":"0","5":"0"}},"is_future":true,"children":[27]},{"cannot_undo":false,"parent":[21],"is_ajax":true,"params":{"span_name":"preview_pane2","action":"update_preview","selected_value":"99","controller":"projects"},"is_future":true,"children":[32]},{"cannot_undo":true,"parent":[31],"is_ajax":false,"params":{"commit":"Update","action":"update","_method":"put","id":"10","project":{"name":"Code Analysis","key_resource_id":"","description":"","course_id":"27","resource_ids":["87","93"]},"new_association":{"resource_ids":["99"]},"controller":"projects","collaborator":{"6":"0","11":"0","7":"0","12":"0","8":"0","13":"0","9":"0","14":"0","15":"0","16":"0","1":"0","17":"0","2":"0","3":"0","4":"0","10":"0","5":"0"}},"is_future":true,"children":[27]},{"cannot_undo":false,"parent":[21],"is_ajax":true,"params":{"span_name":"preview_pane3","action":"update_preview","selected_value":"90","controller":"projects"},"is_future":true,"children":[]},{"cannot_undo":false,"parent":[21],"is_ajax":true,"params":{"span_name":"preview_pane3","action":"update_preview","selected_value":"96","controller":"projects"},"is_future":true,"children":[35]},{"cannot_undo":true,"parent":[34],"is_ajax":false,"params":{"commit":"Update","action":"update","_method":"put","id":"10","project":{"name":"Code Analysis","key_resource_id":"","description":"","course_id":"27","resource_ids":["87","93","99"]},"new_association":{"resource_ids":["90","96"]},"controller":"projects","collaborator":{"6":"0","11":"0","7":"0","12":"0","8":"0","13":"0","9":"0","14":"0","15":"0","16":"0","1":"0","17":"0","2":"0","3":"0","4":"0","10":"0","5":"0"}},"is_future":true,"children":[27]},{"cannot_undo":true,"parent":[20],"is_ajax":false,"params":{"commit":"Update","action":"update","_method":"put","id":"10","project":{"name":"Code Analysis","key_resource_id":"96","description":"","resource_ids":["87","90","93","96","99"],"course_id":"27"},"controller":"projects","collaborator":{"11":"0","6":"0","12":"0","7":"0","13":"0","8":"0","14":"0","9":"0","15":"0","16":"0","17":"0","1":"0","2":"0","3":"0","10":"0","4":"0","5":"0"}},"is_future":true,"children":[27]},{"cannot_undo":true,"parent":[19],"is_ajax":true,"params":{"div_name":"new_association_link","action":"new_association","id":"11","controller":"projects"},"is_future":true,"children":[40]},{"cannot_undo":false,"parent":[1],"is_ajax":false,"params":{"action":"edit","id":"84","controller":"resources"},"is_future":true,"children":[39]},{"cannot_undo":false,"parent":[38],"is_ajax":false,"params":{"action":"show","id":"84","controller":"resources"},"is_future":true,"children":[]},' +
'{"cannot_undo":false,"parent":[37],"is_ajax":true,"params":{"span_name":"preview_pane0","action":"update_preview","selected_value":"84","controller":"projects"},"is_future":true,"children":[41]},{"cannot_undo":true,"parent":[40],"is_ajax":false,"params":{"commit":"Update","action":"update","_method":"put","id":"11","project":{"name":"Menu Redesign","key_resource_id":"84","description":"","course_id":"27"},"new_association":{"resource_ids":["84"]},"controller":"projects","collaborator":{"6":"0","11":"0","7":"0","12":"0","8":"0","13":"0","9":"0","14":"0","15":"0","16":"0","1":"0","17":"0","2":"0","3":"0","4":"0","10":"0","5":"0"}},"is_future":true,"children":[42]},{"cannot_undo":false,"parent":[41],"is_ajax":false,"params":{"action":"show","id":"11","controller":"projects"},"is_future":true,"children":[]},{"cannot_undo":false,"parent":[3],"is_ajax":false,"params":{"action":"edit","id":"8","controller":"projects"},"is_future":true,"children":[44]},{"cannot_undo":true,"parent":[43],"is_ajax":true,"params":{"div_name":"new_association_link","action":"new_association","id":"8","controller":"projects"},"is_future":true,"children":[45,46,47]},{"cannot_undo":false,"parent":[44],"is_ajax":true,"params":{"span_name":"preview_pane0","action":"update_preview","selected_value":"75","controller":"projects"},"is_future":true,"children":[]},{"cannot_undo":false,"parent":[44],"is_ajax":true,"params":{"span_name":"preview_pane0","action":"update_preview","selected_value":"78","controller":"projects"},"is_future":true,"children":[]},{"cannot_undo":false,"parent":[44],"is_ajax":true,"params":{"span_name":"preview_pane0","action":"update_preview","selected_value":"81","controller":"projects"},"is_future":true,"children":[48]},{"cannot_undo":true,"parent":[47],"is_ajax":false,"params":{"commit":"Update","action":"update","_method":"put","id":"8","project":{"name":"Key Bindings","key_resource_id":"81","description":"","course_id":"27"},"new_association":{"resource_ids":["75","78","81"]},"controller":"projects","collaborator":{"6":"0","11":"0","7":"0","12":"0","8":"0","13":"0","9":"0","14":"0","15":"0","16":"0","1":"0","17":"0","2":"0","3":"0","4":"0","10":"0","5":"0"}},"is_future":true,"children":[49]},{"cannot_undo":false,"parent":[48],"is_ajax":false,"params":{"action":"show","id":"8","controller":"projects"},"is_future":true,"children":[]},{"cannot_undo":false,"parent":[3],"is_ajax":true,"params":{"action":"set_project_name","id":"7","value":"Analysis of MichiPoster.com","controller":"projects","editorId":"project_name_7_in_place_editor"},"is_future":true,"children":[51]},{"cannot_undo":false,"parent":[50],"is_ajax":true,"params":{"action":"set_project_name","id":"6","value":"Analysis of Yahoo! Yootopia","controller":"projects","editorId":"project_name_6_in_place_editor"},"is_future":true,"children":[52]},{"cannot_undo":false,"parent":[51],"is_ajax":false,"params":{"action":"edit","id":"6","controller":"projects"},"is_future":true,"children":[53]},{"cannot_undo":true,"parent":[52],"is_ajax":false,"params":{"commit":"Update","action":"update","_method":"put","id":"6","project":{"name":"Analysis of Yahoo! Yootopia","key_resource_id":"105","description":"","course_id":"19"},"controller":"projects","collaborator":{"11":"0","6":"0","12":"0","7":"0","13":"0","8":"0","14":"0","9":"0","15":"0","16":"0","17":"0","1":"0","2":"0","3":"0","10":"0","4":"0","5":"0"}},"is_future":true,"children":[54]},{"cannot_undo":false,"parent":[53],"is_ajax":false,"params":{"action":"show","id":"6","controller":"projects"},"is_future":true,"children":[]},{"cannot_undo":false,"parent":[3],"is_ajax":false,"params":{"action":"edit","id":"7","controller":"projects"},"is_future":true,"children":[56]},{"cannot_undo":true,"parent":[55],"is_ajax":false,"params":{"commit":"Update","action":"update","_method":"put","id":"7","project":{"name":"Analysis of MichiPoster.com","key_resource_id":"105","description":"","course_id":"21"},"controller":"projects","collaborator":{"11":"0","6":"0","12":"0","7":"0","13":"0","8":"0","14":"0","9":"0","15":"0","16":"0","17":"0","1":"0","2":"0","3":"0","10":"0","4":"0","5":"0"}},"is_future":true,"children":[57]},{"cannot_undo":false,"parent":[56],"is_ajax":false,"params":{"action":"show","id":"7","controller":"projects"},"is_future":true,"children":[]},{"cannot_undo":false,"parent":[3],"is_ajax":false,"params":{"action":"edit","id":"12","controller":"projects"},"is_future":true,"children":[59]},' +
'{"cannot_undo":true,"parent":[58],"is_ajax":false,"params":{"commit":"Update","action":"update","_method":"put","id":"12","project":{"name":"TV Disclaimer Noticeability","key_resource_id":"105","description":"","course_id":"28"},"controller":"projects","collaborator":{"11":"1","6":"0","12":"0","7":"0","13":"0","8":"0","14":"0","9":"0","15":"0","16":"0","17":"0","1":"0","2":"0","3":"0","10":"1","4":"0","5":"0"}},"is_future":true,"children":[60]},{"cannot_undo":false,"parent":[59],"is_ajax":false,"params":{"action":"show","id":"12","controller":"projects"},"is_future":true,"children":[]}]';
  this.JSONDoc = this.JSONDoc.evalJSON();
  */
  if( (this.JSONDoc.length == 1) || (this.JSONDoc.length < this.dataGraph.nodes.length) )	{
		this.layout.clear(); 
		this.dataGraph.clear(); 
	}
	var root = this.JSONDoc[0];
	var params = root['params'];
	var rootNode = new DataGraphNode();

	rootNode["root"] = true;
  rootNode.text = this.nodeText(params);		
	rootNode.URL = this.reconstructURL(params);
	this.generateColorStrip();
  
	rootNode.colorStripIndex = 0;
	rootNode.isAjax = root['is_ajax'];
	rootNode["fixed"] = true;
	rootNode.distFromRoot = 0;
	rootNode.parent = new Array();
	rootNode.children = $A(root["children"]);
	var idx = this.dataGraph.findNode(rootNode);
	rootNode = (idx) ? this.dataGraph.getNode(idx) : rootNode;
	
	if( window.CURR_CRUMB == 0 ){
		rootNode["color"] = this.colorStrip[rootNode.colorStripIndex=0];
		rootNode.current = true;
	}
	else {
		rootNode["color"] = (rootNode.colorStripIndex<5) ?
        this.colorStrip[rootNode.colorStripIndex+=1] : this.colorStrip[5];
		rootNode.current = false;
	}
	
	if (idx) {
		this.layout.view.nodes[rootNode.id].domElement.childNodes[0].setAttribute("fill", rootNode["color"]);
	}
	else {
		this.dataGraph.addNode(rootNode);
	}
	
	// Add children
	var localScope = this;
	root["children"].each( function(child) { 
			this.lastNodeAdded = localScope.branch(child, rootNode, 0); // , "#90EE90" // green
		});
	this.notify();
}

/*
 * @param {Object} root
 * @param {Object} rootNode
 */
JSONTreeLoader.prototype.branch = function( root, rootNode, distFromRoot ) {
	var child = this.JSONDoc[root];
	var params = child['params'];
	var childNode = new DataGraphNode();
	var localScope = this;

  childNode.text = this.nodeText(params);
	childNode.URL = this.reconstructURL(params);
  
	childNode.colorStripIndex=0;
	childNode.isAjax = child['is_ajax'];
	childNode.distFromRoot = distFromRoot;

	var idx = this.dataGraph.findNode(childNode);
	childNode = (idx) ? this.dataGraph.getNode(idx) : childNode;
	
	if(!childNode.parent) { childNode.parent = new Array(); }
    childNode.parent.push(rootNode);
    childNode.parent = childNode.parent.uniq();
	childNode.children = child["children"];
	
	if( window.CURR_CRUMB == root ){
		childNode["color"] = this.colorStrip[childNode.colorStripIndex=0];
		childNode.current = true;
	} else {
		childNode["color"] = (childNode.colorStripIndex<5) ?
        this.colorStrip[childNode.colorStripIndex+=1] : this.colorStrip[5];
		childNode.current = false;
	}
	if (idx) {
		this.layout.view.nodes[childNode.id].domElement.childNodes[0].setAttribute("fill", childNode["color"]);
		//this.layout.view.nodes[childNode.id].domElement.childNodes[1].style.visibility='hidden';
		var paren = childNode.parent.last();
		var edge = this.layout.view.edges[childNode.id][paren.id] || this.layout.view.edges[paren.id][childNode.id];
		if(!edge) {  //edge doesn't exist yet....create it now 
			for(pdx in childNode.parent) {
				p = childNode.parent[pdx];
				if(!p.id) continue;
				var e = this.layout.view.edges[childNode.id][p.id] || this.layout.view.edges[p.id][childNode.id];
				if(!e){
					if(pdx == (childNode.parent.size()-1)) break;
					continue;
				}
				e.domEdge.setAttribute("stroke", this.colorStrip[1]);
				
			}
			this.dataGraph.addEdge(childNode, rootNode);
					
			var configNode = (childNode.type in this.layout.forces.spring &&
			rootNode.type in this.layout.forces.spring[childNode.type]) ? 
			this.layout.forces.spring[childNode.type][rootNode.type](childNode, rootNode, true) : 
			this.layout.forces.spring['_default'](childNode, rootNode, true);
			this.layout.model.makeSpring( childNode.particle, rootNode.particle, 
				configNode.springConstant, configNode.dampingConstant, configNode.restLength );
	
			var props = this.layout.viewEdgeBuilder( rootNode, childNode );
			this.layout.view.addEdge( childNode.particle, rootNode.particle, props );
			this.layout.view.drawEdge( childNode.particle, rootNode.particle );
		}
		else {
			edge.domEdge.setAttribute("stroke", childNode["color"]);
		}
	}
	else {
		this.dataGraph.addNode(childNode);
	}
	
	child["children"].each( function(child) {
			localScope.branch(child, childNode, distFromRoot+1);
		});
	return childNode;
}

JSONTreeLoader.prototype.reconstructURL = function( params ) {
	var loc = document.location;
	var action = params['action'];
	var url = loc.protocol + '//'+ loc.host + "/" + params['controller'] + '/';
	if( action != 'index' && action != 'show' ) {
		url += action + "/";
	}
	if( params['id'] )	{
		url += params['id'];
	}

	return url;
}
JSONTreeLoader.prototype.nodeText = function(params){
  var text = "";
  var controller = params['controller']; var action = params['action'];
  if( controller == 'root' )
    text = "Home";
	else if( params.id ) {
		text = controller[0].toUpperCase();
		if( params.action != 'show' )
			text += ": " + action;

		text += ' ' + params.id;
	}
  else if(controller == 'gallery')
    text = "Gallery: " + action[0].toUpperCase() + action.substring(1);
  else if( controller == 'myself' ) {
    if(action == 'index')
      text = 'About';
    else
      text = 'Resume';
  }
  else
		text = controller[0].toUpperCase() + controller.substring(1);
    
  return text;
}
JSONTreeLoader.prototype.toggleText = function() {
	var leaves = $A(this.dataGraph.nodes);
	
	for(var i=0; i<leaves.size(); i++){
		if (leaves[i].children.size() == 0) { // found leaf
			this.layout.view.nodes[leaves[i].id].domElement.childNodes[1].style.visibility='visible';
			var dfr = leaves[i].distFromRoot;
		}
	}
	
	this.layout.view.nodes[0].domElement.childNodes[1].style.visibility='visible';
}
// from http://krazydad.com/makecolors.php
JSONTreeLoader.prototype.generateColorStrip = function() {
	var frequency = Math.PI/10;
	var numStops = 6; // hence phase of pi/10
	var colorString = "#";
	var rStart = 0xAD;  var rStop = 0xcc;
	var gStart = 0xD8;  var gStop = 0xcc;
	var bStart = 0xE6;  var bStop = 0xcc;
	
	this.colorStrip = new Array(6);
	for( i=0; i<numStops; i++ ) {
		rComponent = Math.round(Math.sin(frequency*i)*(rStop-rStart) + rStart);
		gComponent = Math.round(Math.sin(frequency*i)*(gStop-gStart) + gStart);
		bComponent = Math.round(Math.sin(frequency*i)*(bStop-bStart) + bStart);
		this.colorStrip[i+1] = colorString+rComponent.toString(16)+gComponent.toString(16)+bComponent.toString(16);
	}
	this.colorStrip[0] = "#D14A6C";
}
