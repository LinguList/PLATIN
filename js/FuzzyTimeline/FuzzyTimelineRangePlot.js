/*
* FuzzyTimelineRangePlot.js
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
 * @class FuzzyTimelineRangePlot
 * Implementation for a fuzzy time-ranges plot
 * @author Sebastian Kruse (skruse@mpiwg-berlin.mpg.de)
 *
 * @param {HTML object} parent div to append the FuzzyTimeline
 */
function FuzzyTimelineRangePlot(parent) {

	this.rangePlot = this;
	
	this.parent = parent;
	this.options = parent.options;
	
	this.spans;
	this.spanHash;
	
	this.overallMin;
	this.overallMax;
	this.datasets;
	
	this.rangeDiv = this.parent.gui.rangeTimelineDiv;
	this.sliderDiv = document.createElement("div");
	$(this.rangeDiv).append(this.sliderDiv);
	$(this.sliderDiv).css("float","left");
	$(this.sliderDiv).width("85%");
	$(this.sliderDiv).height("2%");
	this.sliderValue = document.createElement("div");
	$(this.rangeDiv).append(this.sliderValue);
	this.sliderValue.align = "right";
	$(this.sliderValue).css("float","right");
	$(this.sliderValue).width("15%");
	$(this.sliderValue).height("2%");

	this.plotDiv = document.createElement("div");
	$(this.rangeDiv).append(this.plotDiv);
	$(this.plotDiv).width("100%");
	$(this.plotDiv).height("98%");

	this.pieChartDiv = this.parent.gui.rangePiechartDiv;

	this.plot = new FuzzyTimelineDensity(this.parent,this.plotDiv);
	this.pieCharts = [];
}

FuzzyTimelineRangePlot.prototype = {

	initialize : function(overallMin,overallMax,datasets) {
		var rangePlot = this;
		rangePlot.overallMin = overallMin;
		rangePlot.overallMax = overallMax;
		rangePlot.datasets = datasets;

		//reset values
		rangePlot.spans = [];
		rangePlot.spanHash = [];
		rangePlot.deletePieCharts();

		//get all distinct time-spans
		$(this.datasets).each(function(){
			$(this.objects).each(function(){
				var dataObject = this;
				if (dataObject.isTemporal){
					if ($.inArray(0,rangePlot.spans)==-1)
						rangePlot.spans.push(0);
				} else if (dataObject.isFuzzyTemporal){
					var span = dataObject.TimeSpanEnd - dataObject.TimeSpanBegin;
					if ($.inArray(span,rangePlot.spans)==-1)
						rangePlot.spans.push(span);
				} 
			});
		});
		//sort the spans
		rangePlot.spans.sort(function(a,b){return a-b;});
		
		if (rangePlot.spans.length > 0){
			//create empty hash map (span -> DataObjects)
			$(rangePlot.spans).each(function(){
				var emptyObjectArray = [];
				$(rangePlot.datasets).each(function(){
					emptyObjectArray.push([]);
				});
				rangePlot.spanHash.push(emptyObjectArray);
			});

			//build hash map (span -> DataObjects)
			var datasetIndex = 0;
			$(rangePlot.datasets).each(function(){
				$(this.objects).each(function(){
					var dataObject = this;
					var span;
					if (dataObject.isTemporal){
						span = 0;
					} else if (dataObject.isFuzzyTemporal){
						span = dataObject.TimeSpanEnd - dataObject.TimeSpanBegin;
					}
					
					if (typeof span !== "undefined"){
						var spanIndex = rangePlot.spans.indexOf(span);
						//has to be in array, so no check for -1
						rangePlot.spanHash[spanIndex][datasetIndex].push(dataObject);
					}
				});
				datasetIndex++;
			});
			
			$(rangePlot.sliderDiv).slider({
				min:0,
				max:rangePlot.spans.length-1,
				step:1,
				value:0
			});
			
			var onSlideFunction = function( event, ui ){
				//redraw span "name"
				var handlePosition = ui.value;
				$(rangePlot.sliderValue).empty();
				$(rangePlot.sliderValue).append(moment.duration(rangePlot.spans[handlePosition]).humanize());
				var shownDatasets = rangePlot.spanHash[0];
				for (var i = 1; i < handlePosition; i++){
					shownDatasets = GeoTemConfig.mergeObjects(shownDatasets,rangePlot.spanHash[i]);
				}
				var hiddenDatasets = [];
				$(rangePlot.datasets).each(function(){
					hiddenDatasets.push([]);
				});
				for (var i = handlePosition+1; i < rangePlot.spanHash.length; i++){
					hiddenDatasets = GeoTemConfig.mergeObjects(hiddenDatasets,rangePlot.spanHash[i]);
				}
				//redraw plot
				//span * 2, cause only this assures that all values fit into every "tick"
				rangePlot.plot.initialize(rangePlot.overallMin,rangePlot.overallMax,shownDatasets,2*rangePlot.spans[handlePosition]);
				//redraw pie charts
				rangePlot.drawRangePieChart(shownDatasets,hiddenDatasets);
			};
			
			$(rangePlot.sliderDiv).on( "slide", onSlideFunction);
			
			onSlideFunction({},{value:0});
		}
	},
			
	drawRangePieChart : function(shownDatasets,hiddenDatasets) {
		var rangePlot = this;

		rangePlot.deletePieCharts();
		var datasetIndex = 0;
		$(rangePlot.datasets).each(function(){
			var div = document.createElement("div");
			var test = $(rangePlot.pieChartDiv).height();

			rangePlot.pieCharts.push(new FuzzyTimelineRangePiechart(rangePlot.parent,div,shownDatasets,hiddenDatasets));
			datasetIndex++;
		});
	},
	
	deletePieCharts : function(){
		var rangePlot = this;
		$(rangePlot.pieChartDiv).empty();
		for (var piechart in rangePlot.pieCharts){
			delete piechart;
		}
		rangePlot.pieCharts = [];
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
