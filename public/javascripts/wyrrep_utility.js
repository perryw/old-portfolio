/**
 * @author perryw

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	OTHER DEALINGS IN THE SOFTWARE.

 */
Lightview.moveWindow = function(){
	var xShrink = document.viewport.getWidth();
	var lvWidth = $('lightview').getWidth(); // NOTE: (0,0) in lightview is the middle of the element
	var lvPercent = 77;
	var rightPad = 25;  // in pixels
	
	// try to calculate number of pixels from left edge of browser so that 
	// lightview is #{rightPad} away from right edge
	var fromLeft = xShrink - lvWidth/2 - rightPad;
	var overlayWidth = 2*(xShrink-fromLeft);
	var overlayOffset = xShrink - overlayWidth;
	
	new Effect.Parallel([
		new Effect.Morph('lightview', {
			sync: true,
			style: {
				left: Math.round((1-fromLeft/xShrink)*100)+'%'
			}
		}),
		new Effect.Morph('lv_overlay', { 
			sync: true,
			style: {
				width: overlayWidth+'px'//,
				//left: 0+'px' //overlayOffset+'px'
			}
		}),
		new Effect.Morph('lightviewController', {
			sync: true,
			style: {
				left: Math.round((1-fromLeft/xShrink)*100)+'%'
			}
		})
	], {
		duration: 0.8,
		delay: 0.5
	});
	
	Lightview.restoreCenterBackup = Lightview.restoreCenter;
	Lightview.restoreCenter = function() { }  // don't want to recenter each time
};

Lightview.changedPicture = function(event){
	var src = event.target.identify();
	$('entire_gallery').hide();
	if( $('courses_show') ) { $('courses_show').remove(); }
	/*
	if (!$('lightview_wyrrep_div')) {
		var elem = new Element('div', {'id': 'lightview_wyrrep_div'});
		var ccontent = new Element('div', {'id': 'canvas_content'});	
		var canvasElem = new Element('canvas', {'id':'canvas_lv_content'});

		elem.appendChild(canvasElem);
		elem.appendChild(ccontent);
		$('lightview').appendChild(elem);
	}
	*/
	new Ajax.Updater('canvas_content', '/gallery/'+src, {
		asynchronous: true, 
		evalScripts: true, 
		method: 'get',
		parameters: '', //'authenticity_token=' + AUTH_TOKEN,
		insertion: 'top',
		asynchronous: false,
        onComplete: function() {
            document.fire('jsviz:clicked');
        }
	});
/*
	var myCanvas = $('canvas_lv_content');
	var dimensions = $('lightview_wyrrep_div').getDimensions();
	myCanvas.setAttribute('width', dimensions.width);
	myCanvas.setAttribute('height', dimensions.height);
	
	var context = myCanvas.getContext('2d');
	context.stokeStyle = "white";
	context.fillStyle = "white";
	context.beginPath();
	context.arc(Lightview.radius, Lightview.radius, Lightview.radius, Math.PI, Math.PI*3/2, false);
	context.lineTo(dimensions.width-Lightview.radius, 0);
	context.arc(dimensions.width-Lightview.radius, Lightview.radius, Lightview.radius, Math.PI*3/2, Math.PI*2, false);
	context.lineTo(dimensions.width, dimensions.height-Lightview.radius);
	context.arc(dimensions.width-Lightview.radius, dimensions.height-Lightview.radius, Lightview.radius, 0, Math.PI/2, false);
	context.lineTo(Lightview.radius, dimensions.height);
	context.arc(Lightview.radius, dimensions.height-Lightview.radius, Lightview.radius, Math.PI/2, Math.PI, false);
	context.stroke();
	context.fill();
	
	$('canvas_content').setStyle( {
		marginTop: (-1 * dimensions.height + Lightview.radius) + 'px',
		marginLeft: (Lightview.radius)+'px'
	});
	*/
	return false;
};

Lightview.observeCloseButtonUnbound = function(event) {
	//Lightview.restoreCenter = Lightview.restoreCenterBackup;
	//if( $('courses_show') ) { $('courses_show').remove(); }
	/*$('lv_overlay').setStyle( {
		width: document.viewport.getWidth() +'px'
	});
	*/
  $('entire_gallery').show();
  document.fire('jsviz:clicked');
  /*
	new Ajax.Updater('p_page', '/gallery', {
			asynchronous: true, 
			evalScripts: true, 
			method: 'get',
			parameters: '',//authenticity_token=' + AUTH_TOKEN,
			onComplete: function() {
				document.fire('jsviz:clicked');
			}
		});
	*/
	return false;
}

Lightview.observePrevNextUnbound = function(event) {
	var source = event.target;
	source = (source == null)? null : source.href;
	
	if( source != null ) {
		Lightview.detachPerryEvents();	
		Lightview.changedPicture(source);
		Lightview.attachPerryEvents();
	}
	
	return false;	
};

Lightview.observeClicksUnbound = function(event){ // add observer for button clicks on lightview

//	if(!AUTH_TOKEN)
//		alert('no authenticity token set!');

	var source = event.target;
	source = (source == null)? null : source.href;

	if( source != null ) {
		Lightview.detachPerryEvents();
		//Lightview.moveWindow();
		Lightview.changedPicture(event);
		Lightview.attachPerryEvents();
	}

	return false;
};

Lightview.attachPerryEvents = function() {
	document.observe('lightview:opened', Lightview.observeClicks);
	document.observe('lightview:hidden', Lightview.observeCloseButton);

};

Lightview.detachPerryEvents = function() {
	document.stopObserving('lightview:opened', Lightview.observeClicks);
	document.stopObserving('lightview:hidden', Lightview.observeCloseButton);
};

Lightview.observeClicks = Lightview.observeClicksUnbound.bindAsEventListener(Lightview);
Lightview.observePrevNext = Lightview.observePrevNextUnbound.bindAsEventListener(Lightview);
Lightview.observeCloseButton = Lightview.observeCloseButtonUnbound.bindAsEventListener(Lightview);

Lightview.notObserved = true;

Event.observe(document, 'dom:loaded', function(){
	Lightview.attachPerryEvents();
});

updateCurrMenuItem = function(newCurr) {
	var oldCurr = $$('.current');
	if(oldCurr.size()) 
      oldCurr[0].removeClassName('current');
	var itm = $(newCurr).ancestors()[0];
	if(itm) itm.addClassName('current');
};
toggleGalleryImgsByTag = function(tagName, containerName){
	var container = $(containerName);
	var foundTags = container.select('.'+tagName).concat($('tag_cloud').select('.'+tagName));
	if( foundTags.length < 1 ) return; // early exit
	foundTags.invoke('toggleClassName','highlight');
	var thumbnailArray = container.select('.thumbnail');
	var isTagLit = foundTags[0].hasClassName('highlight');
	names = foundTags.collect(function(s){return s.ancestors()[1];}); //get div names
	
	thumbnailArray.each( function(n){		
		if((n.select('.highlight').length>1) || (names.indexOf(n)!=-1)){ 
			// won't affect whether or not div's display
			return; 
		}
		else if( container.select('.highlight').length >0){ // there are still selected tags
			n.fade();
		}
		else{
			n.appear();
		}
	});
}
toggleDivByTag = function(container_prefix, container_id, nameOfTag) {
	var container = $(container_prefix+container_id);
	container.appear();
	$('more_info_'+container_id).innerHTML='less info';
	
	var tmp = $('project_'+container_id+'_deliverables_tags').select('.'+nameOfTag); 
	var hasHighlight = false;
	if (tmp && tmp.first() )
		hasHighlight = tmp.first().hasClassName('highlight');
	else {
		alert("moveTo: don't know what to do with tag '"+nameOfTag+"'");
		return false;
	}
	
	var numHighlightedTags = $('project_'+container_id+'_deliverables_tags').select('.highlight').length;

	container.select('.courses_list_project_deliverable').each( function(ds) { 
    var tagElem = ds.select('.'+nameOfTag);
    var litTags = ds.select('.highlight');
    if( litTags.length > 1 ){  /* do nothing because have other tags lit */ }
    else if( litTags.length && !tagElem.length ) { /* do nothing if ds doesn't have tag but has other lit tags */ }
    else if(numHighlightedTags<2 && hasHighlight) { ds.appear(); }
    else if( tagElem.length && hasHighlight ) { ds.fade(); }
    else if( tagElem.length ) { ds.appear(); }
    else { ds.fade(); }
    
	});
	$$('.'+nameOfTag).invoke("toggleClassName", "highlight");
	return false;
}

toggleInfoLink = function(project_prefix, project_id, link_elem) {
	Effect.toggle(project_prefix+project_id, 'appear', {});
	$(link_elem).innerHTML = ($(link_elem).innerHTML=='more info')? 'less info' : 'more info';
}
copyGalleryTagClouds = function() {
  var sideBar = $('tag_cloud');
  if(sideBar) sideBar.innerHTML = '';
  if ($('gallery_projects_tag_cloud')) {
    var pCloud = $('gallery_projects_tag_cloud').cloneNode(true);
    pCloud.show();
    pCloud.id = 'gallery_projects_tag_cloud_sidebar';
    sideBar.insert(pCloud);
  }
  if ($('gallery_deliverables_tag_cloud')) {
    var dCloud = $('gallery_deliverables_tag_cloud').cloneNode(true);
    //dCloud.show();
    dCloud.id = 'gallery_deliverables_tag_cloud_sidebar';
    sideBar.insert(dCloud);
  }
  sideBar.appear();
  
  window.galleryObserver = setInterval("checkGalleryExists()", 1000);
}
checkGalleryExists = function(){
  if(!$('entire_gallery')){ 
    $('tag_cloud').fade(); 
    clearInterval(window.galleryObserver);
  }
 
  return false;
}
toggle_gallery_cloud = function(divname) {
  $('tag_cloud').show();
  Effect.toggle(divname+'_tag_cloud_sidebar','appear');
  var showingGallery = false;
  if(!$$('.toggle_gallery').inject(false, function(acc, val){ return acc | val.hasClassName('highlight');}) ){
    $('tag_cloud').fade();
  }
  return false;
}

// from http://virtuelvis.com/gallery/canvas/searchlight-soft.html
function loadSpotLights(){
    var replaceArray = $$('.gallery_image');
    //replaceArray.each( function(elem){new SpotLight(elem);});
    new SpotLight(replaceArray[0]);
    new SpotLight($('testImg'));
}
var SpotLight = Class.create({
  initialize: function(elem) {
    if( elem.tagName == "IMG" ) {
      var canvas = new Element("canvas", { "id": elem.id} );
      var src = elem.getAttribute("src");
      this.imgSrc = src.substr(0, src.indexOf("?"));
      elem.parentNode.replaceChild(canvas, elem);
      this.canvas = canvas;
    }
    else { this.canvas = elem; }
  
    this.context = this.canvas.getContext('2d');
    this.radius = 35;
    this.gradient = this.context.createRadialGradient(0, 0, 0, 0, 0, this.radius);
    this.gradient.addColorStop(0, "rgba(255,255,255,0.3)");  
    this.gradient.addColorStop(0.1, "rgba(255,255,255,0.3)");
    this.gradient.addColorStop(0.9, "rgba(255,255,255,0.1)");
    this.gradient.addColorStop(1, "rgba(255,255,255,0)"); 
    this.old_x = 0;
    this.old_y = 0;
    this.r = 0;
    var scope = this;
    var canvas = this.canvas;
    canvas.observe('mouseover', function(ev){
      this.old_x = ev.clientX - ev.target.offsetLeft - 8;
      this.old_y = ev.clientY - ev.target.offsetTop - 16;
      this.inter = setInterval(function(ev){
        scope.move();}, 30); }.bind(this));

    canvas.observe('mousemove', function(ev){
      this.x = ev.clientX - ev.target.offsetLeft - 8;
      this.y = ev.clientY - ev.target.offsetTop - 16;
    }.bind(this));

    canvas.observe('mouseout', function(ev){
      clearInterval(this.inter);
      this.context.clearRect(0,0,canvas.width, canvas.height);//this.drawImage();
    }.bind(this));
    
    canvas.observe('click', function(ev){
      Lightview.show(this.canvas.siblings()[0]);
    }.bind(this));
    
    this.drawImage();
  },
  drawImage: function(){
    var img = new Image();
    
    img.src= false? this.imgSrc : '/images/Apple_Background_thumb.jpg';
    canvas = this.canvas; context = this.context;
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.style.background = "url("+img.src+")";
    
    context.save();
    context.beginPath();
    if(!this.x || !this.y) { context.arc((canvas.width / 2), (canvas.height / 2), this.radius, 0, Math.PI * 2, false); }
    else { context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); }
    context.clip();
    //this.createClip();   
    img.src = '/images/no_tag.png'; //'/images/rails.png';
    context.drawImage(img, 0, 0);
    context.restore();
  },
  createClip: function(){
    context.beginPath();
    if(!this.x || !this.y) { context.arc((canvas.width / 2), (canvas.height / 2), this.radius, 0, Math.PI * 2, false); }
    else { context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); }
    
    context.clip();
  },
  mo: function (xc,yc,wc,hc, opacity){
    if (xc < 0) xc = 0;
    if (yc < 0) yc = 0;
    context = this.context;
    this.drawImage();
    /*
    context.save();
    context.beginPath();
    context.globalCompositeOperation = "source-over";  
    context.fillStyle = "rgba(255,255,255,0.1)";
    context.arc(this.old_x, this.old_y, this.radius, 0, 2*Math.PI, false);
    context.fill();
    context.restore();
*/
  },
  
  move: function(){
    var old_x = this.old_x; var old_y = this.old_y; var radius = this.radius;
    var x = this.x; var y = this.y; var r = this.r; var gradient = this.gradient;
    if (Math.abs(this.old_y - this.y) < 5 && Math.abs(this.old_x - this.x) < 5) {
      //return false;
    }
    this.mo(old_x-radius,old_y-radius,2*radius,2*radius);
    context  = this.context;
    context.save();
    context.beginPath();
    r += Math.PI/12;
    context.globalCompositeOperation = "lighter"; //"destination-out";  
    context.fillStyle=gradient; //"rgba(255,255,255,1)";
    context.translate(x,y);
    context.arc(0,0,radius,0,2*Math.PI,false);
    context.closePath();
    context.fill();
    context.restore();
    this.old_x = x;
    this.old_y = y;
    this.r = r;
  }
});
