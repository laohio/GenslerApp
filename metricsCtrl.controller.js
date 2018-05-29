angular
    .module("gensApp")
    .controller("metricsCtrl",metricsCtrl);

metricsCtrl.$inject = ["$scope", "inputData"];

function metricsCtrl($scope, inputData) {
	$scope.cur_rent_sf = '';
	$scope.post_rent_sf = '';
	$scope.sqft_floor = '';
	$scope.reno_cost = '';
	$scope.other_costs = '';


	$scope.rentIncrease = function() {
		return $scope.post_rent_sf - $scope.cur_rent_sf;
	}

	$scope.totalCosts = function () {
		return $scope.reno_cost + $scope.other_costs;
	}

	$scope.calcRoi = function () {
		// Get the number of floors checked; this determines how many floors will be renovated and can be charged
		// higher rents
		var floorsChecked = inputData.getChecked();
		// ROI is (rent increase * number of floors renovated * square feet per floor) * 12   /   total costs
		var roi = (($scope.rentIncrease() * ($scope.sqft_floor * floorsChecked) * 12) / $scope.totalCosts()) * 100;
		var roundedRoi = Math.round(1000*roi)/1000;
		return roundedRoi || 0;
	}
}