/**
 * 
 */

Taskbar = function(div, options) {
	this.div = div;
	this.options = (new TaskbarConfig()).options;
	
	this.init();
}

Taskbar.prototype = {
		
		
		init : function() {
			$(this.div).taskbar(this.options);
		}
}