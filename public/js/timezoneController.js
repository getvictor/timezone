appControllers.controller('TimezoneController', function($scope, $location, $window, AuthenticationService, TimezoneService) {

  $scope.alerts = [];

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  var handleError = function(data) {
    if (data.message) {
      $scope.alerts.push({
        type: 'danger',
        msg: data.message
      });
    } else {
      $scope.alerts.push({
        type: 'danger',
        msg: 'Could not complete request.'
      });
    }
  };

  TimezoneService.get().success(function(data) {
    $scope.timezones = data.results;
  }).error(function(data, status) {
    handleError(data);
  });

});
