/**
 * 
 */

function TaskbarConfig(options) {
	
	this.options = {
			
			simoneOptions		: {
				
				orientation 		: "vertical",
				verticalHeight		: "100%",
				verticalStick		: "top left",
				verticalColumnWidth	: "7%",
				windowsContainment	: "visible",
				windowButtonsIconsOnly: true,
				resizable			: false,
				resolveCollisions	: false,
				buttons				: {
					scalein			: {
						label		: "S+"
					},
					scaleout		: {
						label		: "S-"
					}
				},
				systemButtonsOrder	: ["scalein", "scaleout", "languageselect","networkMonitor","toggleFullscreen","clock","minimizeAll"],
				
			},			
			defaultScale		: 0.75,
			copyDivSelector				: ".simone-taskbar-window-copy",
			containmentDivSelector		: ".simone-taskbar-windows-containment",
			
			workspace			: {
				divId				: "invdiv",
				height				: "2000px",
				width				: "4000px"
			}
			
	}
	
	if ( typeof options != 'undefined') {
		$.extend(this.options, options);
	}
			
}