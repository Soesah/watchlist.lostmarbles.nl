<?php 
  ini_set('display_errors', '0');
  header('Content-Encoding: utf-8');

  $apiKey = json_decode(file_get_contents('settings.json'), true)['apiKey'];

  $url = 'http://www.omdbapi.com/?'.$_SERVER['QUERY_STRING'].'&apiKey='.$apiKey;

  $data = json_decode(file_get_contents($url), true);

  echo json_encode($data, JSON_PRETTY_PRINT);

?>