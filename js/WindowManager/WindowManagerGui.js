function WindowManagerGui(status, div, options) {
	
	this.parent = status;
	var windowManagerGui = this;
	
	this.windowManagerContainer = document.createElement('div');
	$(div).append(windowManagerGui.windowManagerContainer);
	
}

WindowManagerGui.prototype = {
		
		initGui : function() {
			
			
		}
}