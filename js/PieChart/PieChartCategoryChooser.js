/*
* PieChartCategoryChooser.js
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
 * @class PieChartCategoryChooser
 * PieChart dialog for category creation
 * @author Sebastian Kruse (skruse@mpiwg-berlin.mpg.de)
 *
 * @param {PieChartWidget} parent PieChart widget object
 * @param {JSON} options PieChart configuration
 * @param {number} datasetIndex index of the dataset
 * @param {String} columnName name of the column
 */

function PieChartCategoryChooser(pieChart, options, datasetIndex, columnName) {

	var pieChartCategoryChooser = this;
	
	this.parent = pieChart;
	this.options = options;
	this.datasetIndex = parseInt(datasetIndex);
	this.columnName = columnName;
		
	this.dialog = $("<div></div>");
	this.dialog.html("").dialog({modal: true}).dialog('open');

	//to asure that the dialog is above (z-index of) the toolbars
	$(".ui-front").css("z-index","10001");
	
	this.loadValues(datasetIndex, columnName);	
};

PieChartCategoryChooser.prototype = {

	loadValues : function(datasetIndex, columnName){
		var pieChartCategoryChooser = this;
		
		var chartData = [];
		$(GeoTemConfig.datasets[datasetIndex].objects).each(function(){
			var columnData = 
				pieChartCategoryChooser.parent.getElementData(this, columnName);
			
			if ($.inArray(columnData, chartData) == -1)
				chartData.push(columnData);
		});
		
		this.createTextBasedChooser(chartData);
	},
	
	createTextBasedChooser : function(chartData){
		var pieChartCategoryChooser = this;
		
		var table = document.createElement("table");
		var row = document.createElement("tr");
		table.appendChild(row);
		var cell = document.createElement("td");
		row.appendChild(cell);
		var addCategoryName = document.createElement("input");
		addCategoryName.type = "text";
		addCategoryName.value = "category name";
		cell.appendChild(addCategoryName);
		cell = document.createElement("td");
		row.appendChild(cell);
		var addCategoryButton = document.createElement("button");
		$(addCategoryButton).text("add new category");
		cell.appendChild(addCategoryButton);
		var applyCategoryButton = document.createElement("button");
		$(applyCategoryButton).text("apply");
		cell.appendChild(applyCategoryButton);
		
		row = document.createElement("tr");
		table.appendChild(row);
		cell = document.createElement("td");
		row.appendChild(cell);
		var unselected = document.createElement("ul");
		$(unselected).addClass("connectedSortable");
		cell.appendChild(unselected);
		cell = document.createElement("td");
		$(cell).attr("valign","top");
		$(cell).width("100%");
		row.appendChild(cell);
		
		this.dialog.append(table);
		
		$( ".connectedSortable" ).sortable({
			connectWith: ".connectedSortable" 
		}).disableSelection();
		
		$(chartData).each(function(){
			$(unselected).append("<li class='ui-state-default'>"+this+"</li>");
		});
		
		$(addCategoryButton).click(function(){
			var newCategoryContainer = document.createElement("fieldset");
			$(newCategoryContainer).append("<legend>"+$(addCategoryName).val()+"</legend>");
			$(newCategoryContainer).width("188px");
			$(newCategoryContainer).css("float","left");
			var newCategory = document.createElement("ul");
			$(newCategory).addClass("connectedSortable");
			$(newCategory).css("background", "#eee");
			newCategoryContainer.appendChild(newCategory);
			$(newCategory).append("<br/>");
			cell.appendChild(newCategoryContainer);		

			$( ".connectedSortable" ).sortable({
				connectWith: ".connectedSortable" 
			}).disableSelection();
		});
		
		$(applyCategoryButton).click(function(){
			var categories = [];
			$(cell).children().each(function(){
				var label = $(this).find("legend").text();
				var values = [];
				$(this).find("li").each(function(){
					values.push($(this).text());
				});
				
				categories.push({label:label,values:values});
			});
			
			var values = [];
			$(unselected).find("li").each(function(){
				values.push($(this).text());
			});
			
			categories.push({label:"other",values:values});
			
			//create selection function for the pie chart
			var selectionFunction = function(columnData){
				var categoryLabel;
				$(categories).each(function(){
					if ($.inArray(columnData,this.values) != -1){
						categoryLabel = this.label;
						//exit .each
						return false;
					}
					if (typeof categoryLabel !== "undefined")
						return false;
				});
				
				if (typeof categoryLabel === "undefined")
					categoryLabel = "unknown";

				return categoryLabel;
			};
			
			//create pie chart
			pieChartCategoryChooser.parent.addPieChart(
					pieChartCategoryChooser.datasetIndex, pieChartCategoryChooser.columnName, selectionFunction);
		
			//close dialog
			$(pieChartCategoryChooser.dialog).dialog("close");
		});	
		
		//set dialog size
	    var wWidth = $(window).width();
	    var dWidth = wWidth * 0.9;
	    var wHeight = $(window).height();
	    var dHeight = wHeight * 0.9;
	    $(this.dialog).dialog("option", "width", dWidth);
	    $(this.dialog).dialog("option", "height", dHeight);
	}

};