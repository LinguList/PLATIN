/*
* PieChartWidget.js
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
 * @class PieChartWidget
 * PieChartWidget Implementation
 * @author Sebastian Kruse (skruse@mpiwg-berlin.mpg.de)
 *
 * @param {WidgetWrapper} core wrapper for interaction to other widgets
 * @param {HTML object} div parent div to append the PieChart widget div
 * @param {JSON} options user specified configuration that overwrites options in PieChartConfig.js
 */
function PieChartWidget(core, div, options) {

	this.datasets;
	this.core = core;
	this.core.setWidget(this);

	this.options = (new PieChartConfig(options)).options;
	this.gui = new PieChartGui(this, div, this.options);
	
	this.pieChart = new PieChart(this);
	
	this.watchedDataset = 0;
	this.watchColumn = "objekt";
}

PieChartWidget.prototype = {
		
	redrawPieChart : function(objects) {
		var chartDataCounter = new Object;
		var pieChartWidget = this;
		$(objects).each(function(){
			var columnData = this[pieChartWidget.watchColumn];
			if (typeof columnData === "undefined"){
				columnData = this.tableContent[pieChartWidget.watchColumn];
			};
			
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
			$(this.gui.pieChartDiv).empty();

			$.jqplot (this.gui.pieChartDiv.id, [chartData],
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
					legend: { show:true, location: 'e' }
				}
			);
		}
	},

	initWidget : function(data) {
		this.datasets = data;
		this.redrawPieChart(data[this.watchedDataset].objects);
	},

	highlightChanged : function(objects) {
		if( !GeoTemConfig.highlightEvents ){
			return;
		}
		this.redrawPieChart(objects[this.watchedDataset]);
	},

	selectionChanged : function(selection) {
		if( !GeoTemConfig.selectionEvents ){
			return;
		}
		this.redrawPieChart(selection.objects[this.watchedDataset]);
	},

	triggerHighlight : function(item) {
	},

	tableSelection : function() {
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
	}
};
