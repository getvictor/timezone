var options = {
  apiUrl : ''
};

var timezoneApp = angular.module('timezoneApp', [ 'ngRoute' , 'appControllers', 'appServices', 'ui.bootstrap']);

var appServices = angular.module('appServices', []);
var appControllers = angular.module('appControllers', []);

// Configure routes.
timezoneApp.config(function($routeProvider) {
  $routeProvider.when('/register', {
    templateUrl : 'views/register.html',
    controller : 'UserCtrl',
    access : { requiredAuthentication: false }
  }).when('/login', {
    templateUrl : 'views/login.html',
    controller : 'UserCtrl',
    access : { requiredAuthentication: false }
  }).otherwise({
    redirectTo : '/login'
  });
});

timezoneApp.config(function($httpProvider) {
  $httpProvider.interceptors.push('TokenInterceptor');
});

timezoneApp.run(function($rootScope, $location, $window, AuthenticationService) {
  $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
    // Redirect to the login page if both isAuthenticated is false or no token is set
    if (nextRoute && nextRoute.access && nextRoute.access.requiredAuthentication &&
        !(AuthenticationService.isAuthenticated && $window.sessionStorage.token)) {
      $location.path("/login");
    }
  });
});

appControllers.controller('UserCtrl', function AdminUserCtrl($scope, $location, $window, UserService,
    AuthenticationService) {

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
      }).error(function(status, data) {
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

appServices.factory('AuthenticationService', function() {
  var auth = {
    isAuthenticated : false
  };

  return auth;
});

appServices.factory('TokenInterceptor', function($q, $window, $location, AuthenticationService) {
  return {
    request : function(config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },

    requestError : function(rejection) {
      return $q.reject(rejection);
    },

    // Set Authentication.isAuthenticated to true if 200 received.
    response : function(response) {
      if (response !== null && response.status === 200 && $window.sessionStorage.token &&
          !AuthenticationService.isAuthenticated) {
        AuthenticationService.isAuthenticated = true;
      }
      return response || $q.when(response);
    },

    // Revoke client authentication if 401 is received.
    responseError : function(rejection) {
      if (rejection !== null && rejection.status === 401 &&
          ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
        delete $window.sessionStorage.token;
        AuthenticationService.isAuthenticated = false;
        $location.path("/login");
      }

      return $q.reject(rejection);
    }
  };
});

appServices.factory('UserService', function($http) {
  return {
    login : function(username, password) {
      return $http.post(options.apiUrl + '/users/login', {
        username : username,
        password : password
      });
    },

    logout : function() {
      return $http.get(options.apiUrl + '/users/logout');
    },

    register : function(username, password) {
      return $http.post(options.apiUrl + '/users/register', {
        username : username,
        password : password
      });
    }
  };
});
