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
	this.singleTickWidth;
	this.singleTickCenter = function(){return this.singleTickWidth/2;};
	//TODO: experiment with number of ticks, 500 seems to be ok for now
	this.maxTickCount = 250;
	//contains all data
	this.shownDatasetsPlot;
	this.hiddenDatasetsPlot;
	this.combinedDatasetsPlot;
	//contains selected data
	this.selected = [];
	//contains the last selected "date"
	this.highlighted;
	
	this.parent = parent;
	this.div = div;
	this.options = parent.options;
	this.plot;
	
	this.datasets;
}

FuzzyTimelineDensity.prototype = {

	createPlot : function(data){
		density = this;
		var chartData = [];

		chartData.push([density.parent.overallMin,0]);
		$.each(data, function(name,val){
			var tickCenterTime = density.parent.overallMin+name*density.singleTickWidth+density.singleTickCenter();
			var dateObj = moment(tickCenterTime);
			chartData.push([dateObj,val]);
		});
		var maxPlotedDate = chartData[chartData.length-1][0];
		if (density.parent.overallMax > maxPlotedDate){
			chartData.push([density.parent.overallMax,0]);
		} else {
			chartData.push([maxPlotedDate+1,0]);
		}
		

		
		return chartData;
	},
	
	//uniform distribution (UD)	
	createUDData : function(datasets) {
		var density = this;
		var plots = [];
		$(datasets).each(function(){
			var chartDataCounter = new Object();

			for (var i = 0; i < density.tickCount; i++){
				chartDataCounter[i]=0;
			}
			//check if we got "real" datasets, or just array of objects
			var datasetObjects = this;
			if (typeof this.objects !== "undefined")
				datasetObjects = this.objects;
			$(datasetObjects).each(function(){
				var ticks = density.parent.getTicks(this, density.singleTickWidth);
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
						
						chartDataCounter[i] += weight;
					}
				}
			});
			
			var udChartData = density.createPlot(chartDataCounter);
			if (udChartData.length > 0)
				plots.push(udChartData);
		});
		
		return plots;
	},
	
	showPlotByType : function(type){
		var density = this;
		if (type === 'shown'){
			density.showPlot(density.shownDatasetsPlot);
		} else if (type === 'hidden'){
			density.showPlot(density.hiddenDatasetsPlot);
		} else if (type === 'combined'){
			density.showPlot(density.combinedDatasetsPlot);
		}
	},
	
	showPlot : function(plot) {
		var density = this;
		
		var axisFormatString = "%Y";
		var tooltipFormatString = "YYYY";
		if (density.singleTickWidth<60*1000){
			axisFormatString = "%Y/%m/%d %H:%M:%S";
			tooltipFormatString = "YYYY/MM/DD HH:mm:ss";
		} else if (density.singleTickWidth<60*60*1000) {
			axisFormatString = "%Y/%m/%d %H:%M";
			tooltipFormatString = "YYYY/MM/DD HH:mm";
		} else if (density.singleTickWidth<24*60*60*1000){
			axisFormatString = "%Y/%m/%d %H";
			tooltipFormatString = "YYYY/MM/DD HH";
		} else if (density.singleTickWidth<31*24*60*60*1000){
			axisFormatString = "%Y/%m/%d";
			tooltipFormatString = "YYYY/MM/DD";
		} else if (density.singleTickWidth<12*31*24*60*60*1000){
			axisFormatString = "%Y/%m";
			tooltipFormatString = "YYYY/MM";
		}
		
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
		            	highlightString =	moment(xval-density.singleTickCenter()).format(tooltipFormatString) + " - " +
		            						moment(xval+density.singleTickCenter()).format(tooltipFormatString) + " : ";
		            	//(max.)2 Nachkomma-Stellen von y-Wert anzeigen
		            	highlightString +=	Math.round(yval*100)/100; 

		        		return highlightString;
		            }
		        },
		        selection: { 
		        	mode: "x"
		        },
				xaxis: {
					mode: "time",
					timeformat:axisFormatString
				},
		        yaxis: {
		        	min : density.yValMin,
		        	max : density.yValMax
		        },
			};
		
		density.plot = $.plot($(density.div), plot, options);
		
		$(density.div).unbind("plothover");
	    $(density.div).bind("plothover", function (event, pos, item) {
	    	var date;
	        if (item) {
				//contains the x-value (date)
	        	date = item.datapoint[0];
	        }
	        //remember last date, so that we don't redraw the current state
	        //that date may be undefined is on purpose
	    	if (density.highlighted !== date){
	        	density.highlighted = date;
	        	density.triggerHighlight(date);
	        }
	    });
	    
		$(density.div).unbind("plotclick");
	    $(density.div).bind("plotclick", function (event, pos, item) {
	    	var date;
	        //that date may be undefined is on purpose	    	
	        if (item) {
	        	date = item.datapoint[0];
	        }  	
        	density.triggerSelection(date);
	    });
	},
	
	initialize : function(shownDatasets, hiddenDatasets, tickWidth) {
		var density = this;

		//calculate tick width (will be in ms)
		delete density.tickCount;
		delete density.singleTickWidth;
		if (typeof tickWidth !== "undefined"){
			density.singleTickWidth = tickWidth;
			density.tickCount = Math.ceil((density.parent.overallMax-density.parent.overallMin)/tickWidth);
		} 
		if ((typeof density.tickCount === "undefined") || (density.tickCount > density.maxTickCount)){
			density.tickCount = density.maxTickCount;
			density.singleTickWidth = (density.parent.overallMax-density.parent.overallMin)/density.tickCount;
		}
		
		density.shownDatasetsPlot = density.createUDData(shownDatasets);
		density.hiddenDatasetsPlot = density.createUDData(hiddenDatasets);

		density.yValMin = 0;
		density.yValMax = 0;
		
		density.combinedDatasetsPlot = [];
		for (var i = 0; i < density.hiddenDatasetsPlot.length; i++){
			var singlePlot = [];
			for (var j = 0; j < density.hiddenDatasetsPlot[i].length; j++){
				var hiddenVal = density.hiddenDatasetsPlot[i][j][1];
				var shownVal = density.shownDatasetsPlot[i][j][1];
				var combinedVal = hiddenVal + shownVal;
				
				if (hiddenVal < density.yValMin)
					density.yValMin = hiddenVal;
				if (hiddenVal > density.yValMax)
					density.yValMax = hiddenVal;
				if (shownVal < density.yValMin)
					density.yValMin = shownVal;
				if (shownVal > density.yValMax)
					density.yValMax = shownVal;
				if (combinedVal < density.yValMin)
					density.yValMin = combinedVal;
				if (combinedVal > density.yValMax)
					density.yValMax = combinedVal;
				
				singlePlot[j] = [j, combinedVal];				
			}
			density.combinedDatasetsPlot.push(singlePlot);
		}
		
	    density.showPlotByType("combined");
	},
		
	triggerHighlight : function(date) {
		var highlightedObjects = [];
		
		if (typeof date !== "undefined") {
			highlightedObjects = this.parent.getObjects(date);
		} else {
			for (var i = 0; i < GeoTemConfig.datasets.length; i++)
				highlightedObjects.push([]);
		}
		
		this.parent.core.triggerHighlight(highlightedObjects);
	},

	triggerSelection : function(date) {
		var density = this;
		var selection;
		if (typeof date !== "undefined") {
			density.selected = density.parent.getObjects(date);
			selection = new Selection(density.selected, density);
		} else {
			//empty selection
			density.selected = [];
			for (var i = 0; i < GeoTemConfig.datasets.length; i++)
				density.selected.push([]);
			selection = new Selection(density.selected);
		}
		
		this.parent.selectionChanged(selection);
		this.parent.core.triggerSelection(selection);
	},
	
	clearHighlighted : function() {
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
				var ticks = density.parent.getTicks(dataObject, density.singleTickWidth);
				if (typeof ticks !== "undefined"){
					for (var i = ticks.firstTick; i <= ticks.lastTick; i++){
						//the addition of "boundary points", that will always be zero,
						//inserts invalid points that have to be skipped
						//(see createPlot and the points for overallMin and overallMax)						
						density.plot.highlight(datasetIndex,i+1);
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