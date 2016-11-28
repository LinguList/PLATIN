/**
 * 
 */

Window = function(div, options) {
	this.div = div;
	this.options = options;
	
	this.init();
}

Window.prototype = {
		
		
		init : function() {
			
			this.window = $(this.div).window(this.options);
			
			
			
			this.taskbar = $(this.div).window("taskbar");
			
			this.windowDiv = $("div[aria-describedby='"+$(this.window).attr("id")+"']");
			
			
			
			var window = this.window;
			var taskbar = this.taskbar;
			var windowDiv = this.windowDiv;
			var containmentDiv = $(".simone-taskbar-windows-containment");
			
			
		
			if (!(this.options.title == "Statuswindow"))	 {
				this.window.window("option","appendTo",containmentDiv);
				$(windowDiv).watch({
					properties: "position",
					
					callback: function(data, i) {
						if($.inArray("position",data.props) && $.inArray("fixed", data.vals)) {
							$(windowDiv).css("position","absolute");
						}
					}
				});
				$(windowDiv).css("position","absolute");
				
//				$(windowDiv).one('style', function(event) {
//					$(this).css("position","absolute");
//					$(this).one('style', function(event) {
//						$(this).css("position", "absolute");
//					});
//				});
//				
				
				var top = $(windowDiv).css("top");
				var left = $(windowDiv).css("left");
				var width = $(windowDiv).css("width");
				var height = $(windowDiv).css("height");
				var isResizing = false;

				$(windowDiv).resizable({
					minWidth	: -($(windowDiv).width()) * 10,
					minHeight	: -($(windowDiv).height()) * 10,
					start		: function(event, ui) {
						isResizing = true;
					},
					resize		: function(event, ui) {
						var scale = $(windowDiv)[0].getBoundingClientRect().width / $(windowDiv).outerWidth();
						
					    var changeWidth = ui.size.width - ui.originalSize.width; // find change in width
					    var newWidth = ui.originalSize.width + changeWidth / scale; // adjust new width by our zoomScale
					 
					    var changeHeight = ui.size.height - ui.originalSize.height; // find change in height
					    var newHeight = ui.originalSize.height + changeHeight / scale; // adjust new height by our zoomScale
					 
					    ui.size.width = newWidth;
					    ui.size.height = newHeight;	
					    
					    top = $(windowDiv).css("top");
					    left = $(windowDiv).css("left");
					},
					stop		: function(event, ui) {
						width = $(windowDiv).css("width");
						height = $(windowDiv).css("height");
						isResizing = false;
					}
				});
				
				$(windowDiv).draggable({
					start	: function(event, ui) {
						ui.position.left = 0;
						ui.position.top = 0;
					},
					drag	: function(event, ui) {
					    
						var scale = $(windowDiv)[0].getBoundingClientRect().width / $(windowDiv).outerWidth();
						
						var changeLeft = ui.position.left - ui.originalPosition.left; // find change in left
					    var newLeft = ui.originalPosition.left + changeLeft / scale; // adjust new left by our zoomScale
					 
					    var changeTop = ui.position.top - ui.originalPosition.top; // find change in top
					    var newTop = ui.originalPosition.top + changeTop / scale; // adjust new top by our zoomScale
					 
					    ui.position.left = newLeft;
					    ui.position.top = newTop;						
					},
					stop : function(event, ui) {
						top = $(windowDiv).css("top");
						left = $(windowDiv).css("left");
					}
				});

				$(window).on("windowbeforeminimize", function() {
					top = $(windowDiv).css("top");
					left = $(windowDiv).css("left");
					width = $(windowDiv).css("width");
					height = $(windowDiv).css("height");
				});
				
				$(window).on("windowshow", function() {
					$(windowDiv).css("top", top);
					$(windowDiv).css("left", left);
					$(windowDiv).css("width", width);
					$(windowDiv).css("height", height);
				});
				
				$(containmentDiv).on("resize", function(event) {
					$(windowDiv).css("top",top);
					$(windowDiv).css("left",left);
					if (!isResizing) {
						$(windowDiv).css("width", width);
						$(windowDiv).css("height", height);
					}
				});
				$(windowDiv).watch({
					properties: "top,left",
					
					callback: function(data,i) {
					}
				});
				
				
			} else {
				this.window.window("option","appendTo",containmentDiv);
				$(windowDiv).watch({
					properties: "position,left",
					
					callback: function(data, i) {
						if($.inArray("position",data.props) && $.inArray("fixed", data.vals)) {
							$(windowDiv).css("position","absolute");
						}
					}
				});
				$(windowDiv).css("position","absolute");
				$(windowDiv).css({
					"left" : "3px",
					"top" : "3px"
				});
				
				
//				$(windowDiv).css("position","fixed");
	
			}
			
			
			this.windowButton = $(this.taskbar).taskbar("button",$(this.window));
			var windowButton = this.windowButton;
			
			
			
			
			
			
		}
}

MapWindow = function(div, options) {
	
	this.div = div;
	this.options = (new MapWindowConfig(options)).options;
	
	this.init();
	
	var window = this.window;
	
	this.window.one("windowshow", function() {
		$(window).trigger("resize", {
			caller: "taskbar-iframe"
		});
	});
	
	
	
	
	
}

MapWindow.prototype = Object.create(Window.prototype, {
		
});

StatusWindow = function(div, options) {
	
	this.div = div;
	this.options = (new StatusWindowConfig(options)).options;
	
	this.init();

	
//	$(this.div).prev(".ui-dialog-titlebar").css("display","none");
//	$(this.div).dialog('option', 'dialogClass', 'dialogWithoutTitlebar');
	
}

StatusWindow.prototype = Object.create(Window.prototype, {
	
});

PieChartWindow = function(div, options) {
	
	this.div = div;
	this.options = (new PieChartWindowConfig(options)).options;
	
	this.init();
	
	
	
}

PieChartWindow.prototype = Object.create(Window.prototype, {
	
});

UtilityWindow = function(div, options) {
	
	this.div = div;
	this.options = (new UtilityWindowConfig(options)).options;
	
	this.init();

}

UtilityWindow.prototype = Object.create(Window.prototype, {
	
});

PlotWindow = function(div, options) {
	
	this.div = div;
	this.options = (new PlotWindowConfig(options)).options;
	
	this.init();

}

PlotWindow.prototype = Object.create(Window.prototype, {
	
});

TableWindow = function(div, options) {
	
	this.div = div;
	this.options = (new TableWindowConfig(options)).options;
	
	this.init();

}

TableWindow.prototype = Object.create(Window.prototype, {
	
});

AboutWindow = function(div, options) {
	
	this.div = div;
	this.options = (new AboutWindowConfig(options)).options;
	
	this.init();
	
}

AboutWindow.prototype = Object.create(Window.prototype, {
	
});

