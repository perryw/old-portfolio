/**
 * @author perryw
 */
/* loadCSS and loadJS from http://scriptnode.com/article/dynamically-load-css-and-js-files/ */
var loadCSS = function(file, headElem) { 
    var link = document.createElement('link'); 
    link.href = file; 
    link.rel = 'stylesheet'; 
    link.type = 'text/css'; 
    if (headElem) { headElem.appendChild(link); }
    else { document.getElementsByTagName('head')[0].appendChild(link); } 
};
var loadJS = function(file, headElem) { 
  var script = document.createElement('script'); 
  script.src = file; 
  script.type = 'text/javascript'; 
  if(headElem) headElem.appendChild(script);
  else document.getElementsByTagName('head')[0].appendChild(script); 
}; 
loadEverything = function(onlyNecessary) {
  var divtag=document.getElementById("loading"); 
  var head = document.getElementsByTagName("head")[0];
  loadCSS('/stylesheets/reset.css', head);
  loadCSS('/stylesheets/fonts.css', head);
  loadCSS('/stylesheets/grids.css', head);
  loadCSS('/stylesheets/base.css', head);
  loadCSS('/stylesheets/main.css', head);
  loadCSS('/stylesheets/scaffold.css', head);
  
  loadJS('/javascripts/application.js', head);
  
  divtag.innerHTML="Loading prototype...";
  loadJS('/javascripts/prototype.js', head);
  
  divtag.innerHTML="Loading script.aculo.us...";
  loadJS('/javascripts/scriptaculous.js', head);
  return false;
  loadJS('/javascripts/builder.js', head);  
  /*
  
  loadJS('/javascripts/effects.js', head);
  loadJS('/javascripts/controls.js', head);
  loadJS('/javascripts/dragdrop.js', head);
  loadJS('/javascripts/slider.js', head);
  loadJS('/javascripts/sound.js', head);
  
  loadJS('/javascripts/unittest.js', head);
  
  if(onlyNecessary) return false;
  */  
  loadCSS('/stylesheets/gallery.css', head);
  loadCSS('/stylesheets/menu.css', head);
  loadCSS('/stylesheets/breadcrumb.css', head);
  loadCSS('/stylesheets/lightview.css', head);
  
  //divtag.update("Loading Lightview files...");
  loadJS('/javascripts/lightview.js', head);
  
  //divtag.update("Adding observers for Lightview buttons & utility functions...");
  loadJS('/javascripts/wyrrep_utility.js', head);
  
  //divtag.update("Adding support for in-place editing...");
  loadJS('/javascripts/inplaceeditor_empty.js', head);
  
  //divtag.update("Loading JSViz...");
  loadJS('/javascripts/jsviz/util/EventHandler.js', head);
  loadJS('/javascripts/jsviz/util/Timer.js', head);
  loadJS('/javascripts/jsviz/io/DataGraph.js', head);
  loadJS('/javascripts/jsviz/io/JSONTreeLoader.js', head);
  loadJS('/javascripts/jsviz/layout/view/SVGGraphView.js', head);
  loadJS('/javascripts/jsviz/layout/view/HTMLGraphView.js', head);
  loadJS('/javascripts/jsviz/physics/ParticleModel.js', head);
  loadJS('/javascripts/jsviz/physics/Magnet.js', head);
  loadJS('/javascripts/jsviz/physics/Spring.js', head);
  loadJS('/javascripts/jsviz/physics/Particle.js', head);
  loadJS('/javascripts/jsviz/physics/RungeKuttaIntegrator.js', head);
  loadJS('/javascripts/jsviz/layout/graph/ForceDirectedLayout.js', head);
  loadJS('/javascripts/jsviz.js', head);
  //divtag.update("");  
  //window.removeEventListener('load', loadEverything, false);
};
window.addEventListener('load', loadEverything, false);
/*
 * 	
 * 
		<%= javascript_tag 'var divtag=document.getElementById("loading"); divtag.innerHTML="Loading menu...";' %>
*/