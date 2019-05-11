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
var usr=angular.module("main",['ngRoute']);
//config
usr.config(function ($routeProvider) {
    $routeProvider.when("/",{
        templateUrl:"partials/views/home.html"
    })
        .when("/",
            {
                templateUrl:"partials/views/home.html",
                controller:"homeCtrl"
            })
        .when("/home",{
            templateUrl:"partials/views/home.html",
            controller:"homeCtrl"
        })
        .when("/dashboard",{
            templateUrl:"partials/views/dash.html",
            controller:"dashCtrl"
        })
   //additional routing req
   });
   usr.controller("mainCtrl",function ($scope,$http) {
        $scope.user={};
        var id=sessionStorage.getItem('uid');
        console.log(sessionStorage.getItem('uid'));
        if(id===null)
        {
            alert("you are not logged in so please log in");
            window.location="login.html";
        }
        else
        {
            $scope.user.name=sessionStorage.getItem('name');
            let type=sessionStorage.getItem('type');
            console.log(type);
           //permission of tabs for activating and deactivating !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!required!!!!!!!!!!!!!!!!
        }
       $scope.logout=function () {
                    var date=new Date();
                    var lastseen=""+date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+"@"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
          $http(
              {
                  url: "app/logout.php",
                  method: "post",
                  headers: {
                      'Content-type':'application/x-www-form-urlencoded'
                  },
                  data:"lastseen="+lastseen+"&id="+id
              }
          ).then(function (response) {
              console.log(response.data);
          });

            sessionStorage.clear();
            window.location="zenferz.html";

        }
});
