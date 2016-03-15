/**
 * 
 */

function StatusWindow(parent) {
	
	this.index;
	this.statusWindow = this;
	
	this.parent = parent;
	this.options = parent.options;
	
	this.initialize();
	
	
}

StatusWindow.prototype = {
		
		remove : function() {
		},
		
		initialize : function() {
		},
		
		triggerHighlight : function(columnElement) {
		},

		triggerSelection : function(columnElement) {
		},

		deselection : function() {
		},

		filtering : function() {
		},

		inverseFiltering : function() {
		},

		triggerRefining : function() {
		},

		reset : function() {
		},
		
		show : function() {		
		},

		hide : function() {
		}
		
}