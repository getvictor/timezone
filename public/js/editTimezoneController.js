appControllers.controller('EditTimezoneController', function($scope, $location, $window, AuthenticationService, TimezoneService) {

  $scope.alerts = [];

  // TODO: Put alert-handling code into its own service.
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

  var timezoneToEdit = TimezoneService.getTimezoneToEdit();
  if (timezoneToEdit) {
    $scope.edit = true;
    $scope.name = timezoneToEdit.name;
    $scope.city = timezoneToEdit.city;
    $scope.time = TimezoneService.timezoneStringFromMinutes(timezoneToEdit.minutesFromGMT);
    TimezoneService.setTimezoneToEdit(null);
  }

  $scope.addTimezone = function() {

    // Clear alerts;
    $scope.alerts = [];

    // Convert time to minutes
    var minutes = TimezoneService.timezoneMinutesFromString($scope.time);
    var timezone = {
      name: $scope.name,
      city: $scope.city,
      minutesFromGMT: minutes
    };

    TimezoneService.add(timezone).success(function(data) {
      $location.path("/");
    }).error(function(data, status) {
      handleError(data);
    });
  };

  $scope.editTimezone = function() {

    // Clear alerts;
    $scope.alerts = [];

    // Convert time to minutes
    var minutes = TimezoneService.timezoneMinutesFromString($scope.time);
    var timezone = {
      name: $scope.name,
      city: $scope.city,
      minutesFromGMT: minutes,
      id : timezoneToEdit.id
    };

    TimezoneService.edit(timezone).success(function(data) {
      $location.path("/");
    }).error(function(data, status) {
      handleError(data);
    });
  };

});
