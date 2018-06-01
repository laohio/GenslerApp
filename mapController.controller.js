mapboxgl.accessToken = 'pk.eyJ1IjoibGFvaGlvIiwiYSI6ImNqZzN3a3UyazAxdHMycXMwY3M4dHRpYTMifQ.jR-NOnk5CuqYUebMlPwK2A';
angular
    .module("gensApp")
    .controller("mapController",mapController);

mapController.$inject = ["$scope", "inputData","geoData", "$http"];

function mapController($scope,inputData,geoData,$http) { 
    var map = new mapboxgl.Map({
        container: 'map-box-map', // container id
        style: 'mapbox://styles/laohio/cjg6ymums0v4c2rqktr6258uf', // stylesheet location
        center: [-71.0608, 42.3584], // starting position [lng, lat]
        zoom: 16.8, // starting zoom
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

        //map.resize();

    // Layer for all surrounding buildings
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
            // If getFloors() returns a positive value/num_floors has already been defined, and layers have already been made,
            // then delete the existing building layers before making the new ones based on new input data.
            if ($scope.current_num_floors) {
                for (var i = 0; i < $scope.current_num_floors; i++) {
                    map.removeLayer($scope.customLayers[i].floor_id);
                    map.removeSource($scope.customLayers[i].floor_id);
                }
            }

            // Initiailize the number of layers to 0.  We will increment this number in the following for loop.
            // We keep track of it within this function, so that when the number of floors is resubmitted, we know how
            // many layers we have to delete on the map before adding the new ones.
            $scope.current_num_floors = 0;
            $scope.customLayers = inputData.makeLayers();

            for (var i = 0; i < inputData.getFloors(); i++) {
                map.addLayer({
                'id': String($scope.customLayers[i].floor_id),
                'type': 'fill-extrusion',
                'source': $scope.source_data, 
                'paint': {
                    'fill-extrusion-color': 'blue',
                    'fill-extrusion-height': $scope.customLayers[i].floor_height,
                    'fill-extrusion-base': $scope.customLayers[i].base_height,
                    'fill-extrusion-opacity': 0.4
                }
            });
                $scope.current_num_floors++;
            }
        }
    }

    $scope.highlightFloor = function () {
        // Make a particular layer update its fill-extrusion-color

    }

    // Listen for button clicked
    inputData.subscribe($scope, function buttonWasClicked() {
        $scope.prepare_layers();
    });

    var currently_highlighted = [];
    inputData.subscribeCheckbox($scope, function checkboxWasChecked() {
        // Save the floors which will be highlighted yellow in this variable
        var floors_to_highlight = inputData.getFloorsSelected();

        // Check for floor numbers which have been unclicked, by comparing the floors in floors_to_highlight to the last floors
        // that were highlighted (currently_highlighted).  If a floor number is found in currently_highlighted that is no longer
        // in the new floors_to_highlight, make it blue again.
        for (var i = 0; i < currently_highlighted.length; i++) {
            if (floors_to_highlight.indexOf(currently_highlighted[i]) == -1) {
                map.setPaintProperty(currently_highlighted[i], 'fill-extrusion-color', 'blue');
                map.setPaintProperty(currently_highlighted[i], 'fill-extrusion-opacity', 0.4);

            }
        }

        // Update the color of floors in floors_to_highlight to yellow
        for (var i = 0; i < floors_to_highlight.length; i++) {
            map.setPaintProperty(floors_to_highlight[i], 'fill-extrusion-color', 'yellow');
            map.setPaintProperty(floors_to_highlight[i], 'fill-extrusion-opacity', 1);
        }
        // Let's save the floor numbers that are currently highlighted yellow, so that we can UN-highlight them if they were
        // unchecked
        currently_highlighted = floors_to_highlight;
    }); 


    
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
        var layers = document.getElementById('layersMenu');
        layers.appendChild(link);
    }
    });
}