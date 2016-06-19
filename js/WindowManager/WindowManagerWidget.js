WindowManagerWidget = function(core, div, options) {
	
	this.datasets;
	this.core = core;
	this.core.setWidget(this);
	
	this.options = (new WindowManagerConfig(options)).options;
	this.gui = new WindowManagerGui(this, div, this.options);
	this.windowManager = new WindowManager(this);
	
	this.selected;
	
	this.initWidget();
	
}

WindowManagerWidget.prototype = {
		
		initWidget : function(data) {
			
			this.datasets = data;
			this.gui.initGui();
			
			this.addStatusWindow(this.options.statusWindowDiv);
			this.addMapWindow(this.options.mapWindowDiv);
			this.addPieChartWindow(this.options.piechartWindowDiv);
			this.addUtilityWindow(this.options.utilityWindowDiv);
			this.addPlotWindow(this.options.plotWindowDiv);
			this.addTableWindow(this.options.tableWindowDiv);
			
			$(this.piechartWindow.div).on("windowshow", function() {
				$(this).css("height", "100%");
				$(this).css("width", "100%");
			});
			$(this.mapWindow.div).on("windowshow", function() {
				$(this).css("height", "100%");
				$(this).css("width", "100%");
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
				
//				console.debug(config);
				
//				$(this.statusWindow.window).window("option",config.statusWindow.simoneOptions);
				this.setWindowState(this.statusWindow.window, config.statusWindow.minimized, config.statusWindow.maximized);

//				$(this.mapWindow.window).window("option",config.mapWindow.simoneOptions);
				this.setWindowState(this.mapWindow.window, config.mapWindow.minimized, config.mapWindow.maximized);

//				$(this.piechartWindow.window).window("option",config.piechartWindow.simoneOptions);
				this.setWindowState(this.piechartWindow.window, config.piechartWindow.minimized, config.piechartWindow.maximized);

//				$(this.utilityWindow.window).window("option",config.utilityWindow.simoneOptions);
				this.setWindowState(this.utilityWindow.window, config.utilityWindow.minimized, config.utilityWindow.maximized);

//				$(this.plotWindow.window).window("option",config.plotWindow.simoneOptions);
				this.setWindowState(this.plotWindow.window, config.plotWindow.minimized, config.plotWindow.maximized);

//				$(this.tableWindow.window).window("option",config.tableWindow.simoneOptions);
				var window = this.tableWindow.window;
//				$(this.tableWindow.window).on("windowshow", function() {
//					$(window).window("refreshPosition");
//					console.log("Height: "+$(window).window("option","height")+" Width: "+$(window).window("option","width"));
//				});
//				$(this.tableWindow.window).window("option", {
//					height : config.tableWindow.simoneOptions.height,
//					width : config.tableWindow.simoneOptions.width
//				});
//				$(this.tableWindow.window).window("refreshPosition");
				this.setWindowState(this.tableWindow.window, config.tableWindow.minimized, config.tableWindow.maximized);
//				console.log(config.tableWindow.minimized);
//				console.log(config.tableWindow.maximized);
//				console.log(config);
			}
			
		},
		
		addStatusWindow : function(statusWindowDiv) {
			
			var windowManagerWidget = this;
			
			windowManagerWidget.statusWindow = new StatusWindow(statusWindowDiv);
		},
		
		addMapWindow : function(mapWindowDiv) {
			
			var windowManagerWidget = this;
			
			windowManagerWidget.mapWindow = new MapWindow(mapWindowDiv);
		},
		
		addPieChartWindow : function(piechartWindowDiv) {
			
			var windowManagerWidget = this;
			
			windowManagerWidget.piechartWindow = new PieChartWindow(piechartWindowDiv);
		},
		
		addUtilityWindow : function(utilityWindowDiv) {
			
			var windowManagerWidget = this;
			
			windowManagerWidget.utilityWindow = new UtilityWindow(utilityWindowDiv);
		},
		
		addPlotWindow : function(plotWindowDiv) {
			
			var windowManagerWidget = this;
			
			windowManagerWidget.plotWindow = new PlotWindow(plotWindowDiv);
		},
		
		addTableWindow : function(tableWindowDiv) {
			
			var windowManagerWidget = this;
			
			windowManagerWidget.tableWindow = new TableWindow(tableWindowDiv);
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
					$(window).window(maximize, 0);
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
		}

		
}