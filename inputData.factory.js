angular
	.module('gensApp')
	.factory('inputData',inputData);

inputData.$inject = ['$rootScope'];	

function inputData($rootScope) {
	var num_floors = '';
	var sqft = '';
	var building_height = '';

	var floorsSelected = new Set();

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

	// First clear the contents of the floorsSelected Set in case some floors have been unchecked
	function clearFloors() {
		floorsSelected.clear();
	}

	function setFloorsSelected(floor_num) {
		floorsSelected.add(floor_num);
	}
	function getFloorsSelected() {
		return Array.from(floorsSelected);
	}

	// Emit to the rootscope that a button has been clicked
	notify = function() {
		$rootScope.$emit("buttonClicked");
	}

	// Emit to the rootscope that a checkbox has been checked
	checkboxNotify = function () {
		$rootScope.$emit("checkboxChecked");
	}

	// Listen for button click being emmitted to the rootscope.  Fire the callback function once it is.
	subscribe = function (scope, callback) {
		var handler = $rootScope.$on("buttonClicked", callback);
		// Avoid memory leaks
		scope.$on("destroy",handler);
	}

	// Same as above, for checkbox checked
	subscribeCheckbox = function (scope, callback) {
		var handler = $rootScope.$on("checkboxChecked", callback);
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

	var checkedBoxes = 0;

	var setChecked = function(count) {
		checkedBoxes = count;
	}

	getChecked = function() {
		return checkedBoxes;
	}

	return {
		setInfo: setInfo,
		getFloors: getFloors,
		getSqft: getSqft,
		clearFloors: clearFloors,
		setFloorsSelected: setFloorsSelected,
		getFloorsSelected: getFloorsSelected,
		notify: notify,
		checkboxNotify: checkboxNotify,
		subscribe: subscribe,
		subscribeCheckbox: subscribeCheckbox,
		makeLayers: makeLayers,
		setChecked: setChecked,
		getChecked: getChecked
	}
}