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
	//contains all data
	this.datasetsPlot;
	this.datasetsHash;
	this.highlightedDatasetsPlot;
	this.yValMin;
	this.yValMax;
	this.displayType;
	//contains selected data
	this.selected = [];
	//contains the last selected "date"
	this.highlighted;
	
	this.parent = parent;
	this.div = div;
	this.options = parent.options;
	this.plot;
	this.maxTickCount = this.options.maxDensityTicks;
	
	this.datasets;
}

FuzzyTimelineDensity.prototype = {

	initialize : function(datasets) {
		var density = this;
			
		density.datasets = datasets;
		density.selected = [];
	},
	
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
		var objectHashes = [];
		$(datasets).each(function(){
			var chartDataCounter = new Object();
			var objectHash = new Object();

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
						//calculate the weight for each span, that the object overlaps
						if (density.parent.options.timelineMode == 'fuzzy'){
							//in fuzzy mode, each span gets just a fraction of the complete weight
							if (i == ticks.firstTick)
								weight = this.weight * ticks.firstTickPercentage/exactTickCount;
							else if (i == ticks.lastTick)
								weight = this.weight * ticks.lastTickPercentage/exactTickCount;
							else
								weight = this.weight * 1/exactTickCount;
						} else if (density.parent.options.timelineMode == 'stacking'){
							//in stacking mode each span gets the same amount.
							//(besides first and last..)
							if (i == ticks.firstTick)
								weight = this.weight * ticks.firstTickPercentage;
							else if (i == ticks.lastTick)
								weight = this.weight * ticks.lastTickPercentage;
							else
								weight = this.weight;
							
							weight = this.weight;
						}
						
						chartDataCounter[i] += weight;
						//add this object to the hash
						if (typeof objectHash[i] === "undefined")
							objectHash[i] = [];
						objectHash[i].push(this);
					}
				}
			});
			
			var udChartData = density.createPlot(chartDataCounter);
			if (udChartData.length > 0)
				plots.push(udChartData);
			
			objectHashes.push(objectHash);			
		});
		
		return {plots:plots, hashs:objectHashes};
	},
	
	showPlot : function() {
		var density = this;
		var plot = density.datasetsPlot;
		var highlight_select_plot = $.merge([],plot);
		
		//see if there are selected/highlighted values
		if (density.highlightedDatasetsPlot instanceof Array){
			//check if plot is some other - external - graph
			if (plot === density.datasetsPlot)
				highlight_select_plot = $.merge(highlight_select_plot,density.highlightedDatasetsPlot);
		}
		
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
		
		var highlight_select_plot_colors = [];		
		var i = 0;
		$(highlight_select_plot).each(function(){
			var color;
			if (i < GeoTemConfig.datasets.length){
				var datasetColors = GeoTemConfig.getColor(i);
				if (highlight_select_plot.length>GeoTemConfig.datasets.length)
					color = "rgb("+datasetColors.r0+","+datasetColors.g0+","+datasetColors.b0+")";
				else 
					color = "rgb("+datasetColors.r1+","+datasetColors.g1+","+datasetColors.b1+")";
			} else {
				var datasetColors = GeoTemConfig.getColor(i-GeoTemConfig.datasets.length);
				color = "rgb("+datasetColors.r1+","+datasetColors.g1+","+datasetColors.b1+")";
			}			
			
			highlight_select_plot_colors.push({
				color : color,
				data : this
			});
			i++;
		});
		
		density.plot = $.plot($(density.div), highlight_select_plot_colors, options);
		density.parent.drawHandles();
		
		$(density.div).unbind("plothover");
	    $(density.div).bind("plothover", function (event, pos, item) {
	    	var hoverPoint;
	    	//TODO: this could be wanted (if negative weight is used)
	        if ((item)&&(item.datapoint[1] != 0)) {
	        	//at begin and end of plot there are added 0 points
	        	hoverPoint = item.dataIndex-1;
	        }
	        //remember last point, so that we don't redraw the current state
	        //that "hoverPoint" may be undefined is on purpose
	    	if (density.highlighted !== hoverPoint){
    			density.highlighted = hoverPoint;
	        	density.triggerHighlight(hoverPoint);
	        }
	    });

	    //this var prevents the execution of the plotclick event after a select event 
	    density.wasSelection = false;
		$(density.div).unbind("plotclick");
	    $(density.div).bind("plotclick", function (event, pos, item) {
	    	if (density.wasSelection)
	    		density.wasSelection = false;
	    	else {
	        	//remove selection handles (if there were any)
	        	density.parent.clearHandles();
		    	
		    	var selectPoint;
		        //that date may be undefined is on purpose	    	
		    	//TODO: ==0 could be wanted (if negative weight is used)
		        if ((item)&&(item.datapoint[1] != 0)) {
		        	//at begin and end of plot there are added 0 points
		        	selectPoint = item.dataIndex-1;
		        }
	        	density.triggerSelection(selectPoint);
	        }
	    });
	    
	    $(density.div).unbind("plotselected");
	    $(density.div).bind("plotselected", function(event, ranges) {
	    	var spanArray = density.parent.getSpanArray(density.singleTickWidth);
	    	var startSpan, endSpan;
	    	for (var i = 0; i < spanArray.length-1; i++){
	    		if ((typeof startSpan === "undefined") && (ranges.xaxis.from <= spanArray[i+1]))
	    			startSpan = i;
	    		if ((typeof endSpan === "undefined") && (ranges.xaxis.to <= spanArray[i+1]))
	    			endSpan = i;
	    	}
	    	
	    	if ((typeof startSpan !== "undefined") && (typeof endSpan !== "undefined")){
	        	density.triggerSelection(startSpan, endSpan);
		    	density.wasSelection = true;

		    	density.parent.clearHandles();
		    	var xaxis = density.plot.getAxes().xaxis;
		    	var x1 = xaxis.p2c(ranges.xaxis.from) + density.plot.offset().left;
		    	var x2 = xaxis.p2c(ranges.xaxis.to) + density.plot.offset().left;
		    	density.parent.addHandle(x1,x2);
	    	}
	    });
	},
	
	selectByX : function(x1, x2){
		density = this;
		var xaxis = density.plot.getAxes().xaxis;
    	var from = xaxis.c2p(x1-density.plot.offset().left);
    	var to = xaxis.c2p(x2-density.plot.offset().left);

    	var spanArray = density.parent.getSpanArray(density.singleTickWidth);
    	var startSpan, endSpan;
    	for (var i = 0; i < spanArray.length-1; i++){
    		if ((typeof startSpan === "undefined") && (from <= spanArray[i+1]))
    			startSpan = i;
    		if ((typeof endSpan === "undefined") && (to <= spanArray[i+1]))
    			endSpan = i;
    	}
    	
    	if ((typeof startSpan !== "undefined") && (typeof endSpan !== "undefined")){
    		density.triggerSelection(startSpan, endSpan);
    	}
	},
	
	drawDensityPlot : function(datasets, tickWidth) {
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
			if (density.singleTickWidth === 0)
				density.singleTickWidth = 1;
		}
		
		var hashAndPlot = density.createUDData(datasets);
		
		density.datasetsPlot = hashAndPlot.plots;
		density.datasetsHash = hashAndPlot.hashs;

		density.yValMin = 0;
		density.yValMax = 0;
		
		density.combinedDatasetsPlot = [];
		for (var i = 0; i < density.datasetsPlot.length; i++){
			for (var j = 0; j < density.datasetsPlot[i].length; j++){
				var val = density.datasetsPlot[i][j][1];
				
				if (val < density.yValMin)
					density.yValMin = val;
				if (val > density.yValMax)
					density.yValMax = val;				
			}
		}
		
	    density.showPlot();
	},
	
	triggerHighlight : function(hoverPoint) {
		var density = this;
		var highlightedObjects = [];
		

		if (typeof hoverPoint !== "undefined") {
			$(density.datasetsHash).each(function(){
				if (typeof this[hoverPoint] !== "undefined")
					highlightedObjects.push(this[hoverPoint]);
				else
					highlightedObjects.push([]);
			});
		} else {
			for (var i = 0; i < GeoTemConfig.datasets.length; i++)
				highlightedObjects.push([]);
		}
		this.parent.core.triggerHighlight(highlightedObjects);
	},

	triggerSelection : function(startPoint, endPoint) {
		var density = this;
		var selection;
		if (typeof startPoint !== "undefined") {
			if (typeof endPoint === "undefined")
				endPoint = startPoint;
			density.selected = [];
			$(density.datasetsHash).each(function(){
				var objects = [];
				for (var i = startPoint; i <= endPoint; i++){
					$(this[i]).each(function(){
						if ($.inArray(this, objects) == -1){
							objects.push(this);
						}
					});
				}				
				density.selected.push(objects);
			});

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
	
	highlightChanged : function(objects) {
		if( !GeoTemConfig.highlightEvents ){
			return;
		}
		var density = this;
		var emptyHighlight = true;
		var selected_highlighted = GeoTemConfig.mergeObjects(objects,density.selected);
		$(selected_highlighted).each(function(){
			if ((this instanceof Array) && (this.length > 0)){
				emptyHighlight = false;
				return false;
			}
		});
		if (emptyHighlight){
			density.highlightedDatasetsPlot = [];
		} else {
			density.highlightedDatasetsPlot = density.createUDData(selected_highlighted).plots;
		}
		density.showPlot();
	},
	
	selectionChanged : function(objects) {
		if( !GeoTemConfig.selectionEvents ){
			return;
		}
		var density = this;
		density.selected = objects;
		density.highlightChanged([]);
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
