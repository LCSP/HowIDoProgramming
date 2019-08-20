<?php  

$uId = $_GET["uid"];
$cursor = $_GET["cursor"];
$count = $_GET["count"] ?? '10';
$rnd = rand(1,999);

$urlTo = "https://api2.musical.ly/aweme/v1/aweme/post/?max_cursor=".$cursor."&user_id=".$uId."&count=".$count."&retry_type=no_retr&build_number=9.4.0&mcc_mnc=72207&fp=&pass-region=1&pass-route=1&device_id=6609494223781".$rnd."&aid=1128&app_name=musical_ly&version_code=940&version_name=9.4.0&device_platform=android&ab_version=9.4.0&ssmix=a&resolution=540*888&dpi=240&_rticket=1544579225162&as=a1iosdfgh&cp=androide1&app_language=en&language=en&sys_region=US";

//$urlTo = "https://t.tiktok.com/aweme/v1/aweme/post/?user_id=".$uId."&count=".$count."&max_cursor=".$cursor."&aid=1180&_signature=1";


//1128 yes private
//1180 no private
//1233 new

/*$rawD = get_data($urlTo);
$data =json_decode($rawD, false, 512, JSON_BIGINT_AS_STRING);
echo json_encode($data);*/
$user_ip = get_client_ip_server();

echo get_data($urlTo, $user_ip, "",$uId);

function get_data($url, $user_ip, $mode, $uid) {
    

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    
        if ($user_ip != "UNKNOWN") {
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("X-Forwarded-For: " . $user_ip));
    }
    
    //curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.2; en-GB; rv:1.8.1.7) Gecko/20070914 Firefox/2.0.0.7');
    curl_setopt($ch, CURLOPT_USERAGENT, 'com.zhiliaoapp.musically/2018111632 (Linux; U; Build/MPI24.65-39; Cronet/58.0.2991.0)');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $data = curl_exec($ch);

    if (curl_error($ch)) {
            $error_msg = curl_error($ch);
        }

    curl_close($ch);

    if (isset($error_msg)) {
        echo "error_curl";
    }


    //return $data;
    $room_id = getLive($uid, "1", $user_ip);
    $testDec = json_decode($data,true);
    array_push($testDec, $room_id);
    $testOK = json_encode($testDec);
    return $testOK;
    //return $room_id;
}

function getLive($user_id, $mode, $user_ip){
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, "https://tiktokapi.ga/php/islive.php?uid=". $user_id);//TODO
    
    //curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.2; en-GB; rv:1.8.1.7) Gecko/20070914 Firefox/2.0.0.7');
    curl_setopt($ch, CURLOPT_USERAGENT, 'com.zhiliaoapp.musically/2018111632 (Linux; U; Build/MPI24.65-39; Cronet/58.0.2991.0)');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $data = curl_exec($ch);

    if (curl_error($ch)) {
            $error_msg = curl_error($ch);
        }

    curl_close($ch);

    if (isset($error_msg)) {
        echo "error_curl";
    }


    return $data;
}

function get_client_ip_server() {
    $ipaddress = '';
    if (getenv('HTTP_CLIENT_IP'))
        $ipaddress = getenv('HTTP_CLIENT_IP');
    else if(getenv('HTTP_X_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
    else if(getenv('HTTP_X_FORWARDED'))
        $ipaddress = getenv('HTTP_X_FORWARDED');
    else if(getenv('HTTP_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_FORWARDED_FOR');
    else if(getenv('HTTP_FORWARDED'))
        $ipaddress = getenv('HTTP_FORWARDED');
    else if(getenv('REMOTE_ADDR'))
        $ipaddress = getenv('REMOTE_ADDR');
    else
        $ipaddress = 'UNKNOWN';
 
    return $ipaddress;
}
?>
