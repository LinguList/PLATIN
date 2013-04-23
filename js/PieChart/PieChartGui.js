/*
* PieChartGui.js
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
 * @class PieChartGui
 * PieChart GUI Implementation
 * @author Sebastian Kruse (skruse@mpiwg-berlin.mpg.de)
 *
 * @param {PieChartWidget} parent PieChart widget object
 * @param {HTML object} div parent div to append the PieChart gui
 * @param {JSON} options PieChart configuration
 */
function PieChartGui(pieChart, div, options) {

	this.parent = pieChart;
	var pieChartGui = this;
	
	this.pieChartContainer = div;
	this.pieChartContainer.style.position = 'relative';

	this.pieChartsDiv = document.createElement("div");
	this.pieChartsDiv.id = "pieChartsDivID";
	div.appendChild(this.pieChartsDiv);
};
