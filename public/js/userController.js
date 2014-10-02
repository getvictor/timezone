/**
 * Controller for Login and Register views.
 */
appControllers.controller('UserController', function($scope, $location,
    UserService, AuthenticationService, AlertsService) {

  $scope.AlertsService = AlertsService;
  AlertsService.clearAll();

  $scope.login = function(username, password) {
    // Clear alerts.
    AlertsService.clearAll();
    $scope.submitted = true;

    if ($scope.form.$valid) {

      UserService.login(username, password).success(function(data) {
        AuthenticationService.setToken(data.token);
        $location.path("/");
      }).error(function(data, status) {
        AlertsService.error(data);
      });
    }

  };

  $scope.register = function register(username, password) {
    // Clear alerts;
    AlertsService.clearAll();
    $scope.submitted = true;

    if ($scope.form.$valid) {

      UserService.register(username, password).success(function(data) {
        AuthenticationService.setToken(data.token);
        $location.path("/");
      }).error(function(data, status) {
        AlertsService.error(data);
      });
    }
  };

});
