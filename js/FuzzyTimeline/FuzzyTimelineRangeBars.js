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
	
	this.hiddenDatasetsPlot;
	this.shownDatasetsPlot;
	this.combinedDatasetsPlot;
	this.highlightedShownDatasetsPlot;
	this.highlightedHiddenDatasetsPlot;
	this.highlightedCombinedDatasetsPlot;
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

						chartDataCounter[i][1] += weight;
					}
				}
			});
			
			plots.push(chartDataCounter);
		});
		
		return plots;
	},
	
	redrawPlot : function(){
		var rangeBar = this;
		rangeBar.showPlotByType(rangeBar.displayType);
	},
	
	showPlotByType : function(type){
		var rangeBar = this;
		rangeBar.displayType = type;
		if (type === 'shown'){
			rangeBar.showPlot(rangeBar.shownDatasetsPlot);
		} else if (type === 'hidden'){
			rangeBar.showPlot(rangeBar.hiddenDatasetsPlot);
		} else if (type === 'combined'){
			rangeBar.showPlot(rangeBar.combinedDatasetsPlot);
		}
	},
	
	showPlot : function(plot){
		var rangeBar = this;
		var highlight_select_plot = $.merge([],plot);
		
		//see if there are selected/highlighted values
		if (rangeBar.highlightedCombinedDatasetsPlot instanceof Array){
			//check which one should be shown (or none, if plot is some other - external - graph)
			if (plot === rangeBar.shownDatasetsPlot)
				highlight_select_plot = $.merge(highlight_select_plot,rangeBar.highlightedShownDatasetsPlot);
			else if (plot === rangeBar.hiddenDatasetsPlot)
				highlight_select_plot = $.merge(highlight_select_plot,rangeBar.highlightedHiddenDatasetsPlot);
			else if (plot === rangeBar.combinedDatasetsPlot)
				highlight_select_plot = $.merge(highlight_select_plot,rangeBar.highlightedCombinedDatasetsPlot);
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
		var xaxis = density.plot.getAxes().xaxis;
    	var from = xaxis.c2p(x1-density.plot.offset().left);
    	var to = xaxis.c2p(x2-density.plot.offset().left);

    	density.triggerSelection(from, to);
	},	
	
	drawRangeBarChart : function(shownDatasets, hiddenDatasets, spanWidth){
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
		
		rangeBar.shownDatasetsPlot = rangeBar.createPlot(shownDatasets);
		rangeBar.hiddenDatasetsPlot = rangeBar.createPlot(hiddenDatasets);
		//redraw selected plot to fit (possible) new scale
		rangeBar.selectionChanged(rangeBar.selected);
		
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
			rangeBar.highlightedShownDatasetsPlot = [];
			rangeBar.highlightedHiddenDatasetsPlot = [];
			rangeBar.highlightedCombinedDatasetsPlot = [];
		} else {
			var shown_selected_highlighted = [];
			var hidden_selected_highlighted = [];
			$(selected_highlighted).each(function(){
				var singleShown = [], singleHidden = [];
				$(this).each(function(){
					var ticks = rangeBar.parent.getTicks(this, rangeBar.spanWidth);
					if (	(typeof ticks !== 'undefined') &&
							(typeof ticks.firstTick !== 'undefined') &&
							(typeof ticks.lastTick !== 'undefined') ){
						if (ticks.firstTick != ticks.lastTick)
							singleHidden.push(this);
						else
							singleShown.push(this);
					}
				});
				shown_selected_highlighted.push(singleShown);
				hidden_selected_highlighted.push(singleHidden);
			});
			rangeBar.highlightedShownDatasetsPlot = rangeBar.createPlot(shown_selected_highlighted);
			rangeBar.highlightedHiddenDatasetsPlot = rangeBar.createPlot(hidden_selected_highlighted);
			rangeBar.highlightedCombinedDatasetsPlot = rangeBar.createPlot(selected_highlighted);
		}			
		rangeBar.redrawPlot();
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
