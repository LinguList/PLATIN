/*
* FuzzyTimelineRangeBars.js
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
 * @class FuzzyTimelineRangeBars
 * Implementation for a fuzzy time-ranges barchart
 * @author Sebastian Kruse (skruse@mpiwg-berlin.mpg.de)
 *
 * @param {HTML object} parent div to append the FuzzyTimeline
 */
function FuzzyTimelineRangeBars(parent) {

	this.rangeBars = this;
	
	this.parent = parent;
	this.options = parent.options;
	
	this.overallMin;
	this.overallMax;
	
	this.rangeDiv = this.parent.gui.rangeTimelineDiv;
	this.plotDiv = document.createElement("div");
	$(this.rangeDiv).append(this.plotDiv);
	$(this.plotDiv).width("100%");
	$(this.plotDiv).height("98%");

	this.pieChartDiv = this.parent.gui.rangePiechartDiv;

	this.plot = new FuzzyTimelineDensity(this.parent,this.plotDiv);
	this.pieCharts = [];
}

FuzzyTimelineRangeBars.prototype = {

	initialize : function(overallMin,overallMax,datasets) {
		var rangeBar = this;
		
		rangeBar.overallMin = overallMin;
		rangeBar.overallMax = overallMax;

		rangeBar.deletePieCharts();
	},
	
	drawRangeBarChart : function(shownDatasets, spanWidth){
		var rangeBar = this;
		//redraw plot
		//span * 2, cause this will fit most values into a single tick
		rangeBar.plot.initialize(rangeBar.overallMin,rangeBar.overallMax,shownDatasets,2*spanWidth);
	},

	drawRangePieChart : function(shownDatasets,hiddenDatasets) {
		var rangeBar = this;

		var parentDiv = rangeBar.pieChartDiv;
		rangeBar.deletePieCharts();
		var datasetIndex = 0;
		$(GeoTemConfig.datasets).each(function(){
			var div = document.createElement("div");
			$(parentDiv).append(div);
			$(div).height($(parentDiv).height()/GeoTemConfig.datasets.length);

			rangeBar.pieCharts.push(new FuzzyTimelineRangePiechart(rangeBar.parent,div,datasetIndex,shownDatasets,hiddenDatasets));
			datasetIndex++;
		});
	},
	
	deletePieCharts : function(){
		var rangeBar = this;
		$(rangeBar.pieChartDiv).empty();
		for (var piechart in rangeBar.pieCharts){
			delete piechart;
		}
		rangeBar.pieCharts = [];
	},
	
	triggerHighlight : function(columnElement) {

	},

	triggerSelection : function(columnElement) {

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
