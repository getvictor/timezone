appServices.factory('TimezoneService', function($http) {
  return {

    get : function() {
      return $http.get(options.apiUrl + '/timezones');
    }

  };
});
