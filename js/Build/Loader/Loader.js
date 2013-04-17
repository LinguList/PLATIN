/*
* Loader.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
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
 * Script Loader for GeoTemCo (used for debugging purposes)
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 */

var arrayIndex = function(array, obj) {
	if (Array.indexOf) {
		return array.indexOf(obj);
	}
	for (var i = 0; i < array.length; i++) {
		if (array[i] == obj) {
			return i;
		}
	}
	return -1;
}
GeoTemCoLoader = {

	resolveUrlPrefix : function(file) {
		var sources = document.getElementsByTagName("script");
		for (var i = 0; i < sources.length; i++) {
			var index = sources[i].src.indexOf(file);
			if (index != -1) {
				return sources[i].src.substring(0, index);
			}
		}
	},

	load : function() {
		GeoTemCoLoader.startTime = new Date();
		GeoTemCoLoader.urlPrefix = GeoTemCoLoader.resolveUrlPrefix('js/Build/Loader/Loader.js');
		(new DynaJsLoader()).loadScripts([{
			url : GeoTemCoLoader.urlPrefix + 'js/Build/Loader/TimeplotLoader.js'
		}], GeoTemCoLoader.loadJquery);
	},

	loadJquery : function() {
		if (typeof jQuery == 'undefined') {
			(new DynaJsLoader()).loadScripts([{
				url : GeoTemCoLoader.urlPrefix + 'lib/jquery/jquery.min.js'
			},{
				url : GeoTemCoLoader.urlPrefix + 'lib/jquery/purl.min.js'
			}],GeoTemCoLoader.loadjqPlot);
		}
		else {
			GeoTemCoLoader.loadjqPlot();
		}
	},
	
	loadjqPlot : function() {
		if (typeof $.jqplot == 'undefined') {
			(new DynaJsLoader()).loadScripts([{
				url : GeoTemCoLoader.urlPrefix + 'lib/jqPlot/jquery.jqplot.js'
			},{
				url : GeoTemCoLoader.urlPrefix + 'lib/jqPlot/plugins/jqplot.pieRenderer.js'
			}],GeoTemCoLoader.loadJSZip);
		}
		else {
			GeoTemCoLoader.loadJSZip();
		}
	},
	
	loadJSZip : function() {
		if (typeof JSZip == 'undefined') {
			var jsZipFiles = [{
				url : GeoTemCoLoader.urlPrefix + 'lib/jszip/jszip.js'
			}, {
				url : GeoTemCoLoader.urlPrefix + 'lib/jszip/jszip-deflate.js',
			}, {
				url : GeoTemCoLoader.urlPrefix + 'lib/jszip/jszip-inflate.js'
			}, {
				url : GeoTemCoLoader.urlPrefix + 'lib/jszip/jszip-load.js',
			}];
			
			(new DynaJsLoader()).loadScripts(jsZipFiles, GeoTemCoLoader.loaduCSV);
		}
		else {
			GeoTemCoLoader.loaduCSV();
		}
	},

	loaduCSV : function() {
		if (typeof CSV == 'undefined') {
			var jsZipFiles = [{
				url : GeoTemCoLoader.urlPrefix + 'lib/ucsv/ucsv-1.1.0-min.js',
			}];
			
			(new DynaJsLoader()).loadScripts(jsZipFiles, GeoTemCoLoader.loadTimeplot);
		}
		else {
			GeoTemCoLoader.loadTimeplot();
		}
	},

	loadTimeplot : function() {
		TimeplotLoader.load(GeoTemCoLoader.urlPrefix + 'lib/', GeoTemCoLoader.loadScripts);
	},

	loadScripts : function() {

		SimileAjax.includeCssFile(document, GeoTemCoLoader.urlPrefix + 'css/style.css');
		SimileAjax.includeCssFile(document, GeoTemCoLoader.urlPrefix + 'lib/openlayers/theme/default/style.css');

		(new DynaJsLoader()).loadScripts([{
			url : GeoTemCoLoader.urlPrefix + 'lib/slider/js/range.js'
		}]);
		(new DynaJsLoader()).loadScripts([{
			url : GeoTemCoLoader.urlPrefix + 'lib/slider/js/slider.js'
		}]);
		(new DynaJsLoader()).loadScripts([{
			url : GeoTemCoLoader.urlPrefix + 'lib/slider/js/timer.js'
		}]);
		(new DynaJsLoader()).loadScripts([{
			url : GeoTemCoLoader.urlPrefix + 'js/Time/' + 'SimileTimeplotModify.js'
		}]);
		(new DynaJsLoader()).loadScripts([{
			url : GeoTemCoLoader.urlPrefix + 'lib/' + 'openlayers/' + 'OpenLayers.js'
		}]);

		var geoTemCoFiles = [{
			url : GeoTemCoLoader.urlPrefix + 'js/Util/' + 'Tooltips.js'
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/' + 'GeoTemConfig.js',
			test : "GeoTemConfig.loadKml"
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Map/' + 'MapControl.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Map/' + 'CircleObject.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Util/' + 'FilterBar.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Util/' + 'Selection.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Map/' + 'PlacenameTags.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Map/' + 'MapConfig.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Map/' + 'MapGui.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Map/' + 'MapWidget.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Time/' + 'TimeConfig.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Time/' + 'TimeGui.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Time/' + 'TimeWidget.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Table/' + 'TableConfig.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Table/' + 'TableGui.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Table/' + 'TableWidget.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Table/' + 'Table.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Util/' + 'DataObject.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Util/' + 'Dataset.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Time/' + 'TimeDataSource.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Map/' + 'Binning.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Map/' + 'MapDataSource.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Map/' + 'Clustering.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Util/' + 'Dropdown.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Map/' + 'MapZoomSlider.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Map/' + 'MapPopup.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Map/' + 'PlacenamePopup.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Util/Publisher.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Util/WidgetWrapper.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Dataloader/' + 'DataloaderConfig.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Dataloader/' + 'DataloaderGui.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Dataloader/' + 'DataloaderWidget.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Dataloader/' + 'Dataloader.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Overlayloader/' + 'OverlayloaderConfig.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Overlayloader/' + 'OverlayloaderGui.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Overlayloader/' + 'OverlayloaderWidget.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/Overlayloader/' + 'Overlayloader.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/PieChart/' + 'PieChartConfig.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/PieChart/' + 'PieChartGui.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/PieChart/' + 'PieChartWidget.js',
		}, {
			url : GeoTemCoLoader.urlPrefix + 'js/PieChart/' + 'PieChart.js',
		}];
		(new DynaJsLoader()).loadScripts(geoTemCoFiles, GeoTemCoLoader.initGeoTemCo);

	},

	initGeoTemCo : function() {

		GeoTemConfig.configure(GeoTemCoLoader.urlPrefix);
		Publisher.Publish('GeoTemCoReady', '', null);

	}
}

GeoTemCoLoader.load();
