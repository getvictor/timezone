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

  $scope.TimezoneService = TimezoneService;
  $scope.fetchingTimezones = true;

  $scope.timezones = [];
  TimezoneService.get().success(function(data) {
    $scope.timezones = data.results;
    $scope.fetchingTimezones = false;
  }).error(function(data, status) {
    $scope.fetchingTimezones = false;
    handleError(data);
  });

  $scope.edit = function(timezone) {
    TimezoneService.setTimezoneToEdit(timezone);
    $location.url('/editTimezone');
  };

  $scope.delete = function(index, timezone) {
    TimezoneService.delete(timezone).success(function(data) {
      $scope.timezones.splice(index, 1);
    }).error(function(data, status) {
      handleError(data);
    });
  };

});
