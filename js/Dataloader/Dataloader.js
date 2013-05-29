/*
* Dataloader.js
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
 * @class Dataloader
 * Implementation for a Dataloader UI
 * @author Sebastian Kruse (skruse@mpiwg-berlin.mpg.de)
 *
 * @param {HTML object} parent div to append the Dataloader
 */
function Dataloader(parent) {

	this.dataLoader = this;
	
	this.parent = parent;
	this.options = parent.options;

	this.initialize();
}

Dataloader.prototype = {

	show : function() {
		this.dataloaderDiv.style.display = "block";
	},

	hide : function() {
		this.dataloaderDiv.style.display = "none";
	},

	initialize : function() {

		this.addKMLLoader();
		this.addKMZLoader();
		this.addCSVLoader();
		this.addLocalKMLLoader();
		this.addLocalCSVLoader();
		
		// trigger change event on the select so 
		// that only the first loader div will be shown
		$(this.parent.gui.loaderTypeSelect).change();
	},
	
	distributeDataset : function(dataSet) {
		GeoTemConfig.addDataset(dataSet);
	},
	
	addKMLLoader : function() {
		$(this.parent.gui.loaderTypeSelect).append("<option value='KMLLoader'>KML File URL</option>");
		
		this.KMLLoaderTab = document.createElement("div");
		$(this.KMLLoaderTab).attr("id","KMLLoader");
		
		this.kmlURL = document.createElement("input");
		$(this.kmlURL).attr("type","text");
		$(this.KMLLoaderTab).append(this.kmlURL);
		
		this.loadKMLButton = document.createElement("button");
		$(this.loadKMLButton).text("load KML");
		$(this.KMLLoaderTab).append(this.loadKMLButton);

		$(this.loadKMLButton).click($.proxy(function(){
			var kmlURL = $(this.kmlURL).val();
			if (typeof this.options.proxy != 'undefined')
				kmlURL = this.options.proxy + kmlURL;
			var kml = GeoTemConfig.getKml(kmlURL);
			if ((typeof kml !== "undefined") && (kml != null)) {
				var dataSet = new Dataset(GeoTemConfig.loadKml(kml));
				
				if (dataSet != null)
					this.distributeDataset(dataSet);
			} else
				alert("Could not load file.");
		},this));

		$(this.parent.gui.loaders).append(this.KMLLoaderTab);
	},
	
	addKMZLoader : function() {
		$(this.parent.gui.loaderTypeSelect).append("<option value='KMZLoader'>KMZ File URL</option>");
		
		this.KMZLoaderTab = document.createElement("div");
		$(this.KMZLoaderTab).attr("id","KMZLoader");
		
		this.kmzURL = document.createElement("input");
		$(this.kmzURL).attr("type","text");
		$(this.KMZLoaderTab).append(this.kmzURL);
		
		this.loadKMZButton = document.createElement("button");
		$(this.loadKMZButton).text("load KMZ");
		$(this.KMZLoaderTab).append(this.loadKMZButton);

		$(this.loadKMZButton).click($.proxy(function(){
	    	
	    	var dataLoader = this;
			
			var kmzURL = $(this.kmzURL).val();
			if (typeof this.options.proxy != 'undefined')
				kmzURL = this.options.proxy + kmzURL;
			
			GeoTemConfig.getKmz(kmzURL, function(kmlArray){
		    	$(kmlArray).each(function(){
					var dataSet = new Dataset(GeoTemConfig.loadKml(this));
						
					if (dataSet != null)
						dataLoader.distributeDataset(dataSet);
		    	});
			});
		},this));

		$(this.parent.gui.loaders).append(this.KMZLoaderTab);
	},
	
	addCSVLoader : function() {
		$(this.parent.gui.loaderTypeSelect).append("<option value='CSVLoader'>CSV File URL</option>");
		
		this.CSVLoaderTab = document.createElement("div");
		$(this.CSVLoaderTab).attr("id","CSVLoader");
		
		this.csvURL = document.createElement("input");
		$(this.csvURL).attr("type","text");
		$(this.CSVLoaderTab).append(this.csvURL);
		
		this.loadCSVButton = document.createElement("button");
		$(this.loadCSVButton).text("load CSV");
		$(this.CSVLoaderTab).append(this.loadCSVButton);

		$(this.loadCSVButton).click($.proxy(function(){
			var dataLoader = this;
			
			var csvURL = $(this.csvURL).val();
			if (typeof this.options.proxy != 'undefined')
				csvURL = this.options.proxy + csvURL;
			GeoTemConfig.getCsv(csvURL, function(json){
				if ((typeof json !== "undefined") && (json.length > 0)) {
					var dataSet = new Dataset(GeoTemConfig.loadJson(json));
					
					if (dataSet != null)
						dataLoader.distributeDataset(dataSet);
				} else
					alert("Could not load file.");
			});
		},this));

		$(this.parent.gui.loaders).append(this.CSVLoaderTab);
	},	
	
	addLocalKMLLoader : function() {
		$(this.parent.gui.loaderTypeSelect).append("<option value='LocalKMLLoader'>local KML File</option>");
		
		this.localKMLLoaderTab = document.createElement("div");
		$(this.localKMLLoaderTab).attr("id","LocalKMLLoader");
		
		this.kmlFile = document.createElement("input");
		$(this.kmlFile).attr("type","file");
		$(this.localKMLLoaderTab).append(this.kmlFile);
		
		this.loadLocalKMLButton = document.createElement("button");
		$(this.loadLocalKMLButton).text("load KML");
		$(this.localKMLLoaderTab).append(this.loadLocalKMLButton);

		$(this.loadLocalKMLButton).click($.proxy(function(){
			var filelist = $(this.kmlFile).get(0).files;
			if (filelist.length > 0){
				var file = filelist[0];
				var fileName = file.name;
				var reader = new FileReader();
				
				reader.onloadend = ($.proxy(function(theFile) {
			        return function(e) {
						var dataSet = new Dataset(GeoTemConfig.loadKml($.parseXML(reader.result)), fileName);
						if (dataSet != null)
							this.distributeDataset(dataSet);
			        };
			    }(file),this));

				reader.readAsText(file);
			}
		},this));

		$(this.parent.gui.loaders).append(this.localKMLLoaderTab);
	},
	
	addLocalCSVLoader : function() {
		$(this.parent.gui.loaderTypeSelect).append("<option value='LocalCSVLoader'>local CSV File</option>");
		
		this.localCSVLoaderTab = document.createElement("div");
		$(this.localCSVLoaderTab).attr("id","LocalCSVLoader");
		
		this.csvFile = document.createElement("input");
		$(this.csvFile).attr("type","file");
		$(this.localCSVLoaderTab).append(this.csvFile);
		
		this.loadLocalCSVButton = document.createElement("button");
		$(this.loadLocalCSVButton).text("load CSV");
		$(this.localCSVLoaderTab).append(this.loadLocalCSVButton);

		$(this.loadLocalCSVButton).click($.proxy(function(){
			var filelist = $(this.csvFile).get(0).files;
			if (filelist.length > 0){
				var file = filelist[0];
				var fileName = file.name;
				var reader = new FileReader();
				
				reader.onloadend = ($.proxy(function(theFile) {
			        return function(e) {
			        	var json = GeoTemConfig.convertCsv(reader.result);
						var dataSet = new Dataset(GeoTemConfig.loadJson(json, fileName));
						if (dataSet != null)
							this.distributeDataset(dataSet);			
			        };
			    }(file),this));

				reader.readAsText(file);
			}
		},this));

		$(this.parent.gui.loaders).append(this.localCSVLoaderTab);
	}
};
