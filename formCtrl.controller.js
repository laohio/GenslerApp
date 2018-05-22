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

	$scope.makeFloorsArray = function () {
		// A list of floors objects [{number: 1, isChecked}]
		var floorsArray = [];
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
		$scope.notifyMap(); 
	}
	// Run the notify function in our inputData factory to emit to the $rootScope.  
	//Used in "updateFloors" function when click button pressed.
	$scope.notifyMap = function () {
		inputData.notify();
	}

	/********* SECOND PAGE OF FORM NAVIGATION*********/
	$scope.highlightFloors = function() {
		for (var i = 0; i < $scope.floorsArray.length; i++) {
			if ($scope.floorsArray[i].isChecked) {
			}
		}
	}
}