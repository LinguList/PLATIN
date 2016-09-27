WindowManagerWidget = function(core, div, options) {
	
	this.datasets;
	this.core = core;
	this.core.setWidget(this);
	
	this.options = (new WindowManagerConfig(options)).options;
	this.gui = new WindowManagerGui(this, div, this.options);
	this.windowManager = new WindowManager(this);
	
	this.selected;
	
	this.initWidget();
	
	this.taskabar = null;
	
}

WindowManagerWidget.prototype = {
		
		initWidget : function(data) {
			
			var windowManagerWidget = this;
			
			this.datasets = data;
			this.gui.initGui();
			
			this.addStatusWindow(this.options.statusWindowDiv);
			this.addMapWindow(this.options.mapWindowDiv, true);
			this.addPieChartWindow(this.options.piechartWindowDiv, true);
			this.addUtilityWindow(this.options.utilityWindowDiv, true);
			this.addPlotWindow(this.options.plotWindowDiv, true);
			this.addTableWindow(this.options.tableWindowDiv, true);
			this.addAboutWindow(this.options.aboutWindowDiv, true);
			
			$(this.piechartWindow.div).on("windowshow", function() {
				$(this).css("height", "100%");
				$(this).css("width", "100%");
			});
			$(this.mapWindow.div).on("windowshow", function() {
				$(this).css("height", "100%");
				$(this).css("width", "100%");
			});
			
			
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
			function resizeFix(event, ui) {
				var zoomScale = windowManagerWidget.taskbar.scale;
			    var changeWidth = ui.size.width - ui.originalSize.width; // find change in width
			    var newWidth = ui.originalSize.width + changeWidth / zoomScale; // adjust new width by our zoomScale
			 
			    var changeHeight = ui.size.height - ui.originalSize.height; // find change in height
			    var newHeight = ui.originalSize.height + changeHeight / zoomScale; // adjust new height by our zoomScale
			 
			    ui.size.width = newWidth;
			    ui.size.height = newHeight;
			}
			
			function startFix(event, ui) {
			    ui.position.left = 0;
			    ui.position.top = 0;
			}
			 
			function dragFix(event, ui) {
				var zoomScale = windowManagerWidget.taskbar.scale;
			    var changeLeft = ui.position.left - ui.originalPosition.left; // find change in left
			    var newLeft = ui.originalPosition.left + changeLeft / zoomScale; // adjust new left by our zoomScale
			 
			    var changeTop = ui.position.top - ui.originalPosition.top; // find change in top
			    var newTop = ui.originalPosition.top + changeTop / zoomScale; // adjust new top by our zoomScale
			 
			    ui.position.left = newLeft;
			    ui.position.top = newTop;
			}			
			$(scaleFixWindows).each(function(index, window) {
//				$(window.div).resizable({
//				    minWidth: -($(window.div).width()) * 10,  // these need to be large and negative
//				    minHeight: -($(window.div).height()) * 10, // so we can shrink our resizable while scaled
//				    resize: resizeFix
//				});
//				$(window.div).draggable({
//					start: startFix,
//					drag: dragFix
//				});
				$(window.div).on("windowbeforeminimize", function() {
					windowManagerWidget.taskbar.setScaleForWindow($(window.div), 1);
					windowManagerWidget.taskbar.setScaleOriginForWindow($(window.div),"top left");
				});
				$(window.div).on("windowshow", function() {
					windowManagerWidget.taskbar.setScaleForWindow($(window.div), windowManagerWidget.taskbar.scale);					
					windowManagerWidget.taskbar.setScaleOriginForWindow($(window.div), "center center");					
				});
				
				$(window.div).on("windowbeforeshow", function() {
					windowManagerWidget.taskbar.setScaleForWindow($(window.div), windowManagerWidget.taskbar.scale);					
					windowManagerWidget.taskbar.setScaleOriginForWindow($(window.div), "top left");					
				});
				
				$(window.div).on("windowdragstart", function() {
					windowManagerWidget.taskbar.setScaleOriginForWindow($(window.div), "top left");
				});
				
				$(window.div).on("windowdragstop", function() {
					windowManagerWidget.taskbar.setScaleOriginForWindow($(window.div), "center center");
				});
				
				$(window.div).on("windowresizestart", function() {
					$(scaleFixWindows).each(function(i, w) {
						windowManagerWidget.taskbar.setScaleForWindow($(window.div), 1);
						windowManagerWidget.taskbar.setScaleOriginForWindow($(w.div), "top left");
					});
				});
				
				$(window.div).on("windowresize", function() {
					$(scaleFixWindows).each(function(i, w) {
						windowManagerWidget.taskbar.setScaleForWindow($(window.div), windowManagerWidget.taskbar.scale);					
						windowManagerWidget.taskbar.setScaleOriginForWindow($(w.div), "center center");
					});
				});
			});
			
//			$(this.utilityWindow.div).on("windowbeforeminimize", function() {
//				windowManagerWidget.taskbar.setScaleForWindow($(windowManagerWidget.utilityWindow.div), 1);
//				windowManagerWidget.taskbar.setScaleOriginForWindow($(windowManagerWidget.utilityWindow.div),"top left");
//			});
//			$(this.utilityWindow.div).on("windowshow", function() {
//				windowManagerWidget.taskbar.setScaleForWindow($(windowManagerWidget.utilityWindow.div), windowManagerWidget.taskbar.scale);					
//				windowManagerWidget.taskbar.setScaleOriginForWindow($(windowManagerWidget.utilityWindow.div), "center center");					
//			});
//			
//			$(this.utilityWindow.div).on("windowbeforeshow", function() {
//				windowManagerWidget.taskbar.setScaleForWindow($(windowManagerWidget.utilityWindow.div), windowManagerWidget.taskbar.scale);					
//				windowManagerWidget.taskbar.setScaleOriginForWindow($(windowManagerWidget.utilityWindow.div), "top left");					
//			});
//			
//			$(this.utilityWindow.div).on("windowdragstart", function() {
//				windowManagerWidget.taskbar.setScaleOriginForWindow($(windowManagerWidget.utilityWindow.div), "top left");
//			});
//			
//			$(this.utilityWindow.div).on("windowdragstop", function() {
//				windowManagerWidget.taskbar.setScaleOriginForWindow($(windowManagerWidget.utilityWindow.div), "center center");
//			});
			

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
					statusWindow : {
						simoneOptions : $(windowManagerWidget.statusWindow.window).window("option"),
						minimized : $(windowManagerWidget.statusWindow.window).window("minimized"),
						maximized : $(windowManagerWidget.statusWindow.window).window("maximized"),
					},
					mapWindow : {
						simoneOptions : $(windowManagerWidget.mapWindow.window).window("option"),
						minimized : $(windowManagerWidget.mapWindow.window).window("minimized"),
						maximized : $(windowManagerWidget.mapWindow.window).window("maximized"),
					},
					piechartWindow : {
						simoneOptions : $(windowManagerWidget.piechartWindow.window).window("option"),
						minimized : $(windowManagerWidget.piechartWindow.window).window("minimized"),
						maximized : $(windowManagerWidget.piechartWindow.window).window("maximized"),
					},
					utilityWindow : {
						simoneOptions : $(windowManagerWidget.utilityWindow.window).window("option"),
						minimized : $(windowManagerWidget.utilityWindow.window).window("minimized"),
						maximized : $(windowManagerWidget.utilityWindow.window).window("maximized"),
					},
					plotWindow : {
						simoneOptions : $(windowManagerWidget.plotWindow.window).window("option"),
						minimized : $(windowManagerWidget.plotWindow.window).window("minimized"),
						maximized : $(windowManagerWidget.plotWindow.window).window("maximized"),
					},
					tableWindow : {
						simoneOptions : $(windowManagerWidget.tableWindow.window).window("option"),
						minimized : $(windowManagerWidget.tableWindow.window).window("minimized"),
						maximized : $(windowManagerWidget.tableWindow.window).window("maximized"),
					},
					aboutWindow : {
						simoneOptions : $(windowManagerWidget.aboutWindow.window).window("option"),
						minimized : $(windowManagerWidget.aboutWindow.window).window("minimized"),
						maximized : $(windowManagerWidget.aboutWindow.window).window("maximized"),
					}
			};
			
			if (typeof inquiringWidget.sendConfig !== "undefined"){
				inquiringWidget.sendConfig({widgetName: "windowManager", 'config': config});
			}
			
		},
		
		setConfig : function(configObj) {
			
			var windowManagerWidget = this;
			
			
			if (configObj.widgetName === "windowManager"){
				var config = configObj.config;
				
////				console.debug(config);
//				
////				$(this.statusWindow.window).window("option",config.statusWindow.simoneOptions);
//				this.setWindowState(this.statusWindow.window, config.statusWindow.minimized, config.statusWindow.maximized);
//
////				$(this.mapWindow.window).window("option",config.mapWindow.simoneOptions);
//				this.setWindowState(this.mapWindow.window, config.mapWindow.minimized, config.mapWindow.maximized);
//
////				$(this.piechartWindow.window).window("option",config.piechartWindow.simoneOptions);
//				this.setWindowState(this.piechartWindow.window, config.piechartWindow.minimized, config.piechartWindow.maximized);
//
////				$(this.utilityWindow.window).window("option",config.utilityWindow.simoneOptions);
//				this.setWindowState(this.utilityWindow.window, config.utilityWindow.minimized, config.utilityWindow.maximized);
//
////				$(this.plotWindow.window).window("option",config.plotWindow.simoneOptions);
//				this.setWindowState(this.plotWindow.window, config.plotWindow.minimized, config.plotWindow.maximized);
//
////				$(this.tableWindow.window).window("option",config.tableWindow.simoneOptions);
//				var window = this.tableWindow.window;
////				$(this.tableWindow.window).on("windowshow", function() {
////					$(window).window("refreshPosition");
////					console.log("Height: "+$(window).window("option","height")+" Width: "+$(window).window("option","width"));
////				});
////				$(this.tableWindow.window).window("option", {
////					height : config.tableWindow.simoneOptions.height,
////					width : config.tableWindow.simoneOptions.width
////				});
////				$(this.tableWindow.window).window("refreshPosition");
//				this.setWindowState(this.tableWindow.window, config.tableWindow.minimized, config.tableWindow.maximized);
////				console.log(config.tableWindow.minimized);
////				console.log(config.tableWindow.maximized);
////				console.log(config);
//
//				this.setWindowState(this.aboutWindow.window, config.aboutWindow.minimized, config.aboutWindow.maximized);
				windowManagerWidget.mapWindow.window.window("destroy");
				windowManagerWidget.addMapWindow(
						windowManagerWidget.options.mapWindowDiv, 
						config.mapWindow.minimized, 
						config.mapWindow.maximized, 
						windowManagerWidget.getOptions(config.mapWindow.simoneOptions));
//						config.mapWindow.simoneOptions);
//new MapWindow(windowManagerWidget.options.mapWindowDiv, config.mapWindow.simoneOptions);
				
				windowManagerWidget.piechartWindow.window.window("destroy");
				windowManagerWidget.addPieChartWindow(
						windowManagerWidget.options.piechartWindowDiv, 
						config.piechartWindow.minimized, 
						config.piechartWindow.maximized, 
						windowManagerWidget.getOptions(config.piechartWindow.simoneOptions));
//				new PieChartWindow(windowManagerWidget.options.piechartWindowDiv, config.piechartWindow.simoneOptions);
				
				windowManagerWidget.utilityWindow.window.window("destroy");
				windowManagerWidget.addUtilityWindow(
						windowManagerWidget.options.utilityWindowDiv, 
						config.utilityWindow.minimized, 
						config.utilityWindow.maximized, 
						windowManagerWidget.getOptions(config.utilityWindow.simoneOptions));
//new UtilityWindow(windowManagerWidget.options.utilityWindowDiv, config.utilityWindow.simoneOptions);
//				windowManagerWidget.getOptions(config.utilityWindow.simoneOptions);

				windowManagerWidget.plotWindow.window.window("destroy");
				windowManagerWidget.addPlotWindow(
						windowManagerWidget.options.plotWindowDiv, 
						config.plotWindow.minimized, 
						config.plotWindow.maximized, 
						windowManagerWidget.getOptions(config.plotWindow.simoneOptions));
//new PlotWindow(windowManagerWidget.options.plotWindowDiv, config.plotWindow.simoneOptions);
				
				windowManagerWidget.tableWindow.window.window("destroy");
				windowManagerWidget.addTableWindow(
						windowManagerWidget.options.tableWindowDiv, 
						config.tableWindow.minimized, 
						config.tableWindow.maximized, 
						windowManagerWidget.getOptions(config.tableWindow.simoneOptions));
//new TableWindow(windowManagerWidget.options.tableWindowDiv, config.tableWindow.simoneOptions);
				
				windowManagerWidget.aboutWindow.window.window("destroy");
				windowManagerWidget.addAboutWindow(
						windowManagerWidget.options.aboutWindowDiv, 
						config.aboutWindow.minimized, 
						config.aboutWindow.maximized, 
						windowManagerWidget.getOptions(config.aboutWindow.simoneOptions));
//new AboutWindow(windowManagerWidget.options.aboutWindowDiv, config.aboutWindow.simoneOptions);
				
//				console.log($(windowManagerWidget.utilityWindow.div));
				
				windowManagerWidget.taskbar.setScale(config.scale);
			}
			
		},
		
		addStatusWindow : function(statusWindowDiv) {
			
			var windowManagerWidget = this;
					
			windowManagerWidget.statusWindow = new StatusWindow(statusWindowDiv);
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

			windowManagerWidget.mapWindow = new MapWindow(mapWindowDiv, opt);
			
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


			windowManagerWidget.piechartWindow = new PieChartWindow(piechartWindowDiv, opt);

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

			windowManagerWidget.utilityWindow = new UtilityWindow(utilityWindowDiv, opt);

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
			
			windowManagerWidget.plotWindow = new PlotWindow(plotWindowDiv, opt);

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

			windowManagerWidget.tableWindow = new TableWindow(tableWindowDiv, opt);

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

			windowManagerWidget.aboutWindow = new AboutWindow(aboutWindowDiv, opt);

			if (min) {
				windowManagerWidget.aboutWindow.window.window("minimize");				
			}
			
			if (max) {
				windowManagerWidget.aboutWindow.window.window("maximize");				
			}
		},
		
		setWindowState : function(window, minimized, maximized) {
			
			var windowManagerWidget = this;
//			console.log($(window).window("minimized"));
//			$(window).window("minimize",0);
//			console.log("is minimizing? "+$(window).window("minimizing"));
//			console.log("is minimized? "+$(window).window("minimized"));
//			console.log("is restoring? "+$(window).window("restoring"));
//			console.log("is restored? "+$(window).window("restored"));
//			console.log("is showing? "+$(window).window("showing"));
//			console.log("is shown? "+$(window).window("shown"));

//			$(window).one("windowshow", function() {
//				console.log("window shown");
//			});
			
//			$(window).window({
//				show : function(event, ui) {
//					console.log(event);
//				}
//			})
//			$(window).window("show");
//			if (maximized) {
//				console.log("maximize: "+$(window).window("title"));
//				$(window).window("option","position",{ my : "top left", at : "top left"});
//				$(window).window("close");
//				console.log($(window).window("option","position"));
//			}
			if (maximized) {
				if ($(window).window("showing")) {
					$(window).one("windowshow", function() {
						$(window).window("maximize",0);
//						console.log("maximizing after show: "+$(window).window("title"));
					})
				} else {
					$(window).window("maximize", 0);
//					console.log("maximizing: "+$(window).window("title"));
				}
			}
			
			if (minimized) {
				if ($(window).window("showing")) {
					$(window).one("windowshow", function() {
						$(window).window("minimize",0);
//						console.log("minimizing after show: "+$(window).window("title"));
					})
				} else {
					$(window).window("minimize",0);
//					console.log("minimizing: "+$(window).window("title"));
				}
//				$(window.div).window("minimize");
//				console.log("is minimizing? "+$(window).window("minimizing"));
//				console.log("is minimized? "+$(window).window("minimized"));
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
		}

		
}