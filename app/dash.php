<?php
//print_r($_POST);
//$password=$_POST['password'];
//$email=$_POST['email'];
require "database.php";
$postdata=json_decode(file_get_contents("php://input"));
$data=array();
$status=0;
$output=array();
$database=new database();
if($postdata->fn=="load")
{
    $database->query("select * from usr_info where status=0");
    if($result=$database->resultset())
    {
        foreach ($result as $row) {
            $data[] = $row;
        }
        $status=1;
    }
    else if(empty($result))
        $status=1;
    $output=array( 'output' =>$data, 'status' =>$status);

}
else if($postdata->fn=="accept")
{
    $database->query("update usr_info set status=1 where email=:email");
    $database->bind(":email",$postdata->email);
    if($database->execute()) {

        $database->query("insert into user (uid) values (:uid)");
        $database->bind(":uid",$postdata->uid);
        if($database->execute())
            $status = 1;
    }
    else
        $status=0;
    $output=array('status' =>$status);
}
else if($postdata->fn=="refuce"){
    $database->query("delete from usr_info where email=:em");
    $database->bind(":em",$postdata->email);
    if($database->execute())
        $status=1;
    else
        $status=0;
    $output=array('status' =>$status);
}
else if($postdata->fn=="read")
{
    $database->query("select usr_info.uname,usr_info.u_type,usr_info.email,usr_info.reg_id,user.last_seen from usr_info inner join user on usr_info.uid=user.uid where usr_info.status=1");
    if($result=$database->resultset())
    {
        $status=1;
        foreach ($result as $row) {
            $data[] = $row;
        }
    }
    else if(empty($result))
        $status=1;
    else
        $status=0;
    $output=array( 'output' =>$data, 'status' =>$status);
}
echo json_encode($output);