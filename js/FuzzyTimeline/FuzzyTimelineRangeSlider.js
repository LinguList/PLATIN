/*
* FuzzyTimelineRangeSlider.js
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
 * @class FuzzyTimelineRangeSlider
 * Implementation for a fuzzy time-ranges slider
 * @author Sebastian Kruse (skruse@mpiwg-berlin.mpg.de)
 *
 * @param {HTML object} parent div to append the FuzzyTimeline
 */
function FuzzyTimelineRangeSlider(parent) {

	this.rangeSlider = this;
	
	this.parent = parent;
	this.options = parent.options;
	
	this.spans;
	this.spanHash;
	
	this.overallMin;
	this.overallMax;
	this.datasets;
	
	this.sliderParentDiv = this.parent.gui.sliderDiv;
	this.sliderDiv = document.createElement("div");
	$(this.sliderParentDiv).append(this.sliderDiv);
	$(this.sliderDiv).css("float","left");
	$(this.sliderDiv).width("90%");
	this.sliderValue = document.createElement("div");
	$(this.sliderParentDiv).append(this.sliderValue);
	this.sliderValue.align = "right";
	$(this.sliderValue).css("float","right");
	$(this.sliderValue).width("10%");
	
	this.rangeBars = new FuzzyTimelineRangeBars(this.parent);
}

FuzzyTimelineRangeSlider.prototype = {

	initialize : function(overallMin,overallMax,datasets) {
		var rangeSlider = this;
		rangeSlider.overallMin = overallMin;
		rangeSlider.overallMax = overallMax;
		rangeSlider.datasets = datasets;

		//reset values
		rangeSlider.spans = [];
		rangeSlider.spanHash = [];

		//get all distinct time-spans
		$(this.datasets).each(function(){
			$(this.objects).each(function(){
				var dataObject = this;
				if (dataObject.isTemporal){
					if ($.inArray(0,rangeSlider.spans)==-1)
						//smallest span = 1ms
						rangeSlider.spans.push(1000);
				} else if (dataObject.isFuzzyTemporal){
					var span = dataObject.TimeSpanEnd - dataObject.TimeSpanBegin;
					if ($.inArray(span,rangeSlider.spans)==-1)
						rangeSlider.spans.push(span);
				} 
			});
		});
		//sort the spans
		rangeSlider.spans.sort(function(a,b){return a-b;});

		var fixedSpans = [
		    moment.duration(1, 'seconds'),
			moment.duration(1, 'minutes'),
			moment.duration(10, 'minutes'),
			moment.duration(15, 'minutes'),
			moment.duration(30, 'minutes'),
			moment.duration(1, 'hours'),
			moment.duration(5, 'hours'),
			moment.duration(10, 'hours'),
			moment.duration(12, 'hours'),
			moment.duration(1, 'days'),
			moment.duration(7, 'days'),
			moment.duration(1, 'weeks'),
			moment.duration(1, 'months'),
			moment.duration(3, 'months'),
			moment.duration(6, 'months'),
			moment.duration(1, 'years'),
			moment.duration(10, 'years'),
			moment.duration(100, 'years'),
			moment.duration(1000, 'years')];
		
		//add the fixed spans, that are longer than minimum span and not already contained
		for (var i = 0; i < fixedSpans.length; i++){
			if ((fixedSpans[i] > rangeSlider.spans[0]) && ($.inArray(fixedSpans[i],rangeSlider.spans) == -1))
				rangeSlider.spans.push(fixedSpans[i]);
		}

		//and sort again to fit the fixed spans in
		rangeSlider.spans.sort(function(a,b){return a-b;});
		
		if (rangeSlider.spans.length > 0){
			//create empty hash map (span -> DataObjects)
			$(rangeSlider.spans).each(function(){
				var emptyObjectArray = [];
				$(rangeSlider.datasets).each(function(){
					emptyObjectArray.push([]);
				});
				rangeSlider.spanHash.push(emptyObjectArray);
			});

			//build hash map (span -> DataObjects)
			var datasetIndex = 0;
			$(rangeSlider.datasets).each(function(){
				$(this.objects).each(function(){
					var dataObject = this;
					var span;
					if (dataObject.isTemporal){
						//smallest span = 1ms
						span = 1000;
					} else if (dataObject.isFuzzyTemporal){
						span = dataObject.TimeSpanEnd - dataObject.TimeSpanBegin;
					}
					
					if (typeof span !== "undefined"){
						var spanIndex = rangeSlider.spans.indexOf(span);
						//has to be in array, so no check for -1
						rangeSlider.spanHash[spanIndex][datasetIndex].push(dataObject);
					}
				});
				datasetIndex++;
			});
			
			$(rangeSlider.sliderDiv).slider({
				min:0,
				max:rangeSlider.spans.length-1,
				step:1,
				value:0
			});
			
			var onSlideFunction = function( event, ui ){
				//redraw span "name"
				var handlePosition = ui.value;
				$(rangeSlider.sliderValue).empty();
				$(rangeSlider.sliderValue).append(moment.duration(rangeSlider.spans[handlePosition]).humanize());
				var shownDatasets = rangeSlider.spanHash[0];
				for (var i = 1; i < handlePosition; i++){
					shownDatasets = GeoTemConfig.mergeObjects(shownDatasets,rangeSlider.spanHash[i]);
				}
				var hiddenDatasets = [];
				$(rangeSlider.datasets).each(function(){
					hiddenDatasets.push([]);
				});
				for (var i = handlePosition+1; i < rangeSlider.spanHash.length; i++){
					hiddenDatasets = GeoTemConfig.mergeObjects(hiddenDatasets,rangeSlider.spanHash[i]);
				}
				//redraw range plot
				rangeSlider.rangeBars.drawRangeBarChart(rangeSlider.overallMin,rangeSlider.overallMax,shownDatasets,rangeSlider.spans[handlePosition]);
				//redraw pie charts
				rangeSlider.rangeBars.drawRangePieChart(shownDatasets,hiddenDatasets);
			};
			
			$(rangeSlider.sliderDiv).on( "slide", onSlideFunction);
			
			onSlideFunction({},{value:0});
		}
	},
			
	drawRangePieChart : function(shownDatasets,hiddenDatasets) {
		var rangeSlider = this;

		var parentDiv = rangeSlider.pieChartDiv;
		rangeSlider.deletePieCharts();
		var datasetIndex = 0;
		$(rangeSlider.datasets).each(function(){
			var div = document.createElement("div");
			$(parentDiv).append(div);
			$(div).height($(parentDiv).height()/rangeSlider.datasets.length);

			rangeSlider.pieCharts.push(new FuzzyTimelineRangePiechart(rangeSlider.parent,div,datasetIndex,shownDatasets,hiddenDatasets));
			datasetIndex++;
		});
	},
	
	deletePieCharts : function(){
		var rangeSlider = this;
		$(rangeSlider.pieChartDiv).empty();
		for (var piechart in rangeSlider.pieCharts){
			delete piechart;
		}
		rangeSlider.pieCharts = [];
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
