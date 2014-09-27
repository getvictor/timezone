appServices.factory('UserService', function($http, $window, AuthenticationService) {
  return {
    login : function(username, password) {
      return $http.post(options.apiUrl + '/users/login', {
        username : username,
        password : password
      });
    },

    logout : function() {
      AuthenticationService.isAuthenticated = false;
      delete $window.sessionStorage.token;
      // return $http.get(options.apiUrl + '/users/logout');
    },

    register : function(username, password) {
      return $http.post(options.apiUrl + '/users/register', {
        username : username,
        password : password
      });
    }
  };
});
