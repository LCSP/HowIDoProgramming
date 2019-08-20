<?php  
//the most basic user registration process... It was working tho :)

$username = $_POST['username'];
$pass = $_POST['pass'];
$email = $_POST['email'] ?? '';
$captcha = $_POST['g-recaptcha-response'];



//echo $username . "</br>" . $pass . "</br>" . $email . "</br>" . $captcha;

$isOk = checkCaptcha($captcha);

if ($isOk == "1") {
	$result = addUser($username, $pass, $email, "2");
	if ($result == "no") {
		$state = addUser($username, $pass, $email, "1");
		if ($state == "created") {
			header('Location: suc_reg.php?username=' . $username);
		}else{
			header('Location: reg.php?msg=Error%20In%20Database%20Try%20Again%20In%20A%20Couple%20Minutes');
		}
	}else{
		if ($result == "yes") {
			header('Location: reg.php?msg=User%20already%20in%20use');
		}
	}
	
}else{
	header('Location: reg.php?msg=Error%20Captcha%20Try%20again');
}



function checkCaptcha($cp){
	if ($cp != "") {
	$url = "https://tiktokapi.ga/php/robot.php"; //TODO
	$ch = curl_init();

	$data = array('cp' => $cp);
	$fields_string = http_build_query($data);

	curl_setopt($ch,CURLOPT_URL, $url);
	curl_setopt($ch,CURLOPT_POST, count($data));
	curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);


	curl_setopt($ch,CURLOPT_RETURNTRANSFER, true); 


	$result = curl_exec($ch);

	return $result;
	}else{
		return "null";
	}

}

function addUser($username, $pass, $email, $mode){
	if ($mode == "1") {
		$url = "https://tiktokapi.ga/php/user_control.php"; //TODO
	$ch = curl_init();

	$data = array(
		'mode' => '1',
		'username' => $username,
		'pass' => $pass,
		'email' => $email);

	$fields_string = http_build_query($data);

	curl_setopt($ch,CURLOPT_URL, $url);
	curl_setopt($ch,CURLOPT_POST, count($data));
	curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);


	curl_setopt($ch,CURLOPT_RETURNTRANSFER, true); 


	$result = curl_exec($ch);

	return $result;
	}

	if ($mode == "2") {
	$url = "https://tiktokapi.ga/php/user_control.php"; //TODO
	$ch = curl_init();

	$data = array(
		'mode' => '2',
		'username' => $username);

	$fields_string = http_build_query($data);

	curl_setopt($ch,CURLOPT_URL, $url);
	curl_setopt($ch,CURLOPT_POST, count($data));
	curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);


	curl_setopt($ch,CURLOPT_RETURNTRANSFER, true); 


	$result = curl_exec($ch);

	return $result;
	}

}


?>

