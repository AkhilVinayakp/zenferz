<?php
/**
 * Created by PhpStorm.
 * User: NANDHU
 * Date: 2/3/2019
 * Time: 1:30 PM

    this file is used to upload the file into the server the updelin.php is actualy used to create the entry in the database
 */



/* Getting file name */
$filename = $_FILES['file']['name'];

/* Location */
$location = '../uploads/';

// Upload file
if(move_uploaded_file($_FILES['file']['tmp_name'],$location.$filename))
   $status=1;
else
    $status=0;

$arr = array('name'=>$filename,'status'=>$status);
echo json_encode($arr);



