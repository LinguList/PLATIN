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
function FuzzyTimelineDensity(parent,div) {

	this.index;
	this.fuzzyTimeline = this;
	this.overallMin;
	this.overallMax;
	this.singleTickWidth;
	//TODO: experiment with number of ticks, 500 seems to be ok for now
	this.maxTickCount = 250;
	//contains all data
	this.plots = [];
	//contains selected data
	this.selected = [];
	//contains the last selected "date"
	this.highlighted;
	
	this.parent = parent;
	this.div = div;
	this.options = parent.options;
	
	this.datasets;
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

	getObjects : function(date) {
		var density = this;
		var searchedTick = Math.floor((date-this.overallMin)/this.singleTickWidth);
		
		var datasets = [];		
		$(density.datasets).each(function(){
			var objects = [];
			//check if we got "real" datasets, or just array of objects
			var datasetObjects = this;
			if (typeof this.objects !== "undefined")
				datasetObjects = this.objects;
			$(datasetObjects).each(function(){
				var ticks = density.getTicks(this);
				if (typeof ticks !== "undefined"){
					if ((ticks.firstTick <= searchedTick) && (ticks.lastTick >= searchedTick))
						objects.push(this);
				}
			});
			datasets.push(objects);
		});

		return(datasets);
	},
	
	initialize : function(overallMin, overallMax, datasets, tickWidth) {
		var density = this;
		density.datasets = datasets;
		density.overallMin = overallMin;
		density.overallMax = overallMax;

		this.plots = [];
		//calculate tick width (will be in ms)
		delete density.tickCount;
		delete density.singleTickWidth;
		if (typeof tickWidth !== "undefined"){
			density.singleTickWidth = tickWidth;
			density.tickCount = Math.ceil((density.overallMax-density.overallMin)/tickWidth);
		} 
		if ((typeof density.tickCount === "undefined") || (density.tickCount > density.maxTickCount)){
			density.tickCount = density.maxTickCount;
			density.singleTickWidth = (density.overallMax-density.overallMin)/density.tickCount;
		}

		//Gleichverteilung	
		$(density.datasets).each(function(){
			var chartDataCounter = new Object();

			for (var i = 0; i < density.tickCount; i++){
				chartDataCounter[i]=0;
			}
			//check if we got "real" datasets, or just array of objects
			var datasetObjects = this;
			if (typeof this.objects !== "undefined")
				datasetObjects = this.objects;
			$(datasetObjects).each(function(){
				var ticks = density.getTicks(this);
				if (typeof ticks !== "undefined"){
					var weight = this.weight/(ticks.lastTick-ticks.firstTick+1);
					for (var i = ticks.firstTick; i <= ticks.lastTick; i++){
						chartDataCounter[i] += weight;
					}
				}
			});
			
			var udChartData = createPlot(chartDataCounter,density.overallMin,density.singleTickWidth);
			if (udChartData.length > 0)
				density.plots.push(udChartData);
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
		
    	var singleTickCenter = density.singleTickWidth/2;
    	var formatString = "YYYY";
		if (density.singleTickWidth<1000)
			formatString = "YYYY/MM/DD HH:mm:ss";
		else if (density.singleTickWidth<60*1000)
			formatString = "YYYY/MM/DD HH:mm";
		else if (density.singleTickWidth<60*60*1000)
			formatString = "YYYY/MM/DD HH";
		else if (density.singleTickWidth<24*60*60*1000)
			formatString = "YYYY/MM/DD";
		else if (density.singleTickWidth<31*24*60*60*1000)
			formatString = "YYYY/MM";
		
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
		            content: function(xval, yval){
		            	highlightString =	moment(xval-singleTickCenter).format(formatString) + " - " +
		            						moment(xval+singleTickCenter).format(formatString) + " : " + yval; 

		        		return highlightString;
		            }
		        },
		        selection: { 
		        	mode: "x"
		        },
				xaxis: {
					mode: "time",
					timeformat:timeformat
				}
			};
		
		density.plot = $.plot($(density.div), density.plots, options);
		
	    $(density.div).bind("plothover", function (event, pos, item) {
	    	var date;
	        if (item) {
				//contains the x-value (date)
	        	date = item.datapoint[0];
	        }
	        //remember last date, so that we don't redraw the current state
	    	if (density.highlighted !== date){
	        	density.highlighted = date;
	        	density.triggerHighlight(date);
	        }
	    });
	},
		
	triggerHighlight : function(date) {
		var highlightedObjects = [];
		
		if (typeof date !== "undefined") {
			highlightedObjects = this.getObjects(date);
		} else {
			for (var i = 0; i < GeoTemConfig.datasets.length; i++)
				highlightedObjects.push([]);
		}
		
		this.parent.core.triggerHighlight(highlightedObjects);
	},

	triggerSelection : function(columnElement) {

	},
	
	clearHighlighted : function(objects) {
		var density = this;
		if (density.plot instanceof Object)
			density.plot.unhighlight();
	},
	
	drawHighlighted : function(objects) {
		var density = this;
		var datasetIndex = 0;
		$(objects).each(function(){
			var dataset = this;
			$(dataset).each(function(){
				var dataObject = this;
				var ticks = density.getTicks(dataObject);
				if (typeof ticks !== "undefined"){
					for (var i = ticks.firstTick; i <= ticks.lastTick; i++){
						density.plot.highlight(datasetIndex,i);
					}
				}
			});
			datasetIndex++;
		});
	},
	
	highlightChanged : function(objects) {
		var density = this;
		if (density.plot instanceof Object){
			density.clearHighlighted();
			density.drawHighlighted(density.selected);
			density.drawHighlighted(objects);
		}
	},
	
	selectionChanged : function(objects) {
		var density = this;
		density.clearHighlighted();
		density.selected = objects;
		density.drawHighlighted(density.selected);
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
