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
				var windows = $(taskbar.div).taskbar("windows");
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
				var windows = $(taskbar.div).taskbar("windows");
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
			var fixContainmentSize = function(event) {
				$(this).css({
					"width" : "100%",
					"height": "100%"
				});
				var width = $(this).width();
				width -= $("#taskbarDiv").width();
				width /= taskbar.scale;
				var height = $(this).height() / taskbar.scale;
				$(this).css({
					"width"	: width,
					"height": height
				});
				$(this).one('style', fixContainmentSize);
			}
//			$(containmentdiv).one('style', fixContainmentSize);
			$(containmentdiv).watch({
				properties : "width, height",
				callback : function(data, i) {
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
				}
			});
			
		},
		
		setScale : function(scale) {
			
			var taskbar = this;
			taskbar.scale = scale;
			var windows = $(taskbar.div).taskbar("windows");
			var containment = $(".simone-taskbar-window-copy");
			containment.css('transform','scale('+taskbar.scale+')');
			containment.css('transform-origin', 'center center');
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