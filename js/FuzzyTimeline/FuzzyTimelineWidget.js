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
	this.hiddenDatasets;
	this.shownDatasets;
	this.overallMin;
	this.overallMax;
	
	this.core = core;
	this.core.setWidget(this);

	this.options = (new FuzzyTimelineConfig(options)).options;
	this.gui = new FuzzyTimelineGui(this, div, this.options);

	this.viewMode;
	this.density;
	this.rangeSlider;
	this.rangeBars;
	this.spanHash = [];
}

FuzzyTimelineWidget.prototype = {

	initWidget : function(data) {
		var fuzzyTimeline = this;
		
		delete fuzzyTimeline.overallMin;
		delete fuzzyTimeline.overallMax;
		
		$(fuzzyTimeline.gui.plotDiv).empty();
		delete fuzzyTimeline.density;
		delete fuzzyTimeline.rangeBars;
		$(fuzzyTimeline.gui.rangePiechartDiv).empty();
		$(fuzzyTimeline.gui.sliderDiv).empty();
		delete fuzzyTimeline.rangeSlider;

		fuzzyTimeline.switchViewMode("density");
		
		if ( (data instanceof Array) && (data.length > 0) )
		{
			fuzzyTimeline.datasets = data;
			
			$(fuzzyTimeline.datasets).each(function(){
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
					
					if (typeof fuzzyTimeline.overallMin === "undefined")
						fuzzyTimeline.overallMin = datemin;
					if (typeof fuzzyTimeline.overallMax === "undefined")
						fuzzyTimeline.overallMax = datemax;
					
					if (fuzzyTimeline.overallMin > datemin)
						fuzzyTimeline.overallMin = datemin;
					if (fuzzyTimeline.overallMax < datemax)
						fuzzyTimeline.overallMax = datemax;
				});
			});
			
			fuzzyTimeline.rangeSlider = new FuzzyTimelineRangeSlider(fuzzyTimeline);
			fuzzyTimeline.rangeSlider.initialize(fuzzyTimeline.datasets);			
		}
	},
	
	switchViewMode : function(viewMode){
		var fuzzyTimeline = this;
		if (viewMode !== fuzzyTimeline.viewMode){
			$(fuzzyTimeline.gui.plotDiv).empty();
			if (viewMode === "density"){
				delete fuzzyTimeline.rangeBars;
				fuzzyTimeline.density = new FuzzyTimelineDensity(fuzzyTimeline,fuzzyTimeline.gui.plotDiv);
			} else if (viewMode === "barchart"){
				delete fuzzyTimeline.density;
				fuzzyTimeline.rangeBars = new FuzzyTimelineRangeBars(fuzzyTimeline);
			}
			fuzzyTimeline.viewMode = viewMode;
		}
	},
	
	slidePositionChanged : function(spanWidth, shownDatasets, hiddenDatasets) {
		var fuzzyTimeline = this;
		if (fuzzyTimeline.viewMode === "density")
			//redraw density plot
			fuzzyTimeline.density.drawDensityPlot(shownDatasets,hiddenDatasets);
		else if (fuzzyTimeline.viewMode === "barchart")
			//redraw range plot
			fuzzyTimeline.rangeBars.drawRangeBarChart(shownDatasets,hiddenDatasets,spanWidth);
	},

	highlightChanged : function(objects) {
		var fuzzyTimeline = this;
		if( !GeoTemConfig.highlightEvents ){
			return;
		}
		if ( (typeof objects === "undefined") || (objects.length == 0) ){
			return;
		}
		if (fuzzyTimeline.viewMode === "density")
			this.density.highlightChanged(objects);
		else if (fuzzyTimeline.viewMode === "barchart")
			this.rangeBars.highlightChanged(objects);
	},

	selectionChanged : function(selection) {
		var fuzzyTimeline = this;
		if( !GeoTemConfig.selectionEvents ){
			return;
		}
		var objects = selection.objects;
		if (fuzzyTimeline.viewMode === "density")
			this.density.selectionChanged(objects);
		else if (fuzzyTimeline.viewMode === "barchart")
			this.rangeBars.selectionChanged(objects);
	},
	
	buildSpanArray : function(spanWidth) {
		var spanArray = [];
		var tickStart = moment(this.overallMin);		 
		do{
			spanArray.push(moment(tickStart));
			tickStart.add(spanWidth);
		} while (tickStart <= this.overallMax);
		spanArray.push(moment(tickStart));
		
		this.spanHash.push({spanWidth:spanWidth,overallMin:moment(this.overallMin),spanArray:spanArray});
		return(spanArray);
	},
	
	getSpanArray : function(spanWidth){
		for (var i = 0; i < this.spanHash.length; i++){
			var element = this.spanHash[i];
			if (	((this.overallMin-element.overallMin)===0) &&
					((spanWidth-element.spanWidth)===0))
				return element.spanArray;
		}
		return this.buildSpanArray(spanWidth);
	},
	
	getTicks : function(dataObject, spanWidth) {
		var datemin,datemax;
		if (dataObject.isTemporal){
			datemin = moment(dataObject.dates[0].date);
			datemax = datemin;
		} else if (dataObject.isFuzzyTemporal){
			datemin = dataObject.TimeSpanBegin;
			datemax = dataObject.TimeSpanEnd;
		} else{
			return;
		}
		
		if (typeof spanWidth._data === "undefined"){
			//This does only work with millisecond spans, as the length of years is (very) inaccurate.
			//(e.g. 100-0 = 99, 2000-1000 = 1001, 5000-0 = 5003, and so on and even more: duration(5000a) = 4932a)
			//So the time consuming loop below is needed for accurate dates, when years/months/days etc. are supplied
			var firstTick = Math.floor((datemin-this.overallMin)/spanWidth);
			var lastTick = Math.floor((datemax-this.overallMin)/spanWidth);
			//calculate how much the first (and last) tick and the time-span overlap
			var firstTickPercentage = 1;
			var lastTickPercentage = 1;
			if (firstTick != lastTick){
				var secondTickStart = this.overallMin+(firstTick+1)*spanWidth;
				var lastTickStart = this.overallMin+lastTick*spanWidth;
				firstTickPercentage = (secondTickStart-datemin)/spanWidth;
				lastTickPercentage = (datemax-lastTickStart)/spanWidth;
			}
			if (firstTickPercentage === 0){
				firstTick++;
				firstTickPercentage = 1;
			}
			if (lastTickPercentage === 0){
				lastTick--;
				lastTickPercentage = 1;
			}
		} else {
			var spanArray = this.getSpanArray(spanWidth);
			var firstTick, lastTick;
			var tickCount = 0;
			var tickStart = spanArray[0];
			var lastTickStart;
			do{
				lastTickStart = spanArray[tickCount];
				tickCount++;
				tickStart = spanArray[tickCount];
				if ( (typeof firstTick === "undefined") && (datemin <= tickStart) ){
					firstTick = tickCount-1;
					firstTickPercentage = (tickStart - datemin)/spanWidth;
				}
				if ( (typeof lastTick === "undefined") && (datemax <= tickStart) ){
					lastTick = tickCount-1;
					lastTickPercentage = (datemax - lastTickStart)/spanWidth;
				}
			} while (tickStart <= datemax);
			if (firstTick == lastTick){
				firstTickPercentage = 1;
				lastTickPercentage = 1;
			}
		}
		
		return({	firstTick:firstTick,
					lastTick:lastTick,
					firstTickPercentage:firstTickPercentage,
					lastTickPercentage:lastTickPercentage});
	},

	getObjects : function(dateStart, dateEnd) {
		var fuzzyTimeline = this;
		var searchDateStart, searchDateEnd;
		if (typeof dateStart !== "undefined")
			searchDateStart = moment(dateStart);
		if (typeof dateEnd !== "undefined")
			searchDateEnd = moment(dateEnd);
		
		var datasets = [];		
		$(fuzzyTimeline.datasets).each(function(){
			var objects = [];
			//check if we got "real" datasets, or just array of objects
			var datasetObjects = this;
			if (typeof this.objects !== "undefined")
				datasetObjects = this.objects;
			$(datasetObjects).each(function(){
				var datemin,datemax;
				var dataObject = this;
				if (dataObject.isTemporal){
					datemin = moment(dataObject.dates[0].date);
					datemax = datemin;
				} else if (dataObject.isFuzzyTemporal){
					datemin = dataObject.TimeSpanBegin;
					datemax = dataObject.TimeSpanEnd;
				} else{
					return;
				}
				
				if (typeof searchDateEnd === 'undefined'){
					if ( (datemin <= searchDateStart) && (datemax >= searchDateStart) )
						objects.push(this);
				} else {
					if ((datemin <= searchDateEnd) && (datemax >= searchDateStart))
						objects.push(this);
				}
			});
			datasets.push(objects);
		});

		return(datasets);
	},
};
