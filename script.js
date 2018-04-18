function() {
	mapboxgl.accessToken = 'pk.eyJ1IjoibGFvaGlvIiwiYSI6ImNqZzN3a3UyazAxdHMycXMwY3M4dHRpYTMifQ.jR-NOnk5CuqYUebMlPwK2A';
	var map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/mapbox/navigation-preview-night-v2', // stylesheet location",
	    center: [-74.50, 40], // starting position [lng, lat]
	    zoom: 9 // starting zoom
	});
	console.log('hello');
}