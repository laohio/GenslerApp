[{
  "id": "Property",
  "type": "fill-extrusion",
  "source": {
      // GeoJSON data source used in vector tiles (FIGURE OUT HOW TO USE)
      //"type": "GeoJSON",
      // Example for One Beacon; temporary solution b/c CORS issues (assume there"s a way to access from their website?)
      "data": {
            "features": [
              {
                "type": "Feature",
                "properties": {
                  "color": "blue",
                  "height": (153.92/37),
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
  "paint": {
      "fill-extrusion-color": ["get","color"],
      "fill-extrusion-height": ["get","height"],
      "fill-extrusion-base": ["get","base_height"],
      "fill-extrusion-opacity": 0.95
  }
}
]