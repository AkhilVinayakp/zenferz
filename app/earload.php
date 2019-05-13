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
