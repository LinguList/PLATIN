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
		this.addArcGISWMSLoader();
		
		// trigger change event on the select so 
		// that only the first loader div will be shown
		$(this.parent.gui.loaderTypeSelect).change();
	},
	
	distributeKML : function(kmlURL) {
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

			this.openlayersMap.addLayer(newLayer);
		});
	},
	
	distributeArcGISWMS : function(wmsURL, wmsLayer) {
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
		});
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
	}	
};
