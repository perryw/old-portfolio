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
				width: overlayWidth+'px'//, left: 0+'px' //overlayOffset+'px'
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
	if( !foundTags.length ) return; // early exit
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
    var pCloud = Element.extend($('gallery_projects_tag_cloud').cloneNode(true));
    if( !pCloud ) alert('ERROR: pCloud is null');
    pCloud.id = 'gallery_projects_tag_cloud_sidebar';
    //pCloud.style.visibility = ''; //pCloud.show();
    Element.show(pCloud);
    Element.insert(sideBar,pCloud);
  }
  if ($('gallery_deliverables_tag_cloud')) {
    var dCloud = $('gallery_deliverables_tag_cloud').cloneNode(true);
    dCloud.id = 'gallery_deliverables_tag_cloud_sidebar';
    if( !$('gallery_projects_tag_cloud') ) Element.show(dCloud);
    Element.insert(sideBar, dCloud);
  }
  Effect.Appear(sideBar);
  
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
  if(!$$('.toggle_gallery').inject(false, function(acc, val){ return acc | val.hasClassName('highlight');}) ){
    $('tag_cloud').fade();
  }
  return false;
}

// from http://virtuelvis.com/gallery/canvas/searchlight-soft.html
loadSpotLights = function(){
    Event.stopObserving(window, 'load', loadSpotLights);
    $('loading').update("Drawing thumbnails...");
    $$('.gallery_image').each( function(elem){new SpotLight(elem);});
    $('loading').update("");
}
var SpotLight = Class.create({
  initialize: function(elem) {
    if( elem.tagName == "IMG" ) { // FIX THIS TO embed IMG instead of replacing
      var canvas = new Element("canvas", { "id": elem.id} );
      elem.parentNode.replaceChild(canvas, elem);
      this.canvas = canvas;
    }
    else { this.canvas = elem; }
    
    var src = elem.getAttribute("src");
    if (src) {
      this.imgSrc = (src.indexOf("?") == -1) ? src : src.substr(0,src.indexOf("?"));
    }
    else 
      this.imgSrc = null;
    this.overlayURL = elem.getAttribute("overlay");
    this.context = this.canvas.getContext('2d');
    this.radius = 45;
    this.gradient = this.context.createRadialGradient(0, 0, 0, 0, 0, this.radius);
    this.gradient.addColorStop(0, "rgba(255,255,255,0.3)");  
    this.gradient.addColorStop(0.1, "rgba(255,255,255,0.3)");
    this.gradient.addColorStop(0.9, "rgba(255,255,255,0.1)");
    this.gradient.addColorStop(1, "rgba(255,255,255,0)"); 
    this.old_x = 0;
    this.old_y = 0;
    var scope = this;
    var canvas = this.canvas;
    canvas.stopObserving('mouseover');
    canvas.observe('mouseover', function(ev){
      ev.stop(); // stop further propogation
      if(this.inter) clearInterval(this.inter);
      if(this.mo_inter) clearInterval(this.mo_inter);
      if(this.mo_to) clearTimeout(this.mo_to);
      this.context.globalAlpha = 1.0;
      var offset = ev.target.viewportOffset();
      this.old_x = ev.clientX - offset.left - 8;
      this.old_y = ev.clientY - offset.top - 16;
      this.startTime = new Date();
      this.hoverTimeout = setTimeout(function(){
        if( this.iris_inter ) clearInterval( this.iris_inter );
        this.iris = this.radius;
        this.iris_inter = setInterval( function() {
          this.irisIn();
        }.bind(this), 80 );
        return true;
      }.bind(this), 700);
    }.bindAsEventListener(this));

    canvas.stopObserving('mousemove');
    canvas.observe('mousemove', function(ev){
      if( this.startTime ) this.startTime = null; 
      if( this.iris_inter ) clearInterval( this.iris_inter );
      var offset = ev.target.viewportOffset();
      this.x = ev.clientX - offset.left - 8;
      this.y = ev.clientY - offset.top - 16;
      this.move();
    }.bindAsEventListener(this));

    canvas.stopObserving('mouseout');
    canvas.observe('mouseout', function(){
      if( this.startTime ) this.startTime = null; 
      if( this.iris_inter ) clearInterval( this.iris_inter );
      if( this.hoverTimeout ) clearInterval( this.hoverTimeout );
      this.x = null; this.y = null;
      if(this.inter) clearInterval(this.inter);
      if(this.mo_to) clearTimeout(this.mo_to);
      this.iris = this.radius;
      this.iris_inter = setInterval( function() {
        this.irisIn();
      }.bind(this), 30 );
    }.bindAsEventListener(this));

    canvas.observe('gallery:irisIn', function(){
      if(this.mo_to) clearTimeout( this.mo_to );
      if( this.x || this.y ) return;
      this.mo_to = setTimeout( function() {
        if(this.mo_inter) clearInterval(this.mo_inter);
        this.mo_inter = setInterval(function(){
          this.fadeOut(this.mo_inter);
        }.bind(this), 100);
      }.bind(this), 500);
    }.bindAsEventListener(this));
    
    canvas.stopObserving('click');
    canvas.observe('click', function(){
      if( this.startTime ) this.startTime = null; 
      if( this.iris_inter ) clearInterval( this.iris_inter );
      Lightview.show(this.canvas.up().siblings()[0]);
    }.bindAsEventListener(this));
    
    this.drawImage();
    this.inter = setInterval(function(){
      this.fadeOut(this.inter);
    }.bind(this), 100);
  },
  irisIn: function(){
    this.iris += 5;
    this.drawImage(this.iris);
    if( this.iris >= (this.hypotenuse) ) {
      this.iris = this.radius;
      clearInterval(this.iris_inter);
      this.canvas.fire('gallery:irisIn');
    }
    return true;
  },
  fadeOut: function(intervalID) {
    if( this.context.globalAlpha > 0.1 ) {
      this.context.globalAlpha -= 0.1;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      try{ this.context.drawImage(this.overlayImg, 0, 0); }catch(e){}
    }
    else {
      this.context.save();
      this.context.globalAlpha = 0.06;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      try{ this.context.drawImage(this.overlayImg, 0, 0); }catch(e){}
      this.context.restore();
      clearInterval(intervalID);
      this.context.globalAlpha = 1.0;
    }

    return true;
  },
  drawImage: function(drawRadius){
    var canvas = this.canvas; var context = this.context;
    if(!this.img){
      var img = canvas.childElements()[0];
      if (!img) {
        img = new Image();
        img.onload = function(){
          this.canvas.width = img.width;
          this.canvas.height = img.height;
          this.hypotenuse = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
        }.bind(this);
        img.src = this.imgSrc ? this.imgSrc : '/images/Apple_Background_thumb.jpg';
      }
      this.img = img;
      canvas.style.background = "url("+this.img.src+") no-repeat";
    }
    this.context.clearRect(0,0,canvas.width, canvas.height);
    context.save();
    if (!this.overlayImg) {
      var overlayImg = canvas.childElements()[1];
      if (!overlayImg) {
        var overlayImg = new Image();
        overlayImg.onload = function(){
          context.fillStyle = "rgba(255,255,255,0.4)";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(overlayImg, 0, 0);
        }
        overlayImg.src = (this.overlayURL == '') ? '/images/no_tag.png' : this.overlayURL;
      }
      this.overlayImg = overlayImg;
    }
    else {
      context.beginPath();
      var radius = drawRadius? drawRadius : this.radius;
      if( (this.x || this.old_x) && (this.y || this.old_y)) { 
        context.arc(this.x||this.old_x, this.y||this.old_y, radius, 0, Math.PI * 2, false); 
        context.clip();
      }
      context.fillStyle = "rgba(255,255,255,0.4)";
      context.fillRect(0,0,canvas.width, canvas.height); 
      try {
        context.drawImage(this.overlayImg, 0, 0);
      } catch (e) {
        //alert('error trying to draw ' + this.overlayImg.src + ' for img ' +
        //this.img.src);
        //alert(e);
      }
    }
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
    //this.mo(old_x-radius,old_y-radius,2*radius,2*radius);
    this.drawImage();
    context  = this.context;
    context.save();
    context.beginPath();
    context.globalCompositeOperation = "destination-out";  
    context.fillStyle=gradient; //"rgba(255,255,255,1)";
    try{
      context.translate(x||old_x, y||old_y);
      }catch(e){ alert('error trying to translate to ' +x+', ' + y); }
    context.arc(0,0,radius,0,2*Math.PI,false);
    context.closePath();
    context.fill();
    context.restore();
    this.old_x = x;
    this.old_y = y;
    this.r = r;
  }
});
