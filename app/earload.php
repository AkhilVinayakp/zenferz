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
//updating the like operations
else if($postdata->fn=="like")
{
    $database->query("select rating from event where EARid=:id");
    $database->bind(":id",$postdata->input);
    $out=$database->resultset();
    $likes=$out[0]->rating;

        $likes = $likes + 1;
        $database->query("update event set rating =:l where EARid=:id");
        $database->bind(":l",$likes);
        $database->bind(":id",$postdata->input);
        if($database->execute()) {
            $database->query("select liked from user where uid=:id");
            $database->bind(":id", $postdata->input1);
            $out = $database->resultset();
            $row = $out[0]->liked;
            $row = $row . "" . $postdata->input . "" . "-";
            $database->query("update user set liked=:l where uid=:id");
            $database->bind(":l", $row);
            $database->bind(":id", $postdata->input1);
            if($database->execute())
                $data="ok";
            else
                $data="failed inner";
        }
        else
            $data="failed outer";

}
else if ($postdata->fn=="single")
{
    if($postdata->subfn=="load") {
        $database->query("select * from event where EARid=:id");
        $database->bind(":id", $postdata->earid);
        $result = $database->resultset();
        $data = $result[0];
    }
    if($postdata->subfn=="loadlk")
    {
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
            $like = null;
    }



}


$output=array(
    'output' => $data,
    'liked'  =>$like
);

 echo json_encode($output);

