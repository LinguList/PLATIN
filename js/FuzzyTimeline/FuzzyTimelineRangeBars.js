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
	
	this.datasets;
	
	this.hiddenDatasetsPlot;
	this.shownDatasetsPlot;
	this.combinedDatasetsPlot;
	this.yValMin;
	this.yValMax;
	
	this.rangeDiv = this.parent.gui.rangeTimelineDiv;
	this.plotDiv = document.createElement("div");
	$(this.rangeDiv).append(this.plotDiv);
	$(this.plotDiv).width("100%");
	$(this.plotDiv).height("100%");

	this.spanWidth;
	this.tickSpans;
	this.plot;
}

FuzzyTimelineRangeBars.prototype = {

	initialize : function(datasets) {
		var rangeBar = this;
		
		rangeBar.datasets = datasets;
	},
	
	createPlot : function(datasets, tickCount) {
		var rangeBar = this;
		var plots = [];
		
		$(datasets).each(function(){
			var chartDataCounter = [];
			
			for (var i = 0; i < tickCount; i++){
				chartDataCounter[i] = [];
				chartDataCounter[i][0]=i;
				chartDataCounter[i][1]=0;
			}
			//check if we got "real" datasets, or just array of objects
			var datasetObjects = this;
			if (typeof this.objects !== "undefined")
				datasetObjects = this.objects;
			$(datasetObjects).each(function(){
				var ticks = rangeBar.parent.getTicks(this, rangeBar.spanWidth);
				if (typeof ticks !== "undefined"){
					var exactTickCount = 
						ticks.firstTickPercentage+
						ticks.lastTickPercentage+
						(ticks.lastTick-ticks.firstTick-1);
					for (var i = ticks.firstTick; i <= ticks.lastTick; i++){
						var weight = 0;
						if (i == ticks.firstTick)
							weight = this.weight * ticks.firstTickPercentage/exactTickCount;
						else if (i == ticks.lastTick)
							weight = this.weight * ticks.lastTickPercentage/exactTickCount;
						else
							weight = this.weight * 1/exactTickCount;
						
						chartDataCounter[i][1] += weight;
					}
				}
			});
			
			plots.push(chartDataCounter);
		});
		
		return plots;
	},
	
	showPlotByType : function(type){
		var rangeBar = this;
		if (type === 'shown'){
			rangeBar.showPlot(rangeBar.shownDatasetsPlot);
		} else if (type === 'hidden'){
			rangeBar.showPlot(rangeBar.hiddenDatasetsPlot);
		} else if (type === 'combined'){
			rangeBar.showPlot(rangeBar.combinedDatasetsPlot);
		}
	},
	
	showPlot : function(plots){
		var rangeBar = this;
		var tickCount = rangeBar.tickSpans.length-1;
		var ticks = [];
		
		var axisFormatString = "YYYY";
		if (rangeBar.spanWidth<60*1000){
			axisFormatString = "YYYY/MM/DD HH:mm:ss";
		} else if (rangeBar.spanWidth<60*60*1000) {
			axisFormatString = "YYYY/MM/DD HH:mm";
		} else if (rangeBar.spanWidth<24*60*60*1000){
			axisFormatString = "YYYY/MM/DD HH";
		} else if (rangeBar.spanWidth<31*24*60*60*1000){
			axisFormatString = "YYYY/MM/DD";
		} else if (rangeBar.spanWidth<12*31*24*60*60*1000){
			axisFormatString = "YYYY/MM";
		}
		
		for (var i = 0; i < tickCount; i++){
			ticks[i] = [i,rangeBar.tickSpans[i].format(axisFormatString)];
		}
		
		var options = {
				series:{
	                bars:{show: true}
	            },
				grid: {
		            hoverable: true,
		            clickable: true
		        },
		        xaxis: {          
		        	  ticks: ticks
		        },
		        yaxis: {
		        	min : rangeBar.yValMin,
		        	max : rangeBar.yValMax
		        },
		        tooltip: true,
		        tooltipOpts: {
		            content: function(xval, yval){
		            	highlightString =	rangeBar.tickSpans[xval].format(axisFormatString) + " - " +
		            						rangeBar.tickSpans[xval+1].format(axisFormatString) + " : ";
		            	//(max.)2 Nachkomma-Stellen von y-Wert anzeigen
		            	highlightString +=	Math.round(yval*100)/100; 

		        		return highlightString;
		            }
		        },
		        selection: { 
		        	mode: "x"
		        }
			};
		$(rangeBar.plotDiv).unbind();		
		rangeBar.plot = $.plot($(rangeBar.plotDiv), plots, options);
	},
	
	drawRangeBarChart : function(shownDatasets, hiddenDatasets, spanWidth){
		var rangeBar = this;
		rangeBar.spanWidth = spanWidth; 
		rangeBar.tickSpans = rangeBar.parent.getSpanArray(rangeBar.spanWidth);
		//-1 because last span is always empty (only there to have the ending date)
		var tickCount = rangeBar.tickSpans.length-1;
		
		if (tickCount > 100){
			tickCount = 100;
			rangeBar.spanWidth = (rangeBar.parent.overallMax-rangeBar.parent.overallMin)/tickCount;
			rangeBar.tickSpans = rangeBar.parent.getSpanArray(rangeBar.spanWidth);
			tickCount = rangeBar.tickSpans.length-1;
		}
		
		rangeBar.yValMin = 0;
		rangeBar.yValMax = 0;
		
		rangeBar.shownDatasetsPlot = rangeBar.createPlot(shownDatasets, tickCount, rangeBar.spanWidth);
		rangeBar.hiddenDatasetsPlot = rangeBar.createPlot(hiddenDatasets, tickCount, spanWidth);
		
		rangeBar.combinedDatasetsPlot = [];
		for (var i = 0; i < rangeBar.hiddenDatasetsPlot.length; i++){
			var singlePlot = [];
			for (var j = 0; j < rangeBar.hiddenDatasetsPlot[i].length; j++){
				var hiddenVal = rangeBar.hiddenDatasetsPlot[i][j][1];
				var shownVal = rangeBar.shownDatasetsPlot[i][j][1];
				var combinedVal = hiddenVal + shownVal;
				
				if (hiddenVal < rangeBar.yValMin)
					rangeBar.yValMin = hiddenVal;
				if (hiddenVal > rangeBar.yValMax)
					rangeBar.yValMax = hiddenVal;
				if (shownVal < rangeBar.yValMin)
					rangeBar.yValMin = shownVal;
				if (shownVal > rangeBar.yValMax)
					rangeBar.yValMax = shownVal;
				if (combinedVal < rangeBar.yValMin)
					rangeBar.yValMin = combinedVal;
				if (combinedVal > rangeBar.yValMax)
					rangeBar.yValMax = combinedVal;
				
				singlePlot[j] = [j, combinedVal];
			}
			rangeBar.combinedDatasetsPlot.push(singlePlot);
		}
		
		rangeBar.showPlotByType("combined");
	},
	
	highlightChanged : function(objects) {
		if( !GeoTemConfig.highlightEvents ){
			return;
		}
		if ( (typeof objects === "undefined") || (objects.length == 0) ){
			return;
		}
	},

	selectionChanged : function(selection) {
		if( !GeoTemConfig.selectionEvents ){
			return;
		}
		var objects = selection.objects;
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
