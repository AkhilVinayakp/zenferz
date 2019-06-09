<?php
/**
 * Created by PhpStorm.
 * User:
 * Date: 2/5/2019
 * Time: 8:26 PM
 *
 * this file contains all functions for performing forum operations
 */
require "database.php";
$postdata=json_decode(file_get_contents("php://input"));
$data=array();
$output=array();
$status=0;
$database=new database();
if($postdata->fn=="load_topics")
{
    $database->query("select * from topics");
    if($result=$database->resultset()) {
        foreach ($result as $row) {
            $data[] = $row;
        }
        $status=1;
    }
    if(empty($database->resultset()))
        $status=1;
    $output=array(
        'output' =>$data,
        'status' =>$status
    );
    echo json_encode($output);
}
else if($postdata->fn=="create_new_topic")
{
    $database->query("insert into topics values (NULL,:t_name,:uid)");
    $database->bind(":t_name",$postdata->tp_name);
    $database->bind(":uid",$postdata->uid);
    if($database->execute())
        $status=1;
    else
        $status=0;
    $output=array(
        'output' =>$data,
        'status' =>$status
    );
    echo json_encode($output);
}
else if($postdata->fn=="load_quest")
{
    $reply_count=0;
    $database->query("select * from questions where t_id=:t_id");
    $database->bind(":t_id",$postdata->t_id);
    if($result=$database->resultset()) {
        foreach ($result as $row) {
            $data[] = $row;
        }
        $status=1;
    }
    else if(empty($database->resultset()))
    {
        $status=1;
    }
    $output=array(
        'output' =>$data,
        'status' =>$status,
        'reply_num' =>$reply_count
    );
    echo json_encode($output);
}
else if($postdata->fn=="load_reply")
{
    $qu=null;
    $database->query(" select usr_info.uname, usr_info.email , questions.quest ,questions.date from usr_info inner join questions on usr_info.uid=questions.who where q_id=:qid");
    $database->bind(":qid",$postdata->qid);
    if($result=$database->resultset()){
        $qu=$result[0];
        $database->query(" select usr_info.uname, usr_info.email, answers.reply, answers.r_date from usr_info inner join answers on usr_info.uid=answers.who where answers.q_id=:qid order by answers.r_id desc");
        $database->bind(":qid",$postdata->qid);
        if($result=$database->resultset())
        {
            foreach ($result as $row) {
                $data[] = $row;
            }
            $status=1;
        }

    }
    else
        $status=0;
    $output=array(
      'reply' => $data,
      'quest' => $qu,
      'status' =>$status
    );
    echo json_encode($output);

}
else if($postdata->fn=="push_ans")
{
    $database->query("insert into answers values (null,:qid,:reply,:uid,:r_date)");
    $database->bind(":qid",$postdata->qid);
    $database->bind(":reply",$postdata->reply);
    $database->bind(":uid",$postdata->uid);
    $database->bind(":r_date",$postdata->pub_date);
    if($database->execute())
        $status=1;
    else
        $status=0;
    $output=array(
        'status' => $status
    );
    echo json_encode($output);
}
else if($postdata->fn=="push_ques")
{
    $database->query("insert into questions values (null ,:quest,:q_date,:who,:t_id)");
    $database->bind(":quest",$postdata->quest);
    $database->bind(":q_date",$postdata->pub_date);
    $database->bind(":who",$postdata->uid);
    $database->bind(":t_id",$postdata->t_id);
    if($database->execute())
        $status=1;
    else
        $status=0;
    $output=array('status' => $status);
    echo json_encode($output);
}


