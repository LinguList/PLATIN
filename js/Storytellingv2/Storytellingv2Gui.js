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
	
	storytellingv2Gui.mode_option_view = {
			mode_name : 'view',
			buttons : {
				openbutton : false,
				savebutton : false,
				newbutton : false,
				expertmodebutton : false,
				simplemodebutton : false,
				viewmodebutton : false,
				editmodebutton : true,
				newnodebutton : false,
				snapshotbutton : false,
				activatebutton : false,
				deletebutton : false,
				editbutton : false,
				backwardbutton : true,
				forwardbutton : true
			},
			execute : function() {
				storytellingv2Widget = storytellingv2Gui.parent;
				storytellingv2 = storytellingv2Widget.storytellingv2;
				var configs = storytellingv2.findNodesByType(storytellingv2Gui.tree,'config');
				var datasets = storytellingv2.findNodesByType(storytellingv2Gui.tree,'dataset');
				for (var i = 0; i < datasets.length; i++) {
					storytellingv2Gui.tree.jstree().set_type(datasets[i], 'snapshot');
					datasets[i].li_attr.dataset_text = datasets[i].text;
					datasets[i].text = datasets[i].li_attr.snapshot_text || datasets[i].text;
				}			
				for (var i = 0; i < configs.length; i++) {
					var c = storytellingv2Gui.tree.jstree().get_node(configs[i], true);
					$(c).hide();
				}
				
				var ind = storytellingv2Gui.hiddenNodeTypes.indexOf('config');
				if (ind == -1) {
					storytellingv2Gui.hiddenNodeTypes.push('config');
				}
				
				//disable dnd
				storytellingv2Gui.tree.jstree().settings.dnd.is_draggable = function(){
					return false;
				};
				
				//show correct metadata
				storytellingv2Gui.metadata.metadatatype.hide();
				storytellingv2Gui.metadata.metadatatimestamp.hide();
				storytellingv2Gui.metadata.metadataname.hide();
				storytellingv2Gui.metadata.metadatadescription.hide();
				storytellingv2Gui.metadata.metadatasummary.show();
				
				
			}
	};
	
	storytellingv2Gui.mode_option_simple = {
			mode_name : 'simple',
			buttons : {
				openbutton : true,
				savebutton : true,
				newbutton : true,
				expertmodebutton : true,
				simplemodebutton : false,
				viewmodebutton : true,
				editmodebutton : false,
				newnodebutton : false,
				snapshotbutton : true,
				activatebutton : true,
				deletebutton : true,
				editbutton : true,
				backwardbutton : false,
				forwardbutton : false
			},
			execute : function() {
				storytellingv2Widget = storytellingv2Gui.parent;
				storytellingv2 = storytellingv2Widget.storytellingv2;
				
				var configs = storytellingv2.findNodesByType(storytellingv2Gui.tree,'config');
				var datasets = storytellingv2.findNodesByType(storytellingv2Gui.tree,'dataset');
				for (var i = 0; i < datasets.length; i++) {
					storytellingv2Gui.tree.jstree().set_type(datasets[i], 'snapshot');
					datasets[i].li_attr.dataset_text = datasets[i].text;
					datasets[i].text = datasets[i].li_attr.snapshot_text || datasets[i].text;
				}			
				for (var i = 0; i < configs.length; i++) {
					var c = storytellingv2Gui.tree.jstree().get_node(configs[i], true);
					$(c).hide();
				}
				
				var ind = storytellingv2Gui.hiddenNodeTypes.indexOf('config');
				if (ind == -1) {
					storytellingv2Gui.hiddenNodeTypes.push('config');
				}
				
				//enable dnd
				storytellingv2Gui.tree.jstree().settings.dnd.is_draggable = function() {
					return true;
				};

				//show correct metadata
				storytellingv2Gui.metadata.metadatatype.show();
				storytellingv2Gui.metadata.metadatatimestamp.show();
				storytellingv2Gui.metadata.metadataname.show();
				storytellingv2Gui.metadata.metadatadescription.show();
				storytellingv2Gui.metadata.metadatasummary.hide();
			}
	};
	
	storytellingv2Gui.mode_option_expert = {
			mode_name : 'expert',
			buttons : {
				openbutton : true,
				savebutton : true,
				newbutton : true,
				expertmodebutton : false,
				simplemodebutton : true,
				viewmodebutton : true,
				editmodebutton : false,
				newnodebutton : true,
				snapshotbutton : false,
				activatebutton : true,
				deletebutton : true,
				editbutton : true,
				backwardbutton : false,
				forwardbutton : false
			},
			execute : function() {
				storytellingv2Widget = storytellingv2Gui.parent;
				storytellingv2 = storytellingv2Widget.storytellingv2;
				
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
				
				var ind = storytellingv2Gui.hiddenNodeTypes.indexOf('config');
				if (ind > -1) {
					for (var i = storytellingv2Gui.hiddenNodeTypes.length; i >= 0; i--) {
						if (storytellingv2Gui.hiddenNodeTypes[i] == 'config') {
							storytellingv2Gui.hiddenNodeTypes.splice(i, 1);
						}
					}
				}
				
				//enable dnd
				storytellingv2Gui.tree.jstree().settings.dnd.is_draggable = function() {
					return true;
				};

				//show correct metadata
				storytellingv2Gui.metadata.metadatatype.show();
				storytellingv2Gui.metadata.metadatatimestamp.show();
				storytellingv2Gui.metadata.metadataname.show();
				storytellingv2Gui.metadata.metadatadescription.show();
				storytellingv2Gui.metadata.metadatasummary.hide();
				
			}
	};
	
	storytellingv2Gui.storytellingv2Container = document.createElement('div');
	$(div).append(storytellingv2Gui.storytellingv2Container);
	storytellingv2Gui.storytellingv2Container.style.position = 'relative';
//	storytellingv2Gui.storytellingv2Container.window();
};

Storytellingv2Gui.prototype = {
		
		initGui : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;
			
			if (storytellingv2Gui.tree == undefined) {
				storytellingv2Gui.hiddenNodeTypes = [];
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
					'multiple' : false,
					'animation' : false
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
					'snapshot' : {
						'valid_children' : ['config'],
						'icon' : 'lib/jstree/themes/default/snapshot.png'
 					},
					'config' : {
						'valid_children' : ['config'],
						'icon' : 'lib/jstree/themes/default/filter.png'
					}
				}
			});
			
		
			storytellingv2Gui.menu = $('<div style="float: left;"></div>');
			storytellingv2Gui.importexportsubmenu = $('<div style="border: 2px solid; margin: 2px; padding: 5px;"></div>');

			storytellingv2Gui.addOpenButton();
			storytellingv2Gui.addSaveButton();
			storytellingv2Gui.addNewButton();
			storytellingv2Gui.addExpertModeButton();
			storytellingv2Gui.addSimpleModeButton();
			storytellingv2Gui.addViewModeButton();
			storytellingv2Gui.addEditModeButton();
			
			storytellingv2Gui.simplemodebutton.hide();
			$(storytellingv2Gui.importexportsubmenu).append(storytellingv2Gui.openbutton);
			$(storytellingv2Gui.importexportsubmenu).append(storytellingv2Gui.savebutton);
			$(storytellingv2Gui.importexportsubmenu).append(storytellingv2Gui.newbutton);
			$(storytellingv2Gui.importexportsubmenu).append(storytellingv2Gui.expertmodebutton);
			$(storytellingv2Gui.importexportsubmenu).append(storytellingv2Gui.simplemodebutton);
			$(storytellingv2Gui.importexportsubmenu).append(storytellingv2Gui.importfile);
			$(storytellingv2Gui.importexportsubmenu).append(storytellingv2Gui.viewmodebutton);
			$(storytellingv2Gui.importexportsubmenu).append(storytellingv2Gui.editmodebutton);
			
			storytellingv2Gui.treemanipulationsubmenu = $('<div style="border: 2px solid; margin: 2px; padding: 5px;"></div>');
			
			storytellingv2Gui.addNewNodeButton();
			storytellingv2Gui.addSnapshotButton();
			storytellingv2Gui.addActivateButton();
			storytellingv2Gui.addDeleteButton();
			storytellingv2Gui.addEditButton();
			storytellingv2Gui.addBackwardButton();
			storytellingv2Gui.addForwardButton();
			
			$(storytellingv2Gui.treemanipulationsubmenu).append(storytellingv2Gui.newnodebutton);
			$(storytellingv2Gui.treemanipulationsubmenu).append(storytellingv2Gui.snapshotbutton);
			$(storytellingv2Gui.treemanipulationsubmenu).append(storytellingv2Gui.activatebutton);
			$(storytellingv2Gui.treemanipulationsubmenu).append(storytellingv2Gui.deletebutton);
			$(storytellingv2Gui.treemanipulationsubmenu).append(storytellingv2Gui.editbutton);
			$(storytellingv2Gui.treemanipulationsubmenu).append(storytellingv2Gui.backwardbutton);
			$(storytellingv2Gui.treemanipulationsubmenu).append(storytellingv2Gui.forwardbutton);		
			storytellingv2Gui.treemanipulationsubmenu.append(storytellingv2Gui.editform);
			
			storytellingv2Gui.addMetadata();
			
			storytellingv2Gui.newnodebutton.hide();
			$(storytellingv2Gui.storytellingv2Container).append(storytellingv2Gui.tree);
			$(storytellingv2Gui.menu).append(storytellingv2Gui.importexportsubmenu);
			$(storytellingv2Gui.menu).append(storytellingv2Gui.treemanipulationsubmenu);
			$(storytellingv2Gui.menu).append(storytellingv2Gui.metadata);
			$(storytellingv2Gui.storytellingv2Container).append(storytellingv2Gui.menu);
			
			storytellingv2Gui.tree.hide();
			storytellingv2Gui.metadata.hide();
			
			
			//auto selecting node logic
			storytellingv2Gui.tree.on('create_node.jstree delete_node.jstree', function(e, data) {
				var root = storytellingv2Gui.tree.jstree().get_node('#');
				if (root.children.length > 0) {
					storytellingv2Gui.tree.show();
					storytellingv2Gui.metadata.show();
					if (e.type == "create_node") {
						storytellingv2Gui.tree.jstree().deselect_all();
						var t = data.node.type;
						if (storytellingv2Gui.hiddenNodeTypes.indexOf(t) > -1) {
							var parent = storytellingv2Gui.tree.jstree().get_node(data.node.parent);
							storytellingv2Gui.tree.jstree().select_node(parent);
						} else {
							storytellingv2Gui.tree.jstree().select_node(data.node);							
						}
					} if (e.type == "delete_node") {
						storytellingv2Gui.tree.jstree().deselect_all();
						var prev_node = storytellingv2Gui.tree.jstree().get_prev_dom(data.node);
						storytellingv2Gui.tree.jstree().select_node(prev_node);
					}
				} else {
					storytellingv2Gui.tree.hide();
					storytellingv2Gui.metadata.hide();
				}
				
			});
			
			//hide node logic
			storytellingv2Gui.tree.on('open_node.jstree close_node.jstree create_node.jstree delete_node.jstree dnd_start.vakata dnd_stop.vakata dnd_move.vakata', function(e, data) {
				for (var i = 0; i < storytellingv2Gui.hiddenNodeTypes.length; i++) {
					var nodesToHide = storytellingv2.findNodesByType(storytellingv2Gui.tree, storytellingv2Gui.hiddenNodeTypes[i], '#');
					for (var j = 0; j < nodesToHide.length; j++) {
						var node = storytellingv2Gui.tree.jstree().get_node(nodesToHide[j], true);
						$(node).hide();
					}
				}
			
			});
						
			//hide node logic for dnd
			$(document).on('dnd_stop.vakata', function(e, data) {
				for (var i = 0; i < storytellingv2Gui.hiddenNodeTypes.length; i++) {
					var nodesToHide = storytellingv2.findNodesByType(storytellingv2Gui.tree, storytellingv2Gui.hiddenNodeTypes[i], '#');
					for (var j = 0; j < nodesToHide.length; j++) {
						var node = storytellingv2Gui.tree.jstree().get_node(nodesToHide[j], true);
						$(node).hide();
					}
				}				
			});
			
			//restoring last snapshot
			if (localStorage.getItem('PLATIN.storytellingv2.last_snapshot')) {
				var lastSession = storytellingv2Gui.tree.jstree().create_node('#', {
					'text' : 'Last Session',
					'type' : 'session',
					'li_attr' : {
						'timestamp' : Date.now(),
						'description' : 'Default Session'
					}
				});
				var nodes = JSON.parse(LZString.decompressFromUTF16(localStorage.getItem('PLATIN.storytellingv2.last_snapshot')));
				var last = storytellingv2Gui.tree.jstree().create_node(lastSession, nodes);
				
			} else {
				storytellingv2Gui.newbutton.prop('disabled',true);
			}
			
			//start in view mode
			storytellingv2.changeMode(storytellingv2Gui.mode_option_view);

			//set html markup for markitup description textarea
			var markItUpSettings = {
					onShiftEnter:	{keepDefault:false, replaceWith:'<br />\n'},
					onCtrlEnter:	{keepDefault:false, openWith:'\n<p>', closeWith:'</p>\n'},
					onTab:			{keepDefault:false, openWith:'	 '},
					markupSet: [
						{name:'Heading 1', key:'1', openWith:'<h1(!( class="[![Class]!]")!)>', closeWith:'</h1>', placeHolder:'Your title here...' },
						{name:'Heading 2', key:'2', openWith:'<h2(!( class="[![Class]!]")!)>', closeWith:'</h2>', placeHolder:'Your title here...' },
						{name:'Heading 3', key:'3', openWith:'<h3(!( class="[![Class]!]")!)>', closeWith:'</h3>', placeHolder:'Your title here...' },
						{name:'Heading 4', key:'4', openWith:'<h4(!( class="[![Class]!]")!)>', closeWith:'</h4>', placeHolder:'Your title here...' },
						{name:'Heading 5', key:'5', openWith:'<h5(!( class="[![Class]!]")!)>', closeWith:'</h5>', placeHolder:'Your title here...' },
						{name:'Heading 6', key:'6', openWith:'<h6(!( class="[![Class]!]")!)>', closeWith:'</h6>', placeHolder:'Your title here...' },
						{name:'Paragraph', openWith:'<p(!( class="[![Class]!]")!)>', closeWith:'</p>' },
						{separator:'---------------' },
						{name:'Bold', key:'B', openWith:'(!(<strong>|!|<b>)!)', closeWith:'(!(</strong>|!|</b>)!)' },
						{name:'Italic', key:'I', openWith:'(!(<em>|!|<i>)!)', closeWith:'(!(</em>|!|</i>)!)' },
						{name:'Stroke through', key:'S', openWith:'<del>', closeWith:'</del>' },
						{separator:'---------------' },
						{name:'Ul', openWith:'<ul>\n', closeWith:'</ul>\n' },
						{name:'Ol', openWith:'<ol>\n', closeWith:'</ol>\n' },
						{name:'Li', openWith:'<li>', closeWith:'</li>' },
						{separator:'---------------' },
						{name:'Picture', key:'P', replaceWith:'<img src="[![Source:!:http://]!]" alt="[![Alternative text]!]" />' },
						{name:'Link', key:'L', openWith:'<a href="[![Link:!:http://]!]"(!( title="[![Title]!]")!)>', closeWith:'</a>', placeHolder:'Your text to link...' },
						{separator:'---------------' },
						{name:'Clean', className:'clean', replaceWith:function(markitup) { return markitup.selection.replace(/<(.*?)>/g, "") } }
					]
				}
			$('#storytellingv2editdescription').markItUp(markItUpSettings);

		},
		
		addOpenButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.openbutton = $('<input type="button" id="storytellingv2open" name="open" value="open" />');
			storytellingv2Gui.importfile = $('<input type="file" id="storytellingv2importfile" accept="application/json" style="display: block; visibility:hidden; width: 0; height: 0" />');
			storytellingv2Gui.importfile.change(storytellingv2.handleFileSelect());
			
			storytellingv2Gui.openbutton.click($.proxy(function() {
				//clear the inputfile and preserve the onChange handler
				storytellingv2Gui.importfile.replaceWith(storytellingv2Gui.importfile = storytellingv2Gui.importfile.clone(true));
				
				storytellingv2Gui.importfile.click();
			}));
			
		},
		
		addSaveButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.savebutton = $('<input type="button" id="storytellingv2save" name="save" value="save" />');
			var dialog = $('<div id="tree-export-filename" title="Save File As?"><p><input type="text" size="25" /></p></div>');
			storytellingv2Gui.savebutton.append(dialog);
			dialog.dialog({
				resizable: false,
				autoOpen: false,
				height: 220,
				modal: true,
				buttons: {
					'Ok': function() {
						$(this).dialog("close");
					},
					Cancel: function() {
						$(this).dialog("close");
					}
				}
			});
			storytellingv2Gui.savebutton.click($.proxy(function() {
				var tree_as_json = JSON.stringify($('#storytellingv2jstree').jstree(true).get_json('#', { 'flat': true }));
				var exportdate = new Date().toUTCString();

				dialog.dialog('open');
				$(dialog).find(':input').val("Storytelling State(" + exportdate + ").json");
				dialog.dialog('option', 'buttons', {
					'Ok': function() {
						var blob = new Blob([tree_as_json], {type: "text/plain;charset=utf-8"});
						saveAs(blob, dialog.find(':input').val());
						$(this).dialog("close");
					},
					Cancel: function() {
						$(this).dialog("close");
					}
				})
			}));
		
		},
		
		addNewButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.newbutton = $('<input type="button" id="storytellingv2new" name="new" value="new" />');
			var dialog = $('<div id="tree-reset-dialog-confirm" title="Erase all tree content?"><p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>Tree items will be permanently deleted and cannot be recovered. Are you sure?</p></div>');
			storytellingv2Gui.newbutton.append(dialog)
			dialog.dialog({
				resizable: false,
				autoOpen: false,
				height: 260,
				modal: true,
				buttons: {
					'Yes': function() {
						storytellingv2.deleteAllNodes(storytellingv2Gui.tree);			
						$(this).dialog("close");
						storytellingv2Gui.newbutton.prop('disabled',true);
					},
					Cancel: function() {
						$(this).dialog("close");
					}
				}
			});
			
			storytellingv2Gui.newbutton.click($.proxy(function() {
				dialog.dialog('open');
			}));
		},
		
		addExpertModeButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.expertmodebutton = $('<input type="button" id="storytellingv2expertmode" name="expertmode" value="expert mode" />');
			storytellingv2Gui.expertmodebutton.click($.proxy(function() {
				storytellingv2.changeMode(storytellingv2Gui.mode_option_expert);
				
			}));
			
		},
		
		addSimpleModeButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.simplemodebutton = $('<input type="button" id="storytellingv2simplemode" name="simplemode" value="simple mode" />');
			storytellingv2Gui.simplemodebutton.click($.proxy(function() {
				storytellingv2.changeMode(storytellingv2Gui.mode_option_simple);
			}));
			
		},
		
		addViewModeButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.viewmodebutton = $('<input type="button" id="storytellingv2viewmode" name="viewmode" value="view mode" />');
			storytellingv2Gui.viewmodebutton.click($.proxy(function() {
				storytellingv2.changeMode(storytellingv2Gui.mode_option_view);

			}));
			
		},
		
		addEditModeButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.editmodebutton = $('<input type="button" id="storytellingv2editmode" name="editmode" value="edit mode" />');
			storytellingv2Gui.editmodebutton.click($.proxy(function() {
				storytellingv2.changeMode(storytellingv2Gui.mode_option_simple);
			}));
			
		},
		
		addNewNodeButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.newnodebutton = $('<input type="button" id="storytellingv2newnode" name="newnode" value="new node" />');
			storytellingv2Gui.newnodebutton.click($.proxy(function() {
				storytellingv2.defaultSession();
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
						newNode.li_attr.configs = storytellingv2Widget.configArray.slice();
					} else if (newNode.type == 'dataset') {
						var datasets = [];
						if (storytellingv2Widget.datasets != undefined) {
							for (var i = 0; i < storytellingv2Widget.datasets.length; i++) {
								var ds = {};
								ds.label = storytellingv2Widget.datasets[i].label;
								ds.objects = GeoTemConfig.convertCsv(GeoTemConfig.createCSVfromDataset(i));
								datasets.push(ds);
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
				storytellingv2Gui.newbutton.prop('disabled',false);
			}));
		
		},
		
		addSnapshotButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.snapshotbutton = $('<input type="button" id="storytellingv2snapshot" name="snapshot" value="snapshot" />');
			storytellingv2Gui.snapshotbutton.click($.proxy(function() {
				storytellingv2.defaultSession();
				var root = storytellingv2Gui.tree.jstree().get_node('#');
				var session = storytellingv2Gui.tree.jstree().get_node(root.children[0]);
				var countSnapshots = session.children.length + 1;
				var datasets = [];
				
				if (storytellingv2Widget.datasets != undefined) {
					for (var i = 0; i < storytellingv2Widget.datasets.length; i++) {
						var ds = {};
						ds.label = storytellingv2Widget.datasets[i].label;
						ds.objects = GeoTemConfig.convertCsv(GeoTemConfig.createCSVfromDataset(i));
						datasets.push(ds);
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
				try {
					Publisher.Publish('getConfig',storytellingv2Widget);					
				} catch (err) {
					console.log('There was an error getting widget configurations');
				}
				var newConfig = storytellingv2Gui.tree.jstree().create_node(newDataset, {
					'text' : 'Snapshot #'+countSnapshots,
					'type' : 'config',
					'li_attr' : {
						'timestamp' : Date.now(),
						'description' : 'Snapshot #'+countSnapshots+' Config',
						'configs' : storytellingv2Widget.configArray.slice()
					}
				});
				try {
					var node = storytellingv2Gui.tree.jstree(true).get_json(newDataset);
					node.text = "Last Snapshot";
					snapshot_as_json = JSON.stringify(node);
					var compressed = LZString.compressToUTF16(snapshot_as_json);
					localStorage.setItem("PLATIN.storytellingv2.last_snapshot",compressed);
				} catch (err) {
					console.log("LocalStorage Quota exceeded!");
				}
				storytellingv2Gui.mode_option_simple.execute();
				storytellingv2Gui.newbutton.prop('disabled',false);
				
			}));
			
		},
		
		addActivateButton : function() {

			var storytellingv2Gui = this;
			var storytellingv2Widget = storytellingv2Gui.parent;
			var storytellingv2 = storytellingv2Widget.storytellingv2;

			storytellingv2Gui.activatebutton = $('<input type="button" id="storytellingv2activate" name="activate" value="activate" />');
			storytellingv2Gui.activatebutton.click($.proxy(function() {
				storytellingv2Gui.activateNode(storytellingv2Gui);
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
			storytellingv2Gui.editform = $('<div></div>');
			storytellingv2Gui.editform.nameinput = $('<p>Name: <input type="text" /></p>');
			storytellingv2Gui.editform.descriptioninput = $('<p>Description: <textarea name="description" cols="60" rows="20" id="storytellingv2editdescription"></textarea></p>');
			storytellingv2Gui.editform.savebutton = $('<p><input type="button" name="save" value="save" /></p>');
			storytellingv2Gui.editform.append(storytellingv2Gui.editform.nameinput);
			storytellingv2Gui.editform.append(storytellingv2Gui.editform.descriptioninput);
			storytellingv2Gui.editform.append(storytellingv2Gui.editform.savebutton);
			storytellingv2Gui.editform.hide();
			storytellingv2Gui.editbutton.click($.proxy(function() {
				var sel = storytellingv2Gui.tree.jstree().get_selected()[0];
				if (sel != undefined ) {
					sel = storytellingv2Gui.tree.jstree().get_node(sel);
					storytellingv2Gui.editform.nameinput.find(':text').first().val(sel.text);
					storytellingv2Gui.editform.descriptioninput.find('textarea').val(sel.li_attr.description);
					storytellingv2Gui.editform.show();
					storytellingv2Gui.editform.focusout(function() {
						var elem = $(this);
						setTimeout(function() {
							var hasFocus = !!(elem.find(':focus').length > 0);
							if (! hasFocus) {
								storytellingv2Gui.editform.hide();
							}
						}, 10);
					});
					storytellingv2Gui.editform.savebutton.click($.proxy(function() {
						storytellingv2Gui.tree.jstree().rename_node(sel, storytellingv2Gui.editform.nameinput.find(':text').first().val());
						sel.li_attr.description = storytellingv2Gui.editform.descriptioninput.find('textarea').first().val();
						storytellingv2Gui.tree.jstree().redraw();
						storytellingv2Gui.editform.hide();
						storytellingv2Gui.metadata.update(sel);
					}));
					storytellingv2Gui.editform.nameinput.find(':input').focus();
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
					storytellingv2Gui.activateNode();
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
					storytellingv2Gui.activateNode();
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
			var metadatasummary = $('<p></p>');
			$(metadatafieldset).append(metadataname);
			$(metadatafieldset).append(metadatatype);
			$(metadatafieldset).append(metadatatimestamp);
			$(metadatafieldset).append(metadatadescription);
			$(metadatafieldset).append(metadatasummary);
			$(storytellingv2Gui.metadata).append(metadatafieldset);
			storytellingv2Gui.metadata.metadataname = metadataname;
			storytellingv2Gui.metadata.metadatadescription = metadatadescription;
			storytellingv2Gui.metadata.metadatatype = metadatatype;
			storytellingv2Gui.metadata.metadatatimestamp = metadatatimestamp;
			storytellingv2Gui.metadata.metadatasummary = metadatasummary;
			
			storytellingv2Gui.metadata.update = function(node) {
				if (node == undefined) {
					return;
				}
				$(metadataname).empty().append($('<p>Name: '+node.text+'</p>'));
				$(metadatatype).empty().append($('<p>Type: '+node.type+'</p>'));
				var tstamp = new Date(node.li_attr.timestamp);
				$(metadatatimestamp).empty().append($('<p>Timestamp: '+tstamp.toUTCString()+'</p>'));
				$(metadatadescription).empty().append($('<p>Description: '+node.li_attr.description+'</p>'));
				$(metadatasummary).empty().append($('<h2>'+node.text+'</h2><p>'+node.li_attr.description+'</p>'));
				var objectcount = 0;
				var datasetcount = 0;
				if ($.isArray(node.li_attr.selected)) {
					datasetcount = node.li_attr.selected.length;
					$(node.li_attr.selected).each(function() {
						objectcount += this.length;
					});
				}
				if (storytellingv2Gui.mode == "view") {
					storytellingv2Gui.activateNode();
				}
				
			}
			storytellingv2Gui.tree.on('changed.jstree rename_node.jstree set_text.jstree', function(e, data) {

				storytellingv2Gui.metadata.update(data.node);
			});
			
		},
		
		activateNode : function() {
			return (function() {
				
				
				var storytellingv2Widget = storytellingv2Gui.parent;
				var storytellingv2 = storytellingv2Widget.storytellingv2;

				var loadDataset = function(node) {
					var datasets = node.li_attr.datasets;
					if (datasets != undefined) {
						GeoTemConfig.removeAllDatasets();
						for (var i = 0; i < datasets.length; i++) {
							var dataset = new Dataset(GeoTemConfig.loadJson(datasets[i].objects), datasets[i].label);
							GeoTemConfig.addDataset(dataset);
						}
					}
					
				}
				
				var loadFilter = function(node) {
					var configArray = node.li_attr.configs;
					for (var i = 0; i < configArray.length; i++) {
						Publisher.Publish('setConfig', configArray[i]);
					}
				}
				
				var loadSnapshot = function(node) {
					loadDataset(node);
					var childNode = node;
					while (storytellingv2Gui.tree.jstree().is_parent(childNode)) {
						childNode = storytellingv2Gui.tree.jstree().get_node(childNode.children[0]);
						if (childNode.type == 'config') {
							loadFilter(childNode);
						}
					}
				}
				
				var selectedNode = storytellingv2Gui.tree.jstree().get_node(storytellingv2Gui.tree.jstree().get_selected()[0]);
				if (selectedNode == 'undefined' || selectedNode.type == 'session') {
					return;
				}
				if (selectedNode.type == 'snapshot') {
					loadSnapshot(selectedNode);
					return;
				}
				if (selectedNode.parents != undefined) {
					for (var i = selectedNode.parents.length - 1; i >= 0; i--) {
						var curNode = storytellingv2Gui.tree.jstree().get_node(selectedNode.parents[i]);
						if (curNode.type == 'dataset') {
							loadDataset(curNode);
						} else if (curNode.type == 'config') {
							loadFilter(curNode);
						}
					}
				}
				if (selectedNode.type == 'dataset') {
					loadDataset(selectedNode);
				} else if (selectedNode.type == 'config') {
					loadFilter(selectedNode);
				}
				
			})();

			
		}
		
		
};