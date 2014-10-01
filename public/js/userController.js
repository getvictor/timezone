appControllers.controller('UserController', function($scope, $location, $window,
    UserService, AuthenticationService, AlertsService) {

  $scope.AlertsService = AlertsService;
  AlertsService.clearAll();

  // User Controller -- register, login, logout
  $scope.login = function(username, password) {
    // Clear alerts.
    AlertsService.clearAll();
    $scope.submitted = true;

    if ($scope.form.$valid) {

      UserService.login(username, password).success(function(data) {
        AuthenticationService.isAuthenticated = true;
        $window.sessionStorage.token = data.token;
        $location.path("/");
      }).error(function(data, status) {
        AlertsService.error(data);
      });
    }

  };

  $scope.logout = function() {
    if (AuthenticationService.isAuthenticated) {

      UserService.logout().success(function(data) {
        AuthenticationService.isAuthenticated = false;
        delete $window.sessionStorage.token;
        $location.path("/");
      }).error(function(data, status) {
        AlertsService.error(data);
      });
    } else {
      $location.path("/login");
    }
  };

  $scope.register = function register(username, password) {
    // Clear alerts;
    AlertsService.clearAll();
    $scope.submitted = true;

    if ($scope.form.$valid) {

      UserService.register(username, password).success(function(data) {
        AuthenticationService.isAuthenticated = true;
        $window.sessionStorage.token = data.token;
        $location.path("/");
      }).error(function(data, status) {
        AlertsService.error(data);
      });
    }
  };
});
