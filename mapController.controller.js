mapboxgl.accessToken = 'pk.eyJ1IjoibGFvaGlvIiwiYSI6ImNqZzN3a3UyazAxdHMycXMwY3M4dHRpYTMifQ.jR-NOnk5CuqYUebMlPwK2A';
angular
    .module("gensApp")
    .controller("mapController",mapController);

mapController.$inject = ["$scope", "inputData","geoData", "$http"];

function mapController($scope,inputData,geoData,$http) { 
    var map = new mapboxgl.Map({
        container: 'map-box-map', // container id
        style: 'mapbox://styles/mapbox/navigation-preview-night-v2', // stylesheet location
        center: [-71.0608, 42.3584], // starting position [lng, lat]
        zoom: 15.5, // starting zoom
        hash: true, // sync lat/lng with hash fragment of URL
        pitch: 60,
        bearing: 17.5
    });

    map.on('load', function() {
        // Insert the layer beneath a symbol layer
        var layers = map.getStyle().layers;

        var labelLayerId;
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
                labelLayerId = layers[i].id;
                break;
            }
        }

        // In map JS, you need to add layers based on building height, which is the geojson file, and number of stories/square footage, which the user enters.
        // Maybe you should be able to set height (but this messes with the layers)?  No, your height should be consistent with 3d extrusion (especially when
        // other buildings are rendered)


    // Layer for all buildings
    map.addLayer({
        'id': 'All-Buildings',
        'visibility': 'hidden',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'layout': {
            'visibility': 'visible'
        },
        'paint': {
            'fill-extrusion-color': '#aaa',

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "height"]
            ],
            'fill-extrusion-base': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "min_height"]
            ],
            'fill-extrusion-opacity': .8
        }
    }, labelLayerId);

    
    $scope.prepare_layers = function () {
        //Success handler if GeoJSON data successfully retrieved
        function successHandler(res) {
            $scope.source_data = res.data;
            make_layers();
        }
        //Failure handler if GeoJSON unsuccessfully retrieved
        function failureHandler(res) {
            alert('Error: failure to retrieve data');
        }
        //Call geoData factory's function to retrieve data
        getData = function() {
            geoData.getData(successHandler, failureHandler);
        }
        //Run function to get geodata
        getData();

        // Copy layers object, an array with "floor" object for each floor, from inputData factory
        // e.g. customLayers[0] == {floor_id:1, base_height: 0; floor_height: 20}
        // After this, make 3d extrusion on the map for each floor
        
        function make_layers() {
            console.log(inputData.numFloors);
            var customLayers = inputData.makeLayers;
            for (var i = 0; i < inputData.getFloors; i++) {
                console.log('entered loop');
                //console.log('hello');
                map.addLayer({
                'id': 'Property',
                'type': 'fill-extrusion',
                'source': '$scope.source_data', 
                'paint': {
                    'fill-extrusion-color': 'blue',
                    'fill-extrusion-height': customLayers[i].floor_height,
                    'fill-extrusion-base': customLayers[i].base_height,
                    'fill-extrusion-opacity': 0.95
                }
            });
            }
        }
    }
    // THIS should only be run after the data (number of floors, etc.) is entered by the user, otherwise will not work.  Figure this out
    //$scope.prepare_layers();
    
    // Toggleable layers
    var toggleableLayerIds = ['All-Buildings','Property'];
    for (var i = 0; i < toggleableLayerIds.length; i++) {
        var id = toggleableLayerIds[i];

        var link = document.createElement('a');
        link.href = '#';
        link.className = 'active';
        link.textContent = id;

        link.onclick = function (e) {
            var clickedLayer = this.textContent;
            e.preventDefault();
            e.stopPropagation();

            var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

            if (visibility === 'visible') {
                map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                this.className = '';
            } else {
                this.className = 'active';
                map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
            }
        };
        var layers = document.getElementById('menu');
        layers.appendChild(link);
    }
    });
}