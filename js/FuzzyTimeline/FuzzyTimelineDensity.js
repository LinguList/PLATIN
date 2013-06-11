/*
* FuzzyTimelineDensity.js
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
 * @class FuzzyTimelineDensity
 * Implementation for a fuzzy time-ranges density plot
 * @author Sebastian Kruse (skruse@mpiwg-berlin.mpg.de)
 *
 * @param {HTML object} parent div to append the FuzzyTimeline
 */
function FuzzyTimelineDensity(parent) {

	this.index;
	this.fuzzyTimeline = this;
	this.overallMin;
	this.overallMax;
	this.singleTickWidth;
	//TODO: experiment with number of ticks, 1000 seems to be ok for now
	this.tickCount = 1000;
	
	this.parent = parent;
	this.options = parent.options;
}

function createPlot(data,overallMin,singleTickWidth){
	var singleTickCenter = singleTickWidth/2;

	var chartData = [];

	$.each(data, function(name,val){
		var tickCenterTime = overallMin+name*singleTickWidth+singleTickCenter;
		var dateObj = moment(tickCenterTime);
		chartData.push([dateObj,val]);
	});
	
	return chartData;
}

FuzzyTimelineDensity.prototype = {
		
	getTicks : function(dataObject) {
		var datemin,datemax;
		if (dataObject.isTemporal){
			datemin = moment(dataObject.dates[0].date);
			datemax = datemin;
		} else if (dataObject.isFuzzyTemporal){
			datemin = dataObject.TimeSpanBegin;
			datemax = dataObject.TimeSpanEnd;
		} else{
			return;
		}
		
		var firstTick = Math.floor((datemin-this.overallMin)/this.singleTickWidth);
		var lastTick = Math.floor((datemax-this.overallMin)/this.singleTickWidth);
		
		return({firstTick:firstTick,lastTick:lastTick});
	},

	initialize : function(overallMin, overallMax) {
		var density = this;
		this.overallMin = overallMin;
		this.overallMax = overallMax;
		var fuzzyTimeline = this;

		var plots = [];
		//calculate tick width (will be in ms)
		density.singleTickWidth = (density.overallMax-density.overallMin)/density.tickCount;

		//Gleichverteilung	
		$(this.parent.datasets).each(function(){
			var chartDataCounter = new Object();

			for (var i = 0; i < density.tickCount; i++){
				chartDataCounter[i]=0;
			}
			$(this.objects).each(function(){
				var ticks = density.getTicks(this);
				if (typeof ticks !== "undefined"){
					//check whether dates are correctly sorted
					if (ticks.firstTick>ticks.lastTick){
						//dates are in the wrong order
						if (typeof console !== "undefined")
							console.error("Object " + this.name + " has wrong fuzzy dating (twisted start/end?).");
						return;
					}
					
					var weight = 1/(ticks.lastTick-ticks.firstTick+1);
					for (var i = ticks.firstTick; i <= ticks.lastTick; i++){
						chartDataCounter[i] += weight;
					}
				}
			});
			
			var udChartData = createPlot(chartDataCounter,density.overallMin,density.singleTickWidth);
			if (udChartData.length > 0)
				plots.push(udChartData);
		});
		
		var timeformat = "%Y";
		if (density.singleTickWidth<1000)
			timeformat = "%Y/%m/%d %H:%M:%S";
		else if (density.singleTickWidth<60*1000)
			timeformat = "%Y/%m/%d %H:%M";
		else if (density.singleTickWidth<60*60*1000)
			timeformat = "%Y/%m/%d %H";
		else if (density.singleTickWidth<24*60*60*1000)
			timeformat = "%Y/%m/%d";
		else if (density.singleTickWidth<31*24*60*60*1000)
			timeformat = "%Y/%m";
		
		var options = {
				series:{
	                lines:{show: true}
	            },
				grid: {
		            hoverable: true,
		            clickable: true
		        },
		        tooltip: true,
		        tooltipOpts: {
		            content: "%x : %y"
		        },
		        selection: { 
		        	mode: "x"
		        },
				xaxis: {
					mode: "time",
					timeformat:timeformat
				}
			};
		
		density.plot = $.plot($(density.parent.gui.densityDiv), plots, options);
	},
		
	triggerHighlight : function(columnElement) {

	},

	triggerSelection : function(columnElement) {

	},
	
	highlightChanged : function(objects) {
		var density = this;
		if (density.plot instanceof Object){
			density.plot.unhighlight();
			var datasetIndex = 0;
			$(objects).each(function(){
				var dataset = this;
				$(this).each(function(){
					var dataObject = this;
					var ticks = density.getTicks(dataObject);
					if (typeof ticks !== "undefined"){
						for (var i = ticks.firstTick; i <= ticks.lastTick; i++){
							density.plot.highlight(datasetIndex,i);
						}
					} else
						a = 1;
				});
				datasetIndex++;
			});
		}
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
