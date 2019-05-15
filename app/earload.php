<?php
/**
 * Created by PhpStorm.
 * User:
 * Date: 1/11/2019
 * Time: 12:35 AM
 */
require "database.php";
$postdata=json_decode(file_get_contents("php://input"));
$data=array();
$like=array();
$liked=null;
$database=new database();
if($postdata->fn=="normal") {


    $database->query('select * from event where status=0 order by EARId desc ');
    $result = $database->resultset();
    foreach ($result as $row) {
        $data[] = $row;
    }
//finding the liked ear id
    $database->query('select liked from user where uid=:uid');
    $database->bind(':uid', $postdata->uid);
    $liked = $database->resultset();
    if ($liked) {
        $uid = $liked[0]->liked;
        $n = strlen($uid);
        $i = 0;
        while ($i < $n) {
            $like[] = (int)substr($uid, $i, 3);
            $i = $i + 4;
        }
    } else
        $like = 0;
}


$output=array(
    'output' => $data,
    'liked'  =>$like
);

 echo json_encode($output);

