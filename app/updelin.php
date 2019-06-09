<?php
/*
 *  this file is used for create update article and create event

 */
require "database.php";
$postdata=json_decode(file_get_contents("php://input"));
$data=array();
$status=0;
$database=new database();
function maxEAR()
{
    $database=new database();
    $database->query("select MAX(EARid) as ear from event");
    $e=$database->resultset();
    return ++$e[0]->ear;
}

if($postdata->fn=="myarticles"){
    if($postdata->subfn=="create"){
            $newEAR=maxEAR();
        $database->query("insert into event (EARid,name,type,pub_date,by_whom,content,intro,url,status) values (:earid,:name,:type,:pub_date,:by_whom,:content,:intro,:url,:st)");
        $database->bind(":earid",$newEAR);
        $database->bind(":name",$postdata->a_name);
        $database->bind(":type","article");
        $database->bind(":pub_date",$postdata->pub_date);
        $database->bind(":by_whom",$postdata->uid);
        $database->bind(":content",$postdata->a_content);
        $database->bind(":intro",$postdata->a_intro);
        $database->bind(":st",1);
        $database->bind(":url","uploads/purty_wood.png");
        if($database->execute())
        {
            $status=1;
        }
        else
            $status=0;

    }
    /* end of create article*/
    else if($postdata->subfn=="update")
    {
        $database->query("update event set name=:name, pub_date=:pub_date, intro=:intro, content=:content, status=:st where EARid=:earid");
        $database->bind(":name",$postdata->a_name);
        $database->bind(":pub_date",$postdata->pub_date);
        $database->bind(":intro",$postdata->a_intro);
        $database->bind(":content",$postdata->a_content);
        $database->bind(":earid",$postdata->earid);
        $database->bind(":st",1);
        if($database->execute())
            $status=1;
        else
            $status=0;

    }
    else if($postdata->subfn=="delete"){
        $database->query("delete from event where EARid=:earid");
        $database->bind(":earid",$postdata->earid);
        if($database->execute())
            $status=1;
        else
            $status=0;
    }


}
else if($postdata->fn=="events")
{
    if($postdata->subfn=="create")
    {
        $newEAR=maxEAR();
        $database->query("insert into event(EARid, name, type,pub_date,by_whom,venue,fn_date,content,intro,url) values(:earid, :ename, :etype, :pub_date, :by_whom, :venue, :fn_date, :content, :intro, :url)");
        $database->bind(":earid",$newEAR);
        $database->bind(":ename",$postdata->name);
        $database->bind(":etype","event");
        $database->bind(":pub_date",$postdata->pub_date);
        $database->bind(":by_whom",$postdata->by_whom);
        $database->bind(":venue",$postdata->venue);
        $database->bind(":fn_date",$postdata->fn_date);
        $database->bind(":content",$postdata->content);
        $database->bind(":intro",$postdata->intro);
        $database->bind(":url",$postdata->path);
        if($database->execute())
            $status=1;
        else
            $status=0;

    }
}


$output=array(
    'status'  =>$status
);
echo json_encode($output);