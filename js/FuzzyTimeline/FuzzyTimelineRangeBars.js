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
	//contains selected data
	this.selected = [];
	
	this.datasetsPlot;
	this.highlightedDatasetsPlot;
	this.yValMin;
	this.yValMax;
	this.displayType;
	
	this.plotDiv = this.parent.gui.plotDiv;

	this.spanWidth;
	this.tickSpans;
	this.plot;
}

FuzzyTimelineRangeBars.prototype = {

	initialize : function(datasets) {
		var rangeBar = this;
		
		rangeBar.datasets = datasets;
		rangeBar.selected = [];
	},
	
	createPlot : function(datasets) {
		var rangeBar = this;
		var plots = [];
		
		//-1 because last span is always empty (only there to have the ending date)
		var tickCount = rangeBar.tickSpans.length-1;
		
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
						//calculate the weight for each span, that the object overlaps
						if (rangeBar.parent.options.timelineMode == 'fuzzy'){
							//in fuzzy mode, each span gets just a fraction of the complete weight
							if (i == ticks.firstTick)
								weight = this.weight * ticks.firstTickPercentage/exactTickCount;
							else if (i == ticks.lastTick)
								weight = this.weight * ticks.lastTickPercentage/exactTickCount;
							else
								weight = this.weight * 1/exactTickCount;
						} else if (rangeBar.parent.options.timelineMode == 'stacking'){
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

						chartDataCounter[i][1] += weight;
					}
				}
			});
			
			plots.push(chartDataCounter);
		});
		
		return plots;
	},
	
	showPlot : function(){
		var rangeBar = this;
		var plot = rangeBar.datasetsPlot;
		var highlight_select_plot = $.merge([],plot);
		
		//see if there are selected/highlighted values
		if (rangeBar.highlightedDatasetsPlot instanceof Array){
			//check if plot is some other - external - graph
			if (plot === rangeBar.datasetsPlot)
				highlight_select_plot = $.merge(highlight_select_plot,rangeBar.highlightedDatasetsPlot);
		}
		
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
		
		$(rangeBar.plotDiv).unbind();		
		rangeBar.plot = $.plot($(rangeBar.plotDiv), highlight_select_plot_colors, options);
		rangeBar.parent.drawHandles();
		
		$(rangeBar.plotDiv).unbind("plothover");
	    $(rangeBar.plotDiv).bind("plothover", function (event, pos, item) {
	    	var dateStart,dateEnd;
	    	var spans;
	        if (item) {
	        	spans = rangeBar.parent.getSpanArray(rangeBar.spanWidth);
				//contains the x-value (date)
	        	dateStart = spans[item.datapoint[0]];
	        	dateEnd = spans[item.datapoint[0]+1];
	        }
	        //remember last date, so that we don't redraw the current state
	        //that date may be undefined is on purpose
	    	if (rangeBar.highlighted !== dateStart){
	    		rangeBar.highlighted = dateStart;
	    		if (typeof dateStart === "undefined")
	    			rangeBar.triggerHighlight();
	    		else
	    			rangeBar.triggerHighlight(dateStart, dateEnd);
	        }
	    });

	    //this var prevents the execution of the plotclick event after a select event 
	    rangeBar.wasSelection = false;
		$(rangeBar.plotDiv).unbind("plotclick");
	    $(rangeBar.plotDiv).bind("plotclick", function (event, pos, item) {
	    	if (rangeBar.wasSelection)
	    		rangeBar.wasSelection = false;
	    	else {
	        	//remove selection handles (if there were any)
	        	rangeBar.parent.clearHandles();
	        	
		    	var dateStart,dateEnd;
		    	var spans;
		        if (item) {
		        	spans = rangeBar.parent.getSpanArray(rangeBar.spanWidth);
					//contains the x-value (date)
		        	dateStart = spans[item.datapoint[0]];
		        	dateEnd = spans[item.datapoint[0]+1];
		        }  	
	    		if (typeof dateStart === "undefined")
	    			rangeBar.triggerSelection();
	    		else
	    			rangeBar.triggerSelection(dateStart, dateEnd);
	        	wasDataClick = true;
	        }
	    });
	    
	    $(rangeBar.plotDiv).unbind("plotselected");
	    $(rangeBar.plotDiv).bind("plotselected", function(event, ranges) {
        	spans = rangeBar.parent.getSpanArray(rangeBar.spanWidth);
        	dateStart = spans[Math.floor(ranges.xaxis.from)];
        	dateEnd = spans[Math.ceil(ranges.xaxis.to)];
	    	rangeBar.triggerSelection(dateStart, dateEnd);
	    	rangeBar.wasSelection = true;
	    	
	    	rangeBar.parent.clearHandles();
	    	var xaxis = rangeBar.plot.getAxes().xaxis;
	    	var x1 = xaxis.p2c(ranges.xaxis.from) + rangeBar.plot.offset().left;
	    	var x2 = xaxis.p2c(ranges.xaxis.to) + rangeBar.plot.offset().left;
	    	rangeBar.parent.addHandle(x1,x2);
	    });	
	},
	
	
	selectByX : function(x1, x2){
		rangeBar = this;
		var xaxis = rangeBar.plot.getAxes().xaxis;
    	var from = Math.floor(xaxis.c2p(x1-rangeBar.plot.offset().left));
    	var to = Math.ceil(xaxis.c2p(x2-rangeBar.plot.offset().left));
    	
		rangeBar.triggerSelection(rangeBar.tickSpans[from], rangeBar.tickSpans[to+1]);
	},	
	
	drawRangeBarChart : function(datasets, spanWidth){
		var rangeBar = this;
		rangeBar.spanWidth = spanWidth; 
		rangeBar.tickSpans = rangeBar.parent.getSpanArray(rangeBar.spanWidth);
		//-1 because last span is always empty (only there to have the ending date)
		var tickCount = rangeBar.tickSpans.length-1;
		
		if (tickCount > rangeBar.options.maxBars){
			tickCount = rangeBar.options.maxBars;
			rangeBar.spanWidth = (rangeBar.parent.overallMax-rangeBar.parent.overallMin)/tickCount;
			rangeBar.tickSpans = rangeBar.parent.getSpanArray(rangeBar.spanWidth);
			tickCount = rangeBar.tickSpans.length-1;
		}
		
		rangeBar.yValMin = 0;
		rangeBar.yValMax = 0;
		
		rangeBar.datasetsPlot = rangeBar.createPlot(datasets);
		//redraw selected plot to fit (possible) new scale
		rangeBar.selectionChanged(rangeBar.selected);
		
		for (var i = 0; i < rangeBar.datasetsPlot.length; i++){
			for (var j = 0; j < rangeBar.datasetsPlot[i].length; j++){
				var val = rangeBar.datasetsPlot[i][j][1];
				
				if (val < rangeBar.yValMin)
					rangeBar.yValMin = val;
				if (val > rangeBar.yValMax)
					rangeBar.yValMax = val;
			}
		}
		
		rangeBar.showPlot();
	},
	
	highlightChanged : function(objects) {
		if( !GeoTemConfig.highlightEvents ){
			return;
		}
		var rangeBar = this;
		var emptyHighlight = true;
		var selected_highlighted = GeoTemConfig.mergeObjects(objects,rangeBar.selected);
		$(selected_highlighted).each(function(){
			if ((this instanceof Array) && (this.length > 0)){
				emptyHighlight = false;
				return false;
			}
		});
		if (emptyHighlight){
			rangeBar.highlightedDatasetsPlot = [];
		} else {
			rangeBar.highlightedDatasetsPlot = rangeBar.createPlot(selected_highlighted);
		}			
		rangeBar.showPlot();
	},
	
	selectionChanged : function(objects) {
		if( !GeoTemConfig.selectionEvents ){
			return;
		}
		var rangeBar = this;
		rangeBar.selected = objects;
		rangeBar.highlightChanged([]);
	},
	
	triggerHighlight : function(dateStart, dateEnd) {
		var highlightedObjects = [];
		
		if ( (typeof dateStart !== "undefined") && (typeof dateEnd !== "undefined") ){
			highlightedObjects = this.parent.getObjects(dateStart, dateEnd);
		} else {
			for (var i = 0; i < GeoTemConfig.datasets.length; i++)
				highlightedObjects.push([]);
		}
		
		if (typeof this.parent.density !== "undefined")
			this.parent.density.highlightChanged(highlightedObjects);
		
		this.parent.core.triggerHighlight(highlightedObjects);
	},

	triggerSelection : function(dateStart, dateEnd) {
		var rangeBar = this;
		var selection;
		if (typeof dateStart !== "undefined") {
			var selected;
			if (typeof dateEnd === "undefined")
				selected = rangeBar.parent.getObjects(dateStart);
			else
				selected = rangeBar.parent.getObjects(dateStart,dateEnd);
			selection = new Selection(selected, rangeBar);
		} else {
			var selected = [];
			for (var i = 0; i < GeoTemConfig.datasets.length; i++)
				selected.push([]);
			selection = new Selection(selected);
		}
		
		rangeBar.parent.selectionChanged(selection);
		rangeBar.parent.core.triggerSelection(selection);
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
