/*
* FuzzyTimelineGui.js
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
 * @class FuzzyTimelineGui
 * FuzzyTimeline GUI Implementation
 * @author Sebastian Kruse (skruse@mpiwg-berlin.mpg.de)
 *
 * @param {FuzzyTimelineWidget} parent FuzzyTimeline widget object
 * @param {HTML object} div parent div to append the FuzzyTimeline gui
 * @param {JSON} options FuzzyTimeline configuration
 */
function FuzzyTimelineGui(fuzzyTimelineWidget, div, options) {

	this.parent = fuzzyTimelineWidget;
	var fuzzyTimelineGui = this;
	
	this.fuzzyTimelineContainer = div;
	if ($(this.fuzzyTimelineContainer).height() === 0)
		$(this.fuzzyTimelineContainer).height($(this.fuzzyTimelineContainer).width()*9/16);
	this.fuzzyTimelineContainer.style.position = 'relative';

	this.densityDiv = document.createElement("div");
	$(this.densityDiv).width("100%");
	$(this.densityDiv).height("50%");
	div.appendChild(this.densityDiv);
	this.rangeTimelineDiv = document.createElement("div");
	$(this.rangeTimelineDiv).css("float","left");
	$(this.rangeTimelineDiv).width("75%");
	$(this.rangeTimelineDiv).height("50%");
	div.appendChild(this.rangeTimelineDiv);
	this.rangePiechartDiv = document.createElement("div");
	$(this.rangePiechartDiv).css("float","right");
	$(this.rangePiechartDiv).width("25%");
	$(this.rangePiechartDiv).height("50%");
	div.appendChild(this.rangePiechartDiv);
};

FuzzyTimelineGui.prototype = {
};