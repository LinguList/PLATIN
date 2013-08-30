/*
* FuzzyTimelineRangePiechart.js
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
 * @class FuzzyTimelineRangePiechart
 * Implementation for a fuzzy time-ranges pie chart
 * @author Sebastian Kruse (skruse@mpiwg-berlin.mpg.de)
 *
 * @param {HTML object} parent div to append the FuzzyTimeline
 */
function FuzzyTimelineRangePiechart(parent,div) {

	this.fuzzyTimeline = this;
	
	this.parent = parent;
	this.options = parent.options;
	
	this.div = div;
	
	this.selected = [];
	
	this.maxSlices = 10;
}

FuzzyTimelineRangePiechart.prototype = {

	initialize : function(datasets) {
		var piechart = this;
		piechart.datasets = datasets;
		
		piechart.drawPieChart(piechart.datasets);
	},
	
	drawPieChart : function(datasets){
		var piechart = this;
		//build hashmap of spans (span length -> objects[])
		var spans = [];
		var index = 0;
		$(datasets).each(function(){
			var objects = this;
			//check whether we got "real" dataset or just a set of DataObjects
			if (typeof objects.objects !== "undefined")
				objects = objects.objects;
			$(objects).each(function(){
				var dataObject = this;
				var span;
				//TODO: it's actually not a good idea to compare milliseconds
				//better approach would be to check identity for years/months/days/...
				if (dataObject.isTemporal){
					span = moment.duration(1,'milliseconds').asMilliseconds();
				} else if (dataObject.isFuzzyTemporal){
					span = moment.duration(dataObject.TimeSpanEnd-dataObject.TimeSpanBegin).asMilliseconds();
				}
				
				if (typeof span === "undefined")
					return;

				var found = false;
				$(spans).each(function(){
					if (this.span === span){
						this.objects[index].push(dataObject);
						found = true;
						return false;
					}
				});
				if (found === false){
					var newObjectSet = [];
					for (var i = 0; i < piechart.datasets.length; i++)
						newObjectSet.push([]);
					newObjectSet[index].push(dataObject);
					spans.push({span:span,objects:newObjectSet});
				}
			});
			index++;
		});
		
		//TODO: join elements of span array to keep below certain threshold
		
		//sort array by span length		
		spans.sort(function(a,b){
			return(a.span-b.span);
		});
		
		//create chart data
		var chartData = [];
		$(spans).each(function(){
			var spanElem = this;
			$(spanElem.objects).each(function(){
				chartData.push({label:moment.duration(spanElem.span).humanize(),data:this.length});
			});			
		});
		
		$.plot($(piechart.div), chartData,
			{
				series: {
					// Make this a pie chart.
					pie: {
						show:true
					}
				},
				legend: { show:false},
				grid: {
		            hoverable: true,
		            clickable: true
		        },
		        tooltip: true,
			}
		);
		
		var lastHighlighted;
		$(piechart.div).unbind("plothover");
		var hoverFunction = function (event, pos, item) {
	        if (item) {
	        	var highlightedSpan =  Math.ceil(item.seriesIndex/piechart.datasets.length);
	        	if (lastHighlighted !== highlightedSpan){
		        	var highlightedObjects = [];
		        	for(;highlightedSpan>=0;highlightedSpan--){
		        		highlightedObjects = GeoTemConfig.mergeObjects(highlightedObjects,spans[highlightedSpan].objects);
		        	}
		        	lastHighlighted = highlightedSpan;
		        }
	        	piechart.triggerHighlight(highlightedObjects);
	        } else {
	        	piechart.triggerHighlight([]);
	        }
	    };
	    $(piechart.div).bind("plothover", hoverFunction);
	    
	    $(piechart.div).unbind("plotclick");
	    $(piechart.div).bind("plotclick", function (event, pos, item) {
	    	$(piechart.div).unbind("plothover");
	    	if (item){
	    		var selectedSpan =  Math.ceil(item.seriesIndex/piechart.datasets.length);
	        	var selectedObjects = [];
	        	for(;selectedSpan>=0;selectedSpan--){
	        		selectedObjects = GeoTemConfig.mergeObjects(selectedObjects,spans[selectedSpan].objects);
	        	}
	        	piechart.triggerSelection(selectedObjects);
	    	} else {
	        	//if it was a click outside of the pie-chart, enable highlight events
	        	$(piechart.div).bind("plothover", hoverFunction);
	        	//return to old state
	        	piechart.triggerSelection(piechart.selected);
	        	//and redraw piechart
	    		piechart.highlightChanged([]);
	        }
	    });
	},
		
	highlightChanged : function(objects) {
		var piechart = this;
		//check if this is an empty highlight
		var emptyHighlight = true;
		$(objects).each(function(){
			if ((this instanceof Array) && (this.length > 0)){
				emptyHighlight = false;
				return false;
			}
		});
		
		if (emptyHighlight === false)
			piechart.drawPieChart(GeoTemConfig.mergeObjects(piechart.selected, objects));
		else{
			//return to selection (or all objects, if no selection is active)
			if (piechart.selected.length > 0)
				piechart.drawPieChart(piechart.selected);
			else
				piechart.drawPieChart(piechart.datasets);
		}
	},

	selectionChanged : function(selection) {
		var piechart = this;
		if( !GeoTemConfig.selectionEvents ){
			return;
		}
		piechart.selected = selection;
		piechart.highlightChanged([]);
	},
	
	triggerHighlight : function(highlightedObjects) {
		this.parent.triggerHighlight(highlightedObjects);
	},

	triggerSelection : function(selectedObjects) {
		this.parent.triggerSelection(selectedObjects);
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
