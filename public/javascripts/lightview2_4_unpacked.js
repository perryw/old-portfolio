/**
 * @author perryw
 */
var blah = function() {
	var l = Prototype.Browser.IE && (function(a) {
		var b = new RegExp("MSIE ([\\d.]+)").exec(a);
		return b ? parseFloat(b[1]) : -1
	})(navigator.userAgent) < 7,
	BROWSER_IS_WEBKIT_419 = (Prototype.Browser.WebKit && !document.evaluate),
	BROWSER_IS_FIREFOX_LT3 = navigator.userAgent.indexOf("Firefox") > -1 && parseFloat(navigator.userAgent.match(/Firefox[\/\s](\d+)/)[1]) < 3;
	var m = !!navigator.userAgent.match(/mac/i) && (BROWSER_IS_WEBKIT_419 || BROWSER_IS_FIREFOX_LT3);
	Object.extend(Lightview, {
		REQUIRED_Prototype: "1.6.0.2",
		REQUIRED_Scriptaculous: "1.8.1",
		queue: {
			position: "end",
			scope: "lightview"
		},
		require: function(a) {
			if ((typeof window[a] == "undefined") || (this.convertVersionString(window[a].Version) = "" + this["REQUIRED_" + a]));
		}
	},
	convertVersionString: function(a) {
		var v = a.replace(/_.*|\./g, "");
		v = parseInt(v + "0".times(4 - v.length));
		return a.indexOf("_") > -1 ? v - 1 : v
	},
	load: function() {
		this.require("Prototype");
		if ( !! window.Effect && !window.Scriptaculous) {
			this.require("Scriptaculous")
		}
		if (/^(https?:\/\/|\/)/.test(this.options.images)) {
			this.images = this.options.images
		}
		else {
			var a = /lightview(?:-[\w\d.]+)?\.js(.*)/;
			this.images = (($$("head script[src]").find(function(s) {
				return s.src.match(a)
			}) || {}).src || "").replace(a, "") + this.options.images
		}
		if (Prototype.Browser.IE && !document.namespaces.v) {
			document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
			document.observe("dom:loaded",
			function() {
				document.createStyleSheet().addRule("v\\:*", "behavior: url(#default#VML);display: inline-block")
			});
		}
	}
},
start: function() {
	this.radius = this.options.radius;
	this.border = (this.radius > this.options.border) ? this.radius: this.options.border;
	this.closeDimensions = this.options.closeDimensions;
	this.sideDimensions = this.options.sideDimensions;
	this.build()
}
});
Object.extend(Lightview, {
	_lightviewLoadedEvents: 14,
	_lightviewLoadedEvent: function() {
		var a = arguments.callee;
		a.counter++;
		if (a.counter == this._lightviewLoadedEvents) {
			$(document.body).fire("lightview:loaded")
		}
	}
});
Lightview._lightviewLoadedEvent.counter = 0;
Object.extend(Lightview, {
	build: function() {
		this.lightview = new Element("div", {
			id: "lightview"
		});
		var d, sideNegativeMargin, sideStyle = pixelClone(this.sideDimensions);
		if (BROWSER_IS_WEBKIT_419) {
			this.lightview.hide = function() {
				this.setStyle("left:-9500px;
top:-9500px;visibility:hidden;");
				return this
			};
			this.lightview.show = function() {
				this.setStyle("visibility:visible");
				return this
			};
			this.lightview.visible = function() {
				return (this.getStyle("visibility") == "visible" && parseFloat(this.getStyle("top").replace("px", "")) > -9500)
			}
		}
		$(document.body).insert(this.overlay = new Element("div", {
			id: "lv_overlay"
		}).setStyle({
			zIndex: this.options.zIndex - 1,
			position: (!(BROWSER_IS_FIREFOX_LT3 || l)) ? "fixed": "absolute",
			background: m ? "url(" + this.images + "overlay.png) top left repeat": this.options.overlay.background
		}).setOpacity(m ? 1 : this.options.overlay.opacity).hide()).insert(this.lightview.setStyle({
			zIndex: this.options.zIndex,
			top: "-9500px",
			left: "-9500px"
		}).setOpacity(0).insert(this.container = new Element("div", {
			className: "lv_Container"
		}).insert(this.sideButtons = new Element("ul", {
			className: "lv_Sides"
		}).insert(this.prevSide = new Element("li", {
			className: "lv_PrevSide"
		}).setStyle(sideNegativeMargin = Object.extend({
			marginLeft: -1 * this.sideDimensions.width + "px"
		},
		sideStyle)).insert(this.prevButtonImage = new Element("div", {
			className: "lv_Wrapper"
		}).setStyle(Object.extend({
			marginLeft: this.sideDimensions.width + "px"
		},
		sideStyle)).insert(new Element("div", {
			className: "lv_Button"
		})))).insert(this.nextSide = new Element("li", {
			className: "lv_NextSide"
		}).setStyle(Object.extend({
			marginRight: -1 * this.sideDimensions.width + "px"
		},
		sideStyle)).insert(this.nextButtonImage = new Element("div", {
			className: "lv_Wrapper"
		}).setStyle(sideNegativeMargin).insert(new Element("div", {
			className: "lv_Button"
		}))))).insert(this.topButtons = new Element("div", {
			className: "lv_topButtons"
		}).insert(this.topcloseButtonImage = new Element("div", {
			className: "lv_Wrapper lv_topcloseButtonImage"
		}).insert(this.topcloseButton = new Element("div", {
			className: "lv_Button"
		})))).insert(new Element("ul", {
			className: "lv_Frames"
		}).insert(new Element("li", {
			className: "lv_Frame lv_FrameTop"
		}).insert(d = new Element("div", {
			className: "lv_Liquid"
		}).setStyle({
			height: this.border + "px"
		}).insert(new Element("ul", {
			className: "lv_Half lv_HalfLeft"
		}).insert(new Element("li", {
			className: "lv_CornerWrapper"
		}).insert(new Element("div", {
			className: "lv_Corner"
		})).insert(new Element("div", {
			className: "lv_Fill"
		}).setStyle({
			left: this.border + "px"
		})))).insert(new Element("div", {
			className: "lv_Filler"
		})).insert(new Element("ul", {
			className: "lv_Half lv_HalfRight"
		}).insert(new Element("li", {
			className: "lv_CornerWrapper"
		}).setStyle("margin-top: " + ( - 1 * this.border) + "px").insert(new Element("div", {
			className: "lv_Corner"
		})).insert(new Element("div", {
			className: "lv_Fill"
		}).setStyle("left: " + ( - 1 * this.border) + "px")))))).insert(this.resizeCenter = new Element("li", {
			className: "lv_Center"
		}).setStyle("height: " + (150 - this.border) + "px").insert(new Element("div", {
			className: "lv_WrapUp"
		}).insert(new Element("div", {
			className: "lv_WrapDown"
		}).setStyle("margin-top: " + this.border + "px").insert(this.center = new Element("div", {
			className: "lv_WrapCenter"
		}).setOpacity(0).setStyle("padding: 0 " + this.border + "px").insert(this.contentTop = new Element("div", {
			className: "lv_contentTop lv_Fill"
		})).insert(this.menubar = new Element("div", {
			className: "lv_MenuBar clearfix"
		}).insert(this.closeButton = new Element("div", {
			className: "lv_Button lv_Close"
		}).setStyle(pixelClone(this.options.closeDimensions.large)).setStyle({
			background: this.options.backgroundColor
		}).setOpacity(this.options.buttons.opacity.normal)).insert(this.data = new Element("ul", {
			className: "lv_Data"
		}).insert(this.dataText = new Element("li", {
			className: "lv_DataText"
		}).insert(this.title = new Element("div", {
			className: "lv_Title"
		})).insert(this.caption = new Element("div", {
			className: "lv_Caption"
		}))).insert(this.innerController = new Element("div", {
			className: "lv_innerController"
		}).insert(this.imgNumber = new Element("li", {
			className: "lv_ImgNumber"
		}).insert(new Element("div"))).insert(this.innerPrevNext = new Element("li", {
			className: "lv_innerPrevNext"
		}).insert(this.innerPrevButton = new Element("div", {
			className: "lv_Button"
		}).setOpacity(this.options.buttons.opacity.normal).setStyle({
			backgroundColor: this.options.backgroundColor
		}).setPngBackground(this.images + "inner_prev.png", {
			backgroundColor: this.options.backgroundColor
		})).insert(this.innerNextButton = new Element("div", {
			className: "lv_Button"
		}).setOpacity(this.options.buttons.opacity.normal).setStyle({
			backgroundColor: this.options.backgroundColor
		}).setPngBackground(this.images + "inner_next.png", {
			backgroundColor: this.options.backgroundColor
		}))).insert(this.slideshow = new Element("li", {
			className: "lv_Slideshow"
		}).insert(this.slideshowButton = new Element("div", {
			className: "lv_Button"
		}).setOpacity(this.options.buttons.opacity.normal).setStyle({
			backgroundColor: this.options.backgroundColor
		}).setPngBackground(this.images + "inner_slideshow_play.png", {
			backgroundColor: this.options.backgroundColor
		})))))).insert(this.contentBottom = new Element("div", {
			className: "lv_contentBottom "
		}))))).insert(this.loading = new Element("div", {
			className: "lv_Loading"
		}).insert(this.loadingButton = new Element("div", {
			className: "lv_Button"
		}).setStyle("background: url(" + this.images + "loading.gif) top left no-repeat")))).insert(new Element("li", {
			className: "lv_Frame lv_FrameBottom"
		}).insert(d.cloneNode(true))).insert(this.prevnext = new Element("li", {
			className: "lv_PrevNext"
		}).hide().setStyle("margin-top: " + this.border + "px;
 background: url(" + this.images + "blank.gif) top left repeat"))))).insert(new Element("div", {
			id: "lightviewError"
		}).hide());
		var f = new Image();
		f.onload = function() {
			f.onload = Prototype.emptyFunction;
			this.sideDimensions = {
				width: f.width,
				height: f.height
			};
			var a = pixelClone(this.sideDimensions),
			sideNegativeMargin;
			this.sideButtons.setStyle({
				marginTop: 0 - (f.height / 2).round() + "px",
				height: f.height + "px"
			});
			this.prevSide.setStyle(sideNegativeMargin = Object.extend({
				marginLeft: -1 * this.sideDimensions.width + "px"
			},
			a));
			this.prevButtonImage.setStyle(Object.extend({
				marginLeft: a.width
			},
			a));
			this.nextSide.setStyle(Object.extend({
				marginRight: -1 * this.sideDimensions.width + "px"
			},
			a));
			this.nextButtonImage.setStyle(sideNegativeMargin);
			this._lightviewLoadedEvent()
		}.bind(this);
		f.src = this.images + "prev.png";
		$w("center title caption imgNumber")._each(function(e) {
			this[e].setStyle({
				backgroundColor: this.options.backgroundColor
			})
		}.bind(this));
		var g = this.container.select(".lv_Corner");
		$w("tl tr bl br").each(function(a, i) {
			if (this.radius > 0) {
				this.createCorner(g[i], a)
			} else {
				g[i].insert(new Element("div", {
					className: "lv_Fill"
				}))
			}
			g[i].setStyle({
				width: this.border + "px",
				height: this.border + "px"
			}).addClassName("lv_Corner" + a.capitalize());
			this._lightviewLoadedEvent()
		}.bind(this));
		this.lightview.select(".lv_Filler", ".lv_Fill", ".lv_WrapDown").invoke("setStyle", {
			backgroundColor: this.options.backgroundColor
		});
		var S = {};
		$w("prev next topclose").each(function(s) {
			this[s + "ButtonImage"].side = s;
			var b = this.images + s + ".png";
			if (s == "topclose") {
				S[s] = new Image();
				S[s].onload = function() {
					S[s].onload = Prototype.emptyFunction;
					this.closeDimensions[s] = {
						width: S[s].width,
						height: S[s].height
					};
					var a = this.options.buttons.topclose.side,
					style = Object.extend({
						"float": a,
						marginTop: this.closeDimensions[s].height + "px"
					},
					pixelClone(this.closeDimensions[s]));
					style["padding" + a.capitalize()] = this.border + "px";
					this[s + "ButtonImage"].setStyle(style);
					this.topButtons.setStyle({
						height: S[s].height + "px",
						top: -1 * this.closeDimensions[s].height + "px"
					});
					this[s + "ButtonImage"].down().setPngBackground(b).setStyle(pixelClone(this.closeDimensions[s]));
					this._lightviewLoadedEvent()
				}.bind(this);
				S[s].src = this.images + s + ".png"
			} else {
				this[s + "ButtonImage"].setPngBackground(b)
			}
		},
		this);
		var C = {};
		$w("large small").each(function(a) {
			C[a] = new Image();
			C[a].onload = function() {
				C[a].onload = Prototype.emptyFunction;
				this.closeDimensions[a] = {
					width: C[a].width,
					height: C[a].height
				};
				this._lightviewLoadedEvent()
			}.bind(this);
			C[a].src = this.images + "close_" + a + ".png"
		},
		this);
		var L = new Image();
		L.onload = function() {
			L.onload = Prototype.emptyFunction;
			this.loading.setStyle({
				width: L.width + "px",
				height: L.height + "px",
				marginTop: -0.5 * L.height + 0.5 * this.border + "px",
				marginLeft: -0.5 * L.width + "px"
			});
			this._lightviewLoadedEvent()
		}.bind(this);
		L.src = this.images + "loading.gif";
		var h = new Image();
		h.onload = function(a) {
			h.onload = Prototype.emptyFunction;
			var b = {
				width: h.width + "px",
				height: h.height + "px"
			};
			this.slideshow.setStyle(b);
			this.slideshowButton.setStyle(b);
			this._lightviewLoadedEvent()
		}.bind(this);
		h.src = this.images + "inner_slideshow_stop.png";
		$w("prev next").each(function(s) {
			var S = s.capitalize(),
			i = new Image();
			i.onload = function() {
				i.onload = Prototype.emptyFunction;
				this["inner" + S + "Button"].setStyle({
					width: i.width + "px",
					height: i.height + "px"
				});
				this._lightviewLoadedEvent()
			}.bind(this);
			i.src = this.images + "inner_" + s + ".png";
			this["inner" + S + "Button"].prevnext = s
		},
		this);
		$w("slideshow innerPrevNext imgNumber").each(function(c) {
			this[c].hide = this[c].hide.wrap(function(a, b) {
				this.style.position = "absolute";
				a(b);
				return this
			});
			this[c].show = this[c].show.wrap(function(a, b) {
				this.style.position = "relative";
				a(b);
				return this
			})
		},
		this);
		this.lightview.hide();
		this._lightviewLoadedEvent()
	},
	prepare: function() {
		Effect.Queues.get("lightview")._each(function(e) {
			e.cancel()
		});
		this.scaledInnerDimensions = null;
		if (this.view.isSet()) {
			this.controllerHeight = this._controllerHeight;
			if (this.controller && !this.controller.visible()) {
				this.controller.setStyle("visibility:hidden").show();
				this.controllerCenter.setOpacity(0)
			}
		} else {
			this.controllerHeight = null;
			this.controller.hide()
		}
		if (parseInt(this.topcloseButtonImage.getStyle("marginTop")) 1 ? this._controllerOffset: 0; this.isSetGallery = this.views.all(function(a) {
			return a.isImage()
		})
	}
}
this.restoreCenter();
this.appear();
if (this.view.href != "#lightviewError" && Object.keys(Lightview.Plugin).join(" ").indexOf(this.view.type) >= 0) {
	if (!Lightview.Plugin[this.view.type]) {
		$("lightviewError").update(new Template(this.errors.requiresPlugin).evaluate({
			type: this.view.type.capitalize(),
			pluginspage: this.pluginspages[this.view.type]
		}));
		var d = $("lightviewError").getDimensions();
		this.show({
			href: "#lightviewError",
			title: this.view.type.capitalize() + " plugin required",
			options: d
		});
		return false
	}
}
var e = Object.extend({
	menubar: "bottom",
	topclose: false,
	wmode: "transparent",
	innerPreviousNext: this.view.isGallery() && this.options.buttons.innerPreviousNext.display,
	keyboard: this.options.keyboard,
	slideshow: (this.view.isGallery() && this.options.buttons.slideshow.display) || (this.isSetGallery),
	overflow: "hidden",
	overlayClose: this.options.overlay.close,
	viewport: this.options.viewport
},
this.options.defaultOptions[this.view.type] || {});
this.view.options = Object.extend(e, this.view.options);
if (this.view.isSet()) {
	this.view.options.topclose = (this.views.length <= 1)
}
if (! (this.view.title || this.view.caption || (this.views && this.views.length > 1)) && this.view.options.topclose) {
	this.view.options.menubar = false
}
this._contentPosition = "content" + (this.view.options.menubar == "top" ? "Bottom": "Top");
if (this.view.isImage()) {
	if (Prototype.Browser.IE && !this.view._VMLPreloaded) {
		this.view._VMLPreloaded = true;
		var f = new Element("v:image", {
			src: this.view.href,
			display: "none"
		}).setStyle("height:1px;width:1px;");
		$(document.body).insert(f);
		Element.remove.delay(0.1, f)
	}
	if (this.view.isGallery() || this.view.isSet()) {
		this.position = this.views.indexOf(this.view);
		this.preloadSurroundingImages()
	}
	this.innerDimensions = this.view.preloadedDimensions;
	if (this.innerDimensions) {
		this.afterEffect()
	} else {
		this.startLoading();
		var f = new Image();
		f.onload = function() {
			f.onload = Prototype.emptyFunction;
			this.stopLoading();
			this.innerDimensions = {
				width: f.width,
				height: f.height
			};
			this.afterEffect()
		}.bind(this);
		f.src = this.view.href
	}
} else {
	if (this.view.isSet()) {
		this.position = this.views.indexOf(this.view)
	}
	this.innerDimensions = this.view.options.fullscreen ? n.getDimensions() : {
		width: this.view.options.width,
		height: this.view.options.height
	};
	this.afterEffect()
}
},
insertContent: (function() {
	function insertImageUsingHTML(a, b, c) {
		a = $(a);
		var d = pixelClone(c);
		a.update(new Element("img", {
			id: "lightviewContent",
			src: b,
			alt: "",
			galleryimg: "no"
		}).setStyle(d))
	}
	var k = (function() {
		function insertImageUsingVML(a, b, c) {
			a = $(a);
			var d = pixelClone(c);
			a.update(new Element("v:image", {
				src: b,
				id: "lightviewContent"
			}).setStyle(d))
		}
		function insertImageUsingCanvas(b, c, d) {
			b = $(b);
			var f = pixelClone(d),
			image = new Image();
			image.onload = function() {
				canvas = new Element("canvas", f);
				b.update(canvas);
				try {
					var a = canvas.getContext("2d");
					a.drawImage(image, 0, 0, d.width, d.height)
				} catch(e) {
					insertImageUsingHTML(b, c, d)
				}
			}.bind(this);
			image.src = c
		}
		if (Prototype.Browser.IE) {
			return insertImageUsingVML
		} else {
			return insertImageUsingCanvas
		}
	})();
	return function() {
		var c = this.detectExtension(this.view.href),
		dimensions = this.scaledInnerDimensions || this.innerDimensions;
		if (this.view.isImage()) {
			var d = pixelClone(dimensions);
			this[this._contentPosition].setStyle(d);
			if (this.scaledInnerDimensions) {
				k(this[this._contentPosition], this.view.href, dimensions)
			} else {
				insertImageUsingHTML(this[this._contentPosition], this.view.href, dimensions)
			}
		} else {
			if (this.view.isExternal()) {
				switch (this.view.type) {
				case "ajax":
					var f = Object.clone(this.view.options.ajax) || {};
					var g = function() {
						this.stopLoading();
						if (this.view.options.autosize) {
							this[this._contentPosition].setStyle({
								width: "auto",
								height: "auto"
							});
							this.innerDimensions = this.getHiddenDimensions(this[this._contentPosition])
						}
						new Effect.Event({
							queue: this.queue,
							afterFinish: this.resizeWithinViewport.bind(this)
						})
					}.bind(this);
					if (f.onComplete) {
						f.onComplete = f.onComplete.wrap(function(a, b) {
							g();
							a(b)
						})
					} else {
						f.onComplete = g
					}
					this.startLoading();
					new Ajax.Updater(this[this._contentPosition], this.view.href, f);
					break;
				case "iframe":
					this[this._contentPosition].update(this.iframe = new Element("iframe", {
						frameBorder: 0,
						hspace: 0,
						src: this.view.href,
						id: "lightviewContent",
						name: "lightviewContent_" + (Math.random() * 99999).round(),
						scrolling: (this.view.options && this.view.options.scrolling) ? "auto": "no"
					}).setStyle(Object.extend({
						border: 0,
						margin: 0,
						padding: 0
					},
					pixelClone(dimensions))));
					break;
				case "inline":
					var h = this.view.href,
					target = $(h.substr(h.indexOf("#") + 1));
					if (!target || !target.tagName) {
						return
					}
					var i = target.getDimensions();
					target.insert({
						before: this.inlineMarker = new Element(target.tagName).hide()
					});
					target._inlineDisplayRestore = target.getStyle("display");
					this.inlineContent = target.show();
					this[this._contentPosition].update(this.inlineContent);
					this[this._contentPosition].select("select, object, embed").each(function(b) {
						this.overlappingRestore.each(function(a) {
							if (a.element == b) {
								b.setStyle({
									visibility: a.visibility
								})
							}
						})
					}.bind(this));
					if (this.view.options.autosize) {
						this.innerDimensions = i;
						new Effect.Event({
							queue: this.queue,
							afterFinish: this.resizeWithinViewport.bind(this)
						})
					}
					break
				}
			} else {
				var j = {
					tag: "object",
					id: "lightviewContent",
					width: dimensions.width,
					height: dimensions.height
				};
				switch (this.view.type) {
				case "quicktime":
					Object.extend(j, {
						pluginspage: this.pluginspages[this.view.type],
						children: [{
							tag: "param",
							name: "autoplay",
							value: this.view.options.autoplay
						},
						{
							tag: "param",
							name: "scale",
							value: "tofit"
						},
						{
							tag: "param",
							name: "controller",
							value: this.view.options.controls
						},
						{
							tag: "param",
							name: "enablejavascript",
							value: true
						},
						{
							tag: "param",
							name: "src",
							value: this.view.href
						},
						{
							tag: "param",
							name: "loop",
							value: this.view.options.loop || false
						}]
					});
					Object.extend(j, Prototype.Browser.IE ? {
						codebase: this.codebases[this.view.type],
						classid: this.classids[this.view.type]
					}: {
						data: this.view.href,
						type: this.mimetypes[this.view.type]
					});
					break;
				case "flash":
					Object.extend(j, {
						data: this.view.href,
						type: this.mimetypes[this.view.type],
						quality: "high",
						wmode: this.view.options.wmode,
						pluginspage: this.pluginspages[this.view.type],
						children: [{
							tag: "param",
							name: "movie",
							value: this.view.href
						},
						{
							tag: "param",
							name: "allowFullScreen",
							value: "true"
						}]
					});
					if (this.view.options.flashvars) {
						j.children.push({
							tag: "param",
							name: "FlashVars",
							value: this.view.options.flashvars
						})
					}
					break
				}
				this[this._contentPosition].setStyle(pixelClone(dimensions));
				if (this.view.isQuicktime()) {
					this[this._contentPosition].setStyle("visibility:hidden")
				}
				this[this._contentPosition].update(this.createHTML(j)).show();
				if (this.view.isQuicktime()) { (function() {
						try {
							if ("SetControllerVisible" in $("lightviewContent")) {
								$("lightviewContent").SetControllerVisible(this.view.options.controls)
							}
						} catch(e) {}
					}.bind(this)).defer()
				}
			}
		}
	}
})(), getHiddenDimensions: function(b) {
	b = $(b);
	var d = b.ancestors(),
	restore = [],
	styles = [];
	d.push(b);
	d.each(function(c) {
		if (c != b && c.visible()) {
			return
		}
		restore.push(c);
		styles.push({
			display: c.getStyle("display"),
			position: c.getStyle("position"),
			visibility: c.getStyle("visibility")
		});
		c.setStyle({
			display: "block",
			position: "absolute",
			visibility: "visible"
		})
	});
	var e = {
		width: b.clientWidth,
		height: b.clientHeight
	};
	restore.each(function(r, a) {
		r.setStyle(styles[a])
	});
	return e
},
clearContent: function() {
	var a = $("lightviewContent");
	if (a) {
		switch (a.tagName.toLowerCase()) {
		case "object":
			if (Prototype.Browser.WebKit && this.view.isQuicktime()) {
				try {
					a.Stop()
				} catch(e) {}
				a.innerHTML = ""
			}
			if (a.parentNode) {
				a.remove()
			} else {
				a = Prototype.emptyFunction
			}
			break;
		case "iframe":
			a.remove();
			if (Prototype.Browser.Gecko && window.frames.lightviewContent) {
				delete window.frames.lightviewContent
			}
			break;
		default:
			a.remove();
			break
		}
	}
	$w("Top Bottom").each(function(S) {
		this["content" + S].setStyle("width:auto;height:auto;").update("").hide()
	},
	this)
},
adjustDimensionsToView: Prototype.K, afterEffect: function() {
	new Effect.Event({
		queue: this.queue,
		afterFinish: function() {
			this.afterShow()
		}.bind(this)
	})
},
afterShow: function() {
	this.fillMenuBar();
	if (!this.view.isAjax()) {
		this.stopLoading()
	}
	if (! ((this.view.options.autosize && this.view.isInline()) || this.view.isAjax())) {
		this.resizeWithinViewport()
	}
	if (!this.view.isIframe()) {
		new Effect.Event({
			queue: this.queue,
			afterFinish: this.insertContent.bind(this)
		})
	}
	if (this.view.options.topclose) {
		new Effect.Event({
			queue: this.queue,
			afterFinish: this.toggleTopClose.bind(this, true)
		})
	}
},
finishShow: function() {
	new Effect.Event({
		queue: this.queue,
		afterFinish: this.showContent.bind(this)
	});
	if (this.view.isIframe()) {
		new Effect.Event({
			delay: 0.2,
			queue: this.queue,
			afterFinish: this.insertContent.bind(this)
		})
	}
	if (this.sliding) {
		new Effect.Event({
			queue: this.queue,
			afterFinish: this.nextSlide.bind(this)
		})
	}
	if (this.view.isQuicktime()) {
		new Effect.Event({
			queue: this.queue,
			afterFinish: function() {
				this[this._contentPosition].setStyle("visibility:visible")
			}.bind(this)
		})
	}
},
previous: function() {
	if (Effect.Queues.get(Lightview.queue.scope).effects.length) {
		return
	}
	this.show(this.getSurroundingIndexes().previous)
},
next: function() {
	if (Effect.Queues.get(Lightview.queue.scope).effects.length) {
		return
	}
	this.show(this.getSurroundingIndexes().next)
},
resizeWithinViewport: function() {
	this.adjustDimensionsToView();
	var a = this.getInnerDimensions(),
	bounds = this.getBounds();
	if (this.view.options.viewport && (a.width > bounds.width || a.height > bounds.height)) {
		if (this.view.options.fullscreen) {
			this.scaledInnerDimensions = bounds;
			this.fillMenuBar();
			a = bounds
		} else {
			var c = this.getOuterDimensions(),
			b = bounds;
			if (this.view.isMedia()) {
				var d = [bounds.height / c.height, bounds.width / c.width, 1].min();
				this.scaledInnerDimensions = {
					width: (this.innerDimensions.width * d).round(),
					height: (this.innerDimensions.height * d).round()
				}
			}
			else {
				this.scaledInnerDimensions = {
					width: c.width > b.width ? b.width: c.width,
					height: c.height > b.height ? b.height: c.height
				}
			}
			this.fillMenuBar();
			a = Object.clone(this.scaledInnerDimensions);
			if (this.view.isMedia()) {
				a.height += this.menubarDimensions.height
			}
		}
	}
	else {
		this.fillMenuBar();
		this.scaledInnerDimensions = null
	}
	this._resize(a)
},
resize: function(a) {
	this._resize(a, {
		duration: 0
	})
},
_resize: (function() {
	var e, wdiff, hdiff, mleft, mtop, controllerOffset, b;
	var f = (function() {
		var w, h;
		function init(p) {
			w = (e.width + p * wdiff).toFixed(0);
			h = (e.height + p * hdiff).toFixed(0)
		}
		var a;
		if (l) {
			a = function(p) {
				this.lightview.setStyle({
					width: (e.width + p * wdiff).toFixed(0) + "px",
					height: (e.height + p * hdiff).toFixed(0) + "px"
				});
				this.resizeCenter.setStyle({
					height: h - 1 * this.border + "px"
				})
			}
		} else {
			if (BROWSER_IS_FIREFOX_LT3) {
				a = function(p) {
					var v = this.getViewportDimensions(),
					o = document.viewport.getScrollOffsets();
					this.lightview.setStyle({
						position: "absolute",
						marginLeft: 0,
						marginTop: 0,
						width: w + "px",
						height: h + "px",
						left: (o[0] + (v.width / 2) - (w / 2)).floor() + "px",
						top: (o[1] + (v.height / 2) - (h / 2)).floor() + "px"
					});
					this.resizeCenter.setStyle({
						height: h - 1 * this.border + "px"
					})
				}
			} else {
				a = function(p) {
					this.lightview.setStyle({
						position: "fixed",
						width: w + "px",
						height: h + "px",
						marginLeft: ((0 - w) / 2).round() + "px",
						marginTop: ((0 - h) / 2 - controllerOffset).round() + "px"
					});
					this.resizeCenter.setStyle({
						height: h - 1 * this.border + "px"
					})
				}
			}
		}
		return function(p) {
			init.call(this, p);
			a.call(this, p)
		}
	})();
	return function(a) {
		var c = arguments[1] || {};
		e = this.lightview.getDimensions();
		b = 2 * this.border;
		width = a.width ? a.width + b: e.width;
		height = a.height ? a.height + b: e.height;
		this.hidePrevNext();
		if (e.width == width && e.height == height) {
			this._afterResize(a);
			return
		}
		var d = {
			width: width + "px",
			height: height + "px"
		};
		wdiff = width - e.width;
		hdiff = height - e.height;
		mleft = parseInt(this.lightview.getStyle("marginLeft").replace("px", ""));
		mtop = parseInt(this.lightview.getStyle("marginTop").replace("px", ""));
		controllerOffset = this.controller.visible() ? (this.controllerOffset / 2) : 0;
		if (!l) {
			Object.extend(d, {
				marginLeft: 0 - width / 2 + "px",
				marginTop: 0 - height / 2 + "px"
			})
		}
		if (c.duration == 0) {
			f.call(this, 1)
		} else {
			this.resizing = new Effect.Tween(this.lightview, 0, 1, Object.extend({
				duration: this.options.resizeDuration,
				queue: this.queue,
				transition: this.options.transition,
				afterFinish: this._afterResize.bind(this, a)
			},
			c), f.bind(this))
		}
	}
})(), _afterResize: function(a) {
	if (!this.menubarDimensions) {
		return
	}
	var b = this[this._contentPosition],
	contentDimensions;
	if (this.view.options.overflow == "auto") {
		contentDimensions = b.getDimensions()
	}
	b.setStyle({
		height: (a.height - this.menubarDimensions.height) + "px",
		width: a.width + "px"
	});
	if (this.view.options.overflow != "hidden" && (this.view.isAjax() || this.view.isInline())) {
		if (Prototype.Browser.IE) {
			if (this.view.options.overflow == "auto") {
				var c = b.getDimensions();
				b.setStyle("overflow:visible");
				var d = {
					overflowX: "hidden",
					overflowY: "hidden"
				},
				corrected = 0,
				scrollbarWidth = 15;
				if (contentDimensions.height > a.height) {
					d.overflowY = "auto";
					d.width = c.width - scrollbarWidth;
					d.paddingRight = "15px";
					corrected = scrollbarWidth
				}
				if (contentDimensions.width - corrected > a.width) {
					d.overflowX = "auto";
					d.height = c.height - scrollbarWidth;
					d.paddingBottom = "15px"
				}
				b.setStyle(d)
			} else {
				b.setStyle({
					overflow: this.view.options.overflow
				})
			}
		} else {
			b.setStyle({
				overflow: this.view.options.overflow
			})
		}
	} else {
		b.setStyle("overflow:hidden")
	}
	this.restoreCenter();
	this.resizing = null;
	this.finishShow()
},
showContent: function() {
	new Effect.Event({
		queue: this.queue,
		afterFinish: this.hidePrevNext.bind(this)
	});
	new Effect.Event({
		queue: this.queue,
		afterFinish: function() {
			this[this._contentPosition].show();
			this.fillMenuBar()
		}.bind(this)
	});
	new Effect.Parallel([new Effect.Opacity(this.center, {
		sync: true,
		from: 0,
		to: 1
	}), new Effect.Appear(this.sideButtons, {
		sync: true
	})], {
		queue: this.queue,
		duration: 0.25,
		afterFinish: function() {
			if (this.element) {
				this.element.fire("lightview:opened")
			}
		}.bind(this)
	});
	if (this.view.isGallery() || (this.isSetGallery && this.options.controller.buttons.side)) {
		new Effect.Event({
			queue: this.queue,
			afterFinish: this.showPrevNext.bind(this)
		})
	}
},
hideContent: (function() {
	function after() {
		this.clearContent();
		this.topcloseButtonImage.setStyle({
			marginTop: this.closeDimensions.topclose.height + "px"
		});
		this.restoreInlineContent()
	}
	function tween(p) {
		this.center.setOpacity(p);
		this.sideButtons.setOpacity(p)
	}
	return function() {
		if (!this.lightview.visible()) {
			this.center.setOpacity(0);
			this.sideButtons.setOpacity(0);
			this.clearContent();
			return
		}
		new Effect.Tween(this.lightview, 1, 0, {
			duration: 0.2,
			queue: this.queue,
			afterFinish: after.bind(this)
		},
		tween.bind(this))
	}
})(), hideData: function() {
	$w("innerController data dataText title caption imgNumber innerPrevNext slideshow").each(function(a) {
		Element.hide(this[a])
	},
	this)
},
fillMenuBar: function() {
	this.hideData();
	if (!this.view.options.menubar) {
		this.menubarDimensions = {
			width: 0,
			height: 0
		};
		this.closeButtonWidth = 0;
		this.menubar.hide()
	} else {
		this.menubar.show()
	}
	if (this.view.title || this.view.caption) {
		this.dataText.show();
		this.data.show()
	}
	if (this.view.title) {
		this.title.update(this.view.title).show()
	}
	if (this.view.caption) {
		this.caption.update(this.view.caption).show()
	}
	if (this.views && this.views.length > 1) {
		if (this.view.isSet()) {
			this.setNumber.update(new Template(this.options.controller.setNumberTemplate).evaluate({
				position: this.position + 1,
				total: this.views.length
			}));
			if (this.controller.getStyle("visibility") == "hidden") {
				this.controller.setStyle("visibility:visible");
				if (this._controllerCenterEffect) {
					Effect.Queues.get("lightview").remove(this._controllerCenterEffect)
				}
				this._controllerCenterEffect = new Effect.Appear(this.controllerCenter, {
					queue: this.queue,
					duration: 0.1
				})
			}
		} else {
			this.data.show();
			if (this.view.isImage()) {
				this.innerController.show();
				this.imgNumber.show().down().update(new Template(this.options.imgNumberTemplate).evaluate({
					position: this.position + 1,
					total: this.views.length
				}));
				if (this.view.options.slideshow) {
					this.slideshowButton.show();
					this.slideshow.show()
				}
			}
		}
	}
	var a = this.view.isSet();
	if ((this.view.options.innerPreviousNext || a) && this.views.length > 1) {
		var b = {
			prev: (this.options.cyclic || this.position != 0),
			next: (this.options.cyclic || ((this.view.isGallery() || a) && this.getSurroundingIndexes().next != 0))
		};
		$w("prev next").each(function(z) {
			var Z = z.capitalize(),
			cursor = b[z] ? "pointer": "auto";
			if (a) {
				this["controller" + Z].setStyle({
					cursor: cursor
				}).setOpacity(b[z] ? 1 : this.options.buttons.opacity.disabled)
			} else {
				this["inner" + Z + "Button"].setStyle({
					cursor: cursor
				}).setOpacity(b[z] ? this.options.buttons.opacity.normal: this.options.buttons.opacity.disabled)
			}
		}.bind(this));
		if (this.view.options.innerPreviousNext || this.options.controller.innerPreviousNext) {
			this.innerPrevNext.show()
		}
	}
	this.controllerSlideshow.setOpacity(this.isSetGallery ? 1 : this.options.buttons.opacity.disabled).setStyle({
		cursor: this.isSetGallery ? "pointer": "auto"
	});
	this.setCloseButtons();
	if (!this.menubar.childElements().find(Element.visible)) {
		this.menubar.hide();
		this.view.options.menubar = false
	}
	this.setMenubarDimensions()
},
setCloseButtons: function() {
	var a = this.closeDimensions.small.width,
	large = this.closeDimensions.large.width,
	imgWidth = this.scaledInnerDimensions ? this.scaledInnerDimensions.width: this.innerDimensions.width,
	minimum = 180,
	width = 0,
	closeButton = this.view.options.closeButton || "large",
	background = this.options.borderColor;
	if (this.view.options.topclose || this.view.isSet() || !this.view.options.closeButton) {
		background = null
	} else {
		if (imgWidth >= minimum + a && imgWidth = minimum + large) {
			background = closeButton;
			width = this.closeDimensions[closeButton].width
		}
	}
}
if (width > 0) {
	this.data.show();
	this.closeButton.setStyle({
		width: width + "px"
	}).show()
} else {
	this.closeButton.hide()
}
if (background) {
	this.closeButton.setPngBackground(this.images + "close_" + background + ".png", {
		backgroundColor: this.options.backgroundColor
	})
}
this.closeButtonWidth = width
},
startLoading: function() {
	this.loadingEffect = new Effect.Appear(this.loading, {
		duration: 0.2,
		from: 0,
		to: 1,
		queue: this.queue
	})
},
stopLoading: function() {
	if (this.loadingEffect) {
		Effect.Queues.get("lightview").remove(this.loadingEffect)
	}
	new Effect.Fade(this.loading, {
		duration: 0.2,
		queue: this.queue,
		delay: 0.2
	})
},
setPrevNext: function() {
	if (!this.view.isImage()) {
		return
	}
	var a = (this.options.cyclic || this.position != 0),
	next = (this.options.cyclic || ((this.view.isGallery() || this.view.isSet()) && this.getSurroundingIndexes().next != 0));
	this.prevButtonImage[a ? "show": "hide"]();
	this.nextButtonImage[next ? "show": "hide"]();
	var b = this.scaledInnerDimensions || this.innerDimensions;
	this.prevnext.setStyle({
		height: b.height + "px",
		marginTop: this.border + (this.view.options.menubar == "top" ? this.menubar.getHeight() : 0) + "px"
	});
	var c = ((b.width / 2 - 1) + this.border).floor();
	if (a) {
		this.prevnext.insert(this.prevButton = new Element("div", {
			className: "lv_Button lv_PrevButton"
		}).setStyle({
			width: c + "px"
		}));
		this.prevButton.side = "prev"
	}
	if (next) {
		this.prevnext.insert(this.nextButton = new Element("div", {
			className: "lv_Button lv_NextButton"
		}).setStyle({
			width: c + "px"
		}));
		this.nextButton.side = "next"
	}
	if (a || next) {
		this.prevnext.show()
	}
},
showPrevNext: function() {
	if (!this.view || !this.options.buttons.side.display || !this.view.isImage()) {
		return
	}
	this.setPrevNext();
	this.prevnext.show()
},
hidePrevNext: function() {
	this.prevnext.update("").hide();
	this.prevButtonImage.hide().setStyle({
		marginLeft: this.sideDimensions.width + "px"
	});
	this.nextButtonImage.hide().setStyle({
		marginLeft: -1 * this.sideDimensions.width + "px"
	})
},
appear: (function() {
	function after() {
		this.lightview.setOpacity(1)
	}
	if (!BROWSER_IS_WEBKIT_419) {
		after = after.wrap(function(a, b) {
			a(b);
			this.lightview.show()
		})
	}
	return function() {
		if (this.lightview.getStyle("opacity") != 0) {
			return
		}
		if (this.options.overlay.display) {
			new Effect.Appear(this.overlay, {
				duration: 0.2,
				from: 0,
				to: m ? 1 : this.options.overlay.opacity,
				queue: this.queue,
				beforeStart: this.maxOverlay.bind(this),
				afterFinish: after.bind(this)
			})
		} else {
			after.call(this)
		}
	}
})(),
hide: function() {
	if (Prototype.Browser.IE && this.iframe && this.view.isIframe()) {
		this.iframe.remove()
	}
	if (BROWSER_IS_WEBKIT_419 && this.view.isQuicktime()) {
		var a = $$("object#lightviewContent")[0];
		if (a) {
			try {
				a.Stop()
			} catch(e) {}
		}
	}
	if (this.lightview.getStyle("opacity") == 0) {
		return
	}
	this.stopSlideshow();
	this.prevnext.hide();
	if (!Prototype.Browser.IE || !this.view.isIframe()) {
		this.center.hide()
	}
	if (Effect.Queues.get("lightview_hide").effects.length > 0) {
		return
	}
	Effect.Queues.get("lightview").each(function(e) {
		e.cancel()
	});
	new Effect.Event({
		queue: this.queue,
		afterFinish: this.restoreInlineContent.bind(this)
	});
	new Effect.Opacity(this.lightview, {
		duration: 0.1,
		from: 1,
		to: 0,
		queue: {
			position: "end",
			scope: "lightview_hide"
		}
	});
	new Effect.Fade(this.overlay, {
		duration: 0.16,
		queue: {
			position: "end",
			scope: "lightview_hide"
		},
		afterFinish: this.afterHide.bind(this)
	})
},
afterHide: function() {
	this.clearContent();
	this.lightview.hide();
	this.center.setOpacity(0).show();
	this.prevnext.update("").hide();
	this.contentTop.update("").hide();
	this.contentBottom.update("").hide();
	this.disableKeyboardNavigation();
	this.showOverlapping();
	new Effect.Event({
		queue: this.queue,
		afterFinish: this.resize.bind(this, this.options.startDimensions)
	});
	new Effect.Event({
		queue: this.queue,
		afterFinish: function() {
			if (this.element) {
				this.element.fire("lightview:hidden")
			}
			$w("element views view scaledInnerDimensions isSetGallery _openEffect content")._each(function(a) {
				this[a] = null
			}.bind(this))
		}.bind(this)
	})
},
setMenubarDimensions: function() {
	this.menubar.setStyle("padding:0;");
	var a = {},
	imgWidth = this[(this.scaledInnerDimensions ? "scaledI": "i") + "nnerDimensions"].width;
	this.menubar.setStyle({
		width: imgWidth + "px"
	});
	this.data.setStyle({
		width: imgWidth - this.closeButtonWidth - 1 + "px"
	});
	a = this.getHiddenDimensions(this.menubar);
	if (this.view.options.menubar) {
		a.height += this.options.menubarPadding;
		switch (this.view.options.menubar) {
		case "bottom":
			this.menubar.setStyle("padding:" + this.options.menubarPadding + "px 0 0 0");
			break;
		case "top":
			this.menubar.setStyle("padding: 0 0 " + this.options.menubarPadding + "px 0");
			break
		}
	}
	this.menubar.setStyle({
		width: "100%"
	});
	this.menubarDimensions = this.view.options.menubar ? a: {
		width: a.width,
		height: 0
	}
},
restoreCenter: (function() {
	var a, controllerOffset;
	function init() {
		a = this.lightview.getDimensions();
		controllerOffset = this.controller.visible() ? (this.controllerOffset / 2) : 0
	}
	var b;
	if (l) {
		b = function() {
			this.lightview.setStyle({
				top: "50%",
				left: "50%"
			})
		}
	} else {
		if (BROWSER_IS_WEBKIT_419 || BROWSER_IS_FIREFOX_LT3) {
			b = function() {
				var v = this.getViewportDimensions(),
				o = document.viewport.getScrollOffsets();
				this.lightview.setStyle({
					marginLeft: 0,
					marginTop: 0,
					left: (o[0] + (v.width / 2) - (a.width / 2)).floor() + "px",
					top: (o[1] + (v.height / 2) - (a.height / 2)).floor() + "px"
				})
			}
		} else {
			b = function() {
				this.lightview.setStyle({
					position: "fixed",
					left: "50%",
					top: "50%",
					marginLeft: (0 - a.width / 2).round() + "px",
					marginTop: (0 - a.height / 2 - controllerOffset).round() + "px"
				})
			}
		}
	}
	return function() {
		init.call(this);
		b.call(this)
	}
})(),
startSlideshow: function() {
	this.stopSlideshow();
	this.sliding = true;
	this.next.bind(this).delay(0.25);
	this.slideshowButton.setPngBackground(this.images + "inner_slideshow_stop.png", {
		backgroundColor: this.options.backgroundColor
	}).hide();
	this.controllerSlideshow.setPngBackground(this.images + "controller_slideshow_stop.png", {
		backgroundColor: this.options.controller.backgroundColor
	})
},
stopSlideshow: function() {
	if (this.sliding) {
		this.sliding = false
	}
	if (this.slideTimer) {
		clearTimeout(this.slideTimer)
	}
	this.slideshowButton.setPngBackground(this.images + "inner_slideshow_play.png", {
		backgroundColor: this.options.backgroundColor
	});
	this.controllerSlideshow.setPngBackground(this.images + "controller_slideshow_play.png", {
		backgroundColor: this.options.controller.backgroundColor
	})
},
toggleSlideshow: function() {
	if (this.view.isSet() && !this.isSetGallery) {
		return
	}
	this[(this.sliding ? "stop": "start") + "Slideshow"]()
},
nextSlide: function() {
	if (this.sliding) {
		this.slideTimer = this.next.bind(this).delay(this.options.slideshowDelay)
	}
},
updateViews: function() {
	$$("a[class~=lightview], area[class~=lightview]").each(function(a) {
		var b = a._view;
		if (!b) {
			return
		}
		if (b._title) {
			a.writeAttribute("title", b._title)
		}
		a._view = null
	})
},
getSet: function(a) {
	return $$('a[rel="' + a + '"], area[rel="' + a + '"]')
},
getViews: function(a) {
	return this.getSet(a).pluck("_view")
},
addObservers: function() {
	$(document.body).observe("click", this.delegateClose.bindAsEventListener(this));
	$w("mouseover mouseout").each(function(e) {
		this.prevnext.observe(e,
		function(a) {
			var b = a.findElement("div");
			if (!b) {
				return
			}
			if (this.prevButton && this.prevButton == b || this.nextButton && this.nextButton == b) {
				this.toggleSideButton(a)
			}
		}.bindAsEventListener(this))
	}.bind(this));
	this.prevnext.observe("click",
	function(c) {
		var d = c.findElement("div");
		if (!d) {
			return
		}
		var e = (this.prevButton && this.prevButton == d) ? "previous": (this.nextButton && this.nextButton == d) ? "next": null;
		if (e) {
			this[e].wrap(function(a, b) {
				this.stopSlideshow();
				a(b)
			}).bind(this)()
		}
	}.bindAsEventListener(this));
	$w("prev next").each(function(s) {
		var S = s.capitalize(),
		stopSlideshow = function(a, b) {
			this.stopSlideshow();
			a(b)
		},
		blockInnerPrevNext = function(a, b) {
			var c = b.element().prevnext;
			if ((c == "prev" && (this.options.cyclic || this.position != 0)) || (c == "next" && (this.options.cyclic || ((this.view.isGallery() || this.view.isSet()) && this.getSurroundingIndexes().next != 0)))) {
				a(b)
			}
		};
		this[s + "ButtonImage"].observe("mouseover", this.toggleSideButton.bindAsEventListener(this)).observe("mouseout", this.toggleSideButton.bindAsEventListener(this)).observe("click", this[s == "next" ? s: "previous"].wrap(stopSlideshow).bindAsEventListener(this));
		this["inner" + S + "Button"].observe("click", this[s == "next" ? s: "previous"].wrap(blockInnerPrevNext).wrap(stopSlideshow).bindAsEventListener(this)).observe("mouseover", Element.setOpacity.curry(this["inner" + S + "Button"], this.options.buttons.opacity.hover).wrap(blockInnerPrevNext).bindAsEventListener(this)).observe("mouseout", Element.setOpacity.curry(this["inner" + S + "Button"], this.options.buttons.opacity.normal).wrap(blockInnerPrevNext).bindAsEventListener(this));
		this["controller" + S].observe("click", this[s == "next" ? s: "previous"].wrap(blockInnerPrevNext).wrap(stopSlideshow).bindAsEventListener(this))
	},
	this);
	var f = [this.closeButton, this.slideshowButton];
	if (!BROWSER_IS_WEBKIT_419) {
		f.each(function(b) {
			b.observe("mouseover", Element.setOpacity.bind(this, b, this.options.buttons.opacity.hover)).observe("mouseout", Element.setOpacity.bind(this, b, this.options.buttons.opacity.normal))
		},
		this)
	}
	else {
		f.invoke("setOpacity", 1)
	}
	this.slideshowButton.observe("click", this.toggleSlideshow.bindAsEventListener(this));
	this.controllerSlideshow.observe("click", this.toggleSlideshow.bindAsEventListener(this));
	if (BROWSER_IS_WEBKIT_419 || BROWSER_IS_FIREFOX_LT3) {
		var g = function(a, b) {
			if (this.lightview.getStyle("top").charAt(0) == "-") {
				return
			}
			a(b)
		};
		Event.observe(window, "scroll", this.restoreCenter.wrap(g).bindAsEventListener(this));
		Event.observe(window, "resize", this.restoreCenter.wrap(g).bindAsEventListener(this))
	}
	if (BROWSER_IS_FIREFOX_LT3) {
		Event.observe(window, "resize", this.maxOverlay.bindAsEventListener(this))
	}
	if (l) {
		function centerControllerIELT7() {
			if (this.controller) {
				this.controller.setStyle({
					left: ((document.documentElement.scrollLeft || 0) + n.getWidth() / 2).round() + "px"
				})
			}
		}
		Event.observe(window, "scroll", centerControllerIELT7.bindAsEventListener(this));
		Event.observe(window, "resize", centerControllerIELT7.bindAsEventListener(this))
	}
	if (this.options.preloadHover) {
		this._preloadImageHover = function(a) {
			var b = a.findElement("a[class~=lightview], area[class~=lightview]");
			if (!b) {
				return
			}
			a.stop();
			if (!b._view) {
				new Lightview.View(b)
			}
			this.preloadImageHover(b)
		}.bindAsEventListener(this);
		$(document.body).observe("mouseover", this._preloadImageHover)
	}
},
toggleTopClose: function(a) {
	if (this._topCloseEffect) {
		Effect.Queues.get("lightview_topCloseEffect").remove(this.topCloseEffect)
	}
	var b = {
		marginTop: (a ? 0 : this.closeDimensions.topclose.height) + "px"
	};
	this._topCloseEffect = new Effect.Morph(this.topcloseButtonImage, {
		style: b,
		duration: 0.16,
		queue: this.queue,
		delay: a ? 0.15 : 0
	})
},
getScrollDimensions: function() {
	var a = {};
	$w("width height").each(function(d) {
		var D = d.capitalize(),
		ddE = document.documentElement;
		a[d] = Prototype.Browser.IE ? [ddE["offset" + D], ddE["scroll" + D]].max() : Prototype.Browser.WebKit ? document.body["scroll" + D] : ddE["scroll" + D]
	});
	return a
},
maxOverlay: function() {
	if (!BROWSER_IS_FIREFOX_LT3) {
		return
	}
	this.overlay.setStyle(pixelClone(this.getScrollDimensions()))
},
delegateClose: (function() {
	var b = ".lv_Close, .lv_topButtons .lv_Button, .lv_Loading, .lv_controllerClose";
	return function(a) {
		if (this.view && this.view.options && a.findElement(b + (this.view.options.overlayClose ? ", #lv_overlay": ""))) {
			this.hide()
		}
	}
})(),
toggleSideButton: function(a) {
	var b = a.target,
	side = b.side,
	w = this.sideDimensions.width,
	offset = (a.type == "mouseover") ? 0 : side == "prev" ? w: -1 * w,
	style = {
		marginLeft: offset + "px"
	};
	if (!this.sideEffect) {
		this.sideEffect = {}
	}
	if (this.sideEffect[side]) {
		Effect.Queues.get("lightview_side" + side).remove(this.sideEffect[side])
	}
	this.sideEffect[side] = new Effect.Morph(this[side + "ButtonImage"], {
		style: style,
		duration: 0.2,
		queue: {
			scope: "lightview_side" + side,
			limit: 1
		},
		delay: (a.type == "mouseout") ? 0.1 : 0
	})
},
getSurroundingIndexes: function() {
	if (!this.views) {
		return
	}
	var a = this.position,
	length = this.views.length;
	var b = (a <= 0) ? length - 1 : a - 1,
	next = (a >= length - 1) ? 0 : a + 1;
	return {
		previous: b,
		next: next
	}
},
createCorner: function(a, b) {
	var c = arguments[2] || this.options,
	radius = c.radius,
	border = c.border,
	canvas = new Element("canvas", {
		className: "cornerCanvas" + b.capitalize(),
		width: border + "px",
		height: border + "px"
	}),
	position = {
		top: (b.charAt(0) == "t"),
		left: (b.charAt(1) == "l")
	};
	if (canvas && canvas.getContext && canvas.getContext("2d")) {
		a.insert(canvas);
		var d = canvas.getContext("2d");
		d.fillStyle = c.backgroundColor;
		d.arc((position.left ? radius: border - radius), (position.top ? radius: border - radius), radius, 0, Math.PI * 2, true);
		d.fill();
		d.fillRect((position.left ? radius: 0), 0, border - radius, border);
		d.fillRect(0, (position.top ? radius: 0), border, border - radius)
	} else {
		a.insert(new Element("v:roundrect", {
			fillcolor: c.backgroundColor,
			strokeWeight: "1px",
			strokeColor: c.backgroundColor,
			arcSize: (radius / border * 0.5).toFixed(2)
		}).setStyle({
			width: 2 * border - 1 + "px",
			height: 2 * border - 1 + "px",
			position: "absolute",
			left: (position.left ? 0 : ( - 1 * border)) + "px",
			top: (position.top ? 0 : ( - 1 * border)) + "px"
		}))
	}
},
hideOverlapping: function() {
	if (this.preventingOverlap) {
		return
	}
	var b = $$("select, embed, object");
	this.overlappingRestore = b.map(function(a) {
		return {
			element: a,
			visibility: a.getStyle("visibility")
		}
	});
	b.invoke("setStyle", "visibility:hidden");
	this.preventingOverlap = true
},
showOverlapping: function() {
	this.overlappingRestore.each(function(a, i) {
		a.element.setStyle("visibility: " + a.visibility)
	});
	delete this.overlappingRestore;
	this.preventingOverlap = false
},
getInnerDimensions: function() {
	return {
		width: this.innerDimensions.width,
		height: this.innerDimensions.height + this.menubarDimensions.height
	}
},
getOuterDimensions: function() {
	var i = this.getInnerDimensions(),
	b = 2 * this.border;
	return {
		width: i.width + b,
		height: i.height + b
	}
},
getBounds: function() {
	var a = 21,
	safety = 2 * this.sideDimensions.height + a,
	v = this.getViewportDimensions();
	return {
		width: v.width - safety,
		height: v.height - safety
	}
},
getViewportDimensions: function() {
	var v = n.getDimensions();
	if (this.controller && this.controller.visible() && this.views && this.views.length > 1) {
		v.height -= this.controllerOffset
	}
	return v
}
});
var n = {
	getDimensions: function() {
		return {
			width: this.getWidth(),
			height: this.getHeight()
		}
	}
}; (function(a) {
	var B = Prototype.Browser,
	doc = document,
	element, property = {};
	function getRootElement() {
		if (BROWSER_IS_WEBKIT_419) {
			return doc
		}
		if (B.Opera && window.parseFloat(window.opera.version()) < 9.5) {
			return doc.body
		}
		return doc.documentElement
	}
	function define(D) {
		if (!element) {
			element = getRootElement()
		}
		property[D] = "client" + D;
		a["get" + D] = function() {
			return element[property[D]]
		};
		return a["get" + D]()
	}
	a.getWidth = define.curry("Width");
	a.getHeight = define.curry("Height")
})(n); (function() {
	function guard(a, b) {
		if (!this.view) {
			return
		}
		a(b)
	}
	$w("fillMenuBar insertContent").each(function(a) {
		this[a] = this[a].wrap(guard)
	},
	Lightview)
})();
function pixelClone(b) {
	var c = {};
	Object.keys(b).each(function(a) {
		c[a] = b[a] + "px"
	});
	return c
}
Object.extend(Lightview, {
	enableKeyboardNavigation: function() {
		if (!this.view.options.keyboard) {
			return
		}
		this.keyboardEvent = this.keyboardDown.bindAsEventListener(this);
		document.observe("keydown", this.keyboardEvent)
	},
	disableKeyboardNavigation: function() {
		if (this.keyboardEvent) {
			document.stopObserving("keydown", this.keyboardEvent)
		}
	},
	keyboardDown: function(a) {
		var b = String.fromCharCode(a.keyCode).toLowerCase(),
		keyCode = a.keyCode,
		staticGallery = (this.view.isGallery() || this.isSetGallery) && !this.resizing,
		slideshow = this.view.options.slideshow,
		action;
		if (this.view.isMedia()) {
			a.stop();
			action = (keyCode == Event.KEY_ESC || ["x", "c"].member(b)) ? "hide": (keyCode == 37 && staticGallery && (this.options.cyclic || this.position != 0)) ? "previous": (keyCode == 39 && staticGallery && (this.options.cyclic || this.getSurroundingIndexes().next != 0)) ? "next": (b == "p" && slideshow && staticGallery) ? "startSlideshow": (b == "s" && slideshow && staticGallery) ? "stopSlideshow": null;
			if (b != "s") {
				this.stopSlideshow()
			}
		}
		else {
			action = (keyCode == Event.KEY_ESC) ? "hide": null
		}
		if (action) {
			this[action]()
		}
		if (staticGallery) {
			if (keyCode == Event.KEY_HOME && this.views.first() != this.view) {
				this.show(this.views.first())
			}
			if (keyCode == Event.KEY_END && this.views.last() != this.view) {
				this.show(this.views.last())
			}
		}
	}
});
Lightview.afterShow = Lightview.afterShow.wrap(function(a, b) {
	this.enableKeyboardNavigation();
	a(b)
});Object.extend(Lightview, {
	extendSet: function(a) {
		var b = this.getSet(a);
		if (!b) {
			return
		}
		b._each(Lightview.Extend)
	},
	preloadSurroundingImages: function() {
		if (this.views.length == 0) {
			return
		}
		var a = this.getSurroundingIndexes();
		this.preloadFromSet([a.next, a.previous])
	},
	preloadFromSet: function(c) {
		var d = (this.views && this.views.member(c) || Object.isArray(c)) ? this.views: c.rel ? this.getViews(c.rel) : null;
		if (!d) {
			return
		}
		var e = $A(Object.isNumber(c) ? [c] : c.type ? [d.indexOf(c)] : c).uniq();
		e.each(function(a) {
			var b = d[a];
			this.preloadImageDimensions(b)
		},
		this)
	},
	setPreloadedDimensions: function(a, b) {
		a.preloadedDimensions = {
			width: b.width,
			height: b.height
		}
	},
	preloadImageDimensions: function(a) {
		if (a.preloadedDimensions || a.isPreloading || !a.href) {
			return
		}
		var P = new Image();
		P.onload = function() {
			P.onload = Prototype.emptyFunction;
			a.isPreloading = null;
			this.setPreloadedDimensions(a, P)
		}.bind(this);
		a.isPreloading = true;
		P.src = a.href
	},
	preloadImageHover: function(a) {
		var b = a._view;
		if (b && b.preloadedDimensions || b.isPreloading || !b.isImage()) {
			return
		}
		this.preloadImageDimensions(b)
	}
});Element.addMethods({
	setPngBackground: function(a, b) {
		a = $(a);
		var c = Object.extend({
			align: "top left",
			repeat: "no-repeat",
			sizingMethod: "scale",
			backgroundColor: ""
		},
		arguments[2] || {});
		a.setStyle(l ? {
			filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + b + "'', sizingMethod='" + c.sizingMethod + "')"
		}: {
			background: c.backgroundColor + " url(" + b + ") " + c.align + " " + c.repeat
		});
		return a
	}
});Object.extend(Lightview, {
	detectType: function(a) {
		var b;
		$w("flash image iframe quicktime").each(function(t) {
			if (new RegExp("\\.(" + this.typeExtensions[t].replace(/\s+/g, "|") + ")(\\?.*)?", "i").test(a)) {
				b = t
			}
		}.bind(this));
		if (b) {
			return b
		}
		if (a.startsWith("#")) {
			return "inline"
		}
		if (document.domain && document.domain != (a).replace(/(^.*\/\/)|(:.*)|(\/.*)/g, "")) {
			return "iframe"
		}
		return "image"
	},
	detectExtension: function(a) {
		var b = a.gsub(/\?.*/, "").match(/\.([^.]{3,4})$/);
		return b ? b[1] : null
	},
	createHTML: function(b) {
		var c = "<" + b.tag;
		for (var d in b) {
			if (! ["children", "html", "tag"].member(d)) {
				c += " " + d + '="' + b[d] + '"'
			}
		}
		if (new RegExp("^(?:area|base|basefont|br|col|frame|hr|img|input|link|isindex|meta|param|range|spacer|wbr)$", "i").test(b.tag)) {
			c += "/>"
		} else {
			c += ">";
			if (b.children) {
				b.children.each(function(a) {
					c += this.createHTML(a)
				}.bind(this))
			}
			if (b.html) {
				c += b.html
			}
			c += ""
		}
		return c
	}
}); (function() {
	document.observe("dom:loaded",
	function() {
		var c = (navigator.plugins && navigator.plugins.length);
		function detectPlugin(a) {
			var b = false;
			if (c) {
				b = ($A(navigator.plugins).pluck("name").join(",").indexOf(a) >= 0)
			} else {
				try {
					b = new ActiveXObject(a)
				} catch(e) {}
			}
			return !! b
		}
		if (c) {
			window.Lightview.Plugin = {
				flash: detectPlugin("Shockwave Flash"),
				quicktime: detectPlugin("QuickTime")
			}
		} else {
			window.Lightview.Plugin = {
				flash: detectPlugin("ShockwaveFlash.ShockwaveFlash"),
				quicktime: detectPlugin("QuickTime.QuickTime")
			}
		}
	})
})();
Lightview.View = Class.create({
	initialize: function(b) {
		if (b._view) {
			return
		}
		var c = Object.isElement(b);
		if (c && !b._view) {
			b._view = this;
			if (b.title) {
				b._view._title = b.title;
				if (Lightview.options.removeTitles) {
					b.writeAttribute("title", null)
				}
			}
		}
		this.href = c ? b.getAttribute("href") : b.href;
		if (this.href.indexOf("#") >= 0) {
			this.href = this.href.substr(this.href.indexOf("#"))
		}
		var d = b.rel;
		if (d) {
			this.type = d.startsWith("gallery") ? "gallery": d.startsWith("set") ? Lightview.detectType(this.href) : d;
			this.rel = d
		} else {
			this.type = Lightview.detectType(this.href);
			this.rel = this.type
		}
		$w("ajax flash gallery iframe image inline quicktime external media set")._each(function(a) {
			var T = a.capitalize(),
			t = a.toLowerCase();
			if ("image gallery media external set".indexOf(a) < 0) {
				this["is" + T] = function() {
					return this.type == t
				}.bind(this)
			}
		}.bind(this));
		if (c && b._view._title) {
			var e = b._view._title.split(Lightview.options.titleSplit).invoke("strip");
			if (e[0]) {
				this.title = e[0]
			}
			if (e[1]) {
				this.caption = e[1]
			}
			var f = e[2];
			this.options = (f && Object.isString(f)) ? eval("({" + f + "})") : {}
		}
		else {
			this.title = b.title;
			this.caption = b.caption;
			this.options = b.options || {}
		}
		if (this.options.ajaxOptions) {
			this.options.ajax = Object.clone(this.options.ajaxOptions);
			delete this.options.ajaxOptions
		}
	},
	isGallery: function() {
		return this.type.startsWith("gallery")
	},
	isSet: function() {
		return this.rel.startsWith("set")
	},
	isImage: function() {
		return (this.isGallery() || this.type == "image")
	},
	isExternal: function() {
		return "iframe inline ajax".indexOf(this.type) >= 0
	},
	isMedia: function() {
		return ! this.isExternal()
	}
});
Lightview.Extend = function(a) {
	var b = $(a);
	new Lightview.View(a);
	return b
}; (function() {
	function handleClick(a) {
		var b = a.findElement("a[class~=lightview], area[class~=lightview]");
		if (!b) {
			return
		}
		a.stop();
		this.Extend(b);
		if (b._view.rel) {
			this.extendSet(b._view.rel)
		}
		this.show(b)
	}
	function handleMouseOver(a) {
		var b = a.findElement("a[class~=lightview], area[class~=lightview]");
		if (!b) {
			return
		}
		this.Extend(b)
	}
	document.observe("lightview:loaded",
	function() {
		$(document.body).observe("click", handleClick.bindAsEventListener(Lightview)).observe("mouseover", handleMouseOver.bindAsEventListener(Lightview))
	})
})();

Object.extend(Lightview, {
	buildController: function() {
		var b = this.options.controller,
		border = b.border;
		$(document.body).insert(this.controller = new Element("div", {
			id: "lightviewController"
		}).setStyle({
			zIndex: this.options.zIndex + 1,
			marginBottom: b.margin + "px",
			position: "absolute",
			visibility: "hidden"
		}).insert(this.controllerTop = new Element("div", {
			className: "lv_controllerTop"
		}).insert(new Element("div", {
			className: "lv_controllerCornerWrapper lv_controllerCornerWrapperTopLeft"
		}).setStyle("margin-left: " + border + "px").insert(new Element("div", {
			className: "lv_Corner"
		}))).insert(new Element("div", {
			className: "lv_controllerBetweenCorners"
		}).setStyle({
			margin: "0 " + border + "px",
			height: border + "px"
		})).insert(new Element("div", {
			className: "lv_controllerCornerWrapper lv_controllerCornerWrapperTopRight"
		}).setStyle("margin-left: -" + border + "px").insert(new Element("div", {
			className: "lv_Corner"
		})))).insert(this.controllerMiddle = new Element("div", {
			className: "lv_controllerMiddle clearfix"
		}).insert(this.controllerCenter = new Element("ul", {
			className: "lv_controllerCenter"
		}).setStyle("margin: 0 " + border + "px").insert(new Element("li", {
			className: "lv_controllerSetNumber"
		}).insert(this.setNumber = new Element("div"))).insert(new Element("li", {
			className: "lv_ButtonWrapper lv_controllerPrev"
		}).insert(this.controllerPrev = new Element("div", {
			className: "lv_Button"
		}).setPngBackground(this.images + "controller_prev.png", {
			backgroundColor: b.backgroundColor
		}))).insert(new Element("li", {
			className: "lv_ButtonWrapper lv_controllerNext"
		}).insert(this.controllerNext = new Element("div", {
			className: "lv_Button"
		}).setPngBackground(this.images + "controller_next.png", {
			backgroundColor: b.backgroundColor
		}))).insert(new Element("li", {
			className: "lv_ButtonWrapper lv_controllerSlideshow"
		}).insert(this.controllerSlideshow = new Element("div", {
			className: "lv_Button"
		}).setPngBackground(this.images + "controller_slideshow_play.png", {
			backgroundColor: b.backgroundColor
		}))).insert(new Element("li", {
			className: "lv_ButtonWrapper lv_controllerClose"
		}).insert(this.controllerClose = new Element("div", {
			className: "lv_Button"
		}).setPngBackground(this.images + "controller_close.png", {
			backgroundColor: b.backgroundColor
		}))))).insert(this.controllerBottom = new Element("div", {
			className: "lv_controllerBottom"
		}).insert(new Element("div", {
			className: "lv_controllerCornerWrapper lv_controllerCornerWrapperBottomLeft"
		}).setStyle("margin-left: " + border + "px").insert(new Element("div", {
			className: "lv_Corner"
		}))).insert(new Element("div", {
			className: "lv_controllerBetweenCorners"
		}).setStyle({
			margin: "0 " + border + "px",
			height: border + "px"
		})).insert(new Element("div", {
			className: "lv_controllerCornerWrapper lv_controllerCornerWrapperBottomRight"
		}).setStyle("margin-left: -" + border + "px").insert(new Element("div", {
			className: "lv_Corner"
		})))));
		$w("prev next").each(function(s) {
			var S = s.capitalize();
			this["controller" + S].prevnext = s
		},
		this);
		if (BROWSER_IS_WEBKIT_419) {
			this.controller.hide = function() {
				this.setStyle("left:-9500px; top:-9500px; visibility:hidden;");
				return this
			};
			this.controller.show = function() {
				this.setStyle("visibility:visible");
				return this
			};
			this.controller.visible = function() {
				return (this.getStyle("visibility") == "visible" && parseFloat(this.getStyle("top").replace("px", "")) > -9500)
			}
		}
		this.controller.select(".lv_ButtonWrapper div").invoke("setStyle", pixelClone(this.controllerButtonDimensions));
		var c = this.controller.select(".lv_Corner");
		$w("tl tr bl br").each(function(a, i) {
			if (this.radius > 0) {
				this.createCorner(c[i], a, b)
			} else {
				c[i].insert(new Element("div", {
					className: "lv_Fill"
				}))
			}
			c[i].setStyle({
				width: b.border + "px",
				height: b.border + "px"
			}).addClassName("lv_Corner" + a.capitalize())
		},
		this);
		this.controller.down(".lv_controllerMiddle").setStyle("width:100%;");
		this.controller.setStyle(l ? {
			position: "absolute",
			top: "auto",
			left: ""
		}: {
			position: "fixed",
			top: "auto",
			left: "50%"
		});
		this.controller.select(".lv_controllerBetweenCorners", ".lv_controllerMiddle", ".lv_Button").invoke("setStyle", {
			backgroundColor: b.backgroundColor
		});
		this.setNumber.update(new Template(b.setNumberTemplate).evaluate({
			position: 999,
			total: 999
		}));
		this.setNumber.setStyle({
			width: this.setNumber.getWidth() + "px",
			height: this.controllerCenter.getHeight() + "px"
		});
		this._fixateController();
		this.setNumber.update("");
		this.controller.hide().setStyle("visibility:visible");
		this.addObservers();
		this._lightviewLoadedEvent()
	},
	_fixateController: function() {
		var b, finalWidth, controller = this.options.controller,
		border = controller.border;
		if (l) {
			b = this.controllerCenter.getDimensions(),
			finalWidth = b.width + 2 * border;
			this.controllerCenter.setStyle({
				width: b.width + "px",
				margin: 0
			});
			this.controllerMiddle.setStyle("width:auto;");
			this.controllerCenter.setStyle({
				paddingLeft: border + "px"
			});
			this.controllerMiddle.setStyle({
				width: finalWidth + "px"
			});
			$w("top bottom").each(function(a) {
				this["controller" + a.capitalize()].setStyle({
					width: finalWidth + "px"
				})
			},
			this);
			this.controller.setStyle("margin-left:-" + (finalWidth / 2).round() + "px")
		} else {
			this.controllerMiddle.setStyle("width:auto");
			b = this.controllerMiddle.getDimensions();
			this.setNumber.up().setStyle({
				lineHeight: b.height + "px",
				width: this.setNumber.getDimensions().width + "px"
			});
			this.controller.setStyle({
				width: b.width + "px",
				marginLeft: (0 - (b.width / 2).round()) + "px"
			});
			this.controllerMiddle.setStyle({
				width: b.width + "px"
			});
			$w("top bottom").each(function(a) {
				this["controller" + a.capitalize()].setStyle({
					width: b.width + "px"
				})
			},
			this)
		}
		this._controllerOffset = controller.margin + b.height + 2 * border;
		this._controllerHeight = this.controller.getHeight();
		this.setNumber.setStyle({
			lineHeight: b.height + "px"
		})
	}
});
Lightview.buildController = Lightview.buildController.wrap(function(a, b) {
	var c = new Image();
	c.onload = function() {
		c.onload = Prototype.emptyFunction;
		this.controllerButtonDimensions = {
			width: c.width,
			height: c.height
		};
		a(b)
	}.bind(this);
	c.src = this.images + "controller_prev.png";
	var d = (new Image()).src = this.images + "controller_slideshow_stop.png"
});
Lightview.build = Lightview.build.wrap(function(a, b) {
	a(b);
	this.buildController()
});
Lightview.hide = Lightview.hide.wrap(function(a, b) {
	if (this.view && this.view.isSet()) {
		this.controller.hide();
		this.setNumber.update("")
	}
	a(b)
})
})();
Lightview.load();
document.observe("dom:loaded", Lightview.start.bind(Lightview));