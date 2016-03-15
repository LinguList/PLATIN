/**
 * 
 */

function StatusWindowGui(statusWindow, div, options) {
	
	this.parent = statusWindow;
	var statusWindowGui = this;
	
	statusWindowGui.statusWindowContainer = document.createElement('div');
	$(div).append(statusWindowGui.statusWindowContainer);
	
}

StatusWindowGui.prototype = {
		
		initGui : function() {
			
		}
}