/**
 * 
 */

StatusWidget = function(core, div, options) {
	
	this.datasets;
	this.core = core;
	this.core.setWidget(this);
	
	this.options = (new StatusConfig(options)).options;
	this.gui = new StatusGui(this, div, this.options);
	this.status = new Status(this);
	
	this.selected;
	
	this.initWidget();
	
}

StatusWidget.prototype = {
		
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
			this.gui.updateStatus();
		}

		
}