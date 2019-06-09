<?php
//print_r($_POST);
$password=$_POST['password'];
$email=$_POST['email'];
$error="";
$status="";
$ser="localhost";
$ur="root";
$db="project";
$ps="";
$data=array();

//creating the connection
$conn=new mysqli($ser,$ur,$ps,$db);

if($conn->connect_error)
{
    $error="establishing connection failed due to some server error";
}
else {
    $status = "successfully connected";
    $sql="select uid,uname,u_type from usr_info where email=? and password=? and status=1";
    $stmt=$conn->prepare($sql);
    if(!$stmt)
    {
        $error="preparation of sql statement failed";
    }
    else
    {
        $stmt->bind_param("ss",$email,$password);
        $stmt->execute();
        $result=$stmt->get_result();
         if($result->num_rows >0)
         {

             while ($row=$result->fetch_assoc())
             {
                 $data[]=$row;
             }
         }
         else
             $error="fetcing data failed";


    }
    $stmt->close();
}
$conn->close();
$output=array(
    "output"=>$data,
    "error"=>$error,
    "status"=>$status
);
$ob=json_encode($output);
echo $ob;
