/*
* PieChart.js
*
* Copyright (c) 2013, Sebastian Kruse. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class PieChart
 * Implementation for a PieChart
 * @author Sebastian Kruse (skruse@mpiwg-berlin.mpg.de)
 *
 * @param {HTML object} parent div to append the PieChart
 */
function PieChart(parent, watchedDataset, watchedColumn, selectionFunction) {

	this.index;
	this.pieChart = this;
	this.pieChartDiv;
	this.preHighlightObjects;
	
	this.removeButton;
	
	this.parent = parent;
	this.options = parent.options;
	
	this.watchedDatasetLabel;
	this.watchedDataset = parseInt(watchedDataset);
	this.watchColumn = watchedColumn;
	if (typeof selectionFunction !== "undefined")
		this.selectionFunction = selectionFunction;
	else
		//default selectionFunction returns value (creates "distinct" piechart)
		this.selectionFunction = function(columnData){return columnData;};	

	this.initialize();
}

PieChart.prototype = {

	remove : function() {
		this.parent.pieCharts[this.index] = null;
		$(this.pieChartDiv).remove();
		$(this.removeButton).remove();
		this.parent.redrawPieCharts();
	},
	
	initialize : function() {
		var pieChart = this;
		
		if (typeof this.pieChartDiv === "undefined"){
			this.removeButton = document.createElement("button");
			$(this.removeButton).text("remove");
			$(this.removeButton).click(function(){
				pieChart.remove();
			});
			$(this.parent.gui.pieChartsDiv).append(this.removeButton);
			this.pieChartDiv = document.createElement("div");
			this.index = this.parent.pieCharts.length;
			this.pieChartDiv.id = "PieChart"+this.index;
			$(this.parent.gui.pieChartsDiv).append(this.pieChartDiv);
		}
		
	    $(this.pieChartDiv).bind("plothover", function (event, pos, item) {
	        if (item) {
				//item.series.label contains the column element
				pieChart.triggerHighlight(item.series.label);                              
	        } else {
	        	pieChart.triggerHighlight();
	        }
	    });
		
	    $(this.pieChartDiv).bind("plotclick", function (event, pos, item) {
	        if (item) {
				//item.series.label contains the column element
				pieChart.triggerSelection(item.series.label);                              
	        } else {
	        	pieChart.triggerSelection();
	        }
	    });
	},

	getElementData : function(dataObject) {
		pieChart = this;
		var columnData;
		if (pieChart.watchColumn.indexOf("[") === -1){
			columnData = dataObject[pieChart.watchColumn];
			if (typeof columnData === "undefined"){
				columnData = dataObject.tableContent[pieChart.watchColumn];
			};
		} else {
			try {
				var columnName = pieChart.watchColumn.split("[")[0];
				var IndexAndAttribute = pieChart.watchColumn.split("[")[1];
				if (IndexAndAttribute.indexOf("]") != -1){
					var arrayIndex = IndexAndAttribute.split("]")[0];
					var attribute = IndexAndAttribute.split("]")[1];
					
					if (typeof attribute === "undefined")
						columnData = dataObject[columnName][arrayIndex];
					else{
						attribute = attribute.split(".")[1];
						columnData = dataObject[columnName][arrayIndex][attribute];
					}
				}
			} catch(e) {
				if (typeof console !== undefined)
					console.error(e);
				
				columnData = undefined;
			}
		}
		
		if (typeof columnData !== "undefined")
			columnData = pieChart.selectionFunction(columnData);
		
		return(columnData);
	},
	
	getElementsByValue : function(columnElement) {
		var elements = [];
		var pieChart = this;
		if (this.watchedDataset >= 0){
			$(this.parent.datasets[this.watchedDataset].objects).each(function(){
				var columnData = pieChart.getElementData(this);
				if (columnData === columnElement)
					elements.push(this);
			});
		}
		
		return elements;
	},
	
	//check if dataset is still there
	checkForDataSet : function() {
		var dataSets = GeoTemConfig.datasets;
		if (typeof dataSets === "undefined")
			return false;
		if (typeof this.watchedDatasetLabel !== "undefined"){
			//check if our data went missing
			if (	(dataSets.length <= this.watchedDataset) ||
					(dataSets[this.watchedDataset].label !== this.watchedDatasetLabel) ){
				return false;
			} else
				return true;
			
		} else
			return false;
	},
	
	initPieChart : function(dataSets) {
		//TODO: this var "remembers" which dataset we are attached to
		//if it goes missing we delete ourself. This could be improved.
		if (typeof this.watchedDatasetLabel === "undefined")
			this.watchedDatasetLabel = GeoTemConfig.datasets[this.watchedDataset].label;

		// if our dataset went missing, remove this piechart
		if (!this.checkForDataSet()){
				this.remove();
				return;
		}
		
		var objects = [];
		for (var i = 0; i < dataSets.length; i++)
			objects.push([]);
		objects[this.watchedDataset] = dataSets[this.watchedDataset].objects;
		
		this.preHighlightObjects = objects;
		this.redrawPieChart(objects);
	},

	redrawPieChart : function(objects) {
		
		if (typeof objects === "undefined")
			objects = this.preHighlightObjects;
		
		if (this.checkForDataSet(objects)){
			var chartDataCounter = new Object;
			var pieChart = this;
			if (objects[this.watchedDataset].length === 0)
				objects = this.preHighlightObjects;
			$(objects[this.watchedDataset]).each(function(){
				var columnData = pieChart.getElementData(this);
				
				if (typeof chartDataCounter[columnData] === "undefined")
					chartDataCounter[columnData] = 1;
				else
					chartDataCounter[columnData]++;
			});
			
			var chartData = [];
			$.each(chartDataCounter, function(name,val){
				chartData.push({label:name,data:val});
			});
			
			if (chartData.length>0){
				$(this.pieChartDiv).empty();
				
				//calculate height (flot NEEDS a height)				
				var parentHeight = $(this.parent.gui.pieChartsDiv).outerHeight(true) - $(this.parent.gui.columnSelectorDiv).outerHeight(true);
				var pieChartCount = 0;
				$(this.parent.pieCharts).each(function(){
					if (this instanceof PieChart)
						pieChartCount++;
				});
				var height = (parentHeight/pieChartCount) - $(this.removeButton).outerHeight(true);
				$(this.pieChartDiv).height(height);
	
				$.plot($(this.pieChartDiv), chartData,
					{
						series: {
							// Make this a pie chart.
							pie: {
								show:true
							}
						},
						legend: { show:true, position: 'se' },
						grid: {
				            hoverable: true,
				            clickable: true
				        },
				        tooltip: true,
				        tooltipOpts: {
				            content: "%s"
				        }
					}
				);
			}
		}
	},
		
	triggerHighlight : function(columnElement) {
		var highlightedObjects = [];
		for (var i = 0; i < GeoTemConfig.datasets.length; i++)
			highlightedObjects.push([]);
		
		highlightedObjects[this.watchedDataset] = this.getElementsByValue(columnElement);
		
		this.parent.core.triggerHighlight(highlightedObjects);
		
		var myIndex = this.index;
		var pieChart = this;
		$(this.parent.pieCharts).each(function(){
			if (this instanceof PieChart && (this.index !== myIndex)){
				if (this.watchedDataset === pieChart.watchedDataset)
					this.redrawPieChart(highlightedObjects);
			}				
		});
	},

	triggerSelection : function(columnElement) {
		var selectedObjects = [];
		for (var i = 0; i < GeoTemConfig.datasets.length; i++)
			selectedObjects.push([]);

		var selection;
		if (typeof columnElement !== "undefined"){
			selectedObjects[this.watchedDataset] = this.getElementsByValue(columnElement);
			selection = new Selection(selectedObjects, this);
		} else {
			selection = new Selection(selectedObjects);
		}

		this.parent.core.triggerSelection(selection);
		
		if (!selection.valid())
			selection.loadAllObjects();
		
		var myIndex = this.index;
		var pieChart = this;
		$(this.parent.pieCharts).each(function(){
			if (this instanceof PieChart && (this.index !== myIndex)){
				if (this.watchedDataset === pieChart.watchedDataset){
					this.preHighlightObjects = selection.objects;
					this.redrawPieChart(selection.objects);
				}
			}				
		});
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
};
