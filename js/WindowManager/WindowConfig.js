/**
 * 
 */

function StatusWindowWConfig(options) {

	this.options = {

		closable 		: false,
		maximizable 	: false,
		minimizable 	: false,
		resizable 		: false,
		draggable 		: false,
		close 			: null,
		title 			: "Statuswindow",
		position 		: {
			my : "center top",
			at : "center top"
		},
		width 			: 1024,
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
		height 			: 768,
		embeddedContent	: true
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
		height 			: 800
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
		height 			: 768
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
		height 			: 768
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
		height 			: 768
	}

	if (typeof options != 'undefined') {
		$.extend(this.options, options);
	}
}




