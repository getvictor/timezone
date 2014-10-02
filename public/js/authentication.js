/**
 * Service responsible for storing authentication state.
 */
appServices.factory('AuthenticationService', function($window) {

  return {
    isAuthenticated: function() {
      return !!$window.localStorage.token;
    },
    setToken: function(token) {
      $window.localStorage.token = token;
    },
    getToken: function() {
      return $window.localStorage.token;
    },
    clearToken: function() {
      delete $window.localStorage.token;
    }
  };

});

/**
 * Interceptor service that injects authentication tokens into requests.
 */
appServices.factory('TokenInterceptor', function($q, $location, AuthenticationService) {
  return {

    request : function(config) {
      config.headers = config.headers || {};
      if (AuthenticationService.isAuthenticated()) {
        config.headers.Authorization = 'Bearer ' + AuthenticationService.getToken();
      }
      return config;
    },

    requestError : function(rejection) {
      // Mark the promise as a failed operation.
      return $q.reject(rejection);
    },

    // Revoke client authentication if 401 is received.
    responseError : function(rejection) {
      if (rejection !== null && rejection.status === 401) {
        AuthenticationService.clearToken();
        $location.path("/login");
      }

      // Mark the promise as a failed operation.
      return $q.reject(rejection);
    }
  };
});

timezoneApp.config(function($httpProvider) {
  $httpProvider.interceptors.push('TokenInterceptor');
});

/**
 * Refresh authentication token, if one exists.
 */
timezoneApp.run(function($http, $location, AuthenticationService) {

  // Refresh token once every 55 minutes.
  var refreshInterval = 55 * 60 * 1000;

  // Refresh user's token while user is authenticated.
  var tokenRefresh = function() {
    if (AuthenticationService.isAuthenticated()) {
      $http.post(options.apiUrl + '/users/refresh').success(function(data) {
        // If token was deleted while request was outstanding, then don't set it.
        if (AuthenticationService.isAuthenticated()) {
          AuthenticationService.setToken(data.token);
        }
      }).error(function() {
        AuthenticationService.clearToken();
        $location.path('/login');
      });
    }
  };

  tokenRefresh();
  setInterval(tokenRefresh, refreshInterval);
});
