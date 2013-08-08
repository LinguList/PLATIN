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
	
	this.rangeDiv = this.parent.gui.rangeTimelineDiv;
	this.plotDiv = document.createElement("div");
	$(this.rangeDiv).append(this.plotDiv);
	$(this.plotDiv).width("100%");
	$(this.plotDiv).height("100%");

	this.pieChartDiv = this.parent.gui.rangePiechartDiv;

	this.plot;
	this.pieCharts = [];
}

FuzzyTimelineRangeBars.prototype = {

	initialize : function(datasets) {
		var rangeBar = this;
		
		rangeBar.datasets = datasets;

		rangeBar.deletePieCharts();
	},
	
	drawRangeBarChart : function(shownDatasets, spanWidth){
		var rangeBar = this;
		var tickSpans = rangeBar.parent.getSpanArray(spanWidth);
		//-1 because last span is always empty (only there to have the ending date)
		var tickCount = tickSpans.length-1;
		
		if (tickCount > 100){
			tickCount = 100;
			spanWidth = (rangeBar.parent.overallMax-rangeBar.parent.overallMin)/tickCount;
			tickSpans = rangeBar.parent.getSpanArray(spanWidth);
			tickCount = tickSpans.length-1;
		}
		
		var plots = [];
		var ticks = [];
		
		var axisFormatString = "YYYY";
		if (spanWidth<60*1000){
			axisFormatString = "YYYY/MM/DD HH:mm:ss";
		} else if (spanWidth<60*60*1000) {
			axisFormatString = "YYYY/MM/DD HH:mm";
		} else if (spanWidth<24*60*60*1000){
			axisFormatString = "YYYY/MM/DD HH";
		} else if (spanWidth<31*24*60*60*1000){
			axisFormatString = "YYYY/MM/DD";
		} else if (spanWidth<12*31*24*60*60*1000){
			axisFormatString = "YYYY/MM";
		}
		
		for (var i = 0; i < tickCount; i++){
			ticks[i] = [i,tickSpans[i].format(axisFormatString)];
		}
		
		$(shownDatasets).each(function(){
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
				var ticks = rangeBar.parent.getTicks(this, spanWidth);
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
		        tooltip: true,
		        tooltipOpts: {
		            content: function(xval, yval){
		            	highlightString =	tickSpans[xval].format(axisFormatString) + " - " +
		            						tickSpans[xval+1].format(axisFormatString) + " : ";
		            	//(max.)2 Nachkomma-Stellen von y-Wert anzeigen
		            	highlightString +=	Math.round(yval*100)/100; 

		        		return highlightString;
		            }
		        },
		        selection: { 
		        	mode: "x"
		        }
			};

		rangeBar.plot = $.plot($(rangeBar.plotDiv), plots, options);
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
