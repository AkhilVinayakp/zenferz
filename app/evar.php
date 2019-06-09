<?php
/**
 * Created by PhpStorm.
 * User: NANDHU
 * Date: 3/17/2019
 * Time: 10:22 AM
 */

require "database.php";
$postdata=json_decode(file_get_contents("php://input"));
$data=array();
$status=0;
$output=array();
$database=new database();
if($postdata->fn=="load") {
    $database->query('select event.EARid,event.name,event.pub_date,usr_info.uname from event inner join usr_info on event.by_whom=usr_info.uid where event.status=1');
    if($result = $database->resultset()) {
        $status=1;
        foreach ($result as $row) {
            $data[] = $row;
        }
    }


}
else if($postdata->fn=="single")
{
    $database->query('select * from event where EARid=:id');
    $database->bind(":id",$postdata->id);
    if($result = $database->resultset()) {
        $status=1;
        $data=$result[0];
    }

}
else if($postdata->fn=="accept")
{
    $database->query("update event set status=0 where EARid=:id");
    $database->bind(":id",$postdata->id);
    if($database->execute())
        $status=1;
    else
        $status=0;
}
else if($postdata->fn=="reject")
{
    $database->query("delete from event where EARid=:id");
    $database->bind(":id",$postdata->id);
    if($database->execute())
        $status=1;
    else
        $status=0;
}

$output=array(
    'output' => $data,
    'status'  =>$status
);
echo json_encode($output);