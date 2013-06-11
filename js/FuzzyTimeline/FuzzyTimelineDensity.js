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

	initialize : function(overallMin, overallMax) {
		var fuzzyTimeline = this;

		var plots = [];
		//calculate tick width (will be in ms)
		//TODO: experiment with number of ticks, 1000 seems to be ok for now
		var tickCount = 1000;
		var singleTickWidth = (overallMax-overallMin)/tickCount;

		//Gleichverteilung	
		$(this.parent.datasets).each(function(){
			var chartDataCounter = new Object();

			for (var i = 0; i < tickCount; i++){
				chartDataCounter[i]=0;
			}
			$(this.objects).each(function(){
				var datemin,datemax;
				if (this.isTemporal){
					datemin = moment(this.dates[0].date);
					datemax = datemin;
				} else if (this.isFuzzyTemporal){
					datemin = this.TimeSpanBegin;
					datemax = this.TimeSpanEnd;
				} else{
					return;
				}
				
				if ((datemin.isValid()) && (datemax.isValid())){
					var firstTick = Math.floor((datemin-overallMin)/singleTickWidth);
					var lastTick = Math.floor((datemax-overallMin)/singleTickWidth);
					
					//check whether dates are correctly sorted
					if (firstTick>lastTick){
						//dates are in the wrong order
						if (typeof console !== "undefined")
							console.error("Object " + this.name + " has wrong fuzzy dating (twisted start/end?).");
						return;
					}
					
					var weight = 1/(lastTick-firstTick+1);
					for (var i = firstTick; i <= lastTick; i++){
						chartDataCounter[i] += weight;
					}
				}
			});
			
			var udChartData = createPlot(chartDataCounter,overallMin,singleTickWidth);
			if (udChartData.length > 0)
				plots.push(udChartData);
		});
		
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
					mode: "time"
				}
			};
		
		var plot = $.plot($(this.parent.gui.densityDiv), plots, options);
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
