angular
	.module('gensApp')
	.factory('inputData',inputData);

function inputData() {
	return {
		setInfo: setInfo,
		getFloors: getFloors,
		getSqft: getSqft,
		makeLayers: makeLayers
	}
	var num_floors = '';
	var sqft = '';
	var building_height = '';

	function setInfo(floors, squarefeet, height) {
		num_floors = floors;
		sqft = squarefeet;
		building_height = height;
	}

	function getFloors() {
		return num_floors;
	}
	function getSqft() {
		return sqft;
	}


	// Make a list of floor objects for the building, depending on the user input data
	// geodata.data.features[0].properties.height
	function makeLayers() {
		// Originally had $http.get, but don't need if height is just going to be user input
		/*
	    $http
	    .get("buildings.js")
	    .then(function(response) {
	    	*/
	    	//const geodata = response.data;
			/*var total_height = geodata.data.features[0].properties.height;*/ //Total height should also be user input... 
			// It makes most sense since to be dynamically entered since everything else is
			var base_height = 0;
			var floor_height = building_height / num_floors;
			var count = 1;
	  		var building = [];
	  		// Make an object with height info for each floor
	  		for (var i = 1; i <= num_floors; i++) {
	  			// Make instance of geodata object, but update floor/height values
			  	var new_floor = Object.assign({floor_id:count,base_height:base_height,floor_height:floor_height});
			    // Getting ready for the next floor:
			    base_height = floor_height;
			    floor_height += building_height / num_floors;
			    count += 1;
		    	building.push(new_floor);
		  	}
		  	return building;
	}
}