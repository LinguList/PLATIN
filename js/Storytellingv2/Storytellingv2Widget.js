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
	this.gui = new Storytellingv2Gui(this, div, this.options);
	
	this.datasetLink;
	
	this.initWidget();
	
	Publisher.Subscribe('mapChanged', this, function(mapName) {
		this.client.currentStatus["mapChanged"] = mapName;
		this.client.createLink();
	});
	
	var currentStatus = $.url().param("currentStatus");
	if (typeof currentStatus !== "undefined"){
		this.currentStatus = $.deparam(currentStatus);
		$.each(this.currentStatus,function(action,data){
			Publisher.Publish(action, data, this);
		});
	}
}

Storytellingv2Widget.prototype = {

	initWidget : function(data) {
		var storytellingv2Widget = this;
		var gui = storytellingv2Widget.gui;
		
		storytellingv2Widget.datasets = data;
		
		$(gui.storytellingv2Container).empty();
		
		var tree = $('<div style="border: 2px solid; padding: 5px; float: left;" id="storytellingv2jstree"><ul><li>Checkpoint 1<ul><li>Checkpoint 1a</li><li>Checkpoint 1b</li><li>Checkpoint 1c</li></ul></li></ul></div>');		
		tree.jstree();
		
		var menu = $('<div style="float: left;"></div>');
		
		var importexportsubmenu = $('<div style="border: 2px solid; margin: 2px; padding: 5px;"></div>');
		var importbutton = $('<input type="button" id="storytellingv2import" name="import" value="import" />');
		var exportbutton = $('<input type="button" id="storytellingv2export" name="export" value="export" />');
		var resetbutton = $('<input type="button" id="storytellingv2reset" name="reset" value="reset" />');
		$(importexportsubmenu).append(importbutton);
		$(importexportsubmenu).append(exportbutton);
		$(importexportsubmenu).append(resetbutton);
		
		var treemanipulationsubmenu = $('<div style="border: 2px solid; margin: 2px; padding: 5px;"></div>');
		var newbutton = $('<input type="button" id="storytellingv2new" name="new" value="new" />');
		var loadbutton = $('<input type="button" id="storytellingv2load" name="load" value="load" />');
		var deletebutton = $('<input type="button" id="storytellingv2delete" name="delete" value="delete" />');
		var renamebutton = $('<input type="button" id="storytellingv2rename" name="rename" value="rename" />');
		var forwardbutton = $('<input type="button" id="storytellingv2forward" name="forward" value=">>" />');
		var backwardbutton = $('<input type="button" id="storytellingv2backward" name="backward" value="<<" />');
		$(treemanipulationsubmenu).append(newbutton);
		$(treemanipulationsubmenu).append(loadbutton);
		$(treemanipulationsubmenu).append(deletebutton);
		$(treemanipulationsubmenu).append(renamebutton);
		$(treemanipulationsubmenu).append(backwardbutton);
		$(treemanipulationsubmenu).append(forwardbutton);		
		
		var metadata = $('<div></div>');
		var metadatafieldset = $('<fieldset style="border: 2px solid; margin: 2px; padding: 5px;"><legend>Metadata</legend></fieldset>');
		var metadataname = $('<p>Name: Checkpoint 1</p>');
		var metadatatimestamp = $('<p>Timestamp: 10/10/92 14:32</p>');
		var metadatadescription = $('<p>Description: This is Checkpoint 1</p>');
		$(metadatafieldset).append(metadataname);
		$(metadatafieldset).append(metadatatimestamp);
		$(metadatafieldset).append(metadatadescription);
		$(metadata).append(metadatafieldset);
			
		$(gui.storytellingv2Container).append(tree);
		$(menu).append(importexportsubmenu);
		$(menu).append(treemanipulationsubmenu);
		$(menu).append(metadata);
		$(gui.storytellingv2Container).append(menu);
		
		newbutton.click($.proxy(function() {
			var newform = $('<div></div>');
			var nameinput = $('<p>Name: <input type="text" /></p>');
			var descriptioninput = $('<p>Description: <textarea name="description"></textarea></p>');
			var addbutton = $('<p><input type="button" name="add" value="add" /></p>');
			addbutton.click($.proxy(function() {
				$(tree).jstree().create_node("test");
				$(newform).empty();
			}));
			$(newform).append(nameinput);
			$(newform).append(descriptioninput);
			$(newform).append(addbutton);
			$(treemanipulationsubmenu).append(newform);
		}));
		
	},
	
	createLink : function() {
	},
	
	highlightChanged : function(objects) {
	},

	selectionChanged : function(selection) {
	},
};
