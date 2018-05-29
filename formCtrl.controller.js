angular
	.module("gensApp")
	.controller("formCtrl",formCtrl);

formCtrl.$inject = ["$scope", "inputData"];

 function formCtrl($scope,inputData) { 	
 	$scope.show = 1;

 	$scope.switchDiv = function() {
 		$scope.show = 2;
 	}

	$scope.num_floors = '';
	$scope.total_sf = '';
	$scope.building_height = '';

	$scope.num_checked = 0;

	$scope.makeFloorsArray = function () {
		// A list of floors objects [{number: 1, isChecked}]
		var floorsArray = new Array();
		for (var i = 1; i <= $scope.num_floors; i++) {
			floorsArray.push({floor: i, isChecked:false});
		}
		return floorsArray;
	}

	$scope.updateFloors = function () {
		// Prepares one button for each floor to render on html 
		$scope.floorsArray = $scope.makeFloorsArray();
		// Save inputted data information (num floors, etc.) in inputData factory
		inputData.setInfo($scope.num_floors, $scope.total_sf,$scope.building_height);
		// Using our inputData service, we are going to let the map controller know that user input data has been updated
		// and that "submit" has been clicked, so it can render the 3d layers now
		$scope.notifyClicked(); 
	}
	// Run the notify function in our inputData factory to emit to the $rootScope.  
	//Used in "updateFloors" function when click button pressed.
	$scope.notifyClicked = function () {
		inputData.notify();
	}

	/********* SECOND PAGE OF FORM NAVIGATION*********/
	$scope.highlightFloors = function() {
		// Clear floors currently in inputData's floorsSelected array.  This is because everytime this function (highlightFloors) is called,
		// we will from scratch go through the array to see which floors need to be highlighted
		inputData.clearFloors();


		// We need this b/c of a JS quirk when unchecking the last checkbox.  If we unchecked the last checkbox, and that last floor
		// needs to switch from yellow to blue, we'll just run checkboxNotify() here
		if ($scope.calculateChecked() == 0) {
			inputData.checkboxNotify();
		}

		for (var i = 0; i < $scope.floorsArray.length; i++) {
			// If a box is checked...
			if ($scope.floorsArray[i].isChecked) {
				// Add this floor to the "selected floors" which will be highlighted on the building
				inputData.setFloorsSelected(i+1);
				inputData.checkboxNotify();
			}
		}
	}

	// Calculates the number of boxes checked, then sends that number to the inputData factory
	$scope.calculateChecked = function() {
		var count = 0;
		angular.forEach($scope.floorsArray, function(value) {
        	if(value.isChecked) {
          		count++;
        	}
      	});
		inputData.setChecked(count);
      	return count;
	}
}