appControllers.controller('NavbarController', function($scope, $location, $window, UserService, AuthenticationService) {

  $scope.isAuthenticated = function() {
    return AuthenticationService.isAuthenticated && $window.sessionStorage.token;
  };

  $scope.urlMatches = function(url) {
    return $location.url() === url;
  };

  $scope.logout = function() {
    UserService.logout();
    $location.url('/login');
  };

});
