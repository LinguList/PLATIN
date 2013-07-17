/*
* PieChartWidget.js
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
 * @class PieChartWidget
 * PieChartWidget Implementation
 * @author Sebastian Kruse (skruse@mpiwg-berlin.mpg.de)
 *
 * @param {WidgetWrapper} core wrapper for interaction to other widgets
 * @param {HTML object} div parent div to append the PieChart widget div
 * @param {JSON} options user specified configuration that overwrites options in PieChartConfig.js
 */
function PieChartWidget(core, div, options) {

	this.datasets;
	this.selected;
	this.core = core;
	this.core.setWidget(this);

	this.options = (new PieChartConfig(options)).options;
	this.gui = new PieChartGui(this, div, this.options);
	
	this.pieCharts = [];
}

PieChartWidget.prototype = {
	
	addPieChart : function(watchedDataset, watchedColumn, selectionFunction){
		var newPieChart = new PieChart(this, watchedDataset, watchedColumn, selectionFunction);
		this.pieCharts.push(newPieChart);
		if (	(typeof GeoTemConfig.datasets !== "undefined") && 
				(GeoTemConfig.datasets.length > watchedDataset) )
			newPieChart.initPieChart(GeoTemConfig.datasets);
		this.redrawPieCharts(this.selected);
	},

	initWidget : function(data) {
		this.datasets = data;
		this.selected = this.datasets; 
		
		this.gui.refreshColumnSelector();
		
		$(this.pieCharts).each(function(){
			if (this instanceof PieChart)
				this.initPieChart(data);
		});
	},
	
	redrawPieCharts : function(objects, overwrite) {
		$(this.pieCharts).each(function(){
			if (this instanceof PieChart){
				if ( (typeof overwrite !== "undefined") && overwrite)
					this.preHighlightObjects = objects;
				this.redrawPieChart(objects);
			}
		});
	},

	highlightChanged : function(objects) {
		if( !GeoTemConfig.highlightEvents ){
			return;
		}
		if ( (typeof objects === "undefined") || (objects.length == 0) ){
			return;
		}
		this.redrawPieCharts(objects, false);
	},

	selectionChanged : function(selection) {
		if( !GeoTemConfig.selectionEvents ){
			return;
		}
		if (!selection.valid()){
			selection.loadAllObjects();
		}
		var objects = selection.objects;
		this.selected = objects;
		this.redrawPieCharts(objects, true);
	},
	
	getElementData : function(dataObject, watchedColumn, selectionFunction) {
		var columnData;
		if (watchedColumn.indexOf("[") === -1){
			columnData = dataObject[watchedColumn];
			if (typeof columnData === "undefined"){
				columnData = dataObject.tableContent[watchedColumn];
			};
		} else {
			try {
				var columnName = watchedColumn.split("[")[0];
				var IndexAndAttribute = watchedColumn.split("[")[1];
				if (IndexAndAttribute.indexOf("]") != -1){
					var arrayIndex = IndexAndAttribute.split("]")[0];
					var attribute = IndexAndAttribute.split("]")[1];
					
					if (typeof attribute === "undefined")
						columnData = dataObject[columnName][arrayIndex];
					else{
						attribute = attribute.split(".")[1];
						columnData = dataObject[columnName][arrayIndex][attribute];
					}
				}
			} catch(e) {
				if (typeof console !== undefined)
					console.error(e);
				
				delete columnData;
			}
		}
		
		if ( (typeof columnData !== "undefined") && (typeof selectionFunction !== "undefined") )
			columnData = selectionFunction(columnData);
		
		return(columnData);
	},
	
	getElementsByValue : function(columnValue, watchedDataset, watchedColumn, selectionFunction) {
		var elements = [];
		var pieChart = this;

		$(this.datasets[watchedDataset].objects).each(function(){
			var columnData = pieChart.getElementData(this, watchedColumn, selectionFunction);
			if (columnData === columnValue)
				elements.push(this);
		});
		
		return elements;
	},
};
