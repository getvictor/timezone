var options = {
  apiUrl : ''
};

var timezoneApp = angular.module('timezoneApp', [ 'ngRoute' , 'appControllers', 'appServices',
                                                  'ui.bootstrap', 'ui.validate']);

var appServices = angular.module('appServices', []);
var appControllers = angular.module('appControllers', []);

// Configure routes.
timezoneApp.config(function($routeProvider) {
  $routeProvider.when('/register', {
    templateUrl : 'views/register.html',
    controller : 'UserController',
    access : { requiredAuthentication: false }
  }).when('/login', {
    templateUrl : 'views/login.html',
    controller : 'UserController',
    access : { requiredAuthentication: false }
  }).when('/', {
    templateUrl : 'views/timezones.html',
    controller : 'TimezoneController',
    access : { requiredAuthentication: true }
  }).when('/addTimezone', {
    redirectTo : '/editTimezone'
  }).when('/editTimezone', {
    templateUrl : 'views/editTimezone.html',
    controller : 'EditTimezoneController',
    access : { requiredAuthentication: true }
  }).otherwise({
    redirectTo : '/'
  });
});

timezoneApp.run(function($rootScope, $location, $window, AuthenticationService) {
  $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
    var isAuthenticated = AuthenticationService.isAuthenticated && $window.sessionStorage.token;

    // Redirect to the login page if both isAuthenticated is false or no token is set
    if (nextRoute && nextRoute.access) {
      if (nextRoute.access.requiredAuthentication && !isAuthenticated) {
        $location.path("/login");
      } else if (isAuthenticated && (nextRoute.originalPath === '/register' || nextRoute.originalPath === '/login')) {
        $location.path("/");
      }
    }
  });
});
