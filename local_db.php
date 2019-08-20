<?php

//just some db querys
//yeah this was a marketing tool that I made


$uid = $_POST['uid'] ?? '';
$userData = $_POST['data'] ?? '';
$tag = $_POST['tag'] ?? '';
$mode = $_POST['mode'] ?? '1';

$servername = "localhost";
$username = "";
$password = "";
$dbname = "test";

$sql = "";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Error (0)");
} 

if($mode == '1'){
    //$uid = "'".$uid."'";
    $uid = $conn->real_escape_string($uid);

    $sql = "SELECT tt_acc_region,tt_region,tt_at,tt_full_name,tt_followers,tt_following,tt_bio,tt_posts,tt_ins_id,tt_yt_id,tt_usr_id,tt_email from tt_profiles WHERE tt_usr_id='$uid'";

    $result = $conn->query($sql);
    //echo $result;
    if ($result->num_rows > 0) {
        $result = $conn->query($sql);
        echo json_encode($result->fetch_assoc());
    } else {
        echo "0";
    }
}

if($mode == '2'){
    
    $arrLeng = count($userData);

    for($x = 0; $x < $arrLeng; $x++){
        $userData[$x] = $conn->real_escape_string($userData[$x]);
    }

    $sql = "INSERT INTO tt_profiles (`tt_acc_region`,`tt_region`,`tt_at`,`tt_full_name`,`tt_followers`,`tt_following`,`tt_bio`,`tt_posts`,`tt_ins_id`,`tt_yt_id`,`tt_usr_id`,`tt_email`, `tag`) VALUES('$userData[0]','$userData[1]','$userData[2]','$userData[3]','$userData[4]','$userData[5]','$userData[6]','$userData[7]','$userData[8]','$userData[9]','$userData[10]','$userData[11]','$userData[12]')";

    if ($conn->query($sql) === TRUE) {
        echo "done";
    } else {
        echo "Error (2)";
        
    }
}

if($mode == '3'){
    //$uid = "'".$uid."'";
    //$uid = explode("'", $uid);
    $uid = $conn->real_escape_string($uid);

    $sql = "DELETE FROM tt_profiles WHERE `tt_usr_id` = '$uid'";

    if ($conn->query($sql) === TRUE) {
        echo "done";
    } else {
        echo "Error (3)";
    }
}

if($mode == '4'){
    $arrLeng = count($tag);

    for($x = 0; $x < $arrLeng; $x++){
        $tag[$x] = $conn->real_escape_string($tag[$x]);
        
        $sql = "SELECT tag from tt_tags WHERE tag='$tag[$x]'";

        $result = $conn->query($sql);
        if ($result->num_rows > 0) {

        } else {
            $sql = "INSERT INTO tt_tags (tag) VALUES ('$tag[$x]')";
            $conn->query($sql);
        }
    }

    
}


$conn->close();
?>