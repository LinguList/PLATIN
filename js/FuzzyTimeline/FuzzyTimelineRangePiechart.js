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
function FuzzyTimelineRangePiechart(parent,div,datasetIndex,shownDatasets,hiddenDatasets) {

	this.index;
	this.fuzzyTimeline = this;
	
	this.parent = parent;
	this.options = parent.options;
	
	this.div = div;
	this.datasetIndex = datasetIndex;
	this.shownDatasets = shownDatasets;
	this.hiddenDatasets = hiddenDatasets;
	
	this.initialize();
}

FuzzyTimelineRangePiechart.prototype = {

	initialize : function() {
		var piechart = this;
		
		var chartData = [];
		chartData.push({label:"fit",data:piechart.shownDatasets[piechart.datasetIndex].length});
		chartData.push({label:"overlap",data:piechart.hiddenDatasets[piechart.datasetIndex].length});
		
		$.plot($(piechart.div), chartData,
			{
				series: {
					// Make this a pie chart.
					pie: {
						show:true
					}
				},
				legend: { show:true, position: 'se' },
				grid: {
		            hoverable: true,
		            clickable: true
		        },
		        tooltip: true,
		        tooltipOpts: {
		            content: "%s %p.1%"
		        }
			}
		);
		
		$(piechart.div).unbind();
	    $(piechart.div).bind("plothover", function (event, pos, item) {
	        if (item) {
	        	if (item.seriesIndex === 0){
	        		piechart.parent.density.showPlotByType('shown');
	        		piechart.parent.rangeBars.showPlotByType('shown');
	        	}
	        	else if (item.seriesIndex === 1){
	        		piechart.parent.density.showPlotByType('hidden');
	        		piechart.parent.rangeBars.showPlotByType('hidden');
	        	}
	        } else {
        		piechart.parent.density.showPlotByType('combined');
        		piechart.parent.rangeBars.showPlotByType('combined');
	        }
	    });
	    $(piechart.div).bind("plotclick", function (event, pos, item) {
	        if (item) {
				//item.series.label contains the column element
				pieChart.triggerSelection(item.series.label);                              
	        } else {
	        	pieChart.triggerSelection();
	        }
	    });		
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
