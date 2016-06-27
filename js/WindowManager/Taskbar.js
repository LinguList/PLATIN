/**
 * 
 */

Taskbar = function(div, options) {
	this.div = div;
	this.options = (new TaskbarConfig()).options;
	
	this.zoom = 1;
	this.scale = 1;
	
	this.init();
}

Taskbar.prototype = {
		
		
		init : function() {
			
			var taskbar = this;
			
			$(this.div).taskbar(this.options);
			
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
				$(windows).each(function(index,window) {
					var windowDiv = $("div[aria-describedby='"+$(window).attr("id")+"']");
					$(windowDiv).css('transform','scale('+taskbar.scale+')');
					$(windowDiv).css('transform-origin', 'top left');
				})
				
			});
			$(this.div).taskbar("option", "buttons.scaleout").$element.on("click", function() {
				var windows = $(taskbar.div).taskbar("windows");
				taskbar.scale *= 1.1;
				$(windows).each(function(index,window) {
					var windowDiv = $("div[aria-describedby='"+$(window).attr("id")+"']");
					$(windowDiv).css('transform','scale('+taskbar.scale+')');
					$(windowDiv).css('transform-origin', 'top left');
				})
			});
		}
}