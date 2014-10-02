var options = {
  apiUrl : ''
};

var timezoneApp = angular.module('timezoneApp', [ 'ngRoute' , 'appControllers', 'appServices',
                                                  'ui.bootstrap', 'ui.validate']);

var appServices = angular.module('appServices', []);
var appControllers = angular.module('appControllers', []);

// Configure routes.
timezoneApp.config(function($routeProvider) {
  $routeProvider.
  // Register user.
  when('/register', {
    templateUrl : 'views/register.html',
    controller : 'UserController',
    access : { requiredAuthentication: false },
    title : 'Register'
  }).
  // Login user.
  when('/login', {
    templateUrl : 'views/login.html',
    controller : 'UserController',
    access : { requiredAuthentication: false },
    title : 'Login'
  }).
  // Show timezones.
  when('/', {
    templateUrl : 'views/timezones.html',
    controller : 'TimezoneController',
    access : { requiredAuthentication: true },
    title : 'Home'
  }).
  // Add timezone.
  when('/addTimezone', {
    redirectTo : '/editTimezone'
  }).
  // Edit existing timezone.
  when('/editTimezone', {
    templateUrl : 'views/editTimezone.html',
    controller : 'EditTimezoneController',
    access : { requiredAuthentication: true },
    title : 'Edit Timezone'
  }).
  // Go to timezone page.
  otherwise({
    redirectTo : '/'
  });
});

timezoneApp.run(function($rootScope, $location, $window, AuthenticationService) {
  $rootScope.APP_TITLE = APP_TITLE;

  $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
    // Update page title.
    $rootScope.pageTitle = nextRoute.title;

    // Redirect to the login page if not authenticated.
    if (nextRoute && nextRoute.access) {
      var isAuthenticated = AuthenticationService.isAuthenticated();
      if (nextRoute.access.requiredAuthentication && !isAuthenticated) {
        $location.path("/login");
      } else if (isAuthenticated &&
          // A logged in user should not be going back to register/login.
          (nextRoute.originalPath === '/register' || nextRoute.originalPath === '/login')) {
        $location.path("/");
      }
    }
  });
});
