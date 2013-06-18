/*
* LineOverlayWidget.js
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
 * @class LineOverlayWidget
 * Implementation for the widget interactions of an overlay showing lines between points
 * @author Sebastian Kruse (skruse@mpiwg-berlin.mpg.de)
 *
 * @param {WidgetWrapper} core wrapper for interaction to other widgets
 * @param {JSON} options user specified configuration that overwrites options in OverlayloaderConfig.js
 */
function LineOverlayWidget(core, options) {

	this.core = core;
	this.core.setWidget(this);

	this.options = (new LineOverlayConfig(options)).options;
	
	this.attachedMapWidgets = new Array();
	
	this.lineOverlay = new LineOverlay(this);
	this.lines = [];
	this.lineLayer;
	
	this.selected = [];
}

/**
 * @param {Number} dataSet number of dataSet in dataSet array
 * @param {Number} objectID number of DataObject in objects array
 */

function Line(objectStart, objectEnd ) {
	this.objectStart = objectStart;
	this.objectEnd = objectEnd;
}

LineOverlayWidget.prototype = {

	initWidget : function() {
		var lineOverlayWidget = this;
		lineOverlayWidget.lines = [];
		if ((typeof GeoTemConfig.datasets !== "undefined") && (GeoTemConfig.datasets.length > 0))
       		lineOverlayWidget.lines.push(new Line(GeoTemConfig.datasets[0].objects[0],GeoTemConfig.datasets[0].objects[212]));		
		this.drawLines();
	},

	highlightChanged : function(objects) {
		if( !GeoTemConfig.highlightEvents ){
			return;
		}
		this.drawLines(GeoTemConfig.mergeObjects(objects,this.selected));
	},

	selectionChanged : function(selection) {
		if( !GeoTemConfig.selectionEvents ){
			return;
		}
		if (selection.valid())
			this.selected = selection.objects;
		else
			this.selected = [];

		this.drawLines(this.selected);
	},

	triggerHighlight : function(item) {
	},

	tableSelection : function() {
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
	
	getXYofObject : function(cs,dataObject){
		//iterata over datasets
		var x,y;
		var found = false;
		$(cs).each(function(){
			//iterate over circles
			$(this).each(function(){
				var circle = this;
				//iterata over objects in this circle;
				$(circle.elements).each(function(){
					if (this === dataObject){
						x = circle.originX;
						y = circle.originY;
						found = true;
						
						return false;
					}
				});
				//break loop
				if (found === true)
					return false;
			});
			//break loop
			if (found === true)
				return false;
		});
		
		return ({x:x,y:y});
	},
	
	/**
	 * @param {DataObjects[][]} objects set of objects to limit to
	 */
	drawLines : function(objects) {
		var flatObjects = [];
		if (	(typeof objects !== "undefined") &&
				(objects instanceof Array) &&
				(objects.length > 0) ) {
			$(objects).each(function(){
				$.merge(flatObjects, this);				
			});
		}
		var lineOverlayWidget = this;

		var map = lineOverlayWidget.attachedMapWidgets[0].openlayersMap;
		var cs = lineOverlayWidget.attachedMapWidgets[0].mds.getObjectsByZoom();

		if (lineOverlayWidget.lineLayer instanceof OpenLayers.Layer.Vector){
			map.removeLayer(lineOverlayWidget.lineLayer);
			delete lineOverlayWidget.lineLayer;
		}
		lineOverlayWidget.lineLayer = new OpenLayers.Layer.Vector("Line Layer"); 

		map.addLayer(lineOverlayWidget.lineLayer);                    
		map.addControl(new OpenLayers.Control.DrawFeature(lineOverlayWidget.lineLayer, OpenLayers.Handler.Path));
		
		$(lineOverlayWidget.lines).each(function(){
			var line = this;
			
			if (flatObjects.length > 0){
				//if objects are limited, check whether start or end are within 
				if (	($.inArray(line.objectStart, flatObjects) === -1) &&
						($.inArray(line.objectEnd, flatObjects) === -1) )
					return;
			}
			//line.objectEnd;
			//get XY-val of start Object
			var xyStart = lineOverlayWidget.getXYofObject(cs, line.objectStart);
			//continue if no valid XY-coords where found
			if ( (typeof xyStart.x === "undefined") && (typeof xyStart.y === "undefined") )
				return;
			var xyEnd = lineOverlayWidget.getXYofObject(cs, line.objectEnd);
			//continue if no valid XY-coords where found
			if ( (typeof xyEnd.x === "undefined") && (typeof xyEnd.y === "undefined") )
				return;

			var points = new Array(
					   new OpenLayers.Geometry.Point(xyStart.x, xyStart.y),
					   new OpenLayers.Geometry.Point(xyEnd.x, xyEnd.y)
					);

			var line = new OpenLayers.Geometry.LineString(points);

			var style = { 
			  strokeColor: '#0000ff', 
			  strokeOpacity: 0.5,
			  strokeWidth: 5
			};

			var lineFeature = new OpenLayers.Feature.Vector(line, null, style);
			lineOverlayWidget.lineLayer.addFeatures([lineFeature]);
		});
	},
	
	attachMapWidget : function(widget) {
		this.attachedMapWidgets.push(widget);
	}
};
