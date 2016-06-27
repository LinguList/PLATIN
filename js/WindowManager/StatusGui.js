/**
 * 
 */

function StatusGui(parent, div, options) {
	
	this.parent = parent;
	var statusGui = this;
	
	this.status = {
			pieCharts	: [],
			mapbase		: "Open Street Map"
	};
	
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
			
			statusGui.datasetsDiv = document.createElement('div');
			$(statusGui.datasetsDiv).text("DataSet(s): ");
			$(statusGui.datasetsDiv).css({"padding-top" : "3px", "padding-bottom" : "3px"});
			$(statusGui.statusDiv).append(statusGui.datasetsDiv);
			
			statusGui.mapBaseDiv = document.createElement('div');
			$(statusGui.mapBaseDiv).text("Map-Base: " + statusGui.status.mapbase);
			$(statusGui.statusDiv).append(statusGui.mapBaseDiv);
			
			statusGui.activePiechartsDiv = document.createElement('div');
			$(statusGui.activePiechartsDiv).text("Active Piechart(s):");
			$(statusGui.statusDiv).append(statusGui.activePiechartsDiv);
			
			statusGui.selectedObjectsDiv = document.createElement('div');
			$(statusGui.statusDiv).append(statusGui.selectedObjectsDiv);
			
			var count = 0;
			
			if (typeof statusWidget.selected != 'undefined' && typeof statusWidget.selected.length != 'undefined') {
				for (var i = 0; i <= statusWidget.selected.length; i++) {
					count += statusWidget.selected[i].length;
				}
			}
			$(statusGui.selectedObjectsDiv).text(count + " Objects selected");		
			
			Publisher.Subscribe('statusUpdate', this.parent, function(status) {
				
				$.extend(statusGui.status, status);
				$(statusGui.activePiechartsDiv).empty();
				$(statusGui.activePiechartsDiv).text("Active Piechart(s): ");
				$.each(statusGui.status.pieCharts, function(index, piechart) {
					if (piechart != null) {
						var pPar = document.createElement('span');
						var color = [piechart.pieChart.watchedDatasetObject.color.r1, piechart.pieChart.watchedDatasetObject.color.g1, piechart.pieChart.watchedDatasetObject.color.b1];
						$(pPar).css("color", "rgb("+color[0]+","+color[1]+","+color[2]+")" );
						$(pPar).text(piechart.pieChart.watchedDatasetObject.label + " - " + piechart.pieChart.watchColumn);
						$(statusGui.activePiechartsDiv).append(pPar);
						if (index+1 < statusGui.status.pieCharts.length) {
							var seperator = document.createElement('span');
							$(seperator).text(", ");
							$(statusGui.activePiechartsDiv).append(seperator);
						}
					}
				});
				
				if (statusGui.status.mapbase != 'undefined' && statusGui.status.mapbase != null) {
					$(statusGui.mapBaseDiv).empty();
					$(statusGui.mapBaseDiv).text("Map-Base: " + statusGui.status.mapbase);
				}
				
				if (statusGui.status.datasets != 'undefined' && statusGui.status.datasets != null) {
					$(statusGui.datasetsDiv).empty();
					$(statusGui.datasetsDiv).text("DataSet(s): ");
					$.each(statusGui.status.datasets, function(index, dataset) {
						var dPar = document.createElement('span');
						var color = [dataset.color.r1, dataset.color.g1, dataset.color.b1];
						$(dPar).css("background-color", "rgb("+color[0]+","+color[1]+","+color[2]+")");
						$(dPar).css("padding-left", "10px");
						$(dPar).css("padding-right", "10px");
						$(dPar).css("padding-top", "3px");
						$(dPar).css("padding-bottom", "3px");
						$(dPar).text(dataset.label+" ("+dataset.objects.length+")");
						$(statusGui.datasetsDiv).append(dPar);
					});
				}
			});
			
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