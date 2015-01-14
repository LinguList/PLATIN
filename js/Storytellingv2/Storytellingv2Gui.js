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
};