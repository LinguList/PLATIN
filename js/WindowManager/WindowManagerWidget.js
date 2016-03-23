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
			
//			this.addStatusWindow(this.options.statusWindowDiv);
//			this.addMapWindow(this.options.mapWindowDiv);
//			this.addPieChartWindow(this.options.piechartWindowDiv);
//			this.addUtilityWindow(this.options.utilityWindowDiv);
//			this.addPlotWindow(this.options.plotWindowDiv);
//			this.addTableWindow(this.options.tableWindowDiv);

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
					statusWindow : $(windowManagerWidget.statusWindow.window).window("option"),
					mapWindow : $(windowManagerWidget.mapWindow.window).window("option"),
					piechartWindow : $(windowManagerWidget.piechartWindow.window).window("option"),
					utilityWindow : $(windowManagerWidget.utilityWindow.window).window("option"),
					plotWindow : $(windowManagerWidget.plotWindow.window).window("option"),
					tableWindow : $(windowManagerWidget.tableWindow.window).window("option")
			};
			
			if (typeof inquiringWidget.sendConfig !== "undefined"){
				inquiringWidget.sendConfig({widgetName: "windowManager", 'config': config});
			}
			
		},
		
		setConfig : function(configObj) {
			
			var windowManagerWidget = this;
			
			if (configObj.widgetName === "windowManager"){
				var config = configObj.config;
				
				$(this.statusWindow.window).window("option",config.statusWindow);
				$(this.mapWindow.window).window("option",config.mapWindow);
				$(this.piechartWindow.window).window("option",config.piechartWindow);
				$(this.utilityWindow.window).window("option",config.utilityWindow);
				$(this.plotWindow.window).window("option",config.plotWindow);
				$(this.tableWindow.window).window("option",config.tableWindow);
				
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
		}

		
}