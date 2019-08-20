<?php  
//captcha stuff
$cInfo = $_POST['cp'] ?? '';

$urlcap = "https://www.google.com/recaptcha/api/siteverify";
$data = array(
	'secret' => '',
	'response' => $cInfo);


$fields_string = http_build_query($data);

if ($cInfo != '') {
	$ch = curl_init();

//set the url, number of POST vars, POST data
	curl_setopt($ch,CURLOPT_URL, $urlcap);
	curl_setopt($ch,CURLOPT_POST, count($data));
	curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);

//So that curl_exec returns the contents of the cURL; rather than echoing it
	curl_setopt($ch,CURLOPT_RETURNTRANSFER, true); 

//execute post
	$result = curl_exec($ch);

	$json = json_decode($result);
	echo $json->success;
}

?>