//somehow this was actually working

var counter = 0;
var counterAc = 0;

$(document).ready(function () {
  var html1 =
    '<div class="col-lg-4 col-sm-6 portfolio-item"><div class="card h-100"><img  id="video_uri" name="';
  var html2 = '" info="';
  var html3 = '" vn="';
  var html4 = '" infoWater="';
  var html5 = '" infouid="';
  var html6 = '" infomid="';
  var html7 = '" piccomp="';
  var html8 = '"class="card-img-top" src="';
  var html9 =
    '" onerror="imageComp(this);"/><div class="card-body"><p class="card-text">';
  var html10 = "</p></div></div></div>";
  var sep = "</br>";

  var videoUris = "";
  var videoIds = "";

  var user_id = $("#info_userId").text();

  var iid = Cookies.get("iid");
  if (iid != undefined) {
    $.post("php/user_control.php", { mode: "5", uid: iid }, function (data) {
      //console.log(data);
      if (data != "not found") {
        $("#iid").html(
          '<a class="nav-link" href="user/panel.php">' + data + "</a>"
        );
        $("#btn_follow").css("display", "block");
        $(document).on("click", "#btn_follow", function () {
          console.log("lmao");
          $.post(
            "php/user_control.php",
            { mode: "7", uid: iid, userid: user_id },
            function (data) {
              if (data != "") {
                if (data == "added") {
                  $("#btn_follow").css("display", "none");
                  alert("Added to your dashboard.");
                }
                if (data == "already added") {
                  $("#btn_follow").css("display", "none");
                  alert("You are already following this user.");
                }
              } else {
                alert("Something went wrong, Try Again...");
              }
            }
          );
        });
      } else {
        $("#iid").html('<a class="nav-link" href="user/login.php">Login</a>');
      }
    });
  } else {
    $("#iid").html('<a class="nav-link" href="user/login.php">Login</a>');
  }

  var max_offset = 0;
  var max_offset2 = 0;
  var postCount = $("#info_postCount").text();
  var count = 0;
  var count2 = 0;
  var has_more = 0;
  var has_more2 = 0;

  var user_id = user_id.replace(/ /g, "");
  var infoSet = false;
  var room_id = "";

  $("#tab_likes").trigger("click");
  $("#tab_videos").trigger("click");

  $("#tab_videos").on("click", function () {
    $("#likes").css("visibility", "hidden");
    $("#videos").css("visibility", "visible");
  });

  $("#tab_likes").on("click", function () {
    $("#videos").css("visibility", "hidden");
    $("#likes").css("visibility", "visible");
  });

  $(document).on("click", "#btn_goStream", function () {
    //console.log(room_id);
    var win = window.open("live/live.php?room_id=" + room_id, "_blank");
    win.focus();
  });

  document.onkeydown = function (evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
    }
  };

  $(document).on("click", "#btn_more", function () {
    if ((has_more = 1)) {
      getJsonOC();
    } else {
      alert("Dude, calm down... There is no more videos.");
      $("#btn_more").css("display", "none");
    }
  });

  $(document).on("click", "#btn_saveLinks", function () {
    var completeUris = videoUris + videoIds;
    //var dataSend = {videoUrl: videoUris, videoId: videoIds, uid: user_id};

    var html = "php/savevuriLogs.php";
    /*$.post(html, dataSend, function(data){
		console.log(data);
				var blob = new Blob([completeUris], {type: "text/plain;charset=utf-8"});
            	saveAs(blob, "uris_" + user_id + ".txt");
	});*/

    var fd = new FormData();
    fd.append("videoUrl", videoUris);
    fd.append("videoId", videoIds);
    fd.append("uid", user_id);

    navigator.sendBeacon(html, fd);

    var blob = new Blob([completeUris], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "uris_" + user_id + ".txt");
  });

  $(window).on("unload", function () {
    var completeUris = videoUris + videoIds;
    //var dataSend = {videoUrl: videoUris, videoId: videoIds, uid: user_id};

    var html = "php/savevuriLogs.php";
    /*console.log(dataSend);
	console.log(html);
	$.post(html, dataSend, function(data){
		console.log("done");
	});*/

    var fd = new FormData();
    fd.append("videoUrl", videoUris);
    fd.append("videoId", videoIds);
    fd.append("uid", user_id);

    navigator.sendBeacon(html, fd);
  });

  $(document).on("click", "#video_uri", function () {
    var videoUri = $(this).attr("name");
    var video2Down = $(this).attr("info");
    var video2DownWater = $(this).attr("infoWater");
    var videoUid = $(this).attr("infouid");
    var videoMID = $(this).attr("infomid");

    //console.log(addressValue);

    counterAc = parseInt($(this).attr("vn"));

    $("#body_content").css("filter", "blur(5px)");
    $("#player_buttons").css("visibility", "visible");
    $("#btn_downRaw").attr("onclick", 'location.href="' + video2Down + '";');
    $("#btn_downWhater").attr(
      "onclick",
      'location.href="' + video2DownWater + '";'
    );
    if (videoMID != "") {
      $("#btn_goMusic").attr("href", "user_music.php?mid=" + videoMID);
    }

    /*if (video2DownWater != "") {
		$("#btn_downWhater").attr('onclick', "location.href=\"" + video2DownWater + "\";");
	}else{
		$("#btn_downWhater").attr('onclick', "alert('Video with watermark not available')");
	}*/
    $("#video_player_tag").attr("src", videoUri);
    $("#video_player").css("visibility", "visible");
  });

  $(document).keydown(function (e) {
    switch (e.which) {
      case 37: // left
        if ($("#video_player").css("visibility") == "visible") {
          if (counterAc > 1) {
            counterAc = counterAc - 1;
            setPlayerKeys($("[vn=" + counterAc + "]"));
          } else {
            alert("There is no more videos in that direction!");
          }
        }
        break;

      case 39: // right
        if ($("#video_player").css("visibility") == "visible") {
          if (counterAc < counter) {
            counterAc = counterAc + 1;
            setPlayerKeys($("[vn=" + counterAc + "]"));
          } else {
            getJsonOC();
            alert("There is no more videos in that direction! Loding more...");
          }
        }
        break;

      case 77:
        if ($("#player_buttons").css("visibility") != "hidden") {
          //console.log("test1");
          $("#btn_goMusic").click();
        }
        break;

      case 87:
        if ($("#player_buttons").css("visibility") != "hidden") {
          $("#btn_downWhater").click();
        }
        break;

      case 82:
        if ($("#player_buttons").css("visibility") != "hidden") {
          $("#btn_downRaw").click();
        }
        break;

      case 27:
        if ($("#player_buttons").css("visibility") != "hidden") {
          $("#btn_closePlayer").click();
        }
        break;

      case 85:
        if ($("#btn_saveLinks").css("display") != "none") {
          $("#btn_saveLinks").click();
        }
        break;

      default:
        return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  });

  function setPlayerKeys(obj) {
    var videoUri = $(obj).attr("name");
    var video2Down = $(obj).attr("info");
    var video2DownWater = $(obj).attr("infoWater");
    var videoUid = $(obj).attr("infouid");
    var videoMID = $(obj).attr("infomid");

    //console.log(addressValue);

    $("#body_content").css("filter", "blur(5px)");
    $("#player_buttons").css("visibility", "visible");
    $("#btn_downRaw").attr("onclick", 'location.href="' + video2Down + '";');
    $("#btn_downWhater").attr(
      "onclick",
      'location.href="' + video2DownWater + '";'
    );
    if (videoMID != "") {
      $("#btn_goMusic").attr(
        "onclick",
        'location.href="user_music.php?mid=' + videoMID + '";'
      );
    } else {
      alert("There is no users with this music.");
    }
    if (videoUid != "") {
      $("#btn_goUser").attr(
        "onclick",
        'location.href="user_posts.php?user_id=' + videoUid + '";'
      );
    } else {
      $("#btn_goUser").attr(
        "onclick",
        "alert('You are already on that profile.')"
      );
    }
    /*if (video2DownWater != "") {
		$("#btn_downWhater").attr('onclick', "location.href=\"" + video2DownWater + "\";");
	}else{
		$("#btn_downWhater").attr('onclick', "alert('Video with watermark not available')");
	}*/
    $("#video_player_tag").attr("src", videoUri);
    $("#video_player").css("visibility", "visible");
  }

  $("#btn_closePlayer").on("click", function () {
    $("#body_content").css("filter", "");
    $("#player_buttons").css("visibility", "hidden");
    $("#btn_downRaw").attr("onclick", "");
    $("#video_player_tag").attr("src", "");
    $("#video_player").css("visibility", "hidden");
  });

  //getea de a 8
  getJsonOC();
  //getJsonLikes();

  /*while(has_more == 1){
	console.log("yes");
}*/

  function whileDelay() {}

  /*$(window).on("scroll", function() {
	var scrollHeight = $(document).height();
	var scrollPosition = $(window).height() + $(window).scrollTop();
	if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
	    getJson(max_offset, user_id);
	}
});*/

  function getJsonOC() {
    var html = "php/jsonpst.php?uid=" + user_id + "&cursor=" + max_offset;
    //console.log(html);
    $.ajax({
      url: html,
      success: videoAdapt,
      error: function () {
        console.log("Error videos Fetch");
      },
    });
  }

  function getJsonLikes() {
    var html =
      "php/jsonpst.php?uid=" + user_id + "&cursor=" + max_offset2 + "&mode=1";
    console.log(html);
    $.ajax({
      url: html,
      success: videoAdapt2,
      error: function () {
        console.log("Error videos Fetch");
      },
    });
  }

  function videoAdapt(data) {
    /*data = JSON.stringify(data);
	console.log(data);*/
    //console.log(data);
    var userVids = JSON.parse(data);
    //console.log(data);
    //console.log(has_more);
    if (userVids.status_code == 4) {
      alert(
        "User not found. Or User with no Videos. Or profile is private. Error P"
      );
      location.replace("index.html");
      //console.log(data);
    } else {
      if (infoSet != true) {
        infoSet = true;
        setUserInfo(data);
      }

      var arrayLenght = userVids.aweme_list;
      var arrayL = Object.keys(arrayLenght).length;

      var videoUrl = "";
      var videoPic = "";
      var videoTitle = "";
      var videoUrlWater = "";

      if (arrayL > 0) {
        for (var i = 0; i < arrayL; i++) {
          //videoUrlWater = userVids.aweme_list[i].video.download_addr.url_list[0];
          videoUrlWater =
            "https://api2.musical.ly/aweme/v1/play/?video_id=" +
            userVids.aweme_list[i].video.play_addr.uri +
            "&line=0&ratio=540p&watermark=1&media_type=4&vr_type=0&test_cdn=None&improve_bitrate=0&logo_name=tiktok_m";
          videoUrl = userVids.aweme_list[i].video.play_addr.url_list[0];
          videoPic = userVids.aweme_list[i].video.dynamic_cover.url_list[0];
          var videoPicComp = userVids.aweme_list[i].video.cover.url_list[0];
          //videoPic = insert(videoPic, 4 , "s");
          videoTitle = userVids.aweme_list[i].desc;
          var videouid = "";
          var videoMusic = "";
          var videoId = userVids.aweme_list[i].aweme_id;
          counter = counter + 1;
          if (userVids.aweme_list[i].hasOwnProperty("music")) {
            videoMusic = userVids.aweme_list[i].music.mid;
          }
          max_offset = userVids.max_cursor;

          videoUris = videoUris + videoUrl + "\n";
          videoUris = videoUris.replace(/\n/g, "\r\n");

          videoIds = videoIds + videoId + "\n";
          videoIds = videoIds.replace(/\n/g, "\r\n");

          var videoUrlToDown =
            "php/downloader.php?file=" +
            videoUrl +
            "&name=" +
            videoTitle.replace(/#/g, "_").replace(/ /g, "_") +
            "_" +
            user_id;
          var videoWaterToDown =
            "php/downloader.php?file=" +
            encodeURIComponent(videoUrlWater) +
            "&name=" +
            videoTitle.replace(/#/g, "_").replace(/ /g, "_") +
            "_" +
            user_id;
          $("#tbl_vids").append(
            html1 +
              videoUrl +
              html2 +
              videoUrlToDown +
              html3 +
              counter +
              html4 +
              videoWaterToDown +
              html5 +
              videouid +
              html6 +
              videoMusic +
              html7 +
              videoPicComp +
              html8 +
              videoPic +
              html9 +
              videoTitle +
              sep +
              "<hr>" +
              '<p style="font-size: 10px">' +
              "Video Id: " +
              videoId +
              "</p>" +
              html10
          );
          $("#btn_more").css("display", "block");
          $("#btn_saveLinks").css("display", "block");

          //console.log("1");
        }
      } else {
        console.log("error for");
      }
    }
  }

  function videoAdapt2(data) {
    //console.log("jsonpst.php?uid=" + user_id + "&cursor=" + max_offset2 + "&mode=1")
    console.log(data);
    var userVids = JSON.parse(data);

    if (userVids.msg == "Unknow") {
      alert(
        "User not found. Or User with no Videos. Or profile is private. Error L"
      );
      //console.log(max_offset2);
      //location.replace("index.html");
      //console.log(data);
    } else {
      var arrayLenght = userVids.aweme_list;
      var arrayL = Object.keys(arrayLenght).length;

      var videoUrl = "";
      var videoPic = "";
      var videoTitle = "";
      var videoUrlWater = "";
      var videoMusic = "";
      if (arrayL > 0) {
        for (var i = 0; i < arrayL; i++) {
          videoUrl = userVids.aweme_list[i].video.download_addr.url_list[0];
          videoPic = userVids.aweme_list[i].video.dynamic_cover.url_list[0];

          videoTitle = userVids.aweme_list[i].desc;
          max_offset2 = userVids.max_cursor;
          var videouid = userVids.aweme_list[i].author.uid;

          if ("mid" in userVids.aweme_list[i].music) {
            videoMusic = userVids.aweme_list[i].music.mid;
          } else {
            videoMusic = "";
          }
          has_more2 = userVids.has_more;
          //console.log("2: " + has_more2);

          var videoUrlToDown =
            "php/downloader.php?file=" +
            videoUrl +
            "&name=" +
            videoTitle.replace(/#/g, "_").replace(/ /g, "_").replace(/,/g, "_");
          $("#tbl_likes").html(
            $("#tbl_likes").html() +
              html1 +
              videoUrl +
              html2 +
              videoUrlToDown +
              html3 +
              videoUrlWater +
              html4 +
              videouid +
              html5 +
              videoMusic +
              html6 +
              videoPic +
              html7 +
              videoTitle +
              html8
          );

          /*if (userVids.aweme_list[i].video.hasOwnProperty('download_suffix_logo_addr')){
				videoUrlWater = userVids.aweme_list[i].video.download_suffix_logo_addr.url_list[0];
				var videoUrlToDownWater = "php/down_water.php?file=" + videoUrlWater + "&name=" + videoTitle.replace(/#/g,"_").replace(/ /g,"_");;

				$("#tbl_likes").html($("#tbl_likes").html() + html1 + videoUrl + html2 + videoUrlToDown + html3 + videoUrlToDownWater + html4 + videoPic + html5 + videoTitle + html6);
			//console.log("1");
			}else{

				
			}*/

          //console.log("1");
        }
      } else {
        console.log("error for");
      }
    }
  }

  function setUserInfo(data) {
    var userInfo = JSON.parse(data);
    var nick = userInfo.aweme_list[0].author.nickname; //done
    var at = userInfo.aweme_list[0].author.unique_id; //done
    var followingCount = userInfo.aweme_list[0].author.following_count; //done
    var avatarImg = userInfo.aweme_list[0].author.avatar_thumb.url_list[0]; //done
    avatarImg = insert(avatarImg, 4, "s");
    var region = userInfo.aweme_list[0].author.region; //done
    var bio = userInfo.aweme_list[0].author.signature; //done
    has_more = userInfo.has_more;
    room_id = userInfo[0];
    console.log(room_id);
    //console.log(room_id);
    if (room_id != "0") {
      $("#btn_goStream").css("visibility", "visible");
    }

    $("#lbl_nick").html(
      '<img id="user_avatar" src="' +
        avatarImg +
        '" class="img-rounded" style="width: 100px; height: 100px;" alt="' +
        nick +
        '">' +
        "    " +
        nick
    );
    $("#lbl_info").html(
      "@" +
        at +
        sep +
        "Bio: " +
        bio +
        sep +
        "Region: " +
        region +
        $("#lbl_info").html()
    );
    //$("#con_tabs").css('visibility', 'visible');
  }

  function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
  }
});
