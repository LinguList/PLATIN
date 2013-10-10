/*
* DataObject.js
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
 * @class DataObject
 * GeoTemCo's data object class
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 *
 * @param {String} name name of the data object
 * @param {String} description description of the data object
 * @param {JSON} locations a list of locations with longitude, latitide and place name
 * @param {JSON} dates a list of dates
 * @param {float} lon longitude value of the given place
 * @param {float} lat latitude value of the given place
 * @param {Date} timeStart start time of the data object
 * @param {Date} timeEnd end time of the data object
 * @param {int} granularity granularity of the given time
 * @param {int} weight weight of the time object
 * @param {Openlayers.Projection} projection of the coordinates (optional)
 */

function DataObject(name, description, locations, dates, weight, tableContent, projection) {

	this.name = $.trim(name);
	this.description = $.trim(description);
	this.weight = weight;
	this.tableContent = new Object();
	var objectTableContent = this.tableContent;
	for(key in tableContent){
		value = tableContent[key];
		objectTableContent[$.trim(key)]=$.trim(value);
	}

	this.percentage = 0;
	this.setPercentage = function(percentage) {
		this.percentage = percentage;
	}

	this.locations = [];
	var objectLocations = this.locations;
	$(locations).each(function(){
		objectLocations.push({
			latitude:this.latitude,
			longitude:this.longitude,
			place:$.trim(this.place)
		});
	});
	
	//Check if locations are valid
	if (projection instanceof OpenLayers.Projection){	
		var tempLocations = [];
		$(this.locations).each(function(){
			//EPSG:4326 === WGS84
			this.latitude = parseFloat(this.latitude);
			this.longitude = parseFloat(this.longitude);
			if (projection.getCode() === "EPSG:4326"){
				if (	(typeof this.latitude === "number") &&
						(this.latitude>=-90) &&
						(this.latitude<=90) &&
						(typeof this.longitude === "number") &&
						(this.longitude>=-180) &&
						(this.longitude<=180) )
					tempLocations.push(this);
				else{
					if (typeof console !== "undefined")
						console.error("Object " + name + " has no valid coordinate. ("+this.latitude+","+this.longitude+")");
				}					
			}
		});
		this.locations = tempLocations;
	}
	
	this.isGeospatial = false;
	if ((typeof this.locations !== "undefined") && (this.locations.length > 0)) {
		this.isGeospatial = true;
	}

	this.placeDetails = [];
	for (var i = 0; i < this.locations.length; i++) {
		this.placeDetails.push(this.locations[i].place.split("/"));
	}

	this.getLatitude = function(locationId) {
		return this.locations[locationId].latitude;
	}

	this.getLongitude = function(locationId) {
		return this.locations[locationId].longitude;
	}

	this.getPlace = function(locationId, level) {
		if (level >= this.placeDetails[locationId].length) {
			return this.placeDetails[locationId][this.placeDetails[locationId].length - 1];
		}
		return this.placeDetails[locationId][level];
	}

	this.dates = dates;
	this.isTemporal = false;
	if ((typeof this.dates !== "undefined") && (this.dates.length > 0)) {
		this.isTemporal = true;
	}

	this.getDate = function(dateId) {
		return this.dates[dateId].date;
	}

	this.getTimeGranularity = function(dateId) {
		return this.dates[dateId].granularity;
	}

	this.setIndex = function(index) {
		this.index = index;
	}

	this.getTimeString = function() {
		if (this.timeStart != this.timeEnd) {
			return (SimileAjax.DateTime.getTimeString(this.granularity, this.timeStart) + " - " + SimileAjax.DateTime.getTimeString(this.granularity, this.timeEnd));
		} else {
			return SimileAjax.DateTime.getTimeString(this.granularity, this.timeStart) + "";
		}
	};

	this.contains = function(text) {
		var allCombined = this.name + " " + this.description + " " + this.weight + " ";
		
		$.each(this.dates, function(key, value){
			$.each(value, function(){
				allCombined += this + " ";
			});
		});
		
		$.each(this.locations, function(key, value){
			$.each(value, function(){
				allCombined += this + " ";
			});
		});
		
		$.each(this.tableContent, function(key, value){
			allCombined += value + " ";
		});
		
		return (allCombined.indexOf(text) != -1);
	};
	
	this.hasColorInformation = false;
	
	this.setColor = function(r0,g0,b0,r1,g1,b1) {
		this.hasColorInformation = true;
		
		this.color = new Object();
		this.color.r0 = r0;
		this.color.g0 = g0;
		this.color.b0 = b0;
		this.color.r1 = r1;
		this.color.g1 = g1;
		this.color.b1 = b1;
	};

	this.getColor = function() {
		if (!this.hasColorInformation)
			return;
		
		color = new Object();
		color.r0 = this.r0;
		color.g0 = this.g0;
		color.b0 = this.b0;
		color.r1 = this.r1;
		color.g1 = this.g1;
		color.b1 = this.b1;
		
		return color;
	};
};
