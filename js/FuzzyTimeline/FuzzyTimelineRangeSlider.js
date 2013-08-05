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
	
	this.datasets;
	
	this.sliderParentDiv = this.parent.gui.sliderDiv;
	this.rangeStart = document.createElement("select");
	$(this.sliderParentDiv).append(this.rangeStart);
	this.rangeDropdown = document.createElement("select");
	$(this.sliderParentDiv).append(this.rangeDropdown);
}

FuzzyTimelineRangeSlider.prototype = {

	initialize : function(datasets) {
		var rangeSlider = this;
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
					var span = moment.duration(dataObject.TimeSpanEnd-dataObject.TimeSpanBegin).asMilliseconds();
					if ($.inArray(span,rangeSlider.spans)==-1)
						rangeSlider.spans.push(span);
				} 
			});
		});
		//sort the spans
		rangeSlider.spans.sort(function(a,b){return a-b;});

		var fixedSpans = [
		    moment.duration(1, 'seconds').asMilliseconds(),
			moment.duration(1, 'minutes').asMilliseconds(),
			moment.duration(10, 'minutes').asMilliseconds(),
			moment.duration(15, 'minutes').asMilliseconds(),
			moment.duration(30, 'minutes').asMilliseconds(),
			moment.duration(1, 'hours').asMilliseconds(),
			moment.duration(5, 'hours').asMilliseconds(),
			moment.duration(10, 'hours').asMilliseconds(),
			moment.duration(12, 'hours').asMilliseconds(),
			moment.duration(1, 'days').asMilliseconds(),
			moment.duration(7, 'days').asMilliseconds(),
			moment.duration(1, 'weeks').asMilliseconds(),
			moment.duration(1, 'months').asMilliseconds(),
			moment.duration(3, 'months').asMilliseconds(),
			moment.duration(6, 'months').asMilliseconds(),
			moment.duration(1, 'years').asMilliseconds(),
			moment.duration(10, 'years').asMilliseconds(),
			moment.duration(100, 'years').asMilliseconds(),
			moment.duration(1000, 'years').asMilliseconds(),
		
		//add the fixed spans, that are longer than minimum span and not already contained
		for (var i = 0; i < fixedSpans.length; i++){
			if ((fixedSpans[i] > rangeSlider.spans[0]) && ($.inArray(fixedSpans[i],rangeSlider.spans) == -1))
				rangeSlider.spans.push(fixedSpans[i]);
		}

		//and sort again to fit the fixed spans in
		rangeSlider.spans.sort(function(a,b){return a-b;});
		
		if (rangeSlider.spans.length > 0){
			$(rangeSlider.rangeDropdown).empty();
			
			$(rangeSlider.spans).each(function(){
				var duration = moment.duration(Number(this));
				var humanizedSpan = "";
				if (duration < moment.duration(1,'second'))
					humanizedSpan = duration.milliseconds() + "ms";
				else if (duration < moment.duration(1,'minute'))
					humanizedSpan = duration.seconds() + "s";
				else if (duration < moment.duration(1,'hour'))
					humanizedSpan = duration.minutes() + "min";
				else if (duration < moment.duration(1,'day'))
					humanizedSpan = duration.hours() + "h";
				else if (duration < moment.duration(1,'month'))
					humanizedSpan = duration.days() + " days";
				else if (duration < moment.duration(1,'year'))
					humanizedSpan = duration.months() + " months";
				else 
					humanizedSpan = duration.years() + " years";
				$(rangeSlider.rangeDropdown).append("<option>"+humanizedSpan+"</option>");
			});

			$(rangeSlider.rangeDropdown).change(function( eventObject ){
				var handlePosition = rangeSlider.rangeDropdown.selectedIndex;
				var span = rangeSlider.spans[handlePosition];
				
				var shownDatasets = [];
				var hiddenDatasets = [];
				
				var datasetIndex = 0;
				$(rangeSlider.datasets).each(function(){
					var shownSingleDataset = [];
					var hiddenSingleDataset = [];
					$(this.objects).each(function(){
						var dataObject = this;
						var ticks = rangeSlider.parent.getTicks(dataObject, span);
						if (typeof ticks === "undefined") 
							return;
						if (ticks.firstTick == ticks.lastTick) {
							shownSingleDataset.push(dataObject);
						} else {
							hiddenSingleDataset.push(dataObject);
						}
					});
					shownDatasets.push(shownSingleDataset);
					hiddenDatasets.push(hiddenSingleDataset);
					datasetIndex++;
				});
			
				$(rangeSlider.sliderValue).empty();
				$(rangeSlider.sliderValue).append(moment.duration(span).humanize());
				
				rangeSlider.parent.slidePositionChanged(rangeSlider.spans[handlePosition],shownDatasets,hiddenDatasets);
			});
			
			$(rangeSlider.rangeDropdown).change();

			$(rangeSlider.rangeStart).empty();
			//TODO: add Months/Days/etc.
			var starts = [];
			var overallMin = rangeSlider.parent.overallMin;
			var last = moment(overallMin).year();
			starts.push(last);
			for (i = 1;;i++){
				var date = moment(overallMin).year();
				date = date/Math.pow(10,i);
				if (Math.abs(date)<1)
					break;
				date = Math.floor(date);
				date = date*Math.pow(10,i);
				if (date != last)
					starts.push(date);
				last = date;
			}
			$(starts).each(function(){
				$(rangeSlider.rangeStart).append("<option>"+this+"</option>");				
			});

			$(rangeSlider.rangeStart).change(function( eventObject ){
				var handlePosition = rangeSlider.rangeStart.selectedIndex;
				var start = starts[handlePosition];
				
				rangeSlider.parent.overallMin = moment().year(start);
				$(rangeSlider.rangeDropdown).change();
			});
			
			$(rangeSlider.rangerangeStart).change();
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
