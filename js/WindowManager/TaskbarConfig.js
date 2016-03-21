/**
 * 
 */

function TaskbarConfig(options) {
	
	this.options = {
			
			orientation 		: "vertical",
			verticalHeight		: "50%",
			verticalStick		: "top left",
			windowsContainment	: "visible",
			windowButtonsIconsOnly: true
			
	}
	
	if ( typeof options != 'undefined') {
		$.extend(this.options, options);
	}
			
}