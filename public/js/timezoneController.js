appControllers.controller('TimezoneController', function($scope, $location, $window,
    AuthenticationService, TimezoneService, AlertsService) {

  $scope.AlertsService = AlertsService;
  AlertsService.clearAll();

  $scope.TimezoneService = TimezoneService;
  $scope.fetchingTimezones = true;

  $scope.timezones = [];
  TimezoneService.get().success(function(data) {
    $scope.timezones = data.results;
    $scope.fetchingTimezones = false;
  }).error(function(data, status) {
    $scope.fetchingTimezones = false;
    AlertsService.error(data);
  });

  $scope.edit = function(timezone) {
    TimezoneService.setTimezoneToEdit(timezone);
    $location.url('/editTimezone');
  };

  $scope.delete = function(index, timezone) {
    TimezoneService.delete(timezone).success(function(data) {
      $scope.timezones.splice(index, 1);
    }).error(function(data, status) {
      AlertsService.error(data);
    });
  };

});
