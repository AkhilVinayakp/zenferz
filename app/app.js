var reg=angular.module("Reg",["ngRoute"]);
reg.config(function($routeProvider){
    $routeProvider
        .when("/student",{
            templateUrl:"partials/student.html",
            controller:"frmCtrl"
        })
        .when("/college",{
            templateUrl:"partials/college.html",
            controller:"frmCtrl"
        })
        .when("/organization",{
            templateUrl:"partials/organization.html",
            controller:"frmCtrl"
        })
        .when("/",
        {
            templateUrl:"partials/student.html"
        });
});
reg.controller("frmCtrl",function($scope,$http)
{
        console.log("registration");
    $scope.err_pass=function()
    {
        if($scope.password !== $scope.cnf_password)
            return true;
    };
    $scope.frmSub=function() {
        if ($scope.password !== $scope.cnf_password)
            alert("password mismatch");
        else {
            var name = $scope.my_name;
            var email = $scope.email;
            var address = $scope.address;
            var reg = $scope.reg_no;
            var i_id = $scope.i_id;
            var password = $scope.password;
            var type = $scope.type;
            $http({
                url: "app/reg.php",
                method: "POST",
                headers:
                    {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                data:{
                    uname:name,
                    email:email,
                    address:address,
                    reg:reg,
                    i_id:i_id,
                    password:password,
                    u_type:type
                }
            }).then(function (response) {
                console.log(response.data.status);
                if (response.data.status === 0) {
                    alert("something went wrong check your Network \n Ensure that Entered email is not already registered");
                    console.log(response.data);
                }
                else {
                    alert("successfully Registered account will be activated with in 24 hours ");
                    window.location = "zenferz.html";
                    console.log(response.data);

                }
            });
        }


    }
});
