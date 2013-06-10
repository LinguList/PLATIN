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
	
	this.initialize();
}

function createPlot(data){
	var chartData = [];
	
	function linsort (a, b) {
		return a[0] - b[0];
	}

	$.each(data, function(name,val){
		if (typeof val === "undefined")
			val = 0;
		var dateObj = moment(name,"YYYYYY-MM-DDTHH:mm:ss Z");
		chartData.push([dateObj,val]);
	});
	
	chartData.sort(linsort);
	
	return chartData;
}

FuzzyTimelineDensity.prototype = {

	initialize : function() {
		var fuzzyTimeline = this;

		var plots = [];

		//Gleichverteilung	
		$(this.parent.datasets).each(function(){
			var chartDataCounter = new Object();
			var overallMin, overallMax;
			$(this.objects).each(function(){
			});
			$(this.objects).each(function(){
				var datemin,datemax;
				if (this.isTemporal){
					datemin = this.dates[0].date.getYear();
					datemax = datemin;
				} else if (this.isFuzzyTemporal){
					datemin = this.tableContent["TimeSpanBegin"];
					datemax = this.tableContent["TimeSpanEnd"];
				}
				
				if ((typeof datemin !== "undefined") && (typeof datemax !== "undefined")){
					var weight = 1/(datemax-datemin+1);
					for (var i = datemin; i <= datemax; i++){
						if (typeof chartDataCounter[i] === "undefined")
							chartDataCounter[i] = weight;
						else
							chartDataCounter[i] += weight;
					}
				}
			});
			
			var udChartData = createPlot(chartDataCounter);
			if (udChartData.length > 0)
				plots.push(udChartData);
		});
		
		var options = {
				series:{
	                bars:{show: true}
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
