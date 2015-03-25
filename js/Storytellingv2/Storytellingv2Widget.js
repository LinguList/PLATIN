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
	this.configArray = [];
	
	this.simplemode = true;
	
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
			'plugins' : [ 'dnd', 'types' ],
			'types' : {
				'#' : {
					valid_children : ['session']
				},
				'session' : {
					valid_children : ['dataset', 'config']
				},
				'dataset' : {
					'valid_children' : ['config'],
					'icon' : 'lib/jstree/themes/default/dataset.png'
				},
				'config' : {
					'valid_children' : ['config'],
					'icon' : 'lib/jstree/themes/default/filter.png'
				},
				'snapshot' : {
					'valid_children' : []
				}
			}
		});
				
		var menu = $('<div style="float: left;"></div>');
		
		var importexportsubmenu = $('<div style="border: 2px solid; margin: 2px; padding: 5px;"></div>');
		var importbutton = $('<input type="button" id="storytellingv2import" name="import" value="import" />');
		var exportbutton = $('<input type="button" id="storytellingv2export" name="export" value="export" />');
		var resetbutton = $('<input type="button" id="storytellingv2reset" name="reset" value="reset" />');
		var importfile = $('<input type="file" id="storytellingv2importfile" accept="application/json" style="display: block; visibility:hidden; width: 0; height: 0" />');
		var expertbutton = $('<input type="button" id="storytellingv2expert" name="expert" value="expert" />');
		var simplebutton = $('<input type="button" id="storytellingv2simple" name="simple" value="simple" />');
		simplebutton.hide();
		$(importexportsubmenu).append(importbutton);
		$(importexportsubmenu).append(exportbutton);
		$(importexportsubmenu).append(resetbutton);
		$(importexportsubmenu).append(expertbutton);
		$(importexportsubmenu).append(simplebutton);
		$(importexportsubmenu).append(importfile);
		
		exportbutton.click($.proxy(function() {
			var tree_as_json = JSON.stringify($('#storytellingv2jstree').jstree(true).get_json('#', { 'flat': true }));
			var exportdate = new Date().toUTCString();
			
			var pom = document.createElement('a');
			pom.setAttribute('href','data:application/json;charset=UTF-8, ' + encodeURIComponent(tree_as_json));
			pom.setAttribute('download','Storytelling State(' + exportdate + ').json');
			pom.click();
		}));
		
		var deleteAllNodes = function() {
			var nodes = tree.jstree().get_children_dom('#');
			nodes.each(function() {
				tree.jstree().delete_node(this);
			});
		};
		
		var findNodesByType = function(type, parent) {
			if (parent != undefined) {
				parent = tree.jstree().get_node(parent);
			} else {
				parent = tree.jstree().get_node('#');
			}
			var nodes = new Array();
			
			if (parent.type == type) {
				nodes.push(parent);
			}
			for (var i = 0; i < parent.children_d.length; i++) {
				var n = tree.jstree().get_node(parent.children_d[i]);
				if (n.type == type) {
					nodes.push(n);
				}
			}
			
			return nodes;
		};
		
		
		var handleFileSelect = function(evt) {
			var file = evt.target.files[0];
			
			var reader = new FileReader();
			
			reader.onload = (function(f) {
				return function(e) {
					var treedata = JSON.parse(e.target.result);
					deleteAllNodes();
					for (var i = 0; i < treedata.length; i++) {
						tree.jstree().create_node(treedata[i].parent,treedata[i]);
					};
				}
			})(file);
			reader.readAsText(file);
		}
		importfile.change(handleFileSelect);
		
		importbutton.click($.proxy(function() {
			importfile.click();
		}));
		
		resetbutton.click($.proxy(function() {
			deleteAllNodes();
			
		}));
		
		var makeSimple = function() {
			var configs = findNodesByType('config');
			var datasets = findNodesByType('dataset');
			for (var i = 0; i < datasets.length; i++) {
				tree.jstree().set_type(datasets[i], 'snapshot');
				datasets[i].li_attr.dataset_text = datasets[i].text;
				datasets[i].text = datasets[i].li_attr.snapshot_text || datasets[i].text;
			}			
			for (var i = 0; i < configs.length; i++) {
				console.log(tree.jstree().get_node(configs[i], true));
				var c = tree.jstree().get_node(configs[i], true);
				$(c).hide();
			}
		};
		
		simplebutton.click($.proxy(function() {
			simplebutton.hide();
			expertbutton.show();
			newbutton.hide();
			snapshotbutton.show();
			storytellingv2Widget.simplemode = true;
			makeSimple();
		}));
		
		expertbutton.click($.proxy(function() {
			expertbutton.hide();
			simplebutton.show();
			snapshotbutton.hide();
			newbutton.show();
			storytellingv2Widget.simplemode = false;
			var configs = findNodesByType('config');
			for (var i = 0; i < configs.length; i++) {
				tree.jstree().get_node(configs[i], true).show();
			}
			var snapshots = findNodesByType('snapshot');
			for (var i = 0; i < snapshots.length; i++) {
				tree.jstree().set_type(snapshots[i], 'dataset');
				snapshots[i].li_attr.snapshot_text = snapshots[i].text;
				snapshots[i].text = snapshots[i].li_attr.dataset_text || snapshots[i].text;
			}
			
		}));
		
		var treemanipulationsubmenu = $('<div style="border: 2px solid; margin: 2px; padding: 5px;"></div>');
		var newbutton = $('<input type="button" id="storytellingv2new" name="new" value="new" />');
		var snapshotbutton = $('<input type="button" id="storytellingv2snapshot" name="snapshot" value="snapshot" />');
		var loadbutton = $('<input type="button" id="storytellingv2load" name="load" value="load" />');
		var deletebutton = $('<input type="button" id="storytellingv2delete" name="delete" value="delete" />');
		var renamebutton = $('<input type="button" id="storytellingv2rename" name="rename" value="rename" />');
		var forwardbutton = $('<input type="button" id="storytellingv2forward" name="forward" value=">>" />');
		var backwardbutton = $('<input type="button" id="storytellingv2backward" name="backward" value="<<" />');
		$(treemanipulationsubmenu).append(newbutton);
		$(treemanipulationsubmenu).append(snapshotbutton);
		$(treemanipulationsubmenu).append(loadbutton);
		$(treemanipulationsubmenu).append(deletebutton);
		$(treemanipulationsubmenu).append(renamebutton);
		$(treemanipulationsubmenu).append(backwardbutton);
		$(treemanipulationsubmenu).append(forwardbutton);		
		
		newbutton.hide();
		
		var metadata = $('<div></div>');
		var metadatafieldset = $('<fieldset style="border: 2px solid; margin: 2px; padding: 5px;"><legend>Metadata</legend></fieldset>');
		var metadataname = $('<p>Name:</p>');
		var metadatatype = $('<p>Type:</p>');
		var metadatatimestamp = $('<p>Timestamp:</p>');
		var metadatadescription = $('<p>Description:</p>');
		var metadataselected = $('<p></p>');
		$(metadatafieldset).append(metadataname);
		$(metadatafieldset).append(metadatatype);
		$(metadatafieldset).append(metadatatimestamp);
		$(metadatafieldset).append(metadatadescription);
		$(metadatafieldset).append(metadataselected);
		$(metadata).append(metadatafieldset);
			
		tree.on('select_node.jstree', function(e, data) {
			$(metadataname).empty().append($('<p>Name: '+data.node.text+'</p>'));
			$(metadatatype).empty().append($('<p>Type: '+data.node.type+'</p>'));
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
//			$(metadataselected).empty().append($('<p>'+objectcount+' Selected Objects in '+datasetcount+' Datasets</p>'));
			console.log(data.node);
		});
		
		$(gui.storytellingv2Container).append(tree);
		$(menu).append(importexportsubmenu);
		$(menu).append(treemanipulationsubmenu);
		$(menu).append(metadata);
		$(gui.storytellingv2Container).append(menu);
		
		newbutton.click($.proxy(function() {
			defaultSession();
			var newform = $('<div></div>');
			var nameinput = $('<p>Name: <input type="text" /></p>');
			var typeinput = $('<p>Type: <select name="type"><option value="session">Session</option><option value="dataset">Dataset</option><option value="config">Config</option></select></p>');
			var descriptioninput = $('<p>Description: <textarea name="description"></textarea></p>');
			var addbutton = $('<p><input type="button" name="add" value="add" /></p>');
			addbutton.click($.proxy(function() {
				var sel = tree.jstree().get_selected()[0] || '#' ;
				if ($(typeinput).find('option:selected').val() == 'session') {
					sel = '#';
				}
				sel = tree.jstree().create_node(sel, {
					"text" : $(nameinput).find(':text').first().val(),
					"type" : $(typeinput).find('option:selected').val(),
					"li_attr" : {
						"timestamp" : Date.now(),
						"description" : $(descriptioninput).find('textarea').first().val()
					}
				});
				var newNode = tree.jstree().get_node(sel);
				
				if (newNode.type == 'config') {
					Publisher.Publish('getConfig',storytellingv2Widget);
					newNode.li_attr.configs = storytellingv2Widget.configArray;
				} else if (newNode.type == 'dataset') {
					newNode.li_attr.selected = storytellingv2Widget.selected;
					newNode.li_attr.datasets = storytellingv2Widget.datasets;
				}
//				tree.jstree().set_type(sel, 'session');
				$(newform).empty();
			}));
			$(newform).append(nameinput);
			$(newform).append(typeinput);
			$(newform).append(descriptioninput);
			$(newform).append(addbutton);
			$(treemanipulationsubmenu).append(newform);
		}));
	
		var defaultSession = function() {
			if (tree.jstree().is_leaf('#')) {
				tree.jstree().create_node('#', {
					'text' : 'Session #1',
					'type' : 'session',
					'li_attr' : {
						'timestamp' : Date.now(),
						'description' : 'Default Session'
					}
				})
			};

		};
		
		snapshotbutton.click($.proxy(function() {
			defaultSession();
			var root = tree.jstree().get_node('#');
			var session = tree.jstree().get_node(root.children[0]);
			var countSnapshots = session.children.length + 1;
			var newDataset = tree.jstree().create_node(session, {
				'text' : 'Snapshot #'+countSnapshots,
				'type' : 'dataset',
				'li_attr' : {
					'timestamp' : Date.now(),
					'description' : 'Snapshot #'+countSnapshots+' Dataset',
					'datasets' : storytellingv2Widget.datasets,
					'selected' : storytellingv2Widget.selected
				}
			});
			var newConfig = tree.jstree().create_node(newDataset, {
				'text' : 'Snapshot #'+countSnapshots,
				'type' : 'config',
				'li_attr' : {
					'timestamp' : Date.now(),
					'description' : 'Snapshot #'+countSnapshots+' Config',
					'configs' : storytellingv2Widget.configArray
				}
			});
			makeSimple();
			
		}));
		
		var loadDataset = function(node) {
			var datasets = node.li_attr.datasets;
			for (var i = 0; i < datasets.length; i++) {
				GeoTemConfig.addDataset(datasets[i]);
			}
			
		}
		
		var loadFilter = function(node) {
			var configArray = node.li_attr.configs;
			for (var i = 0; i < configArray.length; i++) {
				console.log(configArray[i]);
				Publisher.Publish('setConfig', configArray[i]);
			}
		}
		
		loadbutton.click($.proxy(function() {
			var selectedNode = tree.jstree().get_node(tree.jstree().get_selected()[0]);
			if (selectedNode == 'undefined' || selectedNode.type == 'session') {
				return;
			}
			for (var i = selectedNode.parents.length - 1; i > 0; i--) {
				var curNode = tree.jstree().get_node(selectedNode.parents[i]);
				if (curNode.type == 'dataset') {
					loadDataset(curNode);
				} else if (curNode.type == 'config') {
					loadFilter(curNode);
				}
			}
			if (selectedNode.type == 'dataset') {
				loadDataset(selectedNode);
			} else if (selectedNode.type == 'filter') {
				loadFilter(selectedNode);
			}
		}));
		
		deletebutton.click($.proxy(function() {
			var selectedNode = tree.jstree().get_node(tree.jstree().get_selected()[0]);
			tree.jstree().delete_node(selectedNode);
		}))
		
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
		this.configArray.push(widgetConfig);
	},

};
