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
			
			this.windowButton = $(this.taskbar).taskbar("button",$(this.window));
			
			var window = this.window;
			var taskbar = this.taskbar;
			var windowButton = this.windowButton;
			
			$(this.windowButton).on("click", function() {
				if ($(window).window("shown") && !($(window).window("title") == "Statuswindow")) {
					$(window).window("minimize");
				}
			});
			
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

