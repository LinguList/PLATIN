/*
* GeoTemConfig.js
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
 * @class GeoTemConfig
 * Global GeoTemCo Configuration File
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 */

var GeoTemConfig = {

	incompleteData : true, // show/hide data with either temporal or spatial metadata
	inverseFilter : true, // if inverse filtering is offered
	mouseWheelZoom : true, // enable/disable zoom with mouse wheel on map & timeplot
	language : 'en', // default language of GeoTemCo
	allowFilter : true, // if filtering should be allowed
	highlightEvents : true, // if updates after highlight events
	selectionEvents : true, // if updates after selection events
	//colors for several datasets; rgb1 will be used for selected objects, rgb0 for unselected
	colors : [{
		r1 : 255,
		g1 : 101,
		b1 : 0,
		r0 : 253,
		g0 : 229,
		b0 : 205
	}, {
		r1 : 144,
		g1 : 26,
		b1 : 255,
		r0 : 230,
		g0 : 225,
		b0 : 255
	}, {
		r1 : 0,
		g1 : 217,
		b1 : 0,
		r0 : 213,
		g0 : 255,
		b0 : 213
	}, {
		r1 : 240,
		g1 : 220,
		b1 : 0,
		r0 : 247,
		g0 : 244,
		b0 : 197
	}]

}

GeoTemConfig.ie = false;
GeoTemConfig.ie8 = false;

GeoTemConfig.independentMapId = 0;
GeoTemConfig.independentTimeId = 0;

if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
	GeoTemConfig.ie = true;
	var ieversion = new Number(RegExp.$1);
	if (ieversion == 8) {
		GeoTemConfig.ie8 = true;
	}
}

GeoTemConfig.getIndependentId = function(target){
	if( target == 'map' ){
		return ++GeoTemConfig.independentMapId;
	}
	if( target == 'time' ){
		return ++GeoTemConfig.independentTimeId;
	}
	return 0;
};

GeoTemConfig.setHexColor = function(hex,index,fill){
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if( fill ){
		GeoTemConfig.colors[index].r0 = parseInt(result[1], 16);
		GeoTemConfig.colors[index].g0 = parseInt(result[2], 16);
		GeoTemConfig.colors[index].b0 = parseInt(result[3], 16);
	}
	else {
		GeoTemConfig.colors[index].r1 = parseInt(result[1], 16);
		GeoTemConfig.colors[index].g1 = parseInt(result[2], 16);
		GeoTemConfig.colors[index].b1 = parseInt(result[3], 16);
	}
}

GeoTemConfig.setRgbColor = function(r,g,b,index,fill){
	if( fill ){
		GeoTemConfig.colors[index].r0 = r;
		GeoTemConfig.colors[index].g0 = g;
		GeoTemConfig.colors[index].b0 = b;
	}
	else {
		GeoTemConfig.colors[index].r1 = r;
		GeoTemConfig.colors[index].g1 = g;
		GeoTemConfig.colors[index].b1 = b;
	}
}

GeoTemConfig.configure = function(urlPrefix) {
	GeoTemConfig.urlPrefix = urlPrefix;
	GeoTemConfig.path = GeoTemConfig.urlPrefix + "images/";
}

GeoTemConfig.applySettings = function(settings) {
	$.extend(this, settings);
};

GeoTemConfig.getColor = function(id){
	if( GeoTemConfig.colors.length <= id ){
		GeoTemConfig.colors.push({
			r1 : Math.floor((Math.random()*255)+1),
			g1 : Math.floor((Math.random()*255)+1),
			b1 : Math.floor((Math.random()*255)+1),
			r0 : 230,
			g0 : 230,
			b0 : 230
		});
	}
	return GeoTemConfig.colors[id];
};

GeoTemConfig.getString = function(field) {
	if ( typeof Tooltips[GeoTemConfig.language] == 'undefined') {
		GeoTemConfig.language = 'en';
	}
	return Tooltips[GeoTemConfig.language][field];
}
/**
 * returns the actual mouse position
 * @param {Event} e the mouseevent
 * @return the top and left position on the screen
 */
GeoTemConfig.getMousePosition = function(e) {
	if (!e) {
		e = window.event;
	}
	var body = (window.document.compatMode && window.document.compatMode == "CSS1Compat") ? window.document.documentElement : window.document.body;
	return {
		top : e.pageY ? e.pageY : e.clientY,
		left : e.pageX ? e.pageX : e.clientX
	};
}
/**
 * returns the json object of the file from the given url
 * @param {String} url the url of the file to load
 * @return json object of given file
 */
GeoTemConfig.getJson = function(url) {
	var data;
	$.ajax({
		url : url,
		async : false,
		dataType : 'json',
		success : function(json) {
			data = json;
		}
	});
	return data;
}

GeoTemConfig.mergeObjects = function(set1, set2) {
	var inside = [];
	var newSet = [];
	for (var i = 0; i < set1.length; i++) {
		inside.push([]);
		newSet.push([]);
		for (var j = 0; j < set1[i].length; j++) {
			inside[i][set1[i][j].index] = true;
			newSet[i].push(set1[i][j]);
		}
	}
	for (var i = 0; i < set2.length; i++) {
		for (var j = 0; j < set2[i].length; j++) {
			if (!inside[i][set2[i][j].index]) {
				newSet[i].push(set2[i][j]);
			}
		}
	}
	return newSet;
};

GeoTemConfig.datasets = [];

GeoTemConfig.addDataset = function(newDataset){
	GeoTemConfig.datasets.push(newDataset);
	Publisher.Publish('filterData', GeoTemConfig.datasets, null);
};

GeoTemConfig.removeDataset = function(index){
	GeoTemConfig.datasets.splice(index,1);
	Publisher.Publish('filterData', GeoTemConfig.datasets, null);
};

/**
 * converts the csv-file into json-format
 * 
 * @param {String}
 *            text
 */
GeoTemConfig.convertCsv = function(text){
	/* convert here from CSV to JSON */
	var json = [];
	/* define expected csv table headers (first line) */
	var expectedHeaders = new Array("Name","Address","Description","Longitude","Latitude","TimeStamp","TimeSpan:begin","TimeSpan:end","weight");
	/* convert csv string to array of arrays using ucsv library */
	var csvArray = CSV.csvToArray(text);
	/* get real used table headers from csv file (first line) */
	var usedHeaders = csvArray[0];
	/* loop outer array, begin with second line */
	for (var i = 1; i < csvArray.length; i++) {
		var innerArray = csvArray[i];
		var dataObject = new Object();
		var tableContent = new Object(); 
	   	/* loop inner array */
		for (var j = 0; j < innerArray.length; j++) {
			/* Name */
			if (usedHeaders[j] == expectedHeaders[0]) {
				dataObject["name"] = ""+innerArray[j];
				tableContent["name"] = ""+innerArray[j];
			}
			/* Address */
			else if (usedHeaders[j] == expectedHeaders[1]) {
				dataObject["place"] = ""+innerArray[j];
				tableContent["place"] = ""+innerArray[j];
			}
			/* Description */
			else if (usedHeaders[j] == expectedHeaders[2]) {
				dataObject["description"] = ""+innerArray[j];
				tableContent["description"] = ""+innerArray[j];
			}
			/* TimeStamp */
			else if (usedHeaders[j] == expectedHeaders[5]) {
				dataObject["time"] = ""+innerArray[j];
			}
			/* TimeSpan:begin */
			else if (usedHeaders[j] == expectedHeaders[6]) {
				tableContent["TimeSpanBegin"] = ""+innerArray[j];
			}
			/* TimeSpan:end */
			else if (usedHeaders[j] == expectedHeaders[7]) {
				tableContent["TimeSpanEnd"] = ""+innerArray[j];
			}   						
			/* weight */
			else if (usedHeaders[j] == expectedHeaders[7]) {
				dataObject["weight"] = ""+innerArray[j];
			}   						
			/* Longitude */                                                          
			else if (usedHeaders[j] == expectedHeaders[3]) {                              
				dataObject["lon"] = parseFloat(innerArray[j]);                                           
			}                                                                        
			/* Latitude */                                                           
			else if (usedHeaders[j] == expectedHeaders[4]) {                              
				dataObject["lat"] = parseFloat(innerArray[j]);
			}
			else {
				var header = new String(usedHeaders[j]);
				//remove leading and trailing Whitespace
				header = $.trim(header);
				tableContent[header] = ""+innerArray[j];
			}
		}
		
		dataObject["tableContent"] = tableContent;
		
		json.push(dataObject);
	}
	
	return json;
};

/**
 * returns the xml dom object of the file from the given url
 * @param {String} url the url of the file to load
 * @return xml dom object of given file
 */
GeoTemConfig.getKml = function(url,asyncFunc) {
	var data;
	var async = false;
	if( asyncFunc ){
		async = true;
	}
	$.ajax({
		url : url,
		async : async,
		dataType : 'xml',
		success : function(xml) {
			if( asyncFunc ){
				asyncFunc(xml);
			}
			else {
				data = xml;
			}
		}
	});
	if( !async ){
		return data;
	}
}

/**
 * returns an array of all xml dom object of the kmls 
 * found in the zip file from the given url
 * 
 * can only be used with asyncFunc (because of browser 
 * constraints regarding arraybuffer)
 * 
 * @param {String} url the url of the file to load
 * @return xml dom object of given file
 */
GeoTemConfig.getKmz = function(url,asyncFunc) {
	var kmlDom = new Array();

	var async = true;
	if( !asyncFunc ){
		//if no asyncFunc is given return an empty array
		return kmlDom;
	}
	
	//use XMLHttpRequest as "arraybuffer" is not 
	//supported in jQuery native $.get
    var req = new XMLHttpRequest();
    req.open("GET",url,async);
    req.responseType = "arraybuffer";
    req.onload = function() {
    	var zip = new JSZip();
    	zip.load(req.response, {base64:false});
    	var kmlFiles = zip.file(new RegExp("kml$"));
    	
    	$(kmlFiles).each(function(){
			var kml = this;
			if (kml.data != null) {
				kmlDom.push($.parseXML(kml.data));
			}
    	});
    	
    	asyncFunc(kmlDom);
    };
	req.send();
};

/**
 * returns the JSON "object"  
 * from the csv file from the given url
 * @param {String} url the url of the file to load
 * @return xml dom object of given file
 */
GeoTemConfig.getCsv = function(url,asyncFunc) {
	var async = false;
	if( asyncFunc ){
		async = true;
	}
	
	//use XMLHttpRequest as synchronous behaviour 
	//is not supported in jQuery native $.get
    var req = new XMLHttpRequest();
    req.open("GET",url,async);
    req.responseType = "text";
    req.onload = function() {
    	var json = GeoTemConfig.convertCsv(req.response);
    	if( asyncFunc )
    		asyncFunc(json);
    };
	req.send();
	
	if( !async ){
		return kmlDom;
	}
};

/**
 * returns a Date and a SimileAjax.DateTime granularity value for a given XML time
 * @param {String} xmlTime the XML time as String
 * @return JSON object with a Date and a SimileAjax.DateTime granularity
 */
GeoTemConfig.getTimeData = function(xmlTime) {
	if (!xmlTime)
		return;
	var dateData;
	try {
		var bc = false;
		if (xmlTime.startsWith("-")) {
			bc = true;
			xmlTime = xmlTime.substring(1);
		}
		var timeSplit = xmlTime.split("T");
		var timeData = timeSplit[0].split("-");
		for (var i = 0; i < timeData.length; i++) {
			parseInt(timeData[i]);
		}
		if (bc) {
			timeData[0] = "-" + timeData[0];
		}
		if (timeSplit.length == 1) {
			dateData = timeData;
		} else {
			var dayData;
			if (timeSplit[1].indexOf("Z") != -1) {
				dayData = timeSplit[1].substring(0, timeSplit[1].indexOf("Z") - 1).split(":");
			} else {
				dayData = timeSplit[1].substring(0, timeSplit[1].indexOf("+") - 1).split(":");
			}
			for (var i = 0; i < timeData.length; i++) {
				parseInt(dayData[i]);
			}
			dateData = timeData.concat(dayData);
		}
	} catch (exception) {
		return null;
	}
	var date, granularity;
	if (dateData.length == 6) {
		granularity = SimileAjax.DateTime.SECOND;
		date = new Date(Date.UTC(dateData[0], dateData[1] - 1, dateData[2], dateData[3], dateData[4], dateData[5]));
	} else if (dateData.length == 3) {
		granularity = SimileAjax.DateTime.DAY;
		date = new Date(Date.UTC(dateData[0], dateData[1] - 1, dateData[2]));
	} else if (dateData.length == 2) {
		granularity = SimileAjax.DateTime.MONTH;
		date = new Date(Date.UTC(dateData[0], dateData[1] - 1, 1));
	} else if (dateData.length == 1) {
		granularity = SimileAjax.DateTime.YEAR;
		date = new Date(Date.UTC(dateData[0], 0, 1));
	}
	if (timeData[0] && timeData[0] < 100) {
		date.setFullYear(timeData[0]);
	}
	return {
		date : date,
		granularity : granularity
	};
}
/**
 * converts a JSON array into an array of data objects
 * @param {JSON} JSON a JSON array of data items
 * @return an array of data objects
 */
GeoTemConfig.loadJson = function(JSON) {
	var mapTimeObjects = [];
	var runningIndex = 0;
	for (var i in JSON ) {
		try {
			var item = JSON[i];
			var index = item.index || item.id || runningIndex++;
			var name = item.name || "";
			var description = item.description || "";
			var tableContent = item.tableContent || [];
			var locations = [];
			if (item.location instanceof Array) {
				for (var j = 0; j < item.location.length; j++) {
					var place = item.location[j].place || "unknown";
					var lon = item.location[j].lon || "";
					var lat = item.location[j].lat || "";
					if ((lon == "" || lat == "" || isNaN(lon) || isNaN(lat) ) && !GeoTemConfig.incompleteData) {
						throw "e";
					}
					locations.push({
						longitude : lon,
						latitude : lat,
						place : place
					});
				}
			} else {
				var place = item.place || "unknown";
				var lon = item.lon || "";
				var lat = item.lat || "";
				if ((lon == "" || lat == "" || isNaN(lon) || isNaN(lat) ) && !GeoTemConfig.incompleteData) {
					throw "e";
				}
				locations.push({
					longitude : lon,
					latitude : lat,
					place : place
				});
			}
			var dates = [];
			if (item.time instanceof Array) {
				for (var j = 0; j < item.time.length; j++) {
					var time = GeoTemConfig.getTimeData(item.time[j]);
					if (time == null && !GeoTemConfig.incompleteData) {
						throw "e";
					}
					dates.push(time);
				}
			} else {
				var time = GeoTemConfig.getTimeData(item.time);
				if (time == null && !GeoTemConfig.incompleteData) {
					throw "e";
				}
				if (time != null) {
					dates.push(time);
				}
			}
			var weight = item.weight || 1;
			var mapTimeObject = new DataObject(name, description, locations, dates, weight, tableContent);
			mapTimeObject.setIndex(index);
			mapTimeObjects.push(mapTimeObject);
		} catch(e) {
			continue;
		}
	}

	return mapTimeObjects;
}
/**
 * converts a KML dom into an array of data objects
 * @param {XML dom} kml the XML dom for the KML file
 * @return an array of data objects
 */
GeoTemConfig.loadKml = function(kml) {
	var mapObjects = [];
	var elements = kml.getElementsByTagName("Placemark");
	if (elements.length == 0) {
		return [];
	}
	var index = 0;
	for (var i = 0; i < elements.length; i++) {
		var placemark = elements[i];
		var name, description, place, granularity, lon, lat, tableContent = [], time = [], location = [];
		var weight = 1;
		var timeData = false, mapData = false;
		try {
			name = placemark.getElementsByTagName("name")[0].childNodes[0].nodeValue;
			tableContent["name"] = name;
		} catch(e) {
			name = "";
		}

		try {
			description = placemark.getElementsByTagName("description")[0].childNodes[0].nodeValue;
			tableContent["description"] = description;
		} catch(e) {
			description = "";
		}

		try {
			place = placemark.getElementsByTagName("address")[0].childNodes[0].nodeValue;
			tableContent["place"] = place;
		} catch(e) {
			place = "";
		}

		try {
			var coordinates = placemark.getElementsByTagName("Point")[0].getElementsByTagName("coordinates")[0].childNodes[0].nodeValue;
			var lonlat = coordinates.split(",");
			lon = lonlat[0];
			lat = lonlat[1];
			if (lon == "" || lat == "" || isNaN(lon) || isNaN(lat)) {
				throw "e";
			}
			location.push({
				longitude : lon,
				latitude : lat,
				place : place
			});
		} catch(e) {
			if (!GeoTemConfig.incompleteData) {
				continue;
			}
		}

		try {
			var tuple = GeoTemConfig.getTimeData(placemark.getElementsByTagName("TimeStamp")[0].getElementsByTagName("when")[0].childNodes[0].nodeValue);
			if (tuple != null) {
				time.push(tuple);
				timeData = true;
			} else if (!GeoTemConfig.incompleteData) {
				continue;
			}
		} catch(e) {
			try {
				throw "e";
				var timeSpanTag = placemark.getElementsByTagName("TimeSpan")[0];
				var tuple1 = GeoTemConfig.getTimeData(timeSpanTag.getElementsByTagName("begin")[0].childNodes[0].nodeValue);
				timeStart = tuple1.d;
				granularity = tuple1.g;
				var tuple2 = GeoTemConfig.getTimeData(timeSpanTag.getElementsByTagName("end")[0].childNodes[0].nodeValue);
				timeEnd = tuple2.d;
				if (tuple2.g > granularity) {
					granularity = tuple2.g;
				}
				timeData = true;
			} catch(e) {
				if (!GeoTemConfig.incompleteData) {
					continue;
				}
			}
		}
		var object = new DataObject(name, description, location, time, 1, tableContent);
		object.setIndex(index);
		index++;
		mapObjects.push(object);
	}
	return mapObjects;
};
