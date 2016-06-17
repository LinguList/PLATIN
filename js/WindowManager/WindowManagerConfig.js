function WindowManagerConfig(options) {
	
	this.options = {
			
			statusWindowDiv 	: document.getElementById("statusWindowDiv"),
			mapWindowDiv		: document.getElementById("mapWindowDiv"),
			piechartWindowDiv	: document.getElementById("piechartContainerDiv"),
			utilityWindowDiv	: document.getElementById("utilityContainerDiv"),
			plotWindowDiv		: document.getElementById("plotContainerDiv"),
			tableWindowDiv		: document.getElementById("tableContainerDiv")
			
			
	}
	if (typeof options != 'undefined') {
		$.extend(this.options, options);
	}
}