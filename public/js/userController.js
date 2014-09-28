appControllers.controller('UserController', function($scope, $location, $window, UserService, AuthenticationService) {

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

  // User Controller -- register, login, logout
  $scope.login = function(username, password) {
    // Clear alerts;
    $scope.alerts = [];

    // TODO: Add front end validation.
    UserService.login(username, password).success(function(data) {
      AuthenticationService.isAuthenticated = true;
      $window.sessionStorage.token = data.token;
      $location.path("/");
    }).error(function(data, status) {
      handleError(data);
    });
  };

  $scope.logout = function() {
    if (AuthenticationService.isAuthenticated) {

      UserService.logout().success(function(data) {
        AuthenticationService.isAuthenticated = false;
        delete $window.sessionStorage.token;
        $location.path("/");
      }).error(function(data, status) {
        handleError(data);
      });
    } else {
      $location.path("/login");
    }
  };

  $scope.register = function register(username, password, passwordConfirm) {
    // Clear alerts;
    $scope.alerts = [];

    // TODO: Check that passwords match.
    if (AuthenticationService.isAuthenticated) {
      $location.path("/");
    } else {
      UserService.register(username, password).success(function(data) {
        AuthenticationService.isAuthenticated = true;
        $window.sessionStorage.token = data.token;
        $location.path("/");
      }).error(function(data, status) {
        handleError(data);
      });
    }
  };
});
