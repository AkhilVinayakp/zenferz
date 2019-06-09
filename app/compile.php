<?php
/**
 * Created by PhpStorm.
 * User:
 * * Date: 2/9/2019
 * Time: 12:50 PM
 */
$postdata=json_decode(file_get_contents("php://input"));
$data=array();
$status=0;
if($postdata->ln=="c")
{
    $fp1=fopen('cpr.c','w') or die('failed to create');
    fwrite($fp1,$postdata->prg);
    fclose($fp1);
    $ex=exec('gcc -o cpr.exe cpr.c 2>&1',$data) ;
    if(count($data)==0)
    {
        $ex=exec('cpr',$data);

    }
}
else if($postdata->ln=='c++')
{
    $fp1=fopen('cpppr.cpp','w') or die('failed to create');
    fwrite($fp1,$postdata->prg);
    fclose($fp1);
    $ex=exec('gcc -o cpr.exe cpppr.cpp 2>&1',$data) ;
    if(count($data)==0)
    {
        $ex=exec('cpr',$data);
    }
}
else if($postdata->ln=="java")
{
    $fp1=fopen('Test.java','w') or die('failed to create');
    fwrite($fp1,$postdata->prg);
    fclose($fp1);
    $ex=exec('javac Test.java 2>&1',$data) ;
    if(count($data)==0)
    {
        $ex=exec('java Test',$data);
    }
}

$output=array('output' => $data);
echo json_encode($output);