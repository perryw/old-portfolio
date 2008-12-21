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
 * Author: Kyle Scholz      http://kylescholz.com/
 * Copyright: 2006-2007
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
	req = new Ajax.Request('/breadcrumbs/get_breadcrumb', 
		{
			asynchronous:false, 
			method:'get', 
			onFailure:function(request){ alert('failed to get breadcrumb for JSViz'); }, 
			onSuccess: function(request){
				localScope.handle(request);
			},
			parameters:'authenticity_token=' + encodeURIComponent(AUTH_TOKEN)
		});
}
	
/*
 * Process JSON data in DataGraph.
 * 
 * @param {JSONHTTPRequest} request
 */
JSONTreeLoader.prototype.handle = function( request ) {
	this.JSONDoc = request.responseJSON;
	var root = this.JSONDoc[0];
	var params = root['params'];
	var rootNode = new DataGraphNode();

	if( CURR_CRUMB == 0 ){
		rootNode["root"] = true;
	}

	rootNode["color"] = "#cccccc";
	rootNode.text = params['controller'] + ": " + params['action'];
	rootNode.URL = this.reconstructURL(params);
	rootNode.isAjax = root['is_ajax'];
	rootNode["fixed"] = true;
	
	var idx = this.dataGraph.findNode(rootNode);
	rootNode = (idx) ? this.dataGraph.getNode(idx) : rootNode;
	if (!idx) {
		this.dataGraph.addNode(rootNode);
	}
	//this.lastCrumb = this.JSONDoc[this.JSONDoc.length-1];
	
	// Add children
	var localScope = this;
	root["children"].each( function(child) { 
			this.lastNodeAdded = localScope.branch(child, rootNode, "#90EE90");
		});

	this.notify();
}

/*
 * @param {Object} root
 * @param {Object} rootNode
 */
JSONTreeLoader.prototype.branch = function( root, rootNode, color ) {
	var child = this.JSONDoc[root];
	var params = child['params'];
	var childNode = new DataGraphNode();
	var localScope = this;

	childNode["color"] = color;
	childNode.text = params['controller'] + ": " + params['action'];
	childNode.URL = this.reconstructURL(params);
	childNode.isAjax = child['is_ajax'];
/*
	if( CURR_CRUMB == child ){
		//childNode["root"] = true;
	}
	*/
	var idx = this.dataGraph.findNode(childNode);
	childNode = (idx) ? this.dataGraph.getNode(idx) : childNode;
	
	if(!childNode.parent) { childNode.parent = new Array(); }
	childNode.parent.push(rootNode);
	
	if (!idx) {
		this.dataGraph.addNode(childNode);
	}
	
	child["children"].each( function(child) {
			this.lastNodeAdded = localScope.branch(child, childNode, "#ADD8E6");
			
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
