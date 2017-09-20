/*
* MapDataSource.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
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
 * @class MapDataSource
 * implementation for aggregation of map items
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 *
 * @param {MapWidget} parent Widget
 * @param {JSON} options map configuration
 */
function MapDataSource(parent, options) {

    this.parent = parent;
	this.olMap = parent.openlayersMap;
	this.circleSets = [];
	this.binning = new Binning(this.olMap, options);

};

MapDataSource.prototype = {

	/**
	 * initializes the MapDataSource
	 * @param {MapObject[][]} mapObjects an array of map objects of different sets
	 */
	initialize : function(mapObjects) {

		if (mapObjects != this.mapObjects) {
			this.binning.reset();
			this.binning.setObjects(mapObjects);
		}
		this.mapObjects = mapObjects;

		var set = this.binning.getSet();
		this.circleSets = set.circleSets;
		this.binSets = set.binSets;
		this.hashMapping = set.hashMaps;

		//if a textarea with id "jsonOutput" exists, output binning as json into it
		if ($("#jsonOutput").length > 0){
			var circleClone = jQuery.extend(true, {}, set.circleSets);
			for (var zoomLvl in circleClone){
				circleClone[zoomLvl] = circleClone[zoomLvl][0];
				circles = circleClone[zoomLvl];
				for (var circleName in circles){
					var circle=circles[circleName];
					var newCircle = {};
					newCircle["elements"] = [];
					for (var element in circle["elements"]){
						var thisElement = circle["elements"][element];
						var id = thisElement["tableContent"]["id"];
						if (typeof id === "undefined"){
							id = thisElement["id"];
						}
						newCircle["elements"].push(id);
					} 
					newCircle.originX = circle.originX;
					newCircle.originY = circle.originY;
					newCircle.radius = circle.radius;
					circles[circleName] = newCircle;
				}
			}

			$("#jsonOutput").append(JSON.stringify(circleClone, null, 4));
		}
	},

	getObjectsByZoom : function() {
		var zoom = Math.floor(this.parent.getZoom());
		if (this.circleSets.length < zoom) {
			return null;
		}
		return this.circleSets[zoom];
	},

	getAllObjects : function() {
		if (this.circleSets.length == 0) {
			return null;
		}
		return this.circleSets;
	},

	getAllBins : function() {
		if (this.binSets.length == 0) {
			return null;
		}
		return this.binSets;
	},

	clearOverlay : function() {
		var zoom = Math.floor(this.parent.getZoom());
		var circles = this.circleSets[zoom];
		for (var i in circles ) {
			for (var j in circles[i] ) {
				circles[i][j].reset();
			}
		}
	},

	setOverlay : function(mapObjects) {
		var zoom = Math.floor(this.parent.getZoom());
		for (var j in mapObjects ) {
			for (var k in mapObjects[j] ) {
				var o = mapObjects[j][k];
				if (o.isGeospatial) {
					this.hashMapping[zoom][j][o.index].overlayElements.push(o);
					this.hashMapping[zoom][j][o.index].overlay += o.weight;
				}
			}
		}
	},

	size : function() {
		if (this.circleSets.length == 0) {
			return 0;
		}
		return this.circleSets[0].length;
	},

	getCircle : function(index, id) {
		var zoom = Math.floor(this.parent.getZoom());
		return this.hashMapping[zoom][index][id];
	}
};
