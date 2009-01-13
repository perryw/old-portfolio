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
				left: Math.round(fromLeft/xShrink*100)+'%'
			}
		}),
		new Effect.Morph('lv_overlay', { 
			sync: true,
			style: {
				width: overlayWidth+'px',
				left: overlayOffset+'px'
			}
		})
	], {
		duration: 0.8,
		delay: 0.5
	});
	
	Lightview.restoreCenterBackup = Lightview.restoreCenter;
	Lightview.restoreCenter = function() { }  // don't want to recenter each time
};

Lightview.changedPicture = function(src){
	src = src.substring(0, src.lastIndexOf('/'));
	src = src.substring(src.lastIndexOf('/')+1);
	$('entire_gallery').hide();
	if( $('courses_show') ) { $('courses_show').remove(); }
	new Ajax.Updater('p_page', '/courses/'+src, {
		asynchronous: true, 
		evalScripts: true, 
		method: 'get',
		parameters: '', //'authenticity_token=' + AUTH_TOKEN,
		insertion: 'top'
	});

	return false;
};

Lightview.observeCloseButtonUnbound = function(event) {
	Lightview.restoreCenter = Lightview.restoreCenterBackup;
	if( $('courses_show') ) { $('courses_show').remove(); }
	$('entire_gallery').show();
	
	document.fire('jsviz:clicked');
	/*
	new Ajax.Updater('p_page', '/gallery', {
			asynchronous: true, 
			evalScripts: true, 
			method: 'get',
			parameters: 'authenticity_token=' + AUTH_TOKEN,
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

	if(!AUTH_TOKEN)
		alert('no authenticity token set!');

	var source = event.target;
	source = (source == null)? null : source.href;

	if( source != null ) {
		Lightview.detachPerryEvents();
		Lightview.moveWindow();
		Lightview.changedPicture(source);
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

Lightview.attachPerryEvents();

/*
Event.observe(document, 'lightview:loaded', function(event){
	if (Prototype.Browser.WebKit419 || Prototype.Browser.Gecko) {
		Event.stopObserving(window, 'scroll');
	}
});
*/
updateCurrMenuItem = function(newCurr) {
	oldCurr = $$('.current');
	oldCurr[0].removeClassName('current');
	itm = $(newCurr).ancestors()[0];
	itm.addClassName('current');
};
