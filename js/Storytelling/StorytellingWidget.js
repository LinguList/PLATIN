/*
* StorytellingWidget.js
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
 * @class StorytellingWidget
 * StorytellingWidget Implementation
 * @author Sebastian Kruse (skruse@mpiwg-berlin.mpg.de)
 *
 * @param {WidgetWrapper} core wrapper for interaction to other widgets
 * @param {HTML object} div parent div to append the Storytelling widget div
 * @param {JSON} options user specified configuration that overwrites options in StorytellingConfig.js
 */
function StorytellingWidget(core, div, options) {

	this.datasets;
	this.core = core;
	this.core.setWidget(this);

	this.options = (new StorytellingConfig(options)).options;
	this.gui = new StorytellingGui(this, div, this.options);
}

StorytellingWidget.prototype = {

	initWidget : function(data) {
		var storytellingWidget = this;
		var gui = storytellingWidget.gui;
		
		storytellingWidget.datasets = data;
		
		$(gui.storytellingContainer).empty();
		
		var magneticLinkParam = "";
		$(storytellingWidget.datasets).each(function(){
			
			if (magneticLinkParam.length > 0)
				magneticLinkParam += "&";

			var paragraph = $("<p></p>");
			paragraph.append(this.label);
			if (typeof this.url !== "undefined"){
				//TODO: makes only sense for KML or CSV URLs, so "type" of
				//URL should be preserved (in dataset).
				//startsWith and endsWith defined in SIMILE Ajax (string.js) 
				if (this.url.toLowerCase().endsWith("kml")){
					magneticLinkParam += "kml=";
				} else {
					magneticLinkParam += "csv=";
				}
				magneticLinkParam += this.url;
				
				var tableLinkDiv = document.createElement('a');
				tableLinkDiv.title = this.url;
				tableLinkDiv.href = this.url;
				tableLinkDiv.target = '_';
				tableLinkDiv.setAttribute('class', 'externalLink');
				paragraph.append(tableLinkDiv);
			} else {
				
			}
			
			$(gui.storytellingContainer).append(paragraph);
		});
		
		var magneticLink = document.createElement('a');
		$(magneticLink).append("Magnetic Link");
		magneticLink.title = "Use this link to reload currently loaded (online) data.";
		magneticLink.href = "?"+magneticLinkParam;
		magneticLink.target = '_';
		$(gui.storytellingContainer).prepend(magneticLink);
	},
	
	highlightChanged : function(objects) {
	},

	selectionChanged : function(selection) {
	},
};
