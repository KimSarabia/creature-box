'use strict';

var app = angular.module('userAuth', ["ui.router"]);


app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state("home", {
      url: "/",
      templateUrl: "/html/home.html"
    })
    .state("login", {
      url: "/login",
      templateUrl: "/html/auth.html",
      controller: "authCtrl"
    })
    .state("register", {
      url: "/register",
      templateUrl: "/html/auth.html",
      controller: "authCtrl"
    })
    .state("profile", {
      url: "/profile",
      templateUrl: "/html/profile.html",
      onEnter: stateProtection
    })

    $urlRouterProvider.otherwise("/")
})




function stateProtection(UserService, $state) {
  if (!UserService.username) {
    $state.go("home")
  }
}

  app.run(function(AuthService) {
    AuthService.init();
  })


  app.filter("titleCase", function() {
    return function(input) {
      return input.charAt(0).toUpperCase() + input.slice(1);
    }
  });
