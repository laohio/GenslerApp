angular
	.module('gensApp')
	.factory('geoData',geoData);

geoData.$inject = ["$http"];

function geoData($http) {
    getData = function(successHandler,failureHandler) { 
    	$http.get('http://localhost:8000/buildings.js')
	    .then(function(response) {
	        successHandler(response);
	    }, function(x) {
	        failureHandler(response);
	    });
	}
	return {getData: getData};
}