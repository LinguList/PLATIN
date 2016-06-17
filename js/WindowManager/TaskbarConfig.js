/**
 * 
 */

function TaskbarConfig(options) {
	
	this.options = {
			
			orientation 		: "vertical",
			verticalHeight		: "100%",
			verticalStick		: "top left",
			verticalColumnWidth	: "7%",
			windowsContainment	: "visible",
			windowButtonsIconsOnly: true,
			resizable			: false,
			resolveCollisions	: false,
			buttons				: {
				zoomin			: {
					label		: "Z+"
				},
				zoomout			: {
					label		: "Z-"
				},
				scalein			: {
					label		: "S+"
				},
				scaleout		: {
					label		: "S-"
				}
			},
			systemButtonsOrder	: ["zoomin","zoomout","scalein", "scaleout", "languageselect","networkMonitor","toggleFullscreen","clock","minimizeAll"]
			
	}
	
	if ( typeof options != 'undefined') {
		$.extend(this.options, options);
	}
			
}