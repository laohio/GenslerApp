angular
	.module('gensApp')
	.factory('inputData',inputData);

inputData.$inject = ['$rootScope'];	

function inputData($rootScope) {
	var num_floors = '';
	var sqft = '';
	var building_height = '';

	// Setter function for user inputted information about the building
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

	// Emit to the rootscope that a button has been clicked
	notify = function() {
		$rootScope.$emit("buttonClicked");
	}

	// Listen for button click being emmitted to the rootscope.  Fire the callback function once it is.
	subscribe = function (scope, callback) {
		var handler = $rootScope.$on("buttonClicked", callback);
		// Avoid memory leaks
		scope.$on("destroy",handler);
	}


	// Make a list of objects for the building containing data about each floor (base height, floor height,
	//floor count), based on the user inputted num_floors, which is set here from the formCtrl controller.
	// geodata.data.features[0].properties.height
	function makeLayers() {
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

	return {
		setInfo: setInfo,
		getFloors: getFloors,
		getSqft: getSqft,
		notify: notify,
		subscribe: subscribe,
		makeLayers: makeLayers
	}
}