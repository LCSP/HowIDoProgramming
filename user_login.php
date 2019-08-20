<?php 

//the most basic login process in existence... But hey it actually works very well

$username = $_POST['username'] ?? '';
$pass = $_POST['pass'] ?? '';
$captcha = $_POST['g-recaptcha-response'];
$uid = uniqid('usr',true);
$uid = md5($uid);

$isOk = checkCaptcha($captcha);
if ($isOk == "1") {
	$result = checkUser($username, $pass, "1", "");
	if ($result == "yes") {
		$result = checkUser($username, $pass, "2", "");
		if ($result == $pass) {
			$result = checkUser($username, $pass, "3", $uid);
				if ($result == "login") {
					header('Location: suc_login.php?uid=' . $uid);
				}else{
					header('Location: login.php?msg=Error%20In%20Database%20Try%20Again%20In%20A%20Couple%20Minutes');
				}
		}else{
			//echo $result;
			header('Location: login.php?msg=User%20Or%20Pass%20Incorrect');
		}
	}else{
		header('Location: login.php?msg=User%20Or%20Pass%20Incorrect');
	}
}else{
	header('Location: login.php?msg=Error%20Captcha%20Try%20again');
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


function checkUser($username, $pass, $mode, $uid){
	if ($mode == "1") {
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
	if ($mode == "2") {
	$url = "https://tiktokapi.ga/php/user_control.php"; //TODO
	$ch = curl_init();

	$data = array(
		'mode' => '3',
		'username' => $username);

	$fields_string = http_build_query($data);

	curl_setopt($ch,CURLOPT_URL, $url);
	curl_setopt($ch,CURLOPT_POST, count($data));
	curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);


	curl_setopt($ch,CURLOPT_RETURNTRANSFER, true); 


	$result = curl_exec($ch);

	return $result;
	}
	if ($mode == "3") {
	$url = "https://tiktokapi.ga/php/user_control.php"; //TODO
	$ch = curl_init();

	$data = array(
		'mode' => '4',
		'username' => $username,
		'uid' => $uid);

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