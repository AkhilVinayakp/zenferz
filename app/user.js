var user = angular.module("user",['ngRoute']);
user.config(function ($routeProvider) {
   $routeProvider.when("/",{
       templateUrl:"partials/usr_log.html",
       controller:"logCtrl"
   })
});
user.controller("logCtrl",function ($scope,$http) {
    $scope.signup=function () {
       window.location="default.html";
    };
    $scope.signin = function () {
        $http({
            url:"app/login.php",
            method:"post",
            headers:
                {
                    'Content-type':'application/x-www-form-urlencoded'
                },
            data:'email='+$scope.email+"&password="+$scope.password

        }).then(function(response){
            console.log(response.data);
           if(response.data.error=="") {
               var out = response.data.output;
               console.log(out);
               if (out.length > 0) {
                   var uid = out[0].uid;
                   if (uid === null) {
                       alert("can't sign in somthing went wrong");
                   }
                   else {
                       sessionStorage.setItem('uid', uid);
                       sessionStorage.setItem('name', out[0].uname);
                       sessionStorage.setItem('type',out[0].u_type);
                       window.location = "users.html";
                   }

               }
           }
           else
           {
               alert("Can not find you...");
           }
        })
    }


});
