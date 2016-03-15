/**
 * 
 */

StatusWindowWidget = function(core, div, options) {
	
	this.datasets;
	this.core = core;
	this.core.setWidget(this);
	
	this.options = (new StatusWindowConfig(options)).options;
	this.gui = new StatusWindowGui(this, div, this.options);
	this.statusWindow = new StatusWindow(this);
	
	this.selected;
	
	this.initWidget();
	
}

StatusWindowWidget.prototype = {
		
		initWidget : function(data) {
			
			this.datasets = data;
			this.gui.initGui();
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
		}

		
}