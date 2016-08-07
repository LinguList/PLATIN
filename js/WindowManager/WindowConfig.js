/**
 * 
 */

function StatusWindowConfig(options) {

	this.options = {

		closable 		: false,
		maximizable 	: false,
		minimizable 	: false,
		resizable 		: false,
		draggable 		: false,
		close 			: null,
		title 			: "Statuswindow",
		position 		: {
			my : "right top",
			at : "right top"
		},
		width 			: "92%",
		height 			: 60

	}

	if (typeof options != 'undefined') {
		$.extend(this.options, options);
	}

}

function MapWindowConfig(options) {

	this.options = {

		closable 		: false,
		close 			: null,
		title 			: "Map",
		width 			: 1024,
		height 			: 620,
		icons			: {
			main		: "ui-icon-worldmap"
		}
	}

	if (typeof options != 'undefined') {
		$.extend(this.options, options);
	}
}

function PieChartWindowConfig(options) {

	this.options = {

		closable 		: false,
		close 			: null,
		title 			: "Piecharts",
		width 			: 640,
		height 			: 480,
		icons			: {
			main		: "ui-icon-piechart"
		}
	}

	if (typeof options != 'undefined') {
		$.extend(this.options, options);
	}
}

function UtilityWindowConfig(options) {

	this.options = {

		closable 		: false,
		close 			: null,
		title 			: "Utils",
		width 			: 1024,
		height 			: 768,
		icons			: {
			main		: "ui-icon-utility"
		}

	}

	if (typeof options != 'undefined') {
		$.extend(this.options, options);
	}
}

function PlotWindowConfig(options) {

	this.options = {

		closable 		: false,
		close 			: null,
		title 			: "Plot",
		width 			: 1024,
		height 			: 768,
		icons			: {
			main		: "ui-icon-plotchart"
		}

	}

	if (typeof options != 'undefined') {
		$.extend(this.options, options);
	}
}

function TableWindowConfig(options) {

	this.options = {

		closable 		: false,
		close 			: null,
		title 			: "none",
		width 			: 1024,
		height 			: 768,
		icons			: {
			main		: "ui-icon-table"
		}

	}

	if (typeof options != 'undefined') {
		$.extend(this.options, options);
	}
}

function AboutWindowConfig(options) {

	this.options = {

		closable 		: false,
		close 			: null,
		title 			: "About",
		width 			: 800,
		height 			: 150,
		icons			: {
			main		: "ui-icon-plotchart"
		}

	}

	if (typeof options != 'undefined') {
		$.extend(this.options, options);
	}
}



