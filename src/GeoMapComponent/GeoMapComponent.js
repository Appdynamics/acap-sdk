
import BaseChart from '../BaseChart';
import * as leafjs from 'leaflet';
import leafcss from '../../node_modules/leaflet/dist/leaflet.css';
var GREEN = "GREEN";
var YELLOW = "#FFC300";
var RED = "RED";

function updateGeoFilters(filter, element) {
    setTimeout(function () {
        geoMap.filter = filter;
        $('#' + filter + '-legend-filter').css('color', 'black');

        geoMap.drawModels();
    }, 10);




}
class Location {
    constructor(id, geo, zipcode) {
        this.id = id;
        this.GEO = geo;
        this.ZIPCODE = zipcode;

    }

}

class GeoMapComponent extends BaseChart {
    constructor(options) {
        options.div = options.targetId;
        super(options);


        this.map = null;

        //this.canvas = createCanvas(windowWidth-25-250,windowHeight-25).parent(options.div); 
        this.locationFeatureGroup = null;
        this.dataModels = [];
        this.filteredData = [];
        this.modelLookup = {};
        this.markerLookup = {};
        this.myZoom = null;
        this.filter = 'testfilter';



    }

    getModel(locationId) {
        return this.modelLookup[locationId];
    }

    averageGeolocation(coords) {
        if (coords.length === 1) {
            return coords[0];
        }

        let x = 0.0;
        let y = 0.0;
        let z = 0.0;

        for (let coord of coords) {
            let latitude = coord.LAT * Math.PI / 180;
            let longitude = coord.LON * Math.PI / 180;

            x += Math.cos(latitude) * Math.cos(longitude);
            y += Math.cos(latitude) * Math.sin(longitude);
            z += Math.sin(latitude);
        }

        let total = coords.length;

        x = x / total;
        y = y / total;
        z = z / total;

        let centralLongitude = Math.atan2(y, x);
        let centralSquareRoot = Math.sqrt(x * x + y * y);
        let centralLatitude = Math.atan2(z, centralSquareRoot);

        return {
            LAT: (centralLatitude * 180 / Math.PI),
            LON: centralLongitude * 180 / Math.PI
        };
    }
    resetToAverageLocation(zoom) {
        var compOptions = super.getOptions();
        if(this.dataModels && this.dataModels.length > 0) {
            var center = this.averageGeolocation(this.dataModels.map((loc) => {
                return loc.GEO;
            }))
    
            this.map.setView([center.LAT, center.LON], zoom || compOptions.zoom);
            this.map.fitBounds(this.locationFeatureGroup.getBounds());
        }


    }

    renderChart(data, clickFunction) {

        var compOptions = super.getOptions();
        var lat = compOptions.lat ? compOptions.lat : 39.8283;
        var lng = compOptions.lng ? compOptions.lng : -98.5795;
        var zoom = compOptions.zoom ? compOptions.zoom : 4;
        if (compOptions.height) {
            $(this.getDiv()).css('height', compOptions.height + 'px');
        }
        if (compOptions.width) {
            $(this.getDiv()).css('width', compOptions.width + 'px');
        }
        if (!this.dataModels) {
            this.dataModels = data;
        }


        var style = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        var osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';

        var options = {
            lat: lat,
            lng: lng,
            zoom: zoom,
            style: style,
            attribution: osmAttrib
        }

        this.map = L.map(super.getOptions().div, { preferCanvas: true });
        L.tileLayer(options.style, { minZoom: 1, maxZoom: 18, attribution: options.attribution }).addTo(this.map);
        this.map.setView([options.lat, options.lng], options.zoom);
        this.locationFeatureGroup = L.featureGroup().addTo(this.map);

        this.locationFeatureGroup.on('click', function (ev) {
            var locationId = ev.layer.locationId;
            clickFunction(locationId, gmc.filter);
        });

        super.updateChartOptions(options);
        this.drawModels(data);

        this.map.featureGroup = this.locationFeatureGroup;

        var gmc = this;
        if (compOptions.legend) {
            var legend = L.control({ position: 'bottomright' });

            legend.onAdd = function (map) {

                var div = L.DomUtil.create('div', 'info legend');

                div.innerHTML = compOptions.legend || `<div id="ts-map-legend" >
                                    <h3 class="ts-map-legend-headline">Legend</h3>
                                    <p><br/></p>
                                    <div onclick="updateGeoFilters('testfilter', this)" class="clickable" id="testfilter-legend-filter" style="color:black">Test Filter</div>
                                </div>`;

                return div;
            };
            legend.addTo(this.map);
        }




    }

    getColor(id) {
        var color = RED;
        if (id == 2) {
            color = GREEN;
        }
        if (id == 3) {
            color = YELLOW;
        }
        return color;
    }

    drawModels(data) {
        var drawable_data = [];


        if (!data) {
            data = this.dataModels;
        } else {
            this.dataModels = data;
        }
        var color = RED;

        if (this.filter === "testfilter") {
            drawable_data = data.testfilter || data;
        }


        this.locationFeatureGroup.clearLayers();
        this.modelLookup = {};


        var myRenderer = L.canvas({ padding: 0.5 });

        var invalidZips = [];

        for (let r = 0; r < drawable_data.length; r++) {
            var location = drawable_data[r];
            var locationId = location.id;


            //var color =// this.getColor(location);
            var color = "BLUE";
            if (!this.modelLookup[locationId]) {
                this.modelLookup[locationId] = location;
                if (!location.GEO.LAT) {
                    invalidZips.push(location.ZIPCODE);
                }

                var cm = L.circleMarker([location.GEO.LAT, location.GEO.LON], { radius: 30, color: this.getColor(locationId) }).addTo(this.locationFeatureGroup);
                cm.locationId = locationId;
                this.markerLookup[locationId] = cm;
            }
        }

        this.map.invalidateSize();

    }

    popup(location) {
        var self = this;
        var marker = this.markerLookup[location.id];


        var id = location.id.toString().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/\s]/gi, '');

        var content = `<h5>ID - ${location.id} </h5><b>Zip:</b> ${location.ZIPCODE}<br/>`;

        var popup = L.popup({
            minWidth: 100,
            minHeight: 100
        })
            .setLatLng([location.GEO.LAT, location.GEO.LON])
            .setContent(content).openOn(self.map);

        self.map.flyTo([location.GEO.LAT, location.GEO.LON], self.map.getZoom());







    }

    showComponent(comp, x, y) {
        var parentCanvas = select("#defaultCanvas0").parent();
        var compElement = select("#" + comp.getOptions().targetId);
        compElement.parent(parentCanvas);
        compElement.position(x, y);
        compElement.style('z-index', 10);
        compElement.show();
    }
}


export { Location, GeoMapComponent }