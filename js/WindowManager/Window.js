/**
 * 
 */

Window = function(div, taskbar, options) {
	this.div = div;
	this.options = options;
	this.taskbar = taskbar;

	this.init();
}

Window.prototype = {

	init : function() {

		this.window = $(this.div).window(this.options);
		this.windowDiv = $("div[aria-describedby='" + $(this.window).attr("id")
				+ "']");

		var windowObject = this;
		var window = this.window;
		var taskbar = this.taskbar;
		var windowDiv = this.windowDiv;
		var containmentDiv = $(taskbar.options.containmentDivSelector);

		if (!(this.options.title == "Statuswindow")) {

			// attach the window div to the containment, so that only the
			// containment has to be scaled
			this.window.window("option", "appendTo", containmentDiv);

			// if simone changes window position to fixed, change it back to
			// absolute, which allows scrolling
			$(windowDiv).watch(
					{
						properties : "position",

						callback : function(data, i) {
							if ($.inArray("position", data.props)
									&& $.inArray("fixed", data.vals)) {
								$(windowDiv).css("position", "absolute");
							}
						}
					});
			$(windowDiv).css("position", "absolute");
			
			this.top = $(windowDiv).css("top");
			this.left = $(windowDiv).css("left");
			this.width = $(windowDiv).css("width");
			this.height = $(windowDiv).css("height");
			this.isResizing = false;

			// fix for scaled jqueryUI dialogs when they are resized (prevents
			// jumping windows)
			$(windowDiv)
					.resizable(
							{
								minWidth : -($(windowDiv).width()) * 10,
								minHeight : -($(windowDiv).height()) * 10,
								start : function(event, ui) {
									windowObject.isResizing = true;
								},
								resize : function(event, ui) {
									var scale = $(windowDiv)[0]
											.getBoundingClientRect().width
											/ $(windowDiv).outerWidth();
									var changeWidth = ui.size.width
											- ui.originalSize.width;
									var newWidth = ui.originalSize.width
											+ changeWidth / scale;

									var changeHeight = ui.size.height
											- ui.originalSize.height;
									var newHeight = ui.originalSize.height
											+ changeHeight / scale;
									ui.size.width = newWidth;
									ui.size.height = newHeight;

									windowObject.top = $(windowDiv).css("top");
									windowObject.left = $(windowDiv).css("left");
								},
								stop : function(event, ui) {
									windowObject.width = $(windowDiv).css("width");
									windowObject.height = $(windowDiv).css("height");
									windowObject.isResizing = false;
								}
							});

			// fix for scaled jqueryUI dialogs when they are dragged (prevents
			// jumping windows)
			$(windowDiv)
					.draggable(
							{
								start : function(event, ui) {
									ui.position.left = 0;
									ui.position.top = 0;
								},
								drag : function(event, ui) {

									var scale = $(windowDiv)[0]
											.getBoundingClientRect().width
											/ $(windowDiv).outerWidth();

									var changeLeft = ui.position.left
											- ui.originalPosition.left;
									var newLeft = ui.originalPosition.left
											+ changeLeft / scale;
									var changeTop = ui.position.top
											- ui.originalPosition.top;
									var newTop = ui.originalPosition.top
											+ changeTop / scale;
									ui.position.left = newLeft;
									ui.position.top = newTop;
								},
								stop : function(event, ui) {
									windowObject.top = $(windowDiv).css("top");
									windowObject.left = $(windowDiv).css("left");
								}
							});

			//save position and size of a window before minimizing/maximizing for correctly restoring
			$(window).on("windowbeforeminimize", function() {
				if (!$(window).window("maximized")) {
					windowObject.top = $(windowDiv).css("top");
					windowObject.left = $(windowDiv).css("left");
					windowObject.width = $(windowDiv).css("width");
					windowObject.height = $(windowDiv).css("height");
				}
			});
			$(window).on("windowbeforemaximize", function() {
				windowObject.top = $(windowDiv).css("top");
				windowObject.left = $(windowDiv).css("left");
				windowObject.width = $(windowDiv).css("width");
				windowObject.height = $(windowDiv).css("height");
			});

			//restore correct position and size of a window
			$(window).on("windowshow", function() {
				$(windowDiv).css("top", windowObject.top);
				$(windowDiv).css("left", windowObject.left);
				$(windowDiv).css("width", windowObject.width);
				$(windowDiv).css("height", windowObject.height);
				if ($(window).window("maximized")) {
					$(window).window("maximize");
				}
			});
			$(window).on("windowrestore", function() {
				$(windowDiv).css("top", windowObject.top);
				$(windowDiv).css("left", windowObject.left);
				$(windowDiv).css("width", windowObject.width);
				$(windowDiv).css("height", windowObject.height);
			});

			//resize maximized scaled windows that they fit the whole workspace
			$(window).on(
					"windowmaximize",
					function() {
						var sTop = $(containmentDiv).scrollTop();
						var sLeft = $(containmentDiv).scrollLeft();
						var scrollBarWidth = windowObject.taskbar
								.getScrollBarWidth();
						var nWidth = parseInt($(containmentDiv).css("width"))
								- scrollBarWidth;
						var nHeight = parseInt($(containmentDiv).css("height"))
								- scrollBarWidth;

						$(windowDiv).css({
							"top" : sTop,
							"left" : sLeft,
							"width" : nWidth,
							"height" : nHeight
						});
					});

			//reposition maximized windows when the workspace is scrolled
			$(containmentDiv).on("scroll", function(event) {
				if ($(window).window("maximized")) {
					var sTop = $(containmentDiv).scrollTop();
					var sLeft = $(containmentDiv).scrollLeft();
					$(windowDiv).css({
						"top" : sTop,
						"left" : sLeft
					});

				}
			});

			//reposition windows when the browser size is changed
			$(containmentDiv).on("resize", function(event) {
				if (!$(window).window("maximized")) {
					$(windowDiv).css("top", windowObject.top);
					$(windowDiv).css("left", windowObject.left);
					if (!windowObject.isResizing) {
						$(windowDiv).css("width", windowObject.width);
						$(windowDiv).css("height", windowObject.height);
					}
				}
			});

		} else {
			//reposition the status window to the top left
			this.window.window("option", "appendTo", containmentDiv);
			$(windowDiv).watch(
					{
						properties : "position,left",

						callback : function(data, i) {
							if ($.inArray("position", data.props)
									&& $.inArray("fixed", data.vals)) {
								$(windowDiv).css("position", "absolute");
							}
						}
					});
			$(windowDiv).css("position", "absolute");
			$(windowDiv).css({
				"left" : "3px",
				"top" : "3px"
			});

		}

	}
}

MapWindow = function(div, taskbar, options) {

	this.div = div;
	this.options = (new MapWindowConfig(options)).options;
	this.taskbar = taskbar;

	this.init();

	var window = this.window;


}

MapWindow.prototype = Object.create(Window.prototype, {

});

StatusWindow = function(div, taskbar, options) {

	this.div = div;
	this.options = (new StatusWindowConfig(options)).options;
	this.taskbar = taskbar;

	this.init();

}

StatusWindow.prototype = Object.create(Window.prototype, {

});

PieChartWindow = function(div, taskbar, options) {

	this.div = div;
	this.options = (new PieChartWindowConfig(options)).options;
	this.taskbar = taskbar;

	this.init();

}

PieChartWindow.prototype = Object.create(Window.prototype, {

});

UtilityWindow = function(div, taskbar, options) {

	this.div = div;
	this.options = (new UtilityWindowConfig(options)).options;
	this.taskbar = taskbar;

	this.init();

}

UtilityWindow.prototype = Object.create(Window.prototype, {

});

PlotWindow = function(div, taskbar, options) {

	this.div = div;
	this.options = (new PlotWindowConfig(options)).options;
	this.taskbar = taskbar;

	this.init();

}

PlotWindow.prototype = Object.create(Window.prototype, {

});

TableWindow = function(div, taskbar, options) {

	this.div = div;
	this.options = (new TableWindowConfig(options)).options;
	this.taskbar = taskbar;

	this.init();

}

TableWindow.prototype = Object.create(Window.prototype, {

});

AboutWindow = function(div, taskbar, options) {

	this.div = div;
	this.options = (new AboutWindowConfig(options)).options;
	this.taskbar = taskbar;

	this.init();

}

AboutWindow.prototype = Object.create(Window.prototype, {

});
