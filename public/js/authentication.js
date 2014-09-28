timezoneApp.config(function($httpProvider) {
  $httpProvider.interceptors.push('TokenInterceptor');
});

appServices.factory('AuthenticationService', function() {
  // TODO: Use $window.localStorage to store token across browser windows. Refresh token when it is close to expiring.
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
      // Mark the promise as a failed operation.
      return $q.reject(rejection);
    },

    // Set Authentication.isAuthenticated to true if 200 received.
    // Remove this once authentication is held in localStorage.
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

      // Mark the promise as a failed operation.
      return $q.reject(rejection);
    }
  };
});
