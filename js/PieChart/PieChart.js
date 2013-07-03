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

	this.pieChart = this;
	this.pieChartDiv;
	this.preHighlightObjects;
	
	this.informationDIV;
	
	this.parent = parent;
	this.options = parent.options;
	
	this.watchedDatasetObject;
	this.watchedDataset = parseInt(watchedDataset);
	this.watchColumn = watchedColumn;
	if (typeof selectionFunction !== "undefined")
		this.selectionFunction = selectionFunction;
	else
		//default selectionFunction returns value (creates "distinct" piechart)
		this.selectionFunction = function(columnData){return columnData;};	
}

PieChart.prototype = {

	remove : function() {
		for (var i = 0; i < this.parent.pieCharts.length; i++){
			if (this.parent.pieCharts[i] === this)
				this.parent.pieCharts[i] = null;
		}			
		$(this.pieChartDiv).remove();
		$(this.informationDIV).remove();
		this.parent.redrawPieCharts();
	},
	
	initialize : function() {
		var pieChart = this;
		
		if (typeof this.pieChartDiv === "undefined"){
			this.informationDIV = document.createElement("div");
			$(this.informationDIV).append(GeoTemConfig.datasets[this.watchedDataset].label + " - " + this.watchColumn);
			var c = GeoTemConfig.getColor(this.watchedDataset);
			$(this.informationDIV).css("color","rgb("+c.r1+","+c.g1+","+c.b1+")");
			var removeButton = document.createElement("button");
			$(this.informationDIV).append(removeButton);
			$(removeButton).text("remove");
			$(removeButton).click(function(){
				pieChart.remove();
			});
			$(this.parent.gui.pieChartsDiv).append(this.informationDIV);
			this.pieChartDiv = document.createElement("div");
			$(this.parent.gui.pieChartsDiv).append(this.pieChartDiv);

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
		}
	},

	//check if dataset is still there
	checkForDataSet : function() {
		var dataSets = GeoTemConfig.datasets;
		if (typeof dataSets === "undefined")
			return false;
		if (typeof this.watchedDatasetObject !== "undefined"){
			//check if our data went missing
			if (	(dataSets.length <= this.watchedDataset) ||
					(dataSets[this.watchedDataset] !== this.watchedDatasetObject) ){
				return false;
			} else
				return true;
			
		} else
			return false;
	},
	
	initPieChart : function(dataSets) {
		this.initialize();

		//TODO: this var "remembers" which dataset we are attached to
		//if it goes missing we delete ourself. This could be improved.
		if (typeof this.watchedDatasetObject === "undefined")
			this.watchedDatasetObject = GeoTemConfig.datasets[this.watchedDataset];

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
				var columnData = pieChart.parent.getElementData(this, pieChart.watchColumn, pieChart.selectionFunction);
				
				if (typeof chartDataCounter[columnData] === "undefined")
					chartDataCounter[columnData] = 1;
				else
					chartDataCounter[columnData]++;
			});
			
			// simple function to generate 24bit (rgb!)
			// hash values from strings
			var hashCode = function(string){
				var hash = 0;
				for (var i = 0; i < string.length; i++) {
					char = string.charCodeAt(i);
					hash = (hash << 4)+char;
				}
				hash = Math.abs(hash) & 0xFFFFFF;
				return hash;
			};
			
			var chartData = [];
			$.each(chartDataCounter, function(name,val){
				//get rgb-color (24bit) from hash
				var color = hashCode(name).toString(16);
				//pad to 6 digits
				while (color.length < 6){
					color += '0';
				}
				color = '#'+color;
				chartData.push({label:name,data:val,color:color});
			});
			
			var sortByVal = function(a,b){
				return (b.data-a.data);
			};
			
			chartData.sort(sortByVal);
			
			if (chartData.length>0){
				$(this.pieChartDiv).empty();
				
				//calculate height (flot NEEDS a height)				
				var parentHeight = $(this.parent.gui.pieChartsDiv).outerHeight(true) - $(this.parent.gui.columnSelectorDiv).outerHeight(true);
				var pieChartCount = 0;
				$(this.parent.pieCharts).each(function(){
					if (this instanceof PieChart)
						pieChartCount++;
				});
				var height = (parentHeight/pieChartCount) - $(this.informationDIV).outerHeight(true);
				if (pieChart.options.restrictPieChartSize !== false)
					height = Math.min(height, $(window).height() * pieChart.options.restrictPieChartSize);
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
		
		if (this.watchedDataset >= 0)
			highlightedObjects[this.watchedDataset] = 
				this.parent.getElementsByValue(columnElement, this.watchedDataset, this.watchColumn, this.selectionFunction);
		else
			highlightedObjects[this.watchedDataset] = [];
		
		this.parent.core.triggerHighlight(highlightedObjects);
		
		var pieChart = this;
		$(this.parent.pieCharts).each(function(){
			if (this instanceof PieChart && (this !== pieChart)){
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
			selectedObjects[this.watchedDataset] = 
				this.parent.getElementsByValue(columnElement, this.watchedDataset, this.watchColumn, this.selectionFunction);
			selection = new Selection(selectedObjects, this);
		} else {
			selection = new Selection(selectedObjects);
		}

		this.parent.core.triggerSelection(selection);
		
		if (!selection.valid()){
			selection.loadAllObjects();
			//"undo" selection (click next to piechart)
			//so also redraw this dataset
			this.preHighlightObjects = selection.objects;
			this.redrawPieChart(selection.objects);
		}			
		
		var pieChart = this;
		$(this.parent.pieCharts).each(function(){
			if (this instanceof PieChart && (this !== pieChart)){
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
