mapboxgl.accessToken = 'pk.eyJ1IjoibGFvaGlvIiwiYSI6ImNqZzN3a3UyazAxdHMycXMwY3M4dHRpYTMifQ.jR-NOnk5CuqYUebMlPwK2A';
var map = new mapboxgl.Map({
    container: 'map', // container id
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
    console.log(layers);

    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }


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
    

    
    // Massing layer for specific buildings.  Right now test with one
    map.addLayer({
        'id': 'Property',
        'type': 'fill-extrusion',
        'source': {
            // GeoJSON data source used in vector tiles (FIGURE OUT HOW TO USE)
            'type': 'geojson',
            // Example for One Beacon; temporary solution b/c CORS issues (assume there's a way to access from their website?)
            'data': {
                  "features": [
                    {
                      "type": "Feature",
                      "properties": {
                        "color": "blue",
                        "height": 153.92,
                        "base_height": 0
                      },
                      "geometry": {
                        "coordinates": [
                          [
                            [
                              -71.06116,
                              42.35871
                            ],
                            [
                              -71.061281,
                              42.358323
                            ],
                            [
                              -71.060485,
                              42.358185
                            ],
                            [
                              -71.060366,
                              42.35857
                            ],
                            [
                              -71.06116,
                              42.35871
                            ]
                          ]
                        ],
                        "type": "Polygon"
                      },
                      "id": "5d98b707b2499658c1c15a989f0cb25e"
                    }
                  ],
                  "type": "FeatureCollection"
            },
        },
        'paint': {
            'fill-extrusion-color': ['get','color'],
            'fill-extrusion-height': ['get','height'],
            'fill-extrusion-base': ['get','base_height'],
            'fill-extrusion-opacity': 0.95
        }
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
        var layers = document.getElementById('menu');
        layers.appendChild(link);
}

       
}); 