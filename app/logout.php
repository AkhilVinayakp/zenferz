<?php
/**
 * Created by PhpStorm.
 * User:
 * Date: 1/2/2019
 * Time: 10:16 PM
 */
$error="";
$status="";
$ser="localhost";
$ur="root";
$db="project";
$ps="";
$input=$_POST['lastseen'];
$id=$_POST['id'];
//creating the connection
$conn=new mysqli($ser,$ur,$ps,$db);
if($conn->connect_error)
{
    $error="connection error";
}
else {
    $status = "successfully connected";
    $sql="update user set last_seen=? where uid=?";

    if(!$stmt=$conn->prepare($sql))
    {
        $error="preparation of sql statement failed";
    }
    else {
        $stmt->bind_param("si", $input, $id);
        if ($stmt->execute()) {
            $result = $stmt->affected_rows;
                if($result==0)
                    $error="No rows affected";
                else if($result==null)
                    $error="invalid value id passed";
                else if($result==-1)
                    $error="error in execution";
                else
                    $status.="  execute complete";

            }
            else{ $error="execute failed"; }
        $stmt->close();
        }

}
$conn->close();
$output=array(
    "error"=>$error,
    "status"=>$status
);
$ob=json_encode($output);
echo $ob;


