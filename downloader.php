<?php  
$url = $_GET['file'];
$filename = $_GET['name'];

$url = urldecode($url);

header('Content-Disposition: attachment; filename=' . $filename . '.mp4'); //$arr[1]
header('Content-Type: application/force-download');
header('Content-Type: application/octet-stream');
header('Content-Type: application/download');
header('Content-Description: File Transfer');
ob_flush();
flush();

$opts = array(
       'http' => array('method' => 'GET',
                       'max_redirects' => '20',
                       'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'));

$context = stream_context_create($opts);

$fp = fopen($url, 'r', false, $context);//$url variable with file url
while (!feof($fp)) {
    echo fread($fp, 65536);
    ob_flush();
    flush();
}
fclose($fp);



?>