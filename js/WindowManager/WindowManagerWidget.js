WindowManagerWidget = function(core, div, taskbar, options) {
	
	this.datasets;
	this.core = core;
	this.core.setWidget(this);
	
	this.options = (new WindowManagerConfig(options)).options;
	this.gui = new WindowManagerGui(this, div, this.options);
	this.windowManager = new WindowManager(this);
	
	this.selected;
	this.taskbar = taskbar;
	
	this.initWidget();
	
	
}

WindowManagerWidget.prototype = {
		
		initWidget : function(data) {
			
			var windowManagerWidget = this;
			
			this.datasets = data;
			this.gui.initGui();
			
			//prevent recreation of windows when they already exist
			if (typeof windowManagerWidget.statusWindow !== "undefined") {
				return;
			}
			
			//position every window at a default position after they have been created
			$(this.options.utilityWindowDiv).on("windowcreate", function() {
				var windowDiv = $("div[aria-describedby='"+$(windowManagerWidget.options.utilityWindowDiv).attr("id")+"']");
				$(windowDiv).css({
					"top" : "162px",
					"left": "0px"
				});
			});
			$(this.options.plotWindowDiv).on("windowcreate", function() {
				var windowDiv = $("div[aria-describedby='"+$(windowManagerWidget.options.plotWindowDiv).attr("id")+"']");
				$(windowDiv).css({
					"top" : "552px",
					"left": "0px"
				});
			});
			$(this.options.tableWindowDiv).on("windowcreate", function() {
				var windowDiv = $("div[aria-describedby='"+$(windowManagerWidget.options.tableWindowDiv).attr("id")+"']");
				$(windowDiv).css({
					"top" : "942px",
					"left": "0px"
				});
			});
			$(this.options.mapWindowDiv).on("windowcreate", function() {
				var windowDiv = $("div[aria-describedby='"+$(windowManagerWidget.options.mapWindowDiv).attr("id")+"']");
				$(windowDiv).css({
					"top" : "162px",
					"left": "1290px"
				});
			});
			$(this.options.piechartWindowDiv).on("windowcreate", function() {
				var windowDiv = $("div[aria-describedby='"+$(windowManagerWidget.options.piechartWindowDiv).attr("id")+"']");
				$(windowDiv).css({
					"top" : "792px",
					"left": "1290px"
				});
			});
			$(this.options.aboutWindowDiv).on("windowcreate", function() {
				var windowDiv = $("div[aria-describedby='"+$(windowManagerWidget.options.aboutWindowDiv).attr("id")+"']");
				$(windowDiv).css({
					"top" : "1352px",
					"left": "0px"
				});
			});
			
			//create windows
			this.addStatusWindow(this.options.statusWindowDiv);
			this.addMapWindow(this.options.mapWindowDiv, false);
			this.addPieChartWindow(this.options.piechartWindowDiv, false);
			this.addUtilityWindow(this.options.utilityWindowDiv, false);
			this.addPlotWindow(this.options.plotWindowDiv, false);
			this.addTableWindow(this.options.tableWindowDiv, false);
			this.addAboutWindow(this.options.aboutWindowDiv, false);
			
			//resize window content after windows are shown
			$(this.piechartWindow.div).on("windowshow", function() {
				$(this).css("height", "100%");
				$(this).css("width", "100%");
			});
			$(this.mapWindow.div).on("windowshow", function() {
				$(this).css("height", "100%");
				$(this).css("width", "100%");
				$(this).css("max-height", "none");
			});
			$(this.utilityWindow.div).on("windowshow", function() {
				$(this).css("height", "100%");
				$(this).css("width", "100%");
				$(this).css("max-height", "none");
			});
			
			//alter simone default behaviour when clicking windows associated buttons
			var scaleFixWindows = [windowManagerWidget.mapWindow, windowManagerWidget.piechartWindow, windowManagerWidget.utilityWindow,
			                       windowManagerWidget.plotWindow, windowManagerWidget.tableWindow, windowManagerWidget.aboutWindow];

			$(scaleFixWindows).each(function(i, window) {
				$(window.windowButton).unbind("click dblclick");
				$(window.windowButton).on("click", function() {
					if ($(window.window).window("shown") && !($(window.window).window("title") == "Statuswindow")) {
						var windowDiv = $("div[aria-describedby='"+$(window.window).attr("id")+"']");
						if (windowDiv.hasClass("simone-window-top")) {
							$(window.window).window("minimize");
						} else {
							$(window.window).window("moveToTop");
						}
					} else {
						$(window.window).window("show");
					}
				});
				
			});
			
		},
		
		createLink : function() {
		},
		
		highlightChanged : function(objects) {
		},

		selectionChanged : function(selection) {
			if (!selection.valid()) {
				selection.loadAllObjects();
			}
			this.selected = selection.objects;
		},
		
		getConfig : function(inquiringWidget) {
			
			var windowManagerWidget = this;
			
			var config = {
					scale		: windowManagerWidget.taskbar.scale,
					statusWindow : windowManagerWidget.getWindowConfig(windowManagerWidget.statusWindow),
					mapWindow : windowManagerWidget.getWindowConfig(windowManagerWidget.mapWindow),
					piechartWindow : windowManagerWidget.getWindowConfig(windowManagerWidget.piechartWindow),
					utilityWindow : windowManagerWidget.getWindowConfig(windowManagerWidget.utilityWindow),
					plotWindow : windowManagerWidget.getWindowConfig(windowManagerWidget.plotWindow),
					tableWindow : windowManagerWidget.getWindowConfig(windowManagerWidget.tableWindow),
					aboutWindow : windowManagerWidget.getWindowConfig(windowManagerWidget.aboutWindow)
			};
			
			
			if (typeof inquiringWidget.sendConfig !== "undefined"){
				inquiringWidget.sendConfig({widgetName: "windowManager", 'config': config});
			}
			
		},
		
		setConfig : function(configObj) {
			
			var windowManagerWidget = this;
			
			
			if (configObj.widgetName === "windowManager"){
				var config = configObj.config;
				
				windowManagerWidget.taskbar.setScale(config.scale);
				windowManagerWidget.setWindowConfig(windowManagerWidget.statusWindow, config.statusWindow);
				windowManagerWidget.setWindowConfig(windowManagerWidget.mapWindow, config.mapWindow);
				windowManagerWidget.setWindowConfig(windowManagerWidget.piechartWindow, config.piechartWindow);
				windowManagerWidget.setWindowConfig(windowManagerWidget.utilityWindow, config.utilityWindow);
				windowManagerWidget.setWindowConfig(windowManagerWidget.plotWindow, config.plotWindow);
				windowManagerWidget.setWindowConfig(windowManagerWidget.tableWindow, config.tableWindow);
				windowManagerWidget.setWindowConfig(windowManagerWidget.aboutWindow, config.aboutWindow);
				
			}
			
		},
		
		addStatusWindow : function(statusWindowDiv) {
			
			var windowManagerWidget = this;
					
			windowManagerWidget.statusWindow = new StatusWindow(statusWindowDiv, windowManagerWidget.taskbar);
		},
		
		addMapWindow : function(mapWindowDiv, minimized, maximized, options) {
			
			var windowManagerWidget = this;		
			
			var min = false;
			var max = false;
			var opt = {};
			
			if (minimized != 'undefined') {
				min = minimized;
			}
			
			if (maximized != 'undefined') {
				max = maximized;
			}
			
			if (options != 'undefined') {
				opt = options;
			}

			windowManagerWidget.mapWindow = new MapWindow(mapWindowDiv, windowManagerWidget.taskbar, opt);
			
			if (min) {
				windowManagerWidget.mapWindow.window.window("minimize");				
			}
			
			if (max) {
				windowManagerWidget.mapWindow.window.window("maximize");				
			}
		},
		
		addPieChartWindow : function(piechartWindowDiv, minimized, maximized, options) {
			
			var windowManagerWidget = this;
			
			var min = false;
			var max = false;
			var opt = {};
			
			if (minimized != 'undefined') {
				min = minimized;
			}
			
			if (maximized != 'undefined') {
				max = maximized;
			}
			
			if (options != 'undefined') {
				opt = options;
			}


			windowManagerWidget.piechartWindow = new PieChartWindow(piechartWindowDiv, windowManagerWidget.taskbar, opt);

			if (min) {
				windowManagerWidget.piechartWindow.window.window("minimize");				
			}
			
			if (max) {
				windowManagerWidget.piechartWindow.window.window("maximize");				
			}
		},
		
		addUtilityWindow : function(utilityWindowDiv, minimized, maximized, options) {
			
			var windowManagerWidget = this;
			
			var min = false;
			var max = false;
			var opt = {};
			
			if (minimized != 'undefined') {
				min = minimized;
			}
			
			if (maximized != 'undefined') {
				max = maximized;
			}
			
			if (options != 'undefined') {
				opt = options;
			}
			windowManagerWidget.utilityWindow = new UtilityWindow(utilityWindowDiv, windowManagerWidget.taskbar, opt);

			if (min) {
				windowManagerWidget.utilityWindow.window.window("minimize");				
			}
			
			if (max) {
				windowManagerWidget.utilityWindow.window.window("maximize");				
			}
		},
		
		addPlotWindow : function(plotWindowDiv, minimized, maximized, options) {
			
			var min = false;
			var max = false;
			var opt = {};
			
			if (minimized != 'undefined') {
				min = minimized;
			}
			
			if (maximized != 'undefined') {
				max = maximized;
			}
			
			if (options != 'undefined') {
				opt = options;
			}

			var windowManagerWidget = this;
			
			windowManagerWidget.plotWindow = new PlotWindow(plotWindowDiv, windowManagerWidget.taskbar, opt);

			if (min) {
				windowManagerWidget.plotWindow.window.window("minimize");				
			}
			
			if (max) {
				windowManagerWidget.plotWindow.window.window("maximize");				
			}
		},
		
		addTableWindow : function(tableWindowDiv, minimized, maximized, options) {
			
			var windowManagerWidget = this;
			
			var min = false;
			var max = false;
			var opt = {};
			
			if (minimized != 'undefined') {
				min = minimized;
			}
			
			if (maximized != 'undefined') {
				max = maximized;
			}
			
			if (options != 'undefined') {
				opt = options;
			}

			windowManagerWidget.tableWindow = new TableWindow(tableWindowDiv, windowManagerWidget.taskbar, opt);

			if (min) {
				windowManagerWidget.tableWindow.window.window("minimize");				
			}
			
			if (max) {
				windowManagerWidget.tableWindow.window.window("maximize");				
			}
		},
		
		addAboutWindow : function(aboutWindowDiv, minimized, maximized, options) {
			
			var windowManagerWidget = this;
			
			var min = false;
			var max = false;
			var opt = {};
			
			if (minimized != 'undefined') {
				min = minimized;
			}
			
			if (maximized != 'undefined') {
				max = maximized;
			}
			
			if (options != 'undefined') {
				opt = options;
			}

			windowManagerWidget.aboutWindow = new AboutWindow(aboutWindowDiv, windowManagerWidget.taskbar, opt);

			if (min) {
				windowManagerWidget.aboutWindow.window.window("minimize");				
			}
			
			if (max) {
				windowManagerWidget.aboutWindow.window.window("maximize");				
			}
		},
		
		
		getOptions : function(options) {
			
			var opt = {};
			opt.height = options.height;
			opt.width = options.width;
			opt.position = {
					my			: "left+"+options.position[1]+" top+"+options.position[0],
					at			: "left top",
					of			: ".simone-taskbar-window-copy",
					collision	: "fit"
			}
			
			return opt;
		},
		
		getWindowConfig	: function(window) {
			var config = {};
			config.top = window.top;
			config.left = window.left;
			config.width = window.width;
			config.height = window.height;
			config.isMinimized = $(window.window).window("minimized");
			config.isMaximized = $(window.window).window("maximized");
			return config;
		},
		
		setWindowConfig : function(window, config) {
			window.top = config.top;
			window.left = config.left;
			window.width = config.width;
			window.height = config.height;
			if (config.isMaximized) {
				$(window.window).window("maximize");
			}
			if (config.isMinimized) {
				$(window.window).window("minimize");
			}
			if (!config.isMinimized && !config.isMaximized) {
				$(window.windowDiv).css({
					"top"	: window.top,
					"left"	: window.left,
					"width"	: window.width,
					"height": window.height
				});
				if ($(window.window).window("maximized")) {
					$(window.window).window("restore");
				} else {
					$(window.window).window("show");
				}
			}
		}

		
}