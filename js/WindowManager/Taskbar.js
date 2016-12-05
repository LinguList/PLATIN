/**
 * 
 */

Taskbar = function(div, options) {
	this.div = div;
	this.options = (new TaskbarConfig()).options;
	
	this.scale = 1;
	
	this.init();
}

Taskbar.prototype = {
		
		
		init : function() {
			
			var taskbar = this;
			
			$(this.div).taskbar(this.options);
			this.copydiv = $(".simone-taskbar-window-copy");
			this.containmentdiv = $(".simone-taskbar-windows-containment");
			
			
			var copydiv = this.copydiv;
			var containmentdiv = this.containmentdiv;
//			$(this.div).taskbar("option", "buttons.zoomin").$element.on("click", function() {
//				var windows = $(taskbar.div).taskbar("windows");
//				taskbar.zoom /= 1.1;
//				$(windows).each(function(index,window) {
//					var windowDiv = $("div[aria-describedby='"+$(window).attr("id")+"']");
//					$(windowDiv).css('zoom',taskbar.zoom);
//				})
//				
//			});
//			$(this.div).taskbar("option", "buttons.zoomout").$element.on("click", function() {
//				var windows = $(taskbar.div).taskbar("windows");
//				taskbar.zoom *= 1.1;
//				$(windows).each(function(index,window) {
//					var windowDiv = $("div[aria-describedby='"+$(window).attr("id")+"']");
//					$(windowDiv).css('zoom',taskbar.zoom);
//				})
//			});
			$(this.div).taskbar("option", "buttons.scalein").$element.on("click", function() {
				taskbar.scale /= 1.1;
				containmentdiv.css('transform','scale('+taskbar.scale+')');
				containmentdiv.css('transform-origin', 'top left');
//				$(windows).each(function(index,window) {
//					if ($(window).attr("id") != "statusWindowDiv") {
//						var windowDiv = $("div[aria-describedby='"+$(window).attr("id")+"']");
//						$(windowDiv).css('transform','scale('+taskbar.scale+')');
////						$(windowDiv).css('transform-origin', 'top left');
//						$(windowDiv).css('transform-origin', 'center center');
//					}
//				})
				
			});
			$(this.div).taskbar("option", "buttons.scaleout").$element.on("click", function() {
				taskbar.scale *= 1.1;
				containmentdiv.css('transform','scale('+taskbar.scale+')');
				containmentdiv.css('transform-origin', 'top left');
//				$(windows).each(function(index,window) {
//					if ($(window).attr("id") != "statusWindowDiv") {
//						var windowDiv = $("div[aria-describedby='"+$(window).attr("id")+"']");
//						$(windowDiv).css('transform','scale('+taskbar.scale+')');
////						$(windowDiv).css('transform-origin', 'top left');
//						$(windowDiv).css('transform-origin', 'center center');						
//					}
//				})
			});
			
//			$(copy).detach();
			$(copydiv).insertBefore($(containmentdiv));
			
			
			var invdiv = "<div id='invdiv'></div>";
			containmentdiv.append(invdiv);
			$("#invdiv").css({
				"min-height": "2000px",
				"min-width": "4000px"
			});
			containmentdiv.css("overflow", "scroll");
//			var fixContainmentSize = function(event) {
//				$(this).css({
//					"width" : "100%",
//					"height": "100%"
//				});
//				var width = $(this).width();
//				width -= $("#taskbarDiv").width();
//				width /= taskbar.scale;
//				var height = $(this).height() / taskbar.scale;
//				$(this).css({
//					"width"	: width,
//					"height": height
//				});
//				$(this).one('style', fixContainmentSize);
//			}
//			$(containmentdiv).one('style', fixContainmentSize);
			var getScrollBarWidth = function() {
			    var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
			        widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
			    $outer.remove();
			    return 100 - widthWithScroll;
			};
			
			
			var addjustContainment = function() {
				$(containmentdiv).css({
					"width" : "100%",
					"height": "100%"
				});
				var width = $(this).width();
				width -= $("#taskbarDiv").width();
				width /= taskbar.scale;
				var height = $(this).height() / taskbar.scale;
				$(containmentdiv).css({
					"width"	: width,
					"height": height
				});
				var statusDiv = $("div[aria-describedby='statusWindowDiv']");
				$(statusDiv).css({
					"width" : width-getScrollBarWidth()-15
				});
			};
			$(containmentdiv).watch({
				properties : "width, height,transform",
				callback : function(data, i) {
					addjustContainment();
				}
			});
			
			$(containmentdiv).on("resize", function() {
				addjustContainment();
				
				var windows = $(taskbar.div).taskbar("windows");
				$(windows).each(function(index, window) {
					if ($(window).window("maximized")) {
						
						var sTop = $(containmentdiv).scrollTop();
						var sLeft = $(containmentdiv).scrollLeft();
						var scrollBarWidth = getScrollBarWidth();
						var nWidth = parseInt($(containmentdiv).css("width")) - scrollBarWidth;
						var nHeight = parseInt($(containmentdiv).css("height")) - scrollBarWidth;
						var windowDiv = $("div[aria-describedby='"+$(window).attr("id")+"']");
						$(windowDiv).css({
							"top" : sTop,
							"left": sLeft,
							"width" : nWidth,
							"height": nHeight
						});

					}
				});
			});
			
			$(containmentdiv).scroll(function(event) {
				var top = $(containmentdiv).scrollTop();
				var left = $(containmentdiv).scrollLeft();
				var statusDiv = $("div[aria-describedby='statusWindowDiv']");
				$(statusDiv).css({
					"top" : top+3,
					"left" : left+3
				});
			});
			
			this.setScale(0.75);
			
			

		},
		
		setScale : function(scale) {
			
			var taskbar = this;
			var containmentdiv = this.containmentdiv;
			taskbar.scale = scale;
			containmentdiv.css('transform','scale('+taskbar.scale+')');
			containmentdiv.css('transform-origin', 'top left');
//			$(windows).each(function(index, window) {
//				if ($(window).attr("id") != "statusWindowDiv") {
//					var windowDiv = $("div[aria-describedby='"+$(window).attr("id")+"']");
//					$(windowDiv).css('transform','scale('+taskbar.scale+')');
////					$(windowDiv).css('transform-origin', 'top left');
//					$(windowDiv).css('transform-origin', 'center center');
//				}
//			});
		},
		
		setScaleForWindow : function(window, scale) {
			var windowDiv = $("div[aria-describedby='"+$(window).attr("id")+"']");
			$(windowDiv).css('transform','scale('+scale+')');
		},
		
		setScaleOriginForWindow : function(window, origin) {
			var windowDiv = $("div[aria-describedby='"+$(window).attr("id")+"']");
			$(windowDiv).css('transform-origin', origin);			
		}
}