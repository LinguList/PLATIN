/*
* Storytellingv2.js
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
 * @class Storytellingv2
 * Storytelling Version 2
 * @author Mike Bretschneider (mike.bretschneider@gmx.de)
 *
 * @param {HTML object} parent div to append the Storytellingv2 widget
 */
function Storytellingv2(parent) {

	this.index;
	this.storytellingv2 = this;
	
	this.parent = parent;
	this.options = parent.options;

	this.initialize();
}

Storytellingv2.prototype = {
		
		
		deleteAllNodes : function(tree) {
			var nodes = tree.jstree().get_children_dom('#');
			nodes.each(function() {
				tree.jstree().delete_node(this);
			});
		},
		
		findNodesByType : function(tree,type, parent) {
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
		},
		
		
		handleFileSelect : function(evt) {
			
//			var storytellingv2 = this;
			
			var file = evt.target.files[0];
			var tree = $('#storytellingv2jstree');
			
			var reader = new FileReader();
			
			var deleteAllNodes = function(tree) {
				var nodes = tree.jstree().get_children_dom('#');
				nodes.each(function() {
					tree.jstree().delete_node(this);
				});
			}
			
			reader.onload = (function(f) {
				return function(e) {
					var treedata = JSON.parse(e.target.result);
					deleteAllNodes(tree);
					for (var i = 0; i < treedata.length; i++) {
						tree.jstree().create_node(treedata[i].parent,treedata[i]);
					};
				}
			})(file);
			reader.readAsText(file);
		},
		
		
		makeSimple : function(tree) {
			var configs = this.findNodesByType(tree,'config');
			var datasets = this.findNodesByType(tree,'dataset');
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
		},
		
		
		
		
			
		
		
	
		defaultSession : function(tree) {
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

		},

	remove : function() {
	},
	
	initialize : function() {
	},
	
	triggerHighlight : function(columnElement) {
	},

	triggerSelection : function(columnElement) {
	},

	deselection : function() {
	},

	filtering : function() {
	},

	inverseFiltering : function() {
	},

	triggerRefining : function() {
	},

	reset : function() {
	},
	
	show : function() {		
	},

	hide : function() {
	}
};
