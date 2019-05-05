var user = angular.module("user",['ngRoute']);
user.config(function ($routeProvider) {
   $routeProvider.when("/",{
       templateUrl:"partials/usr_log.html",
       controller:"logCtrl"
   })
});
