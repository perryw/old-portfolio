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
 * Author: Ted Mielczarek	http://ted.mielczarek.org/
 * Copyright: 2006-2007
 */

/**
 * SVGGraphView
 * 
 * @author Kyle Scholz
 * @author Ted Mielczarek
 * 
 * @version 0.3.3
 * 
 * Represents a view on a GraphModel. This implementation supports SVG
 * elements as well as HTML elements.
 * 
 * Since SVG isn't universally supported, I suggest you offer HTMLGraphView
 * to less-evolved browsers. Try this to assign the appropriate view:
 * 
 * var view;
 * if ( document.implementation.hasFeature("org.w3c.dom.svg", '1.1') ) {
 *     view=new SVGGraphView();
 * } else {
 *     view=new HTMLGraphView();
 * }
 * 
 * @param {HTMLElement} container
 * @param {Boolean} skewView (optional) Indicates whether we should draw on a 'skewed' canvas.
 */
var SVGGraphView = function( container, skewView ) {

	this.container = container;

	this.frameLeft = 0;
	this.frameTop = 0;

	this.skewView = skewView;
	this.skewBase = 0;
	this.skewX = 1;
	this.skewY = 1;

	this['nodes'] = {};

	this['edges'] = {};
	
	this.SVGNS = 'http://www.w3.org/2000/svg';
	
	this.svg = document.createElementNS(this.SVGNS, "svg");
	
	this.df = document.createElementNS(this.SVGNS, 'defs');
	this.svg.appendChild(this.df);

	this.svg.setAttribute("version", "1.1");
	this.container.appendChild( this.svg );

	this.eg = document.createElementNS(this.SVGNS, "g");
	this.svg.appendChild(this.eg);

	this.ng = document.createElementNS(this.SVGNS, "g");
 	this.svg.appendChild(this.ng);

	this.defaultEdgeProperties = {
		'stroke': '#c4c4c4',
		'stroke-width': '2px',
		'stroke-dasharray': '2,8'
	}
}

/*
 * @param {Number} frameLeft
 * @param {Number} frameTop
 * @param {Number} frameWidth
 * @param {Number} frameHeight
 */
SVGGraphView.prototype.setSize = function( frameLeft, frameTop, frameWidth, frameHeight ) {
	this.frameLeft = frameLeft;
	this.frameTop = frameTop;
	this.frameWidth = frameWidth;
	this.frameHeight = frameHeight;

	this.centerX = parseInt(frameWidth/2);
	this.centerY = parseInt(frameHeight/2);		

	if ( this.skewView && this.skewBase) {
		this.skewX = this.frameWidth/this.skewBase;
		this.skewY = this.frameHeight/this.skewBase;
	} else {
		this.skewX = 1;
		this.skewY = 1;
	}

   	this.svg.setAttribute("width", this.frameWidth);
   	this.svg.setAttribute("height", this.frameHeight);
	var dimString = parseInt(-1*this.frameWidth/2) + " " + parseInt(-1*this.frameHeight/2)
		+ " " + this.frameWidth + " " + this.frameHeight;
	this.svg.setAttribute("viewBox", dimString);
}

/*
 * Add a node to the view. 
 *
 * @param {Particle} particle
 * @param {DOMNode} domElement
 * @param {Number} centerOffsetX, Position of center of domNode relative to 
 * 		left. If not provided, SVG elements are assumed centered. The center of
 * 		HTML elements is set to offsetWidth/2.
 * @param {Number} centerOffsetY, Position of center of domNode relative to 
 * 		top. If not provided, SVG elements are assumed centered. The center of
 * 		HTML elements is determined by offsetHeight/2.
 */
SVGGraphView.prototype.addNode = function( particle, domElement,
	centerOffsetX, centerOffsetY ) {

	// With an SVG View Element
	if ( domElement.localName=="g" || domElement.localName=="circle" || domElement.localName == "text" ) {
		this.ng.appendChild(domElement);
		centerOffsetX = -300;
		centerOffsetY = 0;

	// With an HTML View Element
	} else {
		this.container.appendChild(domElement);
		domElement.style.zIndex=10;
		if ( centerOffsetX == null ) {
			centerOffsetX = parseInt( domElement.offsetWidth/2 );
		}
		if ( centerOffsetY == null ) {
			centerOffsetY = parseInt( domElement.offsetHeight/2 );
		}
	}

	this.nodes[particle.id] = {
		domElement: domElement,
		centerX: centerOffsetX,
		centerY: centerOffsetY			
	}

	this.drawNode(particle);
	return domElement;
}

/*
 * Drop node, eliminating dom element from document
 */
SVGGraphView.prototype.removeNode = function( particle ) {
	if ( particle ) {
	var domElement = this.nodes[particle.id].domElement;
	if ( domElement.localName=="circle" || domElement.localName == "text" ) {
		this.ng.removeChild( domElement );
	} else {
		this.container.removeChild( domElement );
	}

	// delete edges to particle
	for ( var e in this.edges[particle.id] ) {
		this.removeEdge(this.edges[particle.id][e]);
	}
	
	// delete edges to particle
	for ( var e in this.edges ) {
		if ( this.edges[e][particle.id] ) {
			this.removeEdge(this.edges[e][particle.id]);
		}
	}

	delete this.nodes[particle.id];
	}
}

/*
 * Add an Edge to the view.
 * 
 * @param {Particle} particleA
 * @param {Particle} particleB
 * @param {Object} edgeProperties
 */
SVGGraphView.prototype.addEdge = function( particleA, particleB, edgeProperties ) {
	if ( !this['edges'][particleA.id] ) {
		this['edges'][particleA.id]={};
	}
	if ( !this['edges'][particleA.id][particleB.id] ) {
		var edge = document.createElementNS(this.SVGNS, "polyline");
		if ( !edgeProperties ) {
			edgeProperties = this.defaultEdgeProperties;
		}
		for ( var p in edgeProperties ) {
			if (p == 'EdgeDirection') {
				var direction = edgeProperties['EdgeDirection'];
				// 1 from particleB to particleA
				// 2 from particleA to particleB
				// 3 both ways
				if (direction == 1 || direction == 3) {
					var MId = this.drawMarker(particleA, particleB, { EdgeType: 'start', stroke: edgeProperties['stroke']});
					edge.setAttribute('marker-start', 'url(#' + MId + ')');
				}
				if (direction == 2 || direction == 3) {
					var MId = this.drawMarker(particleA, particleB, { EdgeType: 'end', stroke: edgeProperties['stroke']});
					edge.setAttribute('marker-end', 'url(#' + MId + ')');
				}
			}
			else {
				edge.setAttribute(p, edgeProperties[p]);
			}
		}
		this.edges[particleA.id][particleB.id] = edge;
		edge.id = 'edge'+particleA.id+':'+particleB.id;
		this.eg.appendChild(edge);
 		this['edges'][particleA.id][particleB.id] = {
			source: particleA,
			target: particleB,
			domEdge: edge
		}
		return edge;
	} else {
		return this['edges'][particleA.id][particleB.id].domEdge;
	}
}

/**
 * Create a marker arrow for the edge.
 * 
 * @author Simon Speich, www.speich.net
 * @param {Particle} particleA
 * @param {Particle} particleB
 * @param {object}	marker properties
 * @return string Marker id
 */
SVGGraphView.prototype.drawMarker = function(particleA, particleB, Props){
	var Marker = document.createElementNS(this.SVGNS, 'marker');
	Marker.setAttribute('markerUnits', 'userSpaceOnUse');
	Marker.setAttribute('markerWidth', 10);
	Marker.setAttribute('markerHeight', 10);
	Marker.setAttribute('orient', 'auto');
	// start arrow head where circle ends
	// TODO: better method to get X
	var MrefX = Number(this.nodes[particleA.id].domElement.getElementsByTagName('circle')[0].getAttribute('r'));
	var p = document.createElementNS(this.SVGNS, 'polyline');
	p.setAttribute('fill', Props['stroke']);
	Marker.setAttribute('refY', 5);
	if (Props['EdgeType'] == 'end') {
		var MId = 'ME';	// end marker
		Marker.setAttribute('refX', MrefX + Number(Marker.getAttribute('markerWidth')));
		p.setAttribute('points', '0,0 10,5 0,10 1,5');
	}
	else if (Props['EdgeType'] == 'start') {
		var MId = 'MS';	// start marker
		Marker.setAttribute('refX', -MrefX);
		p.setAttribute('points', '10,0 0,5 10,10 9,4');
	}
	Marker.setAttribute('id', MId + particleA.id + ':' + particleB.id);
	Marker.appendChild(p);
	this.df.appendChild(Marker);
	return Marker.id;
}

/*
 * Drop edge, eliminating dom element from document
 */
SVGGraphView.prototype.removeEdge = function( edge ) {
	var domElement = edge.domEdge;
	var particleA = edge.source;
	var particleB = edge.target;
	this.eg.removeChild(domElement);
	delete this['edges'][particleA.id][particleB.id];
}

/*
 * Draw a node at it's current position.
 * 
 * @param {Particle} particle
 */
SVGGraphView.prototype.drawNode = function( particle ) {
	var domNodeProps = this['nodes'][particle.id];
	if ( domNodeProps ) {
		var domNode = domNodeProps.domElement;
		if( domNode.localName == 'circle' || domNode.localName == 'g') {
			domNode.setAttribute('transform','translate(' + particle.positionX*this.skewX + ' ' + 
				particle.positionY*this.skewY + ')');
		} else if ( domNode.localName == 'text' ) {
			domNode.setAttribute('transform','translate(' + (particle.positionX*this.skewX - 
				domNode.getAttribute("width")) + ' ' + (particle.positionY*this.skewY - 
				domNode.getAttribute("height")) + ')');
		} else {
			domNode.style.left = (particle.positionX*this.skewX) - 
				domNodeProps.centerX + this.centerX + 'px';
			domNode.style.top = particle.positionY*this.skewY - 
				domNodeProps.centerY + this.centerY + 'px';
		}	
		var e = this.edges[particle.id];
		for ( var t in e ) {
			this.drawEdge( particle, e[t]['target'] );
		}
	}
}

/*
 * Draw an edge at it's current position.
 * 
 * @param {Particle} particleA
 * @param {Particle} particleB
 */
SVGGraphView.prototype.drawEdge = function ( particleA, particleB ) {
	var edge = this.edges[particleA.id][particleB.id]['domEdge'];
	var x1 = particleA.positionX * this.skewX;
	var y1 = particleA.positionY * this.skewY;
	var x2 = particleB.positionX * this.skewX;
	var y2 = particleB.positionY * this.skewY;
	edge.setAttribute('points', x1 + "," + y1 + "," + x2 + "," + y2);
}
	
/*
 * Remove everything from the view.
 */
SVGGraphView.prototype.clear = function() {
	// first, remove all the edges
	for ( var e in this.edges ) {
		for ( var eb in this.edges[e] ) {
			this.eg.removeChild( this.edges[e][eb].domEdge );
		}
	}

	this.edges = {};
	this.nodes;
	// now remove the nodes
	for ( var n in this.nodes ) {
		var domElement = this.nodes[n].domElement;
		if (domElement.localName=="circle" || domElement.localName=="text") {
			this.ng.removeChild(domElement);
		} else {
			//this.container.removeChild(domElement);
			this.ng.removeChild(domElement);
		}
	}		

	this.nodes = {};
}