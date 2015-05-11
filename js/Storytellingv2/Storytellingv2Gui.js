/*
* Storytellingv2Gui.js
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
 * @class StorytellingGui
 * Storytellingv2 GUI Implementation
 * @author Mike Bretschneider (mike.bretschneider@gmx.de)
 *
 * @param {Storytellingv2Widget} parent Storytellingv2 widget object
 * @param {HTML object} div parent div to append the Storytellingv2 gui
 * @param {JSON} options Storytellingv2 configuration
 */
function Storytellingv2Gui(storytellingv2, div, options) {

	this.parent = storytellingv2;
	var storytellingv2Gui = this;
	
	storytellingv2Gui.storytellingv2Container = document.createElement('div');
	$(div).append(storytellingv2Gui.storytellingv2Container);
	storytellingv2Gui.storytellingv2Container.style.position = 'relative';
};

Storytellingv2Gui.prototype = {
		
		initGui : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;
			
			if (storytellingv2Gui.tree == undefined) {
				storytellingv2Gui.initTree();
			}
		},
		
		initTree : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;
			
			$(storytellingv2Gui.storytellingv2Container).empty();
			
			storytellingv2Gui.tree = $('<div style="border: 2px solid; padding: 5px; float: left;" id="storytellingv2jstree"><ul></ul></div>');		
			storytellingv2Gui.tree.jstree({
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
						'valid_children' : [],
						'icon' : 'lib/jstree/themes/default/snapshot.png'
 					}
				}
			});
			
			storytellingv2Gui.tree.on('open_node.jstree', function(e, data) {
				var node = data.node;
				if (node.type == 'snapshot') {
					storytellingv2Gui.tree.jstree().close_node(node, false);
				}
				
			});
			
			storytellingv2Gui.menu = $('<div style="float: left;"></div>');
			storytellingv2Gui.importexportsubmenu = $('<div style="border: 2px solid; margin: 2px; padding: 5px;"></div>');

			storytellingv2Gui.addImportButton();
			storytellingv2Gui.addExportButton();
			storytellingv2Gui.addResetButton();
			storytellingv2Gui.addExpertButton();
			storytellingv2Gui.addSimpleButton();
			
			storytellingv2Gui.simplebutton.hide();
			$(storytellingv2Gui.importexportsubmenu).append(storytellingv2Gui.importbutton);
			$(storytellingv2Gui.importexportsubmenu).append(storytellingv2Gui.exportbutton);
			$(storytellingv2Gui.importexportsubmenu).append(storytellingv2Gui.resetbutton);
			$(storytellingv2Gui.importexportsubmenu).append(storytellingv2Gui.expertbutton);
			$(storytellingv2Gui.importexportsubmenu).append(storytellingv2Gui.simplebutton);
			$(storytellingv2Gui.importexportsubmenu).append(storytellingv2Gui.importfile);
			
			storytellingv2Gui.treemanipulationsubmenu = $('<div style="border: 2px solid; margin: 2px; padding: 5px;"></div>');
			
			storytellingv2Gui.addNewButton();
			storytellingv2Gui.addSnapshotButton();
			storytellingv2Gui.addRestoreButton();
			storytellingv2Gui.addDeleteButton();
			storytellingv2Gui.addEditButton();
			storytellingv2Gui.addBackwardButton();
			storytellingv2Gui.addForwardButton();
			
			$(storytellingv2Gui.treemanipulationsubmenu).append(storytellingv2Gui.newbutton);
			$(storytellingv2Gui.treemanipulationsubmenu).append(storytellingv2Gui.snapshotbutton);
			$(storytellingv2Gui.treemanipulationsubmenu).append(storytellingv2Gui.restorebutton);
			$(storytellingv2Gui.treemanipulationsubmenu).append(storytellingv2Gui.deletebutton);
			$(storytellingv2Gui.treemanipulationsubmenu).append(storytellingv2Gui.editbutton);
			$(storytellingv2Gui.treemanipulationsubmenu).append(storytellingv2Gui.backwardbutton);
			$(storytellingv2Gui.treemanipulationsubmenu).append(storytellingv2Gui.forwardbutton);		
			
			storytellingv2Gui.addMetadata();
			
			storytellingv2Gui.newbutton.hide();
			$(storytellingv2Gui.storytellingv2Container).append(storytellingv2Gui.tree);
			$(storytellingv2Gui.menu).append(storytellingv2Gui.importexportsubmenu);
			$(storytellingv2Gui.menu).append(storytellingv2Gui.treemanipulationsubmenu);
			$(storytellingv2Gui.menu).append(storytellingv2Gui.metadata);
			$(storytellingv2Gui.storytellingv2Container).append(storytellingv2Gui.menu);

		},
		
		addImportButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.importbutton = $('<input type="button" id="storytellingv2import" name="import" value="import" />');
			storytellingv2Gui.importfile = $('<input type="file" id="storytellingv2importfile" accept="application/json" style="display: block; visibility:hidden; width: 0; height: 0" />');
			storytellingv2Gui.importfile.change(storytellingv2.handleFileSelect);
			
			storytellingv2Gui.importbutton.click($.proxy(function() {
				storytellingv2Gui.importfile.click();
			}));
			
		},
		
		addExportButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.exportbutton = $('<input type="button" id="storytellingv2export" name="export" value="export" />');
			storytellingv2Gui.exportbutton.click($.proxy(function() {
				var tree_as_json = JSON.stringify($('#storytellingv2jstree').jstree(true).get_json('#', { 'flat': true }));
				var exportdate = new Date().toUTCString();
				
				var pom = document.createElement('a');
				pom.setAttribute('href','data:application/json;charset=UTF-8, ' + encodeURIComponent(tree_as_json));
				pom.setAttribute('download','Storytelling State(' + exportdate + ').json');
				pom.click();
			}));
		
		},
		
		addResetButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.resetbutton = $('<input type="button" id="storytellingv2reset" name="reset" value="reset" />');
			
			storytellingv2Gui.resetbutton.click($.proxy(function() {
				storytellingv2.deleteAllNodes(storytellingv2Gui.tree);
				
			}));
		},
		
		addExpertButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.expertbutton = $('<input type="button" id="storytellingv2expert" name="expert" value="expert" />');
			storytellingv2Gui.expertbutton.click($.proxy(function() {
				storytellingv2Gui.expertbutton.hide();
				storytellingv2Gui.simplebutton.show();
				storytellingv2Gui.snapshotbutton.hide();
				storytellingv2Gui.newbutton.show();
				storytellingv2Gui.parent.simplemode = false;
				var configs = storytellingv2.findNodesByType(storytellingv2Gui.tree,'config');
				for (var i = 0; i < configs.length; i++) {
					storytellingv2Gui.tree.jstree().get_node(configs[i], true).show();
				}
				var snapshots = storytellingv2.findNodesByType(storytellingv2Gui.tree,'snapshot');
				for (var i = 0; i < snapshots.length; i++) {
					storytellingv2Gui.tree.jstree().set_type(snapshots[i], 'dataset');
					snapshots[i].li_attr.snapshot_text = snapshots[i].text;
					snapshots[i].text = snapshots[i].li_attr.dataset_text || snapshots[i].text;
				}
				
			}));
			
		},
		
		addSimpleButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.simplebutton = $('<input type="button" id="storytellingv2simple" name="simple" value="simple" />');
			storytellingv2Gui.simplebutton.click($.proxy(function() {
				storytellingv2Gui.simplebutton.hide();
				storytellingv2Gui.expertbutton.show();
				storytellingv2Gui.newbutton.hide();
				storytellingv2Gui.snapshotbutton.show();
				storytellingv2Gui.parent.simplemode = true;
				storytellingv2.makeSimple(storytellingv2Gui.tree);
			}));
			
		},
		
		addNewButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.newbutton = $('<input type="button" id="storytellingv2new" name="new" value="new" />');
			storytellingv2Gui.newbutton.click($.proxy(function() {
				storytellingv2.defaultSession(storytellingv2Gui.tree);
				var newform = $('<div></div>');
				var nameinput = $('<p>Name: <input type="text" /></p>');
				var typeinput = $('<p>Type: <select name="type"><option value="session">Session</option><option value="dataset">Dataset</option><option value="config">Config</option></select></p>');
				var descriptioninput = $('<p>Description: <textarea name="description"></textarea></p>');
				var addbutton = $('<p><input type="button" name="add" value="add" /></p>');
				newform.focusout(function() {
					var elem = $(this);
					setTimeout(function() {
						var hasFocus = !!(elem.find(':focus').length > 0);
						if (! hasFocus) {
							newform.empty();
						}
					}, 10);
				});
				addbutton.click($.proxy(function() {
					var sel = storytellingv2Gui.tree.jstree().get_selected()[0] || '#' ;
					if ($(typeinput).find('option:selected').val() == 'session') {
						sel = '#';
					}
					sel = storytellingv2Gui.tree.jstree().create_node(sel, {
						"text" : $(nameinput).find(':text').first().val(),
						"type" : $(typeinput).find('option:selected').val(),
						"li_attr" : {
							"timestamp" : Date.now(),
							"description" : $(descriptioninput).find('textarea').first().val()
						}
					});
					var newNode = storytellingv2Gui.tree.jstree().get_node(sel);
					
					if (newNode.type == 'config') {
						Publisher.Publish('getConfig',storytellingv2Widget);
						newNode.li_attr.configs = storytellingv2Widget.configArray;
					} else if (newNode.type == 'dataset') {
						var datasets = [];
						if (storytellingv2Widget.datasets != undefined) {
							for (var i = 0; i < storytellingv2Widget.datasets.length; i++) {
								datasets.push(GeoTemConfig.convertCsv(GeoTemConfig.createCSVfromDataset(i)));
							}
						}
						newNode.li_attr.selected = storytellingv2Widget.selected;
						newNode.li_attr.datasets = datasets;
					}
//					tree.jstree().set_type(sel, 'session');
					$(newform).empty();
				}));
				$(newform).append(nameinput);
				$(newform).append(typeinput);
				$(newform).append(descriptioninput);
				$(newform).append(addbutton);
				$(storytellingv2Gui.treemanipulationsubmenu).append(newform);
				$(nameinput).find(':input').focus();
			}));
		
		},
		
		addSnapshotButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.snapshotbutton = $('<input type="button" id="storytellingv2snapshot" name="snapshot" value="snapshot" />');
			storytellingv2Gui.snapshotbutton.click($.proxy(function() {
				storytellingv2.defaultSession(storytellingv2Gui.tree);
				var root = storytellingv2Gui.tree.jstree().get_node('#');
				var session = storytellingv2Gui.tree.jstree().get_node(root.children[0]);
				var countSnapshots = session.children.length + 1;
				var datasets = [];
				if (storytellingv2Widget.datasets != undefined) {
					for (var i = 0; i < storytellingv2Widget.datasets.length; i++) {
						datasets.push(GeoTemConfig.convertCsv(GeoTemConfig.createCSVfromDataset(i)));
					}
				}
				var newDataset = storytellingv2Gui.tree.jstree().create_node(session, {
					'text' : 'Snapshot #'+countSnapshots,
					'type' : 'dataset',
					'li_attr' : {
						'timestamp' : Date.now(),
						'description' : 'Snapshot #'+countSnapshots+' Dataset',
						'datasets' : datasets,
						'selected' : storytellingv2Widget.selected
					}
				});
				var newConfig = storytellingv2Gui.tree.jstree().create_node(newDataset, {
					'text' : 'Snapshot #'+countSnapshots,
					'type' : 'config',
					'li_attr' : {
						'timestamp' : Date.now(),
						'description' : 'Snapshot #'+countSnapshots+' Config',
						'configs' : storytellingv2Widget.configArray
					}
				});
				storytellingv2.makeSimple(storytellingv2Gui.tree);
				
			}));
			
		},
		
		addRestoreButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.restorebutton = $('<input type="button" id="storytellingv2restore" name="restore" value="restore" />');
			var loadDataset = function(node) {
				var datasets = node.li_attr.datasets;
				if (datasets != undefined) {
					for (var i = 0; i < datasets.length; i++) {
						GeoTemConfig.addDataset(datasets[i]);
					}
				}
				
			}
			
			var loadFilter = function(node) {
				var configArray = node.li_attr.configs;
				for (var i = 0; i < configArray.length; i++) {
					console.log(configArray[i]);
					Publisher.Publish('setConfig', configArray[i]);
				}
			}
			
			var loadSnapshot = function(node) {
				loadDataset(node);
				var childNode = node;
				while (storytellingv2Gui.tree.jstree().is_parent(childNode)) {
					childNode = storytellingv2Gui.tree.jstree().get_node(childNode.children[0]);
					if (childNode.type == 'filter') {
						loadFilter(childNode);
					}
				}
			}
			
			storytellingv2Gui.restorebutton.click($.proxy(function() {
				var selectedNode = storytellingv2Gui.tree.jstree().get_node(storytellingv2Gui.tree.jstree().get_selected()[0]);
				if (selectedNode == 'undefined' || selectedNode.type == 'session') {
					return;
				}
				if (selectedNode.type == 'snapshot') {
					loadSnapshot(selectedNode);
					return;
				}
				for (var i = selectedNode.parents.length - 1; i > 0; i--) {
					var curNode = storytellingv2Gui.tree.jstree().get_node(selectedNode.parents[i]);
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
			
		},
		
		addDeleteButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.deletebutton = $('<input type="button" id="storytellingv2delete" name="delete" value="delete" />');
			storytellingv2Gui.deletebutton.click($.proxy(function() {
				var selectedNode = storytellingv2Gui.tree.jstree().get_node(storytellingv2Gui.tree.jstree().get_selected()[0]);
				storytellingv2Gui.tree.jstree().delete_node(selectedNode);
			}))
			
		},
		
		addEditButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.editbutton = $('<input type="button" id="storytellingv2edit" name="edit" value="edit" />');
			storytellingv2Gui.editbutton.click($.proxy(function() {
				var sel = storytellingv2Gui.tree.jstree().get_selected()[0];
				if (sel != undefined ) {
					sel = storytellingv2Gui.tree.jstree().get_node(sel);
					var editform = $('<div></div>');
					var nameinput = $('<p>Name: <input type="text" value="'+sel.text+'" /></p>');
					var descriptioninput = $('<p>Description: <textarea name="description">'+sel.li_attr.description+'</textarea></p>');
					var savebutton = $('<p><input type="button" name="save" value="save" /></p>');
					editform.focusout(function() {
						var elem = $(this);
						setTimeout(function() {
							var hasFocus = !!(elem.find(':focus').length > 0);
							if (! hasFocus) {
								editform.empty();
							}
						}, 10);
					});
					savebutton.click($.proxy(function() {
						console.log($(nameinput).find(':text').first().val());
						storytellingv2Gui.tree.jstree().rename_node(sel, $(nameinput).find(':text').first().val());
						sel.li_attr.description = $(descriptioninput).find('textarea').first().val();
						storytellingv2Gui.tree.jstree().redraw();
						$(editform).empty();
					}));
//					$(editform).focusout(function() {
//						$(editform).empty();
//					});
					$(editform).append(nameinput);
					$(editform).append(descriptioninput);
					$(editform).append(savebutton);
					storytellingv2Gui.treemanipulationsubmenu.append(editform);
					nameinput.find(':input').focus();
				}
				
				
			}));
			
		},
		
		addForwardButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.forwardbutton = $('<input type="button" id="storytellingv2forward" name="forward" value=">>" />');
			storytellingv2Gui.forwardbutton.click($.proxy(function() {
				var sel = storytellingv2Gui.tree.jstree().get_selected()[0];
				if (storytellingv2Gui.tree.jstree().get_next_dom(sel, true)) {
					storytellingv2Gui.tree.jstree().deselect_node(sel);
					storytellingv2Gui.tree.jstree().select_node(storytellingv2Gui.tree.jstree().get_next_dom(sel, true));
				}
				
			}));
			
		},
		
		addBackwardButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.backwardbutton = $('<input type="button" id="storytellingv2backward" name="backward" value="<<" />');
			storytellingv2Gui.backwardbutton.click($.proxy(function() {
				var sel = storytellingv2Gui.tree.jstree().get_selected()[0];
				if (storytellingv2Gui.tree.jstree().get_prev_dom(sel, true)) {
					storytellingv2Gui.tree.jstree().deselect_node(sel);
					storytellingv2Gui.tree.jstree().select_node(storytellingv2Gui.tree.jstree().get_prev_dom(sel, true));
				}
				
			}));

			
		},
		
		addMetadata : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.metadata = $('<div></div>');
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
			$(storytellingv2Gui.metadata).append(metadatafieldset);
			storytellingv2Gui.tree.on('changed.jstree rename_node.jstree', function(e, data) {
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
//				$(metadataselected).empty().append($('<p>'+objectcount+' Selected Objects in '+datasetcount+' Datasets</p>'));
				console.log(data.node);
			});
			
		}
		
		
};