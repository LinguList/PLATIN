/*
* FuzzyTimelineWidget.js
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
 * @class FuzzyTimelineWidget
 * FuzzyTimelineWidget Implementation
 * @author Sebastian Kruse (skruse@mpiwg-berlin.mpg.de)
 *
 * @param {WidgetWrapper} core wrapper for interaction to other widgets
 * @param {HTML object} div parent div to append the FuzzyTimeline widget div
 * @param {JSON} options user specified configuration that overwrites options in FuzzyTimelineConfig.js
 */
function FuzzyTimelineWidget(core, div, options) {

	this.datasets;
	this.core = core;
	this.core.setWidget(this);

	this.options = (new FuzzyTimelineConfig(options)).options;
	this.gui = new FuzzyTimelineGui(this, div, this.options);
	
	this.density = new FuzzyTimelineDensity(this,this.gui.densityDiv);
}

FuzzyTimelineWidget.prototype = {

	initWidget : function(data) {
		if ( (data instanceof Array) && (data.length > 0) )
		{
			this.datasets = data;
			
			var overallMin, overallMax;
			$(this.datasets).each(function(){
				var chartDataCounter = new Object();
				
				$(this.objects).each(function(){
					var datemin,datemax;
					if (this.isTemporal){
						//TODO: allow more than one date
						datemin = moment(this.dates[0].date);
						datemax = datemin;
					} else if (this.isFuzzyTemporal){
						//TODO: allow more than one date
						datemin = this.TimeSpanBegin;
						datemax = this.TimeSpanEnd;
					}
					
					if (typeof overallMin === "undefined")
						overallMin = datemin;
					if (typeof overallMax === "undefined")
						overallMax = datemax;
					
					if (overallMin > datemin)
						overallMin = datemin;
					if (overallMax < datemax)
						overallMax = datemax;
				});
			});
			
			this.density.initialize(overallMin,overallMax,this.datasets);
		}
	},

	highlightChanged : function(objects) {
		if( !GeoTemConfig.highlightEvents ){
			return;
		}
		if ( (typeof objects === "undefined") || (objects.length == 0) ){
			return;
		}
		this.density.highlightChanged(objects);
	},

	selectionChanged : function(selection) {
		if( !GeoTemConfig.selectionEvents ){
			return;
		}
		var objects = selection.objects;
		this.density.selectionChanged(objects);
	},
};
