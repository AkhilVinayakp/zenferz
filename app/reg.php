<?php

require "database.php";
$database=new database();
$data=array();
$status=0;
//maxid() req :done
function maxid()
{
    $database=new database();
    $database->query("select MAX(uid) as uidm from usr_info");
    $e=$database->resultset();
    return ++$e[0]->uidm;
}
/* connection req:done*/
$postdata=json_decode(file_get_contents("php://input"));
if(empty($postdata->address))
    $postdata->address=null;
$database->query("insert into usr_info values (:uname,:uid,:u_type,:status,:email,:insid,:reg_id,:password,:address)");
$database->bind(":uid",maxid());
$database->bind(":uname",$postdata->uname);
$database->bind(":u_type",$postdata->u_type);
$database->bind(":status",0);
$database->bind(":email",$postdata->email);
$database->bind(":reg_id",$postdata->reg);
$database->bind(":insid",$postdata->i_id);
$database->bind(":password",$postdata->password);
$database->bind(":address",$postdata->address);
try
{
    if($database->execute())
    {
        $status=1;
    }
}
catch (PDOException $e)
{
    $status=0;
}
output=array("status" =>$status);
echo json_encode($output);
//final
?>
