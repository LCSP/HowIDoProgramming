<?php


$file = $_GET['file'];
$name = $_GET['name'];


$GLOBALS['responseHeaders'] = [];
echo getUrlWater($file,$name);
//echo $responseHeaders[4];
//$urlVideoUri = substr($responseHeaders[4], 9);
//echo $urlVideoUri;
//downloadVideo($urlVideoUri, $name);


function getUrlWater($url) {
    /*set_time_limit(0);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    //curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.0.3705; .NET CLR 1.1.4322)');
    curl_setopt($ch, CURLOPT_HEADERFUNCTION, "HandleHeaderLine");
    $r = curl_exec($ch);
    curl_close($ch);
    return $r;*/

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($ch);
    if (curl_errno($ch)) {
        echo 'Error:' . curl_error($ch);
    }
    
    return $result;
    curl_close ($ch);

   
    
}

function downloadVideo($url, $name){
    set_time_limit(0);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.0.3705; .NET CLR 1.1.4322)');
    $r = curl_exec($ch);
    curl_close($ch);

   


   header('Expires: 0'); // no cache
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Last-Modified: ' . gmdate('D, d M Y H:i:s', time()) . ' GMT');
    header('Cache-Control: private', false);
    header('Content-Type: application/force-download');
    header('Content-Disposition: attachment; filename=' . $name . '.mp4');
    header('Content-Transfer-Encoding: binary');
    header('Content-Length: ' . strlen($r)); // provide file size
    header('Connection: close');
    echo $r;
}

function HandleHeaderLine( $curl, $header_line ) {
    array_push($GLOBALS['responseHeaders'], $header_line); // or do whatever
    return strlen($header_line);
}



  ?>