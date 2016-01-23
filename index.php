<?php

/*
// Redirect to https if we are not on localhost
if(strcmp($_SERVER['HTTP_HOST'],"localhost") != 0 && (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] == "")){
    $redirect = "https://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: $redirect");
    exit();
}
*/

require('utils.php');

$relativePath = substr($_SERVER['REQUEST_URI'],strlen($relativeRootUrl));
$parts = explode('/', $relativePath );

$fileDB = "/home/oviles/www-bb8";

header("Access-Control-Allow-Origin: *");

if ($parts[1]=='api') {
  
  $file = $fileDB . DIRECTORY_SEPARATOR . "bb8.json";
 
  if ($parts[2]=='send') {
    $entityBody = file_get_contents('php://input');
    $jsonBody = json_decode($entityBody,true);
    $jsonCleaned = array(
      "created" => $jsonBody["created"],
      "msg" => $jsonBody["msg"]
    );
    file_put_contents($file, json_encode($jsonCleaned,JSON_PRETTY_PRINT));
  } else if ($parts[2]=='get') {
    if(!file_exists($file))
    {
      return404();
      exit();
    } else {
      header("Content-Type: application/json; charset=UTF-8");  
      $string = file_get_contents($file);
      $json=json_decode($string,true);
      echo json_encode($json);
    }
  } else {
    return404();
    exit();
  }
  
  
  
}

?>