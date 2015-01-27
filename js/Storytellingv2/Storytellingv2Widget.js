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
	
	this.selected;
	
	this.initWidget();
	
}

Storytellingv2Widget.prototype = {

	initWidget : function(data) {
		var storytellingv2Widget = this;
		var gui = storytellingv2Widget.gui;
		
		storytellingv2Widget.datasets = data;
		
		
		$(gui.storytellingv2Container).empty();
		
		var tree = $('<div style="border: 2px solid; padding: 5px; float: left;" id="storytellingv2jstree"><ul></ul></div>');		
		tree.jstree({
			'core' : {
				'check_callback' : true,
			},
		});
				
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
		var metadataname = $('<p>Name:</p>');
		var metadatatimestamp = $('<p>Timestamp:</p>');
		var metadatadescription = $('<p>Description:</p>');
		var metadataselected = $('<p></p>');
		$(metadatafieldset).append(metadataname);
		$(metadatafieldset).append(metadatatimestamp);
		$(metadatafieldset).append(metadatadescription);
		$(metadatafieldset).append(metadataselected);
		$(metadata).append(metadatafieldset);
			
		tree.on('select_node.jstree', function(e, data) {
			$(metadataname).empty().append($('<p>Name: '+data.node.text+'</p>'));
			var tstamp = new Date(data.node.li_attr.timestamp);
			$(metadatatimestamp).empty().append($('<p>Timestamp: '+tstamp.toUTCString()+'</p>'));
			$(metadatadescription).empty().append($('<p>Description: '+data.node.li_attr.description+'</p>'));
			var objectcount = 0;
			var datasetcount = 0;
			if ($.isArray(data.node.li_attr.selected)) {
				datasetcount = data.node.li_attr.selected.length;
				$(data.node.li_attr.selected).each(function() {
					objectcount += this.length;
				});
			}
			$(metadataselected).empty().append($('<p>'+objectcount+' Selected Objects in '+datasetcount+' Datasets</p>'));
			
			console.log(data);
		});
		
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
				var sel = tree.jstree().get_selected();
				sel = tree.jstree().create_node(null, {
					"text" : $(nameinput).find(':text').first().val(),
					"li_attr" : {
						"timestamp" : Date.now(),
						"description" : $(descriptioninput).find('textarea').first().val(),
						"selected" : storytellingv2Widget.selected,
					}
				});
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
		if (!selection.valid()) {
			selection.loadAllObjects();
		}
		this.selected = selection.objects;
	},
};
