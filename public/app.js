'use strict';

var app = angular.module('app', ['ngRoute', 'ui.bootstrap', 'appControllers', 'appServices',]);

var appServices = angular.module('appServices', []);
var appControllers = angular.module('appControllers', []);

app.config(function($routeProvider) {
    $routeProvider.
        when('/register', {
            templateUrl: 'views/register.html',
            controller: 'UserCtrl'
        }).
        when('/login', {
            templateUrl: 'views/login.html',
            controller: 'UserCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
});


app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});

app.run(function($rootScope, $location, $window, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        //redirect only if both isAuthenticated is false and no token is set
        if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication 
            && !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {
            $location.path("/login");
        }
    });
});

appControllers.controller('UserCtrl', function AdminUserCtrl($scope, $location, $window, UserService, AuthenticationService) {

        // User Controller -- register, login, logout
        $scope.login = function(username, password) {
            if (username != null && password != null) {

                UserService.signIn(username, password).success(function(data) {
                    AuthenticationService.isAuthenticated = true;
                    $window.sessionStorage.token = data.token;
                    $location.path("/");
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
        };

        $scope.logout = function() {
            if (AuthenticationService.isAuthenticated) {
                
                UserService.logOut().success(function(data) {
                    AuthenticationService.isAuthenticated = false;
                    delete $window.sessionStorage.token;
                    $location.path("/");
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
            else {
                $location.path("/login");
            }
        };

        $scope.register = function register(username, password, passwordConfirm) {
            if (AuthenticationService.isAuthenticated) {
                $location.path("/");
            } else {
                UserService.register(username, password, passwordConfirm).success(function(data) {
                    $location.path("/");
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
        };
    }
);

appServices.factory('AuthenticationService', function() {
    var auth = {
        isAuthenticated: false,
        isAdmin: false
    };

    return auth;
});

appServices.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },

        requestError: function(rejection) {
            return $q.reject(rejection);
        },

        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },

        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
                delete $window.sessionStorage.token;
                AuthenticationService.isAuthenticated = false;
                $location.path("/admin/login");
            }

            return $q.reject(rejection);
        }
    };
});

appServices.factory('UserService', function ($http) {
    return {
        signIn: function(username, password) {
            return $http.post(options.api.base_url + '/user/signin', {username: username, password: password});
        },

        logOut: function() {
            return $http.get(options.api.base_url + '/user/logout');
        },

        register: function(username, password, passwordConfirmation) {
            return $http.post(options.api.base_url + '/user/register', {username: username, password: password, passwordConfirmation: passwordConfirmation });
        }
    };
});

