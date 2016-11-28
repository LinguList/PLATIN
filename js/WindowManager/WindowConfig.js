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
		height 			: 45

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
		},
		durations		: {
			maximize	: 10,
			minimize	: 10,
			restore		: 10,
			show		: 10
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
		},
		durations		: {
			maximize	: 10,
			minimize	: 10,
			restore		: 10,
			show		: 10
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
		},
		durations		: {
			maximize	: 10,
			minimize	: 10,
			restore		: 10,
			show		: 10
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
		},
		durations		: {
			maximize	: 10,
			minimize	: 10,
			restore		: 10,
			show		: 10
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
		title 			: "Table",
		width 			: 1024,
		height 			: 768,
		icons			: {
			main		: "ui-icon-table"
		},
		durations		: {
			maximize	: 10,
			minimize	: 10,
			restore		: 10,
			show		: 10
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
		},
		durations		: {
			maximize	: 10,
			minimize	: 10,
			restore		: 10,
			show		: 10
		}


	}

	if (typeof options != 'undefined') {
		$.extend(this.options, options);
	}
}



