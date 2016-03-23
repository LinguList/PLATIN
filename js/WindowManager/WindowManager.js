function WindowManager(parent) {
	
	this.index;
	this.status = this;
	
	this.parent = parent;
	this.options = parent.options;
	
	this.initialize();
	
	
}

WindowManager.prototype = {
		
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