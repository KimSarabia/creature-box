'use strict';

var app = angular.module('userAuth');

app.service('AuthService', function($http, UserService, $state) {

  this.init = function() {
    return $http.get("/users/profile")
    .then(function(res) {
      UserService.set(res.data);
    })
  }

  this.register = function(user) {
    return $http.post('/users/register', user)
    .then(function(res) {
      UserService.set(res.data);
    })
  };

  this.login = function(user) {
    return $http.post('/users/authenticate', user)
    .then(function(res) {
      //chain promise and set user with userService
      UserService.set(res.data);
    })
  };

  this.logout = function() {
    return $http.post("/users/logout")
    .then(function() {
      UserService.destroy();
      $state.go("home")
    })
  }
});

app.service("UserService", function() {

  this.set = function(user) {
    this.username = user.username;
    this._id = user._id;
  };
  this.destroy = function() {
    this.username = null;
    this._id = null;
  };

});
