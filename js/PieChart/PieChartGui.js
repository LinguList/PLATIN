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

	this.columnSelectorDiv = document.createElement("div");
	div.appendChild(this.columnSelectorDiv);
	this.datasetSelect = document.createElement("select");
	$(this.datasetSelect).select(function(event){
		if (typeof pieChartGui.parent.datasets !== "undefined"){
			var dataset = pieChartGui.parent.datasets[$(pieChartGui.datasetSelect).val()];
			if (dataset.objects.length > 0){
				var test = dataset.objects[0].tableContent;
			    for (var attribute in test) {
			    	$(pieChartGui.columnSelect).append("<option value="+attribute+">"+attribute+"</option>");
			    }
			}
		}
	});
	this.columnSelectorDiv.appendChild(this.datasetSelect);
	this.columnSelect = document.createElement("select");
	this.columnSelectorDiv.appendChild(this.columnSelect);
	this.buttonNewPieChart = document.createElement("button");
	$(this.buttonNewPieChart).text("add");
	this.columnSelectorDiv.appendChild(this.buttonNewPieChart);
	$(this.buttonNewPieChart).click(function(){
		pieChartGui.parent.addPieChart($(pieChartGui.datasetSelect).val(), $(pieChartGui.columnSelect).val());
	});
	
	this.refreshColumnSelector();
	
	this.pieChartsDiv = document.createElement("div");
	this.pieChartsDiv.id = "pieChartsDivID";
	div.appendChild(this.pieChartsDiv);
};

PieChartGui.prototype = {
		
	refreshColumnSelector : function(){
		$(this.datasetSelect).empty();
		$(this.columnSelect).empty();
		
		if ( (typeof this.parent.datasets !== "undefined") && (this.parent.datasets.length > 0)) {
			var index = 0;
			var pieChartGui = this;
			$(this.parent.datasets).each(function(){
				$(pieChartGui.datasetSelect).append("<option value="+index+">"+this.label+"</option>");
				index++;
			});
			
			$(pieChartGui.datasetSelect).select();
		}
	}
};