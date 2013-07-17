/*
* DataloaderWidget.js
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
 * @class DataloaderWidget
 * DataloaderWidget Implementation
 * @author Sebastian Kruse (skruse@mpiwg-berlin.mpg.de)
 *
 * @param {WidgetWrapper} core wrapper for interaction to other widgets
 * @param {HTML object} div parent div to append the Dataloader widget div
 * @param {JSON} options user specified configuration that overwrites options in DataloaderConfig.js
 */
function DataloaderWidget(core, div, options) {

	this.core = core;
	this.core.setWidget(this);

	this.options = (new DataloaderConfig(options)).options;
	this.gui = new DataloaderGui(this, div, this.options);
	
	this.dataLoader = new Dataloader(this);
}

DataloaderWidget.prototype = {

	initWidget : function() {

		var dataloaderWidget = this;
	},

	highlightChanged : function(objects) {
		if( !GeoTemConfig.highlightEvents ){
			return;
		}
	},

	selectionChanged : function(selection) {
		if( !GeoTemConfig.selectionEvents ){
			return;
		}
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
	
	loadFromURL : function() {
		var dataLoaderWidget = this;
		//using jQuery-URL-Parser (https://github.com/skruse/jQuery-URL-Parser)
		$.each($.url().param(),function(paramName, paramValue){
			//startsWith and endsWith defined in SIMILE Ajax (string.js)
			var fileName = $.url(paramValue).attr('file');
			var origURL = paramValue;
			if (typeof dataLoaderWidget.options.proxy != 'undefined')
				paramValue = dataLoaderWidget.options.proxy + paramValue;
			if (paramName.toLowerCase().startsWith("kml")){
				GeoTemConfig.getKml(paramValue,function(kmlDoc){
					var dataSet = new Dataset(GeoTemConfig.loadKml(kmlDoc), fileName, origURL);
					if (dataSet != null)
						dataLoaderWidget.dataLoader.distributeDataset(dataSet);			
				});
			}
			else if (paramName.toLowerCase().startsWith("csv")){
				GeoTemConfig.getCsv(paramValue,function(json){
					var dataSet = new Dataset(GeoTemConfig.loadJson(json), fileName, origURL);
					if (dataSet != null)
						dataLoaderWidget.dataLoader.distributeDataset(dataSet);			
				});
			}
		});
	}
};
