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
 * @class Storytellingv2Widget
 * Storytellingv2Widget Implementation
 * @author Mike Bretschneider (mike.bretschneider@gmx.de)
 *
 * @param {WidgetWrapper} core wrapper for interaction to other widgets
 * @param {HTML object} div parent div to append the Storytellingv2 widget div
 * @param {JSON} options user specified configuration that overwrites options in Storytellingv2Config.js
 */
Storytellingv2Widget = function(core, div, options) {

	this.datasets;
	this.core = core;
	this.core.setWidget(this);
	this.currentStatus = new Object();

	this.options = (new Storytellingv2Config(options)).options;
	this.storytellingv2 = new Storytellingv2(this);
	this.gui = new Storytellingv2Gui(this, div, this.options);
	
	this.datasetLink;
	
	this.selected;
	this.configArray = [];
	
	this.simplemode = true;
	
	this.initWidget();
	
}

Storytellingv2Widget.prototype = {

	initWidget : function(data) {
		
		
		var storytellingv2Widget = this;
		var gui = storytellingv2Widget.gui;
		
		storytellingv2Widget.datasets = data;
		
		gui.initGui();
		
	},
	
	createLink : function() {
	},
	
	highlightChanged : function(objects) {
	},

	selectionChanged : function(selection) {
		if (!selection.valid()) {
			selection.loadAllObjects();
		}
		this.selected = selection.objects;
	},
	
	sendConfig : function(widgetConfig){
		for (var i = 0; i < this.configArray.length; i++) {
			if (this.configArray[i].widgetName == widgetConfig.widgetName) {
				this.configArray.splice(i,1);
			}
		}
		this.configArray.push(widgetConfig);
	},

};
