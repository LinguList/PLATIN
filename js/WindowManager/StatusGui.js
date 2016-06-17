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
			
			statusGui.dataSourceDiv = document.createElement('div');
			$(statusGui.dataSourceDiv).text("Datasource(s):");
			$(statusGui.statusDiv).append(statusGui.dataSourceDiv);
			
			statusGui.dataSetsDiv = document.createElement('div');
			$(statusGui.dataSetsDiv).text("DataSet(s):");
			$(statusGui.statusDiv).append(statusGui.dataSetsDiv);
			
			statusGui.mapBaseDiv = document.createElement('div');
			$(statusGui.mapBaseDiv).text("Map-Base:");
			$(statusGui.statusDiv).append(statusGui.mapBaseDiv);
			
			statusGui.activePiechartsDiv = document.createElement('div');
			$(statusGui.activePiechartsDiv).text("Active Piechart(s):");
			$(statusGui.statusDiv).append(statusGui.activePiechartsDiv);
			
			statusGui.selectedObjectsDiv = document.createElement('div');
			$(statusGui.statusDiv).append(statusGui.selectedObjectsDiv);
			
			var count = 0;
			
			if (typeof statusWidget.selected != 'undefined') {
				for (var i = 0; i <= statusWidget.selected.length; i++) {
					count += statusWidget.selected[i].length;
				}
			}
			$(statusGui.selectedObjectsDiv).text(count + " Objects selected");				
			
		},

		updateStatus : function() {
			
			var statusGui = this;
			var statusWidget = this.parent;
			
			if (typeof statusWidget.selected != 'undefined') {
				var count = 0;
				for (var i = 0; i < statusWidget.selected.length; i++) {
					count += statusWidget.selected[i].length;
				}
				$(statusGui.selectedObjectsDiv).text(count + " Objects selected");				
			}
		}
}