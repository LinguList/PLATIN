/*
* Overlayloader.js
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
 * @class Overlayloader
 * Implementation for a Overlayloader UI
 * @author Sebastian Kruse (skruse@mpiwg-berlin.mpg.de)
 *
 * @param {HTML object} parent div to append the Overlayloader
 */
function Overlayloader(parent) {

	this.overlayLoader = this;
	
	this.parent = parent;
	this.options = parent.options;
	this.attachedMapWidgets = parent.attachedMapWidgets;

	this.overlays = [];

	this.initialize();
}

Overlayloader.prototype = {

	show : function() {
		this.overlayloaderDiv.style.display = "block";
	},

	hide : function() {
		this.overlayloaderDiv.style.display = "none";
	},

	initialize : function() {

		this.addKMLLoader();
		this.addKMZLoader();
		this.addArcGISWMSLoader();
		this.addXYZLoader();
		this.addRomanEmpireLoader();
		this.addDARIAHMapLoader();
		
		// trigger change event on the select so 
		// that only the first loader div will be shown
		$(this.parent.gui.loaderTypeSelect).change();
	},
	
	distributeKML : function(kmlURL) {
		var newOverlay = new Object();
		newOverlay.name = kmlURL;
		newOverlay.layers = [];
		
		$(this.attachedMapWidgets).each(function(){
			var newLayer = new OpenLayers.Layer.Vector("KML", {
				projection: this.openlayersMap.displayProjection,
	            strategies: [new OpenLayers.Strategy.Fixed()],
	            protocol: new OpenLayers.Protocol.HTTP({
	                url: kmlURL,
	                format: new OpenLayers.Format.KML({
	                    extractStyles: true,
	                    extractAttributes: true
	                })
	            })
	        });
			
			newOverlay.layers.push({map:this.openlayersMap,layer:newLayer});

			this.openlayersMap.addLayer(newLayer);
		});
		
		this.overlays.push(newOverlay);
		this.parent.gui.refreshOverlayList();
	},
	
	distributeKMZ : function(kmzURL) {
		var newOverlay = new Object();
		newOverlay.name = kmzURL;
		newOverlay.layers = [];
		
		$(this.attachedMapWidgets).each(function(){
			var newLayer = new OpenLayers.Layer.Vector("KML", {
				projection: this.openlayersMap.displayProjection,
				strategies: [new OpenLayers.Strategy.Fixed()],
				format: OpenLayers.Format.KML,
				extractAttributes: true
			});
			
			newOverlay.layers.push({map:this.openlayersMap,layer:newLayer});
			
			var map = this.openlayersMap;
					
			GeoTemConfig.getKmz(kmzURL, function(kmlDoms){
				$(kmlDoms).each(function(){
					var kml = new OpenLayers.Format.KML().read(this);
					newLayer.addFeatures(kml);
					map.addLayer(newLayer);
				});
			});
		});
		
		this.overlays.push(newOverlay);
		this.parent.gui.refreshOverlayList();
	},
	
	distributeArcGISWMS : function(wmsURL, wmsLayer) {
		var newOverlay = new Object();
		newOverlay.name = wmsURL + " - " + wmsLayer;
		newOverlay.layers = [];
		
		var newLayer = new OpenLayers.Layer.WMS("ArcGIS WMS label", wmsURL, {
				layers: wmsLayer,
				format: "image/png",
				transparent: "true"
			}
	    	,{
	    		projection : "EPSG:3857"
	    	}
		);

		newLayer.setIsBaseLayer(false);
		$(this.attachedMapWidgets).each(function(){
			this.openlayersMap.addLayer(newLayer);
			newOverlay.layers.push({map:this.openlayersMap,layer:newLayer});			
		});
		
		this.overlays.push(newOverlay);
		this.parent.gui.refreshOverlayList();
	},

	distributeXYZ : function(xyzURL) {
		var newOverlay = new Object();
		newOverlay.name = xyzURL;
		newOverlay.layers = [];
		
        var newLayer = new OpenLayers.Layer.XYZ(
                "XYZ Layer",
                [
                  xyzURL
                ], {
                sphericalMercator: true,
                transitionEffect: "resize",
                buffer: 1,
                numZoomLevels: 12,
                transparent : true
              }
            );

		newLayer.setIsBaseLayer(false);
		$(this.attachedMapWidgets).each(function(){
			this.openlayersMap.addLayer(newLayer);
			this.openlayersMap.setBaseLayer(newLayer);
			newOverlay.layers.push({map:this.openlayersMap,layer:newLayer});
		});
		
		this.overlays.push(newOverlay);
		this.parent.gui.refreshOverlayList();
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
			
			this.distributeKML(kmlURL);
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
			var kmzURL = $(this.kmzURL).val();
			if (typeof this.options.proxy != 'undefined')
				kmzURL = this.options.proxy + kmzURL;
			
			this.distributeKMZ(kmzURL);
		},this));

		$(this.parent.gui.loaders).append(this.KMZLoaderTab);
	},
	
	addArcGISWMSLoader : function() {
		$(this.parent.gui.loaderTypeSelect).append("<option value='ArcGISWMSLoader'>ArcGIS WMS</option>");
		
		this.ArcGISWMSLoaderTab = document.createElement("div");
		$(this.ArcGISWMSLoaderTab).attr("id","ArcGISWMSLoader");
		
		$(this.ArcGISWMSLoaderTab).append("URL: ");
		
		this.wmsURL = document.createElement("input");
		$(this.wmsURL).attr("type","text");
		$(this.ArcGISWMSLoaderTab).append(this.wmsURL);
		
		$(this.ArcGISWMSLoaderTab).append("Layer: ");
		
		this.wmsLayer = document.createElement("input");
		$(this.wmsLayer).attr("type","text");
		$(this.ArcGISWMSLoaderTab).append(this.wmsLayer);
		
		this.loadArcGISWMSButton = document.createElement("button");
		$(this.loadArcGISWMSButton).text("load Layer");
		$(this.ArcGISWMSLoaderTab).append(this.loadArcGISWMSButton);

		$(this.loadArcGISWMSButton).click($.proxy(function(){
			var wmsURL = $(this.wmsURL).val();
			var wmsLayer = $(this.wmsLayer).val();
			
			this.distributeArcGISWMS(wmsURL, wmsLayer);
		},this));

		$(this.parent.gui.loaders).append(this.ArcGISWMSLoaderTab);
	},
	
	addXYZLoader : function() {
		$(this.parent.gui.loaderTypeSelect).append("<option value='XYZLoader'>XYZ Layer</option>");
		
		this.XYZLoaderTab = document.createElement("div");
		$(this.XYZLoaderTab).attr("id","XYZLoader");
		
		$(this.XYZLoaderTab).append("URL (with x,y,z variables): ");
		
		this.xyzURL = document.createElement("input");
		$(this.xyzURL).attr("type","text");
		$(this.XYZLoaderTab).append(this.xyzURL);
		
		this.loadXYZButton = document.createElement("button");
		$(this.loadXYZButton).text("load Layer");
		$(this.XYZLoaderTab).append(this.loadXYZButton);

		$(this.loadXYZButton).click($.proxy(function(){
			var xyzURL = $(this.xyzURL).val();
			
			this.distributeXYZ(xyzURL);
		},this));

		$(this.parent.gui.loaders).append(this.XYZLoaderTab);
	},
	
	addRomanEmpireLoader : function() {
		$(this.parent.gui.loaderTypeSelect).append("<option value='RomanEmpireLoader'>Roman Empire</option>");
		
		this.RomanEmpireLoaderTab = document.createElement("div");
		$(this.RomanEmpireLoaderTab).attr("id","RomanEmpireLoader");

		this.loadRomanEmpireButton = document.createElement("button");
		$(this.loadRomanEmpireButton).text("load Layer");
		$(this.RomanEmpireLoaderTab).append(this.loadRomanEmpireButton);

		$(this.loadRomanEmpireButton).click($.proxy(function(){
			this.distributeXYZ("http://pelagios.dme.ait.ac.at/tilesets/imperium/${z}/${x}/${y}.png");
		},this));

		$(this.parent.gui.loaders).append(this.RomanEmpireLoaderTab);
	},
	
	addDARIAHMapLoader : function() {
		$(this.parent.gui.loaderTypeSelect).append("<option value='DARIAHMapLoader'>DARIAH maps</option>");
		
		this.DARIAHMapLoaderTab = document.createElement("div");
		$(this.DARIAHMapLoaderTab).attr("id","DARIAHMapLoader");

		this.DARIAHMapSelect = document.createElement("select");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry1994'>Contemporary Map (1994)</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry1945'>Historical Map of 1945</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry1938'>Historical Map of 1938</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry1920'>Historical Map of 1920</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry1914'>Historical Map of 1914</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry1880'>Historical Map of 1880</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry1815'>Historical Map of 1815</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry1783'>Historical Map of 1783</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry1715'>Historical Map of 1715</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry1650'>Historical Map of 1650</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry1530'>Historical Map of 1530</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry1492'>Historical Map of 1492</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry1279'>Historical Map of 1279</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry1000'>Historical Map of 1000</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry800'>Historical Map of 800</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry600'>Historical Map of 600</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry400'>Historical Map of 400</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry1bc'>Historical Map of 1 BC</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry200bc'>Historical Map of 200 BC</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry323bc'>Historical Map of 323 BC</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry500bc'>Historical Map of 500 BC</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry1000bc'>Historical Map of 1000 BC</option>");
		$(this.DARIAHMapSelect).append("<option value='historic:cntry2000bc'>Historical Map of 2000 BC</option>");
		$(this.DARIAHMapLoaderTab).append(this.DARIAHMapSelect);

		this.loadDARIAHMapButton = document.createElement("button");
		$(this.loadDARIAHMapButton).text("load Layer");
		$(this.DARIAHMapLoaderTab).append(this.loadDARIAHMapButton);
		
		$(this.loadDARIAHMapButton).click($.proxy(function(){
			this.distributeArcGISWMS("http://dev2.dariah.eu/geoserver/wms",$(this.DARIAHMapSelect).val());
		},this));

		$(this.parent.gui.loaders).append(this.DARIAHMapLoaderTab);
	}

};
