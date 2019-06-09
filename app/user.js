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
   usr.controller("homeCtrl",function ($scope,$http,$location) {
   var id=sessionStorage.getItem('uid');
    var ob,l;//array of liked ear by the user and it's length,like controlle for likeitfn
   // $scope.ear={};

    $http(
        {
            url:"app/earload.php",
            method: "POST",
            headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data:{
                    uid:id,
                    fn:"normal"
                }
        }
    ).then(function (response) {
        console.log(response.data);
        $scope.ear=response.data.output;

        //managing likes
        try{
         l=response.data.liked.length;}
         catch (e) {
             
         }
         if(l>0) {
             ob = response.data.liked;
         }

         console.log(ob);


    });
      $scope.isliked=function(earid,x)//change the color if it id liked
    {
        //console.log(earid);
        var css={"color":"red"};
        earid=parseInt(earid);
        for(var i=0;i<l;i++)
        {
            if(earid==ob[i])
            {

                return css;
            }


        }
        if (x.li === true) return css;
    };
    $scope.likeit=function(earid,x)
    {

        // console.log(colo);
           x.rating++;
           $http({
               url:"app/earload.php",
               method: "POST",
               headers:
                   {
                       'Content-Type': 'application/x-www-form-urlencoded'
                   },
               data:{
                   fn:"like",
                   input:earid,
                   input1:id
               }
           }).then(function (response) {
               console.log(response.data);
               if(response.data.output==="ok")
               {
                   x.li=true;
                   $scope.isliked(earid,x);
                   $scope.islikedit(earid,x);
               }

           })
    };


    $scope.kind=function(kind)
    {
        if(kind=="event")
            return true;

    };
    $scope.red=function (x) {

        $location.path("/single");
        sessionStorage.setItem('ob',x);
    };
    $scope.load_comment=function (x) {
        $location.path("/single");
        sessionStorage.setItem('ob',x)
    }
   
  });
usr.controller("singleCtrl",function ($scope,$http,$location,$log) {
    $scope.x={};
    $scope.x.li=false;
    var ob,l;//ob array containing liked videos and l it's length
    let  earid=sessionStorage.getItem('ob');// is the EARid
    if(earid==null) {
        alert("permission denided");
        $location.path("/home");
    }
    else {
        console.log(earid);
        $http({
            url: "app/earload.php",
            method: "POST",
            headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            data: {
                earid: earid,
                subfn: "load",
                fn: "single"
            }
        }).then(function (response) {
              $scope.x=response.data.output;
            console.log(response.data.output);

        });
           //loading the liked

        $http({
            url:"app/earload.php",
            method: "POST",
            headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            data:{
                earid:earid,
                subfn:"loadlk",
                fn:"single",
                uid:sessionStorage.getItem('uid')
            }
        }).then(function (response) {
           // console.log(response.data);
            l=response.data.liked.length;
            ob=response.data.liked;

        });
        $scope.isliked=function()//change the color if it id liked
        {
            //console.log(earid);
            var css={"color":"red"};
            earid=parseInt(earid);
            for(var i=0;i<l;i++)
            {
                if(earid==ob[i])
                {

                    return css;
                }


            }
            if ($scope.x.li === true) return css;
        };
        $scope.islikedit=function()//enable and disable the like button
        {
            earid=parseInt(earid);
            for(var i=0;i<l;i++)
            {
                if(earid==ob[i])
                {
                    return true;
                }
            }
            if($scope.x.li===true) return true;
        };
        $scope.likeit=function()
        {

            // console.log(colo);
            $scope.x.rating++;
            $http({
                url:"app/earload.php",
                method: "POST",
                headers:
                    {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                data:{
                    fn:"like",
                    input:earid,
                    input1:sessionStorage.getItem('uid')
                }
            }).then(function (response) {
                console.log(response.data);
                if(response.data.output==="ok")
                {
                  $scope.x.li=true;

                }

            })
           //controlling the comments
        /*
            -----------------------------


         */

        function loadcomm()
        {
            $http({
                url:"app/earload.php",
                method: "POST",
                headers:
                    {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                data: {
                    fn: "comment",
                    subfn: "load",
                    earid: earid
                }
            }).then(function (response) {
                $scope.comments=response.data.output;
                $log.info($scope.comments);
            })
        }
        loadcomm();//calling to load the commenta
        $scope.comShow=function () {
                    if($scope.comments==null)
                        return true;
                    else
                        return false;
        };


        $scope.commentit=function () {
                $http({
                    url:"app/earload.php",
                    method: "POST",
                    headers:
                        {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                    data:{
                        fn:"comment",
                        subfn:"add",
                        earid:earid,
                        comment:$scope.comment,
                        uname:sessionStorage.getItem('name')
                    }
                }).then(function (response) {
                    $log.info(response.data);
                    //console.log(sessionStorage.getItem('uname'));
                    alert("Successfully added");
                    loadcomm();
                    $scope.comment="";
                },function (reason) {
                    alert(reason.error);
                })
               }
            }
        };
      
