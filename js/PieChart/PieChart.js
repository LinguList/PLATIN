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
	this.watchedDataset = watchedDataset;
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
		
		$(this.pieChartDiv).bind('jqplotDataHighlight', function(ev, seriesIndex, pointIndex, data) {
			//data[0] contains the column element
			pieChart.triggerHighlight(data[0]);                              
        }); 
		
		$(this.pieChartDiv).bind('jqplotDataUnhighlight', function(ev, seriesIndex, pointIndex, data) {
			//data[0] contains the column element
			pieChart.triggerHighlight();                              
        }); 
		
		$(this.pieChartDiv).bind('jqplotDataClick', function(ev, seriesIndex, pointIndex, data) {
			//data[0] contains the column element
			pieChart.triggerSelection(data[0]);                              
        });
	},

	getElementsByValue : function(columnElement) {
		var elements = [];
		
		if (this.watchedDataset >= 0){
			pieChartWidget = this;
			$(this.parent.datasets[this.watchedDataset].objects).each(function(){
				var columnData = this[pieChartWidget.watchColumn];
				if (typeof columnData === "undefined"){
					columnData = this.tableContent[pieChartWidget.watchColumn];
				};
				
				columnData = pieChartWidget.selectionFunction(columnData);
				
				if (columnData === columnElement)
					elements.push(this);
			});
		}
		
		return elements;
	},
	
	initPieChart : function(dataSets) {
		if (typeof this.watchedDatasetLabel !== "undefined"){
			//check if our data went missing
			if (	(dataSets.length <= this.watchedDataset) ||
					(dataSets[this.watchedDataset].label !== this.watchedDatasetLabel) ){
				// if our dataset went missing, remove this piechart
				this.remove();
				return;
			}
		}
		var objects = [];
		for (var i = 0; i < dataSets.length; i++)
			objects.push([]);
		objects[this.watchedDataset] = dataSets[this.watchedDataset].objects;
		//TODO: this var "remembers" which dataset we are attached to
		//if it goes missing we delete ourself (in. This could be improved.
		this.watchedDatasetLabel = GeoTemConfig.datasets[this.watchedDataset].label;
		
		this.preHighlightObjects = objects;
		this.redrawPieChart(objects);
	},

	redrawPieChart : function(objects) {
		
		if (this.watchedDataset >= 0){
			var chartDataCounter = new Object;
			var pieChartWidget = this;
			if (objects[this.watchedDataset].length === 0)
				objects = this.preHighlightObjects;
			$(objects[this.watchedDataset]).each(function(){
				var columnData = this[pieChartWidget.watchColumn];
				if (typeof columnData === "undefined"){
					columnData = this.tableContent[pieChartWidget.watchColumn];
				};
				
				columnData = pieChartWidget.selectionFunction(columnData);
				
				if (typeof chartDataCounter[columnData] === "undefined")
					chartDataCounter[columnData] = 1;
				else
					chartDataCounter[columnData]++;
			});
			
			var chartData = [];
			$.each(chartDataCounter, function(name,val){
				chartData.push([name,val]);
			});
			
			if (chartData.length>0){
				$(this.pieChartDiv).empty();
	
				$.jqplot (this.pieChartDiv.id, [chartData],
					{
						seriesDefaults: {
							// Make this a pie chart.
							renderer: $.jqplot.PieRenderer,
							rendererOptions: {
								// Put data labels on the pie slices.
								// By default, labels show the percentage of the slice.
								showDataLabels: true
							}
						},
						legend: { show:true, location: 'e' },
						highlighter: {
							show: true,
						    showTooltip: true,
						    tooltipFade: true,
						    formatString:'%s', 
							tooltipLocation:'sw',
							useAxesFormatters:false
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
		$(this.parent.pieCharts).each(function(){
			if (this instanceof PieChart && (this.index !== myIndex)){
				this.redrawPieChart(highlightedObjects);
			}				
		});
	},

	triggerSelection : function(columnElement) {
		var selectedObjects = [];
		for (var i = 0; i < GeoTemConfig.datasets.length; i++)
			selectedObjects.push([]);
		
		selectedObjects[this.watchedDataset] = this.getElementsByValue(columnElement);
		
		var selection = new Selection(selectedObjects, this);
		this.parent.core.triggerSelection(selection);
		
		var myIndex = this.index;
		$(this.parent.pieCharts).each(function(){
			if (this instanceof PieChart && (this.index !== myIndex)){
				this.preHighlightObjects = selectedObjects;
				this.redrawPieChart(selectedObjects);
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
