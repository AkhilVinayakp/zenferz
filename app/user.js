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
        .when("/editprofile",{
            templateUrl:"partials/views/edit.html",
            controller:"editprofileCtrl"
        })
        .when("/create",{
            templateUrl:"partials/views/create_u.html",
            controller:"createEditCtrl"
        })
        .when("/users",{
            templateUrl:"partials/views/users.html",
            controller:"usersCtrl"
        })

        .when("/forums",{
            templateUrl:"partials/views/forums.html",
            controller:"forumsCtrl"
        })
        .when("/compiler",{
            templateUrl:"partials/views/compiler.html",
            controller:"compilerCtrl"
        })
        .when("/single",{
            templateUrl:"partials/views/single.html",
            controller:"singleCtrl"
        })
        .when("/events",{
            templateUrl:"partials/views/createEvent.html",
            controller:"eventCtrl"
        })
        .when("/reply",{
            templateUrl:"partials/views/answers.html",
            controller:"replyCtrl"
        })
        .when("/evar",{
            templateUrl:"partials/views/evar_post.html",
            controller:"evarCtrl"
        })


});


//controller
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
           if(type==0)
           {
               $scope.dash_Show=true;
               $scope.Event_cre_show=true;
               $scope.frcom=true;
           }
           else if(type==1)
           {
                $scope.dash_Show=false;
                $scope.Event_cre_show=false;
                $scope.frcom=true;
           }
           else if (type==2)//colleges
           {
               $scope.dash_Show=false;
               $scope.Event_cre_show=true;
               $scope.frcom=false;
           }
           else if(type==3)//organization
           {
               $scope.dash_Show=false;
               $scope.Event_cre_show=true;
               $scope.frcom=true;
           }
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
    $scope.islikedit=function(earid,x)//enable and disable the like button
    {
        earid=parseInt(earid);
        for(var i=0;i<l;i++)
        {
            if(earid==ob[i])
            {
                return true;
            }
        }
        if(x.li===true) return true;
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


//single page view
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
        };
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
});

//dashboard controller
usr.controller("dashCtrl",function ($scope,$http) {

    function load() {
        $http({
            url: "app/dash.php",
            method: "POST",
            headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            data: {
                fn: "load",
            }
        }).then(function (response) {
            console.log(response.data);
            if(response.data.status===1)
                $scope.x=response.data.output;
            else
                alert("something went wrong");
        },function (reason) {
            alert(reason.error);
        })
    }
    load();
    $scope.accept=function (email,uid) {
        $http({
            url: "app/dash.php",
            method: "POST",
            headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            data: {
                fn: "accept",
                email:email,
                uid:uid
            }
        }).then(function (response) {
            console.log(response.data);
            if(response.data.status===1)
                load();
            else
                alert("somthing went wrong");
        })

    };
    $scope.refuce=function (email) {
        $http({
            url: "app/dash.php",
            method: "POST",
            headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            data: {
                fn: "refuce",
                email:email
            }
        }).then(function (response) {
            console.log(response.data);
            if(response.data.status===1)
                load();
            else
                alert("something went wrong");
        })
    }

});


//edit profile ctrl
usr.controller("editprofileCtrl",function ($scope,$http) {

    $scope.err_pass=function()
    {
        if($scope.password !== $scope.cnf_password)
            return true;
    };
    $scope.frmSub=function () {
        $http({
            url:"app/earload.php",
            method: "POST",
            headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            data: {
                fn: "password",
                uid: sessionStorage.getItem('uid'),
                newpass: $scope.password
            }
        }).then(function (response) {
                        console.log(response.data);
                if(response.data.output=="success")
                {
                    alert("success");
                }
                else
                    alert("something went wrong");

        })
    }


});

usr.controller("usersCtrl",function ($scope,$http) {
    function load() {
        $http({
            url:"app/dash.php",
            method: "POST",
            headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            data: {
                fn: "read"
            }

        }).then(function (response) {
            console.log(response.data);
            if(response.data.status==1)
            {
                $scope.u=response.data.output;
            }
            else
                alert("something wrong");
        })
    }
    load();
    $scope.user_del=function (email) {
        if(confirm("Do you want to continue"))
        {
            $http({
                url:"app/dash.php",
                method: "POST",
                headers:
                    {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                data: {
                    fn: "refuce",
                    email:email
                }
            }).then(function (response) {
                console.log(response.data);
                if(response.data.status===1)
                    alert("successfully removed");
                else
                    alert("something went wrong");
                load();
            })
        }
    }

});

usr.controller("createEditCtrl",function ($scope,$log,$http) {
    /*
    26.01.2019
     */
    $scope.earid=0;//stores the current EARid --for updating the article
    function load()
    {
        $http({
            url:"app/earload.php",
            method: "POST",
            headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            data: {
                fn: "myarticles",
                subfn: "load",
                uid: sessionStorage.getItem('uid'),
                type: "article"
            }
        }).then(function (response) {
            $log.info(response.data);
            $scope.articles=response.data.output;
            if($scope.articles==null)
                $scope.arShow=true;
        })
    }

    $scope.edit=true;
    load();
    $scope.arShow=false;
    $scope.create=false;
    $scope.editAr=function(ar)
    {
        $scope.edit=false;
        $scope.create=true;
        $scope.updateshow=true;
        $scope.submitshow=false;
        $scope.a_name=ar.name;
        $scope.intro=ar.intro;
        $scope.content=ar.content;
        $scope.earid=ar.EARid;
        //$log.info($scope.earid);
    };


    $scope.createnew=function () {
        $scope.create = true;
        $scope.edit = false;
        $scope.submitshow = true;
    };
    $scope.submit=function () {
        var date = new Date();
        var pub_date = "" + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        $http({
            url: "app/updelin.php",
            method: "POST",
            headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            data: {
                fn: "myarticles",
                subfn: "create",
                uid: sessionStorage.getItem('uid'),
                a_intro: $scope.intro,
                a_name: $scope.a_name,
                a_content: $scope.content,
                pub_date: pub_date
            }
        }).then(function (response) {
            $log.info(response.data.status);
            if(response.data.status==1)
            {
                alert("successfully created");
                $scope.create = false;
                $scope.edit = true;
                load();
            }
            else {
                alert("somthing went wrong sorry...........\nPlease try again later");
            }
        },function (reason) {
            $log.info(reason.error);
            alert(reason.error);
        })


    };
    $scope.update=function () {
        var date = new Date();
        var pub_date = "" + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
      $http({
          url: "app/updelin.php",
          method: "POST",
          headers:
              {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
          data: {
              fn: "myarticles",
              subfn: "update",
              earid:$scope.earid,
              a_intro: $scope.intro,
              a_name: $scope.a_name,
              a_content: $scope.content,
              pub_date: pub_date
          }
      }).then(function (response) {
            $log.info(response.data);
            if(response.data.status==1) {
                alert("successfully updated");
                $scope.create = false;
                $scope.edit = true;
                load();
            }
            else
                alert("something went wrong");
      },function (reason) {
          alert(reason.error);
      })

    };
    $scope.delete=function (earid) {
        $http({
            url: "app/updelin.php",
            method: "POST",
            headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            data: {
                fn: "myarticles",
                subfn: "delete",
                earid:earid
            }
        }).then(function (response) {
            $log.info(response.data);
            if(response.data.status==1)
            {
                alert("successfully removed");
                load();
            }
            else
                alert("error in deleting");
        },function (reason) {
            alert(reason.error);
        })
    }

});

/* creating a custom directive for file upload

 */
usr.directive('ngFile', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('change', function(){

                $parse(attrs.ngFile).assign(scope,element[0].files);
                scope.$apply();
            });
        }
    };
}]);

    usr.controller('eventCtrl', ['$scope', '$http' ,function ($scope, $http) {
        $scope.path="";
        var date = new Date();
        var pub_date = "" + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        $scope.submit = function(value){
            var fd=new FormData();
            angular.forEach($scope.uploadfiles,function(file){
                fd.append('file',file);
            });

            $http({
                method: 'post',
                url: 'app/createEvent.php',
                data: fd,
                headers: {'Content-Type': undefined},
            }).then(function(response) {
                // Store response data
                    console.log(response.data);
                    if(response.data.status==1) {
                        $scope.path = response.data.name;
                        $scope.path = "uploads/" + $scope.path;
                        console.log($scope.path);
                        console.log($scope.fn_date);
                        console.log((($scope.fn_date).toString()).substr(0,15));
                        $http({
                            url: "app/updelin.php",
                            method: "POST",
                            headers:
                                {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                            data: {
                                fn: "events",
                                subfn: "create",
                                name:$scope.e_name,
                                venue: $scope.venue,
                                by_whom:sessionStorage.getItem('uid'),
                                pub_date:pub_date,
                                fn_date:(($scope.fn_date).toString()).substr(0,15),
                                intro:$scope.intro,
                                content:$scope.content,
                                path:$scope.path
                            }
                        }).then(function (response) {
                            console.log(response.data);
                            if(response.data.status==1)
                            {
                                alert("successfully created ");
                                $scope.content=null;
                                $scope.path=null;
                                $scope.venue=null;
                                $scope.e_name=null;
                                $scope.fn_date=null;

                            }
                        },function (reason) {
                            alert(reason.error);
                        })
                    }
                    else
                    {
                        alert("upload failed");
                    }
            });
        }

    }]);




usr.controller("forumsCtrl",function ($scope,$http,$log) {
    $scope.create_topic_sh=false;
    $scope.topics=true;
    $scope.show_answer=false;
    function load() {
        $http({
            url:"app/forum.php",
            method: "POST",
            headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            data: {
                fn: "load_topics",
            }
        }).then(function (response) {
            $log.info(response.data);
            if(response.data.status==1) {
                $scope.tp_names = response.data.output;
            }
            else
                alert("server error");
        })
    }
    load();
    $scope.create_topic=function () {
        $log.info("create new topic window");
        $scope.topics=false;
        $scope.create_topic_sh=true;
    };
    function load_ques(t_id){
        $http({
            url: "app/forum.php",
            method: "POST",
            headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            data: {
                fn: "load_quest",
                t_id:t_id
            }
        }).then(function (response) {
            $log.info(response.data);
            if(response.data.status==1) {

                $scope.ques = response.data.output;
                //$scope.num_reply = response.data.reply_num;
            }
            else
                alert("server error");
        },function (reason) {
            alert(reason.error);
        })
    }
    $scope.load_topic=function (t_id) {//to load a particular topic from database
      $log.info("press ok");
      sessionStorage.setItem('t_id',t_id);
      $scope.show_quest=true;
      $scope.topics=false;
      load_ques(t_id);
    };
    $scope.create_new_tp=function () {
        $log.info("create a new topic");
        $http({
            url: "app/forum.php",
            method: "POST",
            headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            data: {
                fn: "create_new_topic",
                uid: sessionStorage.getItem('uid'),
                tp_name: $scope.tp_name,
            }
        }).then(function (response) {
            $log.info(response.data);
            $scope.topics=true;
            $scope.create_topic_sh=false;
            load();
        })
    };
    $scope.qu_choosen=function (q_id) {
        console.log("clicked");
        //window.location="#/reply";
        sessionStorage.setItem('q_id',q_id);
        
    };
    $scope.create_qu_clicked=function () {
        $scope.show_quest=false;
        $scope.show_create_qu=true;
    };
    $scope.push_ques=function () {
        var date = new Date();
        let pub_d=""+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        $http({
            url: "app/forum.php",
            method: "POST",
            headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            data: {
                fn: "push_ques",
                uid: sessionStorage.getItem('uid'),
                t_id:sessionStorage.getItem('t_id'),
                quest:$scope.quest,
                pub_date: pub_d
            }
        }).then(function (response) {
            $log.info(response.data);
            if(response.data.status==1) {
                $scope.show_quest = true;
                $scope.show_create_qu = false;
                load_ques(sessionStorage.getItem('t_id'));
            }else alert("something went wrong");
        })
    }

});


usr.controller("replyCtrl",function ($scope,$http,$log) {
    $scope.showRep=true;
    console.log("success");
    var date = new Date();

    let pub_d=""+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    let q_id=sessionStorage.getItem('q_id');
    console.log(q_id);
    function load(){
    $http({
        url: "app/forum.php",
        method: "POST",
        headers:
            {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        data: {
            fn: "load_reply",
            qid: q_id
        }
    }).then(function (response) {
        $log.info(response.data);
        $scope.qu=response.data.quest;
        //$log.info($scope.qu);
        $scope.rep=response.data.reply;
    },function (reason) {
        $log.info(reason.error);
        alert("server error");
    })
    }
    load();
    $scope.put_answ=function () {
        $scope.showRep=false;
    };
    $scope.push_ans=function () {
      $http({
          url: "app/forum.php",
          method: "POST",
          headers:
              {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
          data: {
              fn: "push_ans",
              uid: sessionStorage.getItem('uid'),
              qid:q_id,
              reply:$scope.qu_ans,
              pub_date: pub_d
          }
      }).then(function (response) {
          $log.info(response.data);
          if(response.data.status==1)
          {
              $scope.qu_ans=null;
              alert("answer posted");
              $scope.showRep=true;
              load();
          }
          else
          {
              alert("something went wrong please try again later..");
              $scope.showRep=true;

          }

      },function (reason) {
          alert(reason.error);
      })
    }

});

usr.controller("compilerCtrl",function ($scope,$http) {
    $scope.names=["c","java"];
    $scope.ln="";
    document.getElementById('editor').style.fontSize='16px';
    ace.require("ace/ext/language_tools");
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/dracula");
    function config() {
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: false
        });
    }

    $scope.load=function() {
        console.log($scope.ln);

        if ($scope.ln === "c") {
            editor.session.setMode("ace/mode/c_cpp");
            console.log("cccc");
            config();
            editor.setValue("#include<stdio.h> \n void main() \n { \n \t printf() \n}");

        }

        else if ($scope.ln === "java") {
            editor.session.setMode("ace/mode/java");

            editor.setValue("class Test\n{ \n \tpublic static void main(String args[])\n \t{\n    } \n }");
           // console.log("javaaaa");
            config();
        }

    };
    $scope.code_run=function() {
        console.log("hi");
        $scope.pr = editor.getValue();
        if ($scope.pr == "" || $scope.ln==""){
            alert("editor is empty")
        }else {
                    $scope.output="loading please wait";
            $http({
                url: "app/compile.php",
                method: "POST",
                headers:
                    {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                data: {
                    prg:$scope.pr,
                    ln:$scope.ln
                }
            }).then(function (response) {
                console.log(response.data);
                $scope.output=response.data.output;

            })
        }

    }



});
//admin approval for events and articles
usr.controller("evarCtrl",function ($scope,$http) {
    $scope.list_of_evar=true;
    $scope.request=false;
    $scope.ar=null;
    $scope.x={};
        if($scope.ar==null)
            $scope.request=true;
    function load() {
        $http({
            url: "app/evar.php",
            method: "POST",
            headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            data: {
                    fn:"load"
            }
        }).then(function (response) {
            console.log(response.data.output);
            if(response.data.output==null)
                $scope.request=true;
            else
            {
                $scope.ev=response.data.output;
                $scope.request=false;
            }
        })
    }
    load();
    $scope.viewEA=function (id) {
        $scope.list_of_evar=false;
        $http({
            url: "app/evar.php",
            method: "POST",
            headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            data: {
                fn:"single",
                id:id
            }
        }).then(function (response) {
            $scope.x=response.data.output;
            //console.log(response.data);
            console.log($scope.x);
        },function (reason) {
            alert(reason.error);
        })
    };
    $scope.kind=function (type) {
        if(type==="event")
            return true;
        else
            return false;
    };
    $scope.acc=function (id) {
      $http({
          url: "app/evar.php",
          method: "POST",
          headers:
              {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
          data: {
              fn:"accept",
              id:id
          }
      }).then(function (response) {
          console.log(response.data);
          if(response.data.status==1)
          {
              alert("accepted");
              $scope.list_of_evar=true;
              load();
          }
          else
          {
              alert("something went wrong please try again later");
          }
      },function (reason) {
          alert(reason.error);
      })
    };
    $scope.rej=function (id) {
        $http({
            url: "app/evar.php",
            method: "POST",
            headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            data: {
                fn:"reject",
                id:id
            }
        }).then(function (response) {
            if(response.data.status==1)
            {
                alert("deleted");
                $scope.list_of_evar=true;
                load();
            }
            else
                alert("somthing went wrong");
        })
    }

});