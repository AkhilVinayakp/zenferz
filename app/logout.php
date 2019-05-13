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
