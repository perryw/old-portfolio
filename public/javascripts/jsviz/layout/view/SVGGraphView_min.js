var SVGGraphView=function(a,b){this.container=a;this.frameLeft=0;this.frameTop=0;this.skewView=b;this.skewBase=0;this.skewX=1;this.skewY=1;this["nodes"]={};this["edges"]={};this.SVGNS="http://www.w3.org/2000/svg";this.svg=document.createElementNS(this.SVGNS,"svg");this.df=document.createElementNS(this.SVGNS,"defs");this.svg.appendChild(this.df);this.svg.setAttribute("version","1.1");this.container.appendChild(this.svg);this.eg=document.createElementNS(this.SVGNS,"g");this.svg.appendChild(this.eg);this.ng=document.createElementNS(this.SVGNS,"g");this.svg.appendChild(this.ng);this.defaultEdgeProperties={stroke:"#c4c4c4","stroke-width":"2px","stroke-dasharray":"2,8"}};SVGGraphView.prototype.setSize=function(e,d,a,b){this.frameLeft=e;this.frameTop=d;this.frameWidth=a;this.frameHeight=b;this.centerX=parseInt(a/2);this.centerY=parseInt(b/2);if(this.skewView&&this.skewBase){this.skewX=this.frameWidth/this.skewBase;this.skewY=this.frameHeight/this.skewBase}else{this.skewX=1;this.skewY=1}this.svg.setAttribute("width",this.frameWidth);this.svg.setAttribute("height",this.frameHeight);var c=parseInt(-1*this.frameWidth/2)+" "+parseInt(-1*this.frameHeight/2)+" "+this.frameWidth+" "+this.frameHeight;this.svg.setAttribute("viewBox",c)};SVGGraphView.prototype.addNode=function(d,c,b,a){if(c.localName=="g"||c.localName=="circle"||c.localName=="text"){this.ng.appendChild(c);b=0;a=0}else{this.container.appendChild(c);c.style.zIndex=10;if(b==null){b=parseInt(c.offsetWidth/2)}if(a==null){a=parseInt(c.offsetHeight/2)}}this.nodes[d.id]={domElement:c,centerX:b,centerY:a};this.drawNode(d);return c};SVGGraphView.prototype.removeNode=function(c){if(c){var b=this.nodes[c.id].domElement;if(b.localName=="circle"||b.localName=="text"){this.ng.removeChild(b)}else{this.container.removeChild(b)}for(var a in this.edges[c.id]){this.removeEdge(this.edges[c.id][a])}for(var a in this.edges){if(this.edges[a][c.id]){this.removeEdge(this.edges[a][c.id])}}delete this.nodes[c.id]}};SVGGraphView.prototype.addEdge=function(c,a,g){if(!this["edges"][c.id]){this["edges"][c.id]={}}if(!this["edges"][c.id][a.id]){var d=document.createElementNS(this.SVGNS,"polyline");if(!g){g=this.defaultEdgeProperties}for(var f in g){if(f=="EdgeDirection"){var e=g.EdgeDirection;if(e==1||e==3){var b=this.drawMarker(c,a,{EdgeType:"start",stroke:g.stroke});d.setAttribute("marker-start","url(#"+b+")")}if(e==2||e==3){var b=this.drawMarker(c,a,{EdgeType:"end",stroke:g.stroke});d.setAttribute("marker-end","url(#"+b+")")}}else{d.setAttribute(f,g[f])}}this.edges[c.id][a.id]=d;d.id="edge"+c.id+":"+a.id;this.eg.appendChild(d);this["edges"][c.id][a.id]={source:c,target:a,domEdge:d};return d}else{return this["edges"][c.id][a.id].domEdge}};SVGGraphView.prototype.drawMarker=function(e,c,b){var a=document.createElementNS(this.SVGNS,"marker");a.setAttribute("markerUnits","userSpaceOnUse");a.setAttribute("markerWidth",10);a.setAttribute("markerHeight",10);a.setAttribute("orient","auto");var f=Number(this.nodes[e.id].domElement.getElementsByTagName("circle")[0].getAttribute("r"));var g=document.createElementNS(this.SVGNS,"polyline");g.setAttribute("fill",b.stroke);a.setAttribute("refY",5);if(b.EdgeType=="end"){var d="ME";a.setAttribute("refX",f+Number(a.getAttribute("markerWidth")));g.setAttribute("points","0,0 10,5 0,10 1,5")}else{if(b.EdgeType=="start"){var d="MS";a.setAttribute("refX",-f);g.setAttribute("points","10,0 0,5 10,10 9,4")}}a.setAttribute("id",d+e.id+":"+c.id);a.appendChild(g);this.df.appendChild(a);return a.id};SVGGraphView.prototype.removeEdge=function(c){var d=c.domEdge;var b=c.source;var a=c.target;this.eg.removeChild(d);delete this["edges"][b.id][a.id]};SVGGraphView.prototype.drawNode=function(f){var a=this["nodes"][f.id];if(a){var c=a.domElement;if(c.localName=="circle"||c.localName=="g"){c.setAttribute("transform","translate("+f.positionX*this.skewX+" "+f.positionY*this.skewY+")")}else{if(c.localName=="text"){c.setAttribute("transform","translate("+(f.positionX*this.skewX-c.getAttribute("width"))+" "+(f.positionY*this.skewY-c.getAttribute("height"))+")")}else{c.style.left=(f.positionX*this.skewX)-a.centerX+this.centerX+"px";c.style.top=f.positionY*this.skewY-a.centerY+this.centerY+"px"}}var d=this.edges[f.id];for(var b in d){this.drawEdge(f,d[b]["target"])}}};SVGGraphView.prototype.drawEdge=function(b,a){var g=this.edges[b.id][a.id]["domEdge"];var d=b.positionX*this.skewX;var f=b.positionY*this.skewY;var c=a.positionX*this.skewX;var e=a.positionY*this.skewY;g.setAttribute("points",d+","+f+","+c+","+e)};SVGGraphView.prototype.clear=function(){for(var b in this.edges){for(var a in this.edges[b]){this.eg.removeChild(this.edges[b][a].domEdge)}}this.edges={};for(var d in this.nodes){var c=this.nodes[d].domElement;if(c.localName=="circle"||c.localName=="text"){this.ng.removeChild(c)}else{this.ng.removeChild(c)}}this.nodes={}};