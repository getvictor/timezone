/**
 * Service for interfacing with the user API.
 */
appServices.factory('UserService', function($http, AuthenticationService) {
  return {
    login : function(username, password) {
      return $http.post(options.apiUrl + '/users/login', {
        username : username,
        password : password
      });
    },

    logout : function() {
      AuthenticationService.clearToken();
    },

    register : function(username, password) {
      return $http.post(options.apiUrl + '/users/register', {
        username : username,
        password : password
      });
    }
  };
});
