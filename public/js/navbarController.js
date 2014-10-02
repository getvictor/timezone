/**
 * Controller for the navigation bar.
 */
appControllers.controller('NavbarController', function($scope, $location,
    UserService, AuthenticationService) {

  $scope.isAuthenticated = function() {
    return AuthenticationService.isAuthenticated();
  };

  $scope.urlMatches = function(url) {
    return $location.url() === url;
  };

  $scope.logout = function() {
    UserService.logout();
    $location.url('/login');
  };

});
