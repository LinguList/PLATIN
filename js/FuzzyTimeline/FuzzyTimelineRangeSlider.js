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
	$(this.sliderParentDiv).append("Start of timeline:");
	$(this.sliderParentDiv).append(this.rangeStart);
	this.rangeDropdown = document.createElement("select");
	$(this.sliderParentDiv).append("Time slice width:");
	$(this.sliderParentDiv).append(this.rangeDropdown);
	
	this.pieChartDiv = this.parent.gui.rangePiechartDiv;
}

FuzzyTimelineRangeSlider.prototype = {

	initialize : function(datasets) {
		var rangeSlider = this;
		rangeSlider.datasets = datasets;

		//reset values
		rangeSlider.spans = [];
		rangeSlider.spanHash = [];

		//find smallest (most accurate) time-span
		var smallestSpan;
		$(this.datasets).each(function(){
			$(this.objects).each(function(){
				var dataObject = this;
				var span;
				if (dataObject.isTemporal){
					smallestSpan = moment.duration(1,'milliseconds');
				} else if (dataObject.isFuzzyTemporal){
					span = moment.duration(dataObject.TimeSpanEnd-dataObject.TimeSpanBegin);
					if ( (typeof smallestSpan === 'undefined') || (span < smallestSpan))
						smallestSpan = span;
				}
			});
			if ((typeof smallestSpan !== 'undefined') && (smallestSpan.asMilliseconds() === 1))
				return false;
		});
		
		if (typeof smallestSpan === 'undefined')
			return;

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
			moment.duration(2, 'weeks'),
			moment.duration(1, 'months'),
			moment.duration(2, 'months'),
			moment.duration(3, 'months'),
			moment.duration(6, 'months'),
			moment.duration(1, 'years'),
			moment.duration(5, 'years'),
			moment.duration(10, 'years'),
			moment.duration(20, 'years'),
			moment.duration(25, 'years'),
			moment.duration(50, 'years'),
			moment.duration(100, 'years'),
			moment.duration(200, 'years'),
			moment.duration(250, 'years'),
			moment.duration(500, 'years'),
			moment.duration(1000, 'years'),
			moment.duration(2000, 'years'),
			moment.duration(2500, 'years'),
			moment.duration(5000, 'years'),
			moment.duration(10000, 'years'),
			];
		
		//only add spans that are not too small for the data
		for (var i = 0; i < fixedSpans.length; i++){
			if (	(fixedSpans[i].asMilliseconds() > (smallestSpan.asMilliseconds() * 0.5)) &&
					((rangeSlider.parent.overallMax-rangeSlider.parent.overallMin)/fixedSpans[i]<rangeSlider.options.maxBars))
				rangeSlider.spans.push(fixedSpans[i]);
		}
		
		if (rangeSlider.spans.length > 0){
			$(rangeSlider.rangeDropdown).empty();
			
			$(rangeSlider.spans).each(function(){
				var duration = this;
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
				
				rangeSlider.drawRangePieChart(shownDatasets,hiddenDatasets);
				
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
