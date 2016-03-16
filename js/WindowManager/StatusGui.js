/**
 * 
 */

function StatusGui(status, div, options) {
	
	this.parent = status;
	var statusGui = this;
	
	this.statusContainer = document.createElement('div');
	$(div).append(statusGui.statusContainer);
	
}

StatusGui.prototype = {
		
		initGui : function() {
			
			var statusGui = this;
			var statusWidget = this.parent;
			
			$(statusGui.statusContainer).empty();
			
			statusGui.statusDiv = document.createElement('div');
			$(statusGui.statusContainer).append(statusGui.statusDiv);
			
			var count = 0;
			
			if (typeof statusWidget.selected != 'undefined') {
				for (var i = 0; i <= statusWidget.selected.length; i++) {
					count += statusWidget.selected[i].length;
				}
			}
			$(statusGui.statusDiv).text(count + " Objects selected");				
			
		},

		updateStatus : function() {
			
			var statusGui = this;
			var statusWidget = this.parent;
			
			if (typeof statusWidget.selected != 'undefined') {
				var count = 0;
				for (var i = 0; i < statusWidget.selected.length; i++) {
					count += statusWidget.selected[i].length;
				}
				$(statusGui.statusDiv).text(count + " Objects selected");				
			}
		}
}