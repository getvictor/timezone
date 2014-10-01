appControllers.controller('EditTimezoneController', function($scope, $location, $window,
    AuthenticationService, TimezoneService, AlertsService) {

  $scope.AlertsService = AlertsService;
  AlertsService.clearAll();

  var timezoneToEdit = TimezoneService.getTimezoneToEdit();
  if (timezoneToEdit) {
    $scope.edit = true;
    $scope.name = timezoneToEdit.name;
    $scope.city = timezoneToEdit.city;
    $scope.time = TimezoneService.timezoneStringFromMinutes(timezoneToEdit.minutesFromGMT);
    TimezoneService.setTimezoneToEdit(null);
  }

  $scope.addTimezone = function() {
    AlertsService.clearAll();
    $scope.submitted = true;

    if ($scope.form.$valid) {

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
        AlertsService.error(data);
      });

    }
  };

  $scope.editTimezone = function() {
    AlertsService.clearAll();
    $scope.submitted = true;

    if ($scope.form.$valid) {

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
        AlertsService.error(data);
      });

    }
  };

});
