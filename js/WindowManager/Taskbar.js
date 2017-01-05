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

		$(this.div).taskbar(this.options.simoneOptions);
		this.copydiv = $(this.options.copyDivSelector);
		this.containmentdiv = $(this.options.containmentDivSelector);

		var copydiv = this.copydiv;
		var containmentdiv = this.containmentdiv;

		// Setup buttons for scaling
		$(this.div).taskbar("option", "buttons.scalein").$element.on("click",
				function() {
					taskbar.setScale(taskbar.scale / 1.1);
				});
		$(this.div).taskbar("option", "buttons.scaleout").$element.on("click",
				function() {
					taskbar.setScale(taskbar.scale * 1.1);
				});

		// reorder divs to prevent overlapping without modifying z-index
		$(copydiv).insertBefore($(containmentdiv));

		// setup an invisible div to increase the size of the workspace
		taskbar.workspaceDiv = "<div id='" + taskbar.options.workspace.divId
				+ "'></div>";
		var workspaceDiv = taskbar.workspaceDiv;
		containmentdiv.append(workspaceDiv);
		$("#" + taskbar.options.workspace.divId).css({
			"min-height" : taskbar.options.workspace.height,
			"min-width" : taskbar.options.workspace.width
		});
		// make workspace scrollable
		containmentdiv.css("overflow", "scroll");

		// recalculate containment boundaries so that the whole space is used
		var addjustContainment = function() {
			$(containmentdiv).css({
				"width" : "100%",
				"height" : "100%"
			});
			var width = $(this).width();
			width -= $(taskbar.div).width();
			width /= taskbar.scale;
			var height = $(this).height() / taskbar.scale;
			$(containmentdiv).css({
				"width" : width,
				"height" : height
			});
			var statusDiv = $("div[aria-describedby='statusWindowDiv']");
			$(statusDiv).css({
				"width" : width - taskbar.getScrollBarWidth() - 15
			});
		};

		// set containment boundaries when some css values are modified (by
		// simone)
		$(containmentdiv).watch({
			properties : "width, height,transform",
			callback : function(data, i) {
				addjustContainment();
			}
		});

		// set contaiment boundaries when a browser resize happens
		$(containmentdiv).on(
				"resize",
				function() {
					addjustContainment();

					// addjust all maximized windows to fit the whole
					// containment
					var windows = $(taskbar.div).taskbar("windows");
					$(windows).each(
							function(index, window) {
								if ($(window).window("maximized")) {
									var sTop = $(containmentdiv).scrollTop();
									var sLeft = $(containmentdiv).scrollLeft();
									var scrollBarWidth = taskbar
											.getScrollBarWidth();
									var nWidth = parseInt($(containmentdiv)
											.css("width"))
											- scrollBarWidth;
									var nHeight = parseInt($(containmentdiv)
											.css("height"))
											- scrollBarWidth;
									var windowDiv = $("div[aria-describedby='"
											+ $(window).attr("id") + "']");
									$(windowDiv).css({
										"top" : sTop,
										"left" : sLeft,
										"width" : nWidth,
										"height" : nHeight
									});

								}
							});
				});

		// realign the statuswindow to the top left when the workspace is
		// scrolled
		$(containmentdiv).scroll(function(event) {
			var top = $(containmentdiv).scrollTop();
			var left = $(containmentdiv).scrollLeft();
			var statusDiv = $("div[aria-describedby='statusWindowDiv']");
			$(statusDiv).css({
				"top" : top + 3,
				"left" : left + 3
			});
		});

		this.setScale(taskbar.options.defaultScale);

	},

	// util function to scale the containment div
	setScale : function(scale) {
		var taskbar = this;
		var containmentdiv = this.containmentdiv;
		taskbar.scale = scale;
		containmentdiv.css('transform', 'scale(' + taskbar.scale + ')');
		containmentdiv.css('transform-origin', 'top left');
	},

	// util function to calculate the width of scrollbars
	getScrollBarWidth : function() {
		var $outer = $('<div>').css({
			visibility : 'hidden',
			width : 100,
			overflow : 'scroll'
		}).appendTo('body'), widthWithScroll = $('<div>').css({
			width : '100%'
		}).appendTo($outer).outerWidth();
		$outer.remove();
		return 100 - widthWithScroll;
	}

}