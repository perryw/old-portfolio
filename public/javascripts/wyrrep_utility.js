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
	/*
	src = src.substring(0, src.lastIndexOf('/'));
	src = src.substring(src.lastIndexOf('/')+1);
	var tmp = parseInt(src);
	if(isNaN(tmp)) { // invalid src...probably because it's a slideshare object
		src = event.target.identify();
	}
	*/
	$('entire_gallery').hide();
	if( $('courses_show') ) { $('courses_show').remove(); }
	if (!$('lightview_wyrrep_div')) {
		var elem = document.createElement('div');
		elem.setAttribute('id', 'lightview_wyrrep_div');
		
		var containerBR = new Element('div', {'id':'containerBR'});
		var containerBL = new Element('div', {'id':'containerBL'});
		var containerTR = new Element('div', {'id':'containerTR'});
		var containerTL = new Element('div', {'id':'containerTL'});
		
		var canvasElemBR = document.createElement('canvas');
		canvasElemBR.setAttribute('id', 'canvasBR');
		canvasElemBR.setAttribute('height', '12');
		canvasElemBR.setAttribute('width', '12');
		
		var context = canvasElemBR.getContext('2d');
		context.fillStyle = "white";
		context.strokeStyle = "white";
		context.beginPath();
		context.arc(0,0, Lightview.radius, 0, Math.PI/2, false);
		context.lineTo(0,0);
		context.stroke();
		context.fill();
		
		var canvasElemBL = document.createElement('canvas');
		canvasElemBL.setAttribute('id', 'canvasBL');
		canvasElemBL.setAttribute('height', '12');
		canvasElemBL.setAttribute('width', '12');
		context = canvasElemBL.getContext('2d');
		
		context.fillStyle = "white"; 
		context.strokeStyle = "white";
		context.beginPath();
		context.lineTo(Lightview.radius, 0);
		context.lineTo(Lightview.radius, Lightview.radius);
		context.arc(Lightview.radius,0, Lightview.radius, Math.PI/2, Math.PI, false);
		context.stroke();
		context.fill();
		
		var canvasElemTL = document.createElement('canvas');
		canvasElemTL.setAttribute('id', 'canvasTL');
		canvasElemTL.setAttribute('height', '12');
		canvasElemTL.setAttribute('width', '12');
		context = canvasElemTL.getContext('2d');
		
		context.fillStyle = "white"; 
		context.strokeStyle = "white";
		context.beginPath();
		context.moveTo(Lightview.radius, 0);
		context.lineTo(Lightview.radius, Lightview.radius);
		context.lineTo(0, Lightview.radius);
		context.arc(Lightview.radius,Lightview.radius, Lightview.radius, Math.PI, Math.PI*3/2, false);
		context.stroke();
		context.fill();
		
		var canvasElemTR = document.createElement('canvas');
		canvasElemTR.setAttribute('id', 'canvasTR');
		canvasElemTR.setAttribute('height', '12');
		canvasElemTR.setAttribute('width', '12');
		context = canvasElemTR.getContext('2d');
		
		context.fillStyle = "white"; 
		context.strokeStyle = "white";
		context.beginPath();
		context.arc(0,Lightview.radius, Lightview.radius, Math.PI*3/2, Math.PI*2, false);
		context.lineTo(0, Lightview.radius);
		context.lineTo(0,0);
		context.stroke();
		context.fill();
		
		var borderTop = new Element('div', {'id' : 'lv_content_borderTop', 'class':'lv_content_border_horiz'});
		borderTop.setStyle({height: Lightview.radius+'px'});
		var borderLeft = new Element('div', {'id' : 'lv_content_borderLeft', 'class':'lv_content_border_sides', 'width':Lightview.radius});
		borderLeft.setStyle({width: Lightview.radius+'px'});
		var borderRight = new Element('div', {'id' : 'lv_content_borderRight', 'class':'lv_content_border_sides', 'width':Lightview.radius});
		borderRight.setStyle({width: Lightview.radius+'px'});
		var borderBottom = new Element('div', {'id' : 'lv_content_borderBottom', 'class':'lv_content_border_horiz', 'height':Lightview.radius});
		borderBottom.setStyle({height: Lightview.radius+'px'});
		var contentDiv = new Element('div', { 'id': 'canvas_content'});
		var contentContainer = new Element('div', { 'id': 'canvas_content_container'});
		contentContainer.appendChild(contentDiv);
		
		containerBR.appendChild(canvasElemBR);
		containerBL.appendChild(canvasElemBL);
		containerTL.appendChild(canvasElemTL);
		containerTR.appendChild(canvasElemTR);
		
		elem.appendChild(containerTL);
		elem.appendChild(borderTop);
		elem.appendChild(containerTR);
		elem.appendChild(borderLeft);
		elem.appendChild(contentContainer);
		elem.appendChild(borderRight);
		elem.appendChild(containerBL);
		elem.appendChild(borderBottom);
		elem.appendChild(containerBR);
		$('lightview').appendChild(elem);
	}
	
	new Ajax.Updater('canvas_content', '/gallery/'+src, {
		asynchronous: true, 
		evalScripts: true, 
		method: 'get',
		parameters: '', //'authenticity_token=' + AUTH_TOKEN,
		insertion: 'top',
		asynchronous: false
	});

	var w = $('canvas_content_container').getWidth();
	var h = $('canvas_content_container').getHeight();
	borderTop.setStyle({width: w+'px'});
	borderBottom.setStyle({width: w+'px'});
	borderLeft.setStyle({height: h+'px'});
	borderRight.setStyle({height: h+'px'});
	return false;
};

Lightview.observeCloseButtonUnbound = function(event) {
	//Lightview.restoreCenter = Lightview.restoreCenterBackup;
	if( $('courses_show') ) { $('courses_show').remove(); }
	$('entire_gallery').show();
	$('lv_overlay').setStyle( {
		width: document.viewport.getWidth() +'px'
	});
	new Ajax.Updater('p_page', '/gallery', {
			asynchronous: true, 
			evalScripts: true, 
			method: 'get',
			parameters: '',//authenticity_token=' + AUTH_TOKEN,
			onComplete: function() {
				document.fire('jsviz:clicked');
			}
		});
	
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

toggleDivByTag = function(container_prefix, container_id, nameOfTag) {
	var container = $(container_prefix+container_id);
	container.appear();
	$('more_info_'+container_id).innerHTML='less info';
	
	var tmp = container.select('.'+nameOfTag); 
	var hasHighlight = false;
	if (tmp && tmp.first() )
		hasHighlight = tmp.first().hasClassName('highlight');
	else {
		alert("moveTo: don't know what to do with tag '"+nameOfTag+"'");
		return false;
	}
	
	var highlightedTags = container.select('.highlight').collect( function(ht){ return ht.innerHTML; } ).uniq();
	var numCurrentHighlighted = highlightedTags.size();
	
	var delivs = container.select('.deliv_show');
	delivs.each( function(ds) { 
		var tagsArray = ds.select('.'+nameOfTag);
		var ancestor = ds.ancestors()[1];
		if( numCurrentHighlighted == 0 ) {  // hide divs w/o tag
			if( tagsArray.size() == 0 )
				Effect.toggle(ancestor.identify(), 'appear');
		}
		else if( hasHighlight && numCurrentHighlighted == 1 ) { // want to remove only highlight and show all divs 
			ancestor.appear();
		}
		else if( hasHighlight ) { // want to remove highlight, but only if no other selected tags exist
			var removeMe = false;
			var tags = new Array();
			var litTags = ds.select('.highlight');
			litTags.each( function(lt){
				if ($w(lt.className).include(nameOfTag)) {
					removeMe = true;
					throw $break;
				}
			});
			if( removeMe && litTags.length == 1 )
				ancestor.fade();
		}
		else if(0 != ds.select('.'+nameOfTag).length){  // fallback case: new tag with already existing tags highlighted.  Can probably be refactored
			ancestor.appear();
		}
	});

	$$('.'+nameOfTag).each( function(t){ 
		t.toggleClassName('highlight'); 
		hasHighlight = (hasHighlight? hasHighlight: t.hasClassName('highlight')); 
	});

	return false;
}

toggleInfoLink = function(project_prefix, project_id, link_elem) {
	Effect.toggle(project_prefix+project_id, 'appear', {});
	$(link_elem).innerHTML = ($(link_elem).innerHTML=='more info')? 'less info' : 'more info';
}
