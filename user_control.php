<?php  
//db connections and querys
$servername = "localhost";
$usernamedb = "";
$password = "";
$database = "omjtahcr_tiktokapi";

$mode = $_POST['mode'];

$username = $_POST['username'] ?? '';
$pass = $_POST['pass'] ?? '';
$email = $_POST['email'] ?? '';
$uid = $_POST['uid'] ?? '';
$userid = $_POST['userid'] ?? '';

//mode 1 = add user
//mode 2 = user exist?
//mode 3 = pass check
//mode 4 = login user
//mode 5 = get user name
//mode 6 = get user follows

if ($mode == "1") {

	$conn = mysqli_connect($servername, $usernamedb, $password, $database);
	
	$username = mysqli_real_escape_string($conn,$username);
	$pass = mysqli_real_escape_string($conn,$pass);
	$email = mysqli_real_escape_string($conn,$email);

	if (!$conn) {
    	die("errordb");
	}

	$sql = "INSERT INTO users (username, pass, email) VALUES ('$username', '$pass', '$email')";
	
	if (mysqli_query($conn, $sql)) {
    	echo "created";
	} else {
    	echo "error";
	}

	mysqli_close($conn);

}

if ($mode == "2") {
	$conn = mysqli_connect($servername, $usernamedb, $password, $database);
	
	$username = mysqli_real_escape_string($conn,$username);

	if (!$conn) {
    	die("errordb");
	}

	$sql = "SELECT * FROM users WHERE username = '$username'";
	$result = mysqli_query($conn,$sql);
	$matchFound = mysqli_num_rows($result) > 0 ? 'yes' : 'no';
	echo $matchFound;

	mysqli_close($conn);
}

if ($mode == "3") {
	$conn = mysqli_connect($servername, $usernamedb, $password, $database);
	
	$username = mysqli_real_escape_string($conn,$username);

	if (!$conn) {
    	die("errordb");
	}

	$sql = "SELECT pass FROM users WHERE username = '$username'";
	$result = mysqli_query($conn,$sql);
	if ($result) {
      while($row = mysqli_fetch_array($result)) {
        echo $row[0];
      }

    }
    else {
      echo "error";
    }

	mysqli_close($conn);
}

if ($mode == "4") {

	$conn = mysqli_connect($servername, $usernamedb, $password, $database);
	
	$username = mysqli_real_escape_string($conn,$username);
	$uid = mysqli_real_escape_string($conn,$uid);

	if (!$conn) {
    	die("errordb");
	}

	$sql = "UPDATE users SET galleta='$uid' WHERE username='$username'";
	
	if (mysqli_query($conn, $sql)) {
    	echo "login";
	} else {
    	echo "error";
	}

	mysqli_close($conn);

}

if ($mode == "5") {
	$conn = mysqli_connect($servername, $usernamedb, $password, $database);
	
	$uid = mysqli_real_escape_string($conn,$uid);

	if (!$conn) {
    	die("errordb");
	}

	$sql = "SELECT username FROM users WHERE galleta = '$uid'";
	$result = mysqli_query($conn,$sql);
	if ($result) {
      while($row = mysqli_fetch_array($result)) {
        echo $row[0];
      }

    }
    else {
      echo "not found";
    }

	mysqli_close($conn);
}

if ($mode == "6") {
	$conn = mysqli_connect($servername, $usernamedb, $password, $database);
	
	$uid= mysqli_real_escape_string($conn,$uid);

	if (!$conn) {
    	die("errordb");
	}

	$sql = "SELECT follow_users FROM users WHERE galleta = '$uid'";
	$result = mysqli_query($conn,$sql);
	if ($result) {
      while($row = mysqli_fetch_array($result)) {
        echo $row[0];
      }

    }
    else {
      echo "error";
    }

	mysqli_close($conn);
}

if ($mode == "7") {

	$conn = mysqli_connect($servername, $usernamedb, $password, $database);
	
	$userid = $userid . "/";
	$userid = mysqli_real_escape_string($conn,$userid);
	$uid = mysqli_real_escape_string($conn,$uid);

	if (!$conn) {
    	die("errordb");
	}

	$sql = "SELECT follow_users FROM users WHERE follow_users LIKE '%$userid%' AND galleta LIKE '%$uid%'";//219309202052378624/
	$result = mysqli_query($conn,$sql);//46986db7f9398e96180c9fc4a0a0eeaa
	$matchFound = mysqli_num_rows($result) > 0 ? 'yes' : 'no';
	if ($matchFound != 'yes') {
		$sql = "UPDATE users SET follow_users = CONCAT(follow_users, '$userid') WHERE galleta = '$uid'";
		
		if (mysqli_query($conn, $sql)) {
	    	echo "added";
		} else {
	    	echo "error" . mysqli_error($conn);
		}//SELECT follow_users FROM users WHERE galleta='46986db7f9398e96180c9fc4a0a0eeaa' LIKE '219309202052378624/'

		mysqli_close($conn);

	}else{
		echo "already added";
		mysqli_close($conn);
	}
	

	
}



?>