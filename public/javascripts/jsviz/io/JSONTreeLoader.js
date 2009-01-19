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
			alert('railed to get current breadcrumb index with response ' + request); 
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
	if( (this.JSONDoc.length == 1) || (this.JSONDoc.length < this.dataGraph.nodes.length) )	{
		this.layout.clear(); 
		this.dataGraph.clear(); 
	}
	var root = this.JSONDoc[0];
	var params = root['params'];
	var rootNode = new DataGraphNode();

	rootNode["root"] = true;

	rootNode.text = params['controller'] + ": " + params['action'];
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

	childNode.text = params['controller'] + ": " + params['action'];
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
	if( params['id'] )
	{
		url += parseInt(params['id']);
	}

	return url;
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
