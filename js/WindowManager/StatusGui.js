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
			this.outputDatasources();
			$(statusGui.statusDiv).append(statusGui.dataSourceDiv);			
			
			statusGui.datasetsDiv = document.createElement('div');
			this.outputDatasets();
			$(statusGui.statusDiv).append(statusGui.datasetsDiv);
			
			statusGui.mapBaseDiv = document.createElement('div');
			this.outputMapbase();
			$(statusGui.statusDiv).append(statusGui.mapBaseDiv);
			
			statusGui.activePiechartsDiv = document.createElement('div');
			this.outputPiecharts();
			$(statusGui.statusDiv).append(statusGui.activePiechartsDiv);
			
			statusGui.selectedObjectsDiv = document.createElement('div');
			this.updateStatus();
			$(statusGui.statusDiv).append(statusGui.selectedObjectsDiv);
			
			
			
			Publisher.Subscribe('statusUpdate', this.parent, function(status) {
				
				$.extend(statusGui.status, status);
				
				statusGui.outputPiecharts();
				
				statusGui.outputMapbase();
				
				statusGui.outputDatasets();
				
			});
						
		},

		updateStatus : function() {
			
			var statusGui = this;
			var statusWidget = this.parent;
			
			if (typeof statusWidget.selected != 'undefined') {
				var count =  Array();
				for (var i = 0; i < statusWidget.selected.length; i++) {
					count[i] = statusWidget.selected[i].length;
				}
				var c = 0;
				for (var i=count.length; i--;) {
					c+=count[i];
				}
				$(statusGui.selectedObjectsDiv).empty();
				$(statusGui.selectedObjectsDiv).text(c + " Objects selected");	
				var datasets = GeoTemConfig.datasets;
				$(count).each(function(i, d) {
					var dPar = document.createElement('span');
					var color = [datasets[i].color.r1, datasets[i].color.g1, datasets[i].color.b1];
					$(dPar).css("color", "rgb("+color[0]+","+color[1]+","+color[2]+")");
					$(dPar).text(" "+d+"/"+ (d*100/datasets[i].objects.length).toFixed(2)+"%");
					$(statusGui.selectedObjectsDiv).append(dPar);
				});
			} else {
				$(statusGui.selectedObjectsDiv).text("0 Objects selected");		

			}
		},
		
		outputDatasources : function() {
			var statusGui = this;
			$(statusGui.dataSourceDiv).text("Datasource(s):");
		},
		
		outputDatasets : function() {
			var statusGui = this;
			$(statusGui.datasetsDiv).text("DataSet(s): ");
			$(statusGui.datasetsDiv).css({"padding-top" : "3px", "padding-bottom" : "3px"});
			
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

		},
		
		outputMapbase : function() {
			var statusGui = this;
			$(statusGui.mapBaseDiv).text("Map-Base: " + statusGui.status.mapbase);
			if (statusGui.status.mapbase != 'undefined' && statusGui.status.mapbase != null) {
				$(statusGui.mapBaseDiv).empty();
				$(statusGui.mapBaseDiv).text("Map-Base: " + statusGui.status.mapbase);
			};

		},
		
		outputPiecharts : function() {
			var statusGui = this;
			$(statusGui.activePiechartsDiv).text("Active Piechart(s):");
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

		}
		
}