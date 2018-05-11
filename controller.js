angular
	.module("gensApp")
	.controller("formCtrl",formCtrl);

formCtrl.$inject = ["$scope", "inputData"];

 function formCtrl($scope,inputData) {
	$scope.num_floors = '';
	$scope.total_sf = '';
	$scope.building_height = '';

	$scope.makeFloorsArray = function () {
		var floorsArray = [];
		for (var i = 1; i <= $scope.num_floors; i++) {
			floorsArray.push(i);
		}
		return floorsArray;
	}

	$scope.updateFloors = function () {
		$scope.floorsArray = $scope.makeFloorsArray();
		inputData.setInfo($scope.num_floors, $scope.total_sf,$scope.building_height);
		
	}
}