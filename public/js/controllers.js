'use strict';

var app = angular.module('userAuth');

app.controller("navCtrl", function($scope, AuthService, UserService) {

  $scope.$watch(function() {
    return UserService.username;
  }, function(username) {
    $scope.username = username
  });

  $scope.logout = function() {
    AuthService.logout()
  }
});



app.controller("authCtrl", function($scope, $state, AuthService) {
  $scope.page = $state.current.name;

  $scope.submit = function(user) {
    if ($scope.page === "login") {
      AuthService.login(user).then(function() {
          console.log("Logged in!")
          $state.go("home")
        }, function(err) {
          console.error(err);
        });

    } else {
      if(user.password !== user.passwordConf) {
        user.password = "";
        user.passwordConf = "";
        alert("Passwords do not match")
        return;
      }
      console.log("register")
      AuthService.register(user).then(function(res) {
        console.log('res:', res);
        $state.go("home")
      }, function(err) {
        console.error(err);
      });
    }
  }
})
