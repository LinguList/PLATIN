function WindowManagerConfig(options) {
	
	this.options = {
			
			statusWindowDiv 	: "statusWindowDiv",
			mapWindowDiv		: "mapWindowDiv",
			piechartWindowDiv	: "piechartContainerDiv",
			utilityWindowDiv	: "utilityContainerDiv",
			plotWindowDiv		: "plotContainerDiv",
			tableWindowDiv		: "tableContainerDiv"
			
			
	}
	if (typeof options != 'undefined') {
		$.extend(this.options, options);
	}
}