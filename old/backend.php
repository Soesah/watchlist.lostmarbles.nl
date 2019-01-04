<?php 
  ini_set('display_errors', '0');
  header('Content-Encoding: utf-8');

  $data = json_decode(file_get_contents('php://input'), true);

  $saved = file_put_contents('data/list.json', json_encode($data, JSON_PRETTY_PRINT));

  if ($saved) {
    echo json_encode($data, JSON_PRETTY_PRINT);
  } else {
    header('HTTP/1.1 400');
    echo 'An error occured, data could not be saved.';
  }

?>