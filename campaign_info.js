//sometimes I'm amaze of how much stuff I write
//but yeah this is basically a marketing tool that showed the information of a certain camapaign
//of course is done with promises (THANKS JS FOR THAT) in an async fashion
//if there is any link don't even bother because they don't work anymore :(

var args = parseURLParams(window.location.href);
var u = getCookie("uid_camp_usr");
var p = getCookie("uid_camp_pod");

var camp_id = args.cid[0];

main();

async function main() {
  name_status(camp_id);
  following_status(camp_id);
  like_status(camp_id);
  comment_status(camp_id);
  sendComment("", camp_id);
}

async function name_status(id) {
  return new Promise(function (resolve, reject) {
    var html =
      "../assets/php/dbcon.php?uid=" +
      u +
      "&pod=" +
      p +
      "&mode=9&camp_id=" +
      id;
    $.ajax({
      url: html,
      success: function (data) {
        try {
          var jsonObj = JSON.parse(data);
          $("#lbl_camp_name").html("Campaign Name: " + jsonObj.campaign_name);
          $("#lbl_camp_status").html("Status: " + jsonObj.status);
        } catch (error) {
          console.log("error trying to parse json from Campaign status");
        }
      },
      error: function () {
        //$('#' + user_id).attr('class', 'card bg-danger text-center d-inline-block flex-shrink-0')
        //console.log("Error Fetching User Info for: " + usr);
      },
    });
  });
}

async function following_status(id) {
  return new Promise(function (resolve, reject) {
    var html =
      "../assets/php/dbcon.php?uid=" +
      u +
      "&pod=" +
      p +
      "&mode=10&camp_id=" +
      id;
    $.ajax({
      url: html,
      success: async function (data) {
        try {
          //console.log(data);
          var jsonObj = JSON.parse(data);
          jsonObj = jsonObj.follow_status;
          jsonObj = jsonObj.split("/");
          var oldusr = "";
          var test = 0;
          //progress bar config
          let followingCount = jsonObj.length;
          /*let barStep = 100 / followingCount;
          $("#bar_following").css("width", "0%");
          $("#progress_bar_crawler").html("0/" + followingCount);*/
          let bar4Index = 1;
          //progress bar config
          for (var key in jsonObj) {
            /*await progressBar(
              barStep,
              followingCount,
              bar4Index,
              "bar_following"
            );*/
            $("#bar_following").html(
              bar4Index.toString() + "/" + followingCount.toString()
            );
            bar4Index++;
            if (jsonObj[key].length > 1) {
              var followObj = eval("(" + jsonObj[key] + ")");
              if (followObj.user != oldusr) {
                if (followObj.status != "error") {
                  if (followObj.user != "undefined") {
                    //console.log(followObj.user);
                    test++;
                    //console.log(test);
                    var handle = await getHandle(followObj.user);
                    //console.log(await getHandle(jsonObj[key].user));
                    var html =
                      "<tr><td>" +
                      followObj.user +
                      "</td><td>" +
                      handle +
                      "</td><td>" +
                      followObj.status +
                      "</td></tr>";
                    $("#tbl_following").append(html);
                  }
                } else {
                  if (followObj.user != "undefined") {
                    var handle = await getHandle(followObj.user);
                    //console.log(await getHandle(jsonObj[key].user));
                    var html =
                      "<tr><td>" +
                      followObj.user +
                      "</td><td>" +
                      handle +
                      "</td><td>" +
                      followObj.errorid +
                      "</td></tr>";
                    $("#tbl_following").append(html);
                  }
                }
              }
              oldusr = followObj.user;
            }
          }
        } catch (error) {
          console.log(error);
        }
      },
      error: function () {
        //$('#' + user_id).attr('class', 'card bg-danger text-center d-inline-block flex-shrink-0')
        //console.log("Error Fetching User Info for: " + usr);
      },
    });
  });
}

async function like_status(id) {
  return new Promise(function (resolve, reject) {
    var html =
      "../assets/php/dbcon.php?uid=" +
      u +
      "&pod=" +
      p +
      "&mode=12&camp_id=" +
      id;
    $.ajax({
      url: html,
      success: async function (data) {
        try {
          //console.log(data);
          var jsonObj = JSON.parse(data);
          //console.log(jsonObj);
          jsonObj = jsonObj.like_status;
          console.log(jsonObj);
          //console.log(jsonObj);
          jsonObj = jsonObj.split("/");
          //console.log(jsonObj);
          var likeDic = {};
          //progress bar config
          let likingCount = jsonObj.length;
          /*let barStep = 100 / likingCount;
          $("#bar_liking").css("width", "0%");
          $("#bar_liking").html("0/" + likingCount);*/
          let bar4Index = 1;
          //progrss bar config

          for (let index = 0; index < jsonObj.length; index++) {
            //await progressBar(barStep, likingCount, bar4Index, "bar_liking");
            $("#bar_liking").html(
              bar4Index.toString() + "/" + likingCount.toString()
            );
            bar4Index++;
            // console.log(jsonObj[index]);
            if (jsonObj[index].length > 1) {
              console.log(jsonObj[index]);
              var likeObj = eval("(" + jsonObj[index] + ")");
              //console.log(likeObj);
              var handle = await getHandle(likeObj.user);
              var usr_id = likeObj.user;
              var lVideos = likeObj.videos.split(",");
              var videos = {};
              if (likeObj.hasOwnProperty("errors")) {
                var errors = likeObj.errors;
                if (errors.length > 0) {
                  for (let i = 0; i < lVideos.length; i++) {
                    if (lVideos[i].length > 0) {
                      var error = errors.find(
                        (element) => element[0] === lVideos[i]
                      );
                      if (error != undefined) {
                        videos[lVideos[i]] = error[1];
                      } else {
                        videos[lVideos[i]] = "Good";
                      }
                    }
                  }
                } else {
                  for (let i = 0; i < lVideos.length; i++) {
                    if (lVideos[i].length > 0) {
                      videos[lVideos[i]] = "Good";
                    }
                  }
                }
              } else {
                for (let i = 0; i < lVideos.length; i++) {
                  if (lVideos[i].length > 0) {
                    videos[lVideos[i]] = "Good";
                  }
                }
              }
              //console.log(lVideos);

              likeDic[usr_id] = videos;

              var html =
                '<a class="dropdown-item" onclick="showLikes(\'' +
                usr_id +
                '\')" role="presentation">' +
                handle +
                "</a>";

              $("#cont_like_users").append(html);
            }
          }
          $("#likes_info").html(JSON.stringify(likeDic));
        } catch (error) {
          console.log(
            "error trying to parse json from Following status: " + error.stack
          );
        }
      },
      error: function () {
        //$('#' + user_id).attr('class', 'card bg-danger text-center d-inline-block flex-shrink-0')
        //console.log("Error Fetching User Info for: " + usr);
      },
    });
  });
}

async function comment_status(id) {
  return new Promise(function (resolve, reject) {
    var html =
      "../assets/php/dbcon.php?uid=" +
      u +
      "&pod=" +
      p +
      "&mode=14&camp_id=" +
      id;
    //console.log(html);
    $.ajax({
      url: html,
      success: function (data) {
        try {
          jsonObj = JSON.parse(data);
          var comUsers = jsonObj.comment_status;
          comUsers = comUsers.split("/");
          $("#cont_comment_users").html("");
          comUsers.forEach(async (element) => {
            if (element.length > 1) {
              var usrCom = eval("(" + element + ")");
              //console.log(usrCom);
              var handle = await getHandle(usrCom.user);
              var html =
                '<a class="dropdown-item" onclick="loadComments(\'' +
                usrCom.user +
                "', '" +
                id +
                '\')" role="presentation">' +
                handle +
                "</a>";
              $("#cont_comment_users").append(html);
            }
          });
        } catch (error) {
          console.log("error trying to parse json from Following status");
        }
      },
      error: function () {
        //$('#' + user_id).attr('class', 'card bg-danger text-center d-inline-block flex-shrink-0')
        //console.log("Error Fetching User Info for: " + usr);
      },
    });
  });
}

//*utils

function goComment(uid, comid) {
  if ($("#input_msg").val() != "") {
    var html =
      "../assets/php/dbcon.php?uid=" +
      u +
      "&pod=" +
      p +
      "&mode=20&camp_id=" +
      camp_id;
    $.ajax({
      url: html,
      success: function (data) {
        try {
          var jsonObj = JSON.parse(data);
          jsonObj = jsonObj.comment_status;
          jsonObj = jsonObj.split("/");
          jsonObj.forEach((element) => {
            if (element.length > 1) {
              jsonObj = eval("(" + element + ")");
              if (jsonObj.user == uid) {
                var vidId = jsonObj.videoid;
                sendComment(comid, camp_id, $("#input_msg").val(), vidId);
              }
            }
          });
        } catch (error) {
          console.log("error trying to get handle from db");
        }
      },
      error: function () {
        //$('#' + user_id).attr('class', 'card bg-danger text-center d-inline-block flex-shrink-0')
        //console.log("Error Fetching User Info for: " + usr);
      },
    });
  }
}

function parseURLParams(url) {
  var queryStart = url.indexOf("?") + 1,
    queryEnd = url.indexOf("#") + 1 || url.length + 1,
    query = url.slice(queryStart, queryEnd - 1),
    pairs = query.replace(/\+/g, " ").split("&"),
    parms = {},
    i,
    n,
    v,
    nv;

  if (query === url || query === "") return;

  for (i = 0; i < pairs.length; i++) {
    nv = pairs[i].split("=", 2);
    n = decodeURIComponent(nv[0]);
    v = decodeURIComponent(nv[1]);

    if (!parms.hasOwnProperty(n)) parms[n] = [];
    parms[n].push(nv.length === 2 ? v : null);
  }
  return parms;
}

async function getHandle(uid) {
  return new Promise(function (resolve, reject) {
    var html =
      "../assets/php/dbcon.php?uid=" +
      u +
      "&pod=" +
      p +
      "&mode=11&userid=" +
      uid;
    //console.log("Test: " + uid);
    $.ajax({
      url: html,
      success: function (data) {
        try {
          var jsonObj = JSON.parse(data);
          resolve(jsonObj.tt_at);
        } catch (error) {
          console.log("error trying to get handle from db");
        }
      },
      error: function () {
        //$('#' + user_id).attr('class', 'card bg-danger text-center d-inline-block flex-shrink-0')
        //console.log("Error Fetching User Info for: " + usr);
      },
    });
  });
}

function showLikes(uid) {
  $("#tbl_like").html("");
  var jsonObj = JSON.parse($("#likes_info").html());
  var lVideos = jsonObj[uid];
  for (key in lVideos) {
    if (lVideos.hasOwnProperty(key)) {
      var html =
        "<tr><td>" +
        key +
        '</td><td><a href="https://m.tiktok.com/v/' +
        key +
        '.html" target="_blank">Play Video...</a></td><td>' +
        lVideos[key] +
        "</td></tr>";
      $("#tbl_like").append(html);
    }
  }

  /*if (element > 1) {
    var html =
      "<tr><td>" +
      element +
      '</td><td><a href="https://m.tiktok.com/v/' +
      element +
      '.html" target="_blank">Play Video...</a></td><td>Good</td></tr>';
    $("#tbl_like").append(html);
  }*/
}

function loadComments(uid, id) {
  $("#tbl_comments").html("");
  return new Promise(function (resolve, reject) {
    var html =
      "../assets/php/dbcon.php?uid=" +
      u +
      "&pod=" +
      p +
      "&mode=13&camp_id=" +
      id;
    //console.log(html);
    $.ajax({
      url: html,
      success: function (data) {
        try {
          var comments = data.split("�");
          comments.forEach((element) => {
            if (element.length > 1) {
              //console.log(element);
              var jsonObj = eval("(" + element + ")");
              if (jsonObj.touser == uid) {
                if (jsonObj.sender == "sys_user") {
                  var html =
                    "<tr><td>System User (You)</td><td>" +
                    jsonObj.text +
                    "</td><td>" +
                    "---" +
                    "</td></tr>";
                  $("#tbl_comments").append(html);
                  checkForReplys(uid, jsonObj.comid, id);
                } else {
                  var html =
                    "<tr><td>Selected User</td><td>" +
                    jsonObj.text +
                    "</td><td>" +
                    "---" +
                    "</td></tr>";
                  $("#tbl_comments").append(html);
                }
              }
            }
          });
        } catch (error) {
          console.log("error trying to parse json from Following status");
        }
      },
      error: function () {
        //$('#' + user_id).attr('class', 'card bg-danger text-center d-inline-block flex-shrink-0')
        //console.log("Error Fetching User Info for: " + usr);
      },
    });
  });
}

function reloadComments(uid, id) {
  $("#tbl_comments").html("");
  return new Promise(function (resolve, reject) {
    var html =
      "../assets/php/dbcon.php?uid=" +
      u +
      "&pod=" +
      p +
      "&mode=13&camp_id=" +
      id;
    //console.log(html);
    $.ajax({
      url: html,
      success: function (data) {
        //console.log(data);
        try {
          var comments = data.split(/[�Þ]+/);
          comments.forEach((element) => {
            if (element.length > 1) {
              //console.log(element);
              var jsonObj = eval("(" + element + ")");
              if (jsonObj.touser == uid) {
                //console.log(jsonObj);
                if (jsonObj.sender == "sys_user") {
                  var html =
                    "<tr><td>System User (You)</td><td>" +
                    jsonObj.text +
                    "</td><td>" +
                    "---" +
                    "</td></tr>";
                  $("#btn_sendComment").attr("disabled", true);
                } else {
                  var html =
                    "<tr><td>Selected User</td><td>" +
                    jsonObj.text +
                    "</td><td>" +
                    "---" +
                    "</td></tr>";
                  $("#btn_sendComment").attr("disabled", false);
                  $("#btn_sendComment").attr(
                    "onclick",
                    'goComment("' + uid + '", "' + jsonObj.comid + '")'
                  );
                }
                $("#tbl_comments").append(html);
              }
            }
          });
        } catch (error) {
          console.log("error trying to parse json from Following status");
        }
      },
      error: function () {
        //$('#' + user_id).attr('class', 'card bg-danger text-center d-inline-block flex-shrink-0')
        //console.log("Error Fetching User Info for: " + usr);
      },
    });
  });
}

async function checkForReplys(uid, cid, id) {
  return new Promise(function (resolve, reject) {
    var html =
      "../assets/php/dbcon.php?uid=" +
      u +
      "&pod=" +
      p +
      "&mode=15&camp_id=" +
      id;
    //console.log(html);
    $.ajax({
      url: html,
      success: function (data) {
        try {
          var jsonObj = JSON.parse(data);
          jsonObj.forEach((element) => {
            if (element[1].length > 1) {
              var dbReplys = JSON.parse(element[1]);
              dbReplys.forEach((element) => {
                if (element.reply_to.cid == cid) {
                  var newMsg =
                    '{sender: "target", comid: "' +
                    element.comm_reply.cid +
                    '", text: "' +
                    element.comm_reply.text +
                    '", touser: "' +
                    element.comm_reply.user_id +
                    '"}Þ';
                  var html =
                    "../assets/php/dbcon.php?uid=" +
                    u +
                    "&pod=" +
                    p +
                    "&mode=16&camp_id=" +
                    id +
                    "&data=" +
                    newMsg;
                  $.ajax({
                    url: html,
                    success: function (data) {
                      try {
                        //console.log(data);
                        reloadComments(uid, id);
                        resolve();
                      } catch (error) {
                        console.log(
                          "error trying to parse json from Following status"
                        );
                      }
                    },
                    error: function () {
                      //$('#' + user_id).attr('class', 'card bg-danger text-center d-inline-block flex-shrink-0')
                      //console.log("Error Fetching User Info for: " + usr);
                    },
                  });
                }
              });
            }
          });
        } catch (error) {
          console.log("error trying to parse json from Following status");
        }
      },
      error: function () {
        //$('#' + user_id).attr('class', 'card bg-danger text-center d-inline-block flex-shrink-0')
        //console.log("Error Fetching User Info for: " + usr);
      },
    });
  });
}

async function sendComment(cid, id, cm_text, aweme) {
  return new Promise(function (resolve, reject) {
    var html =
      "../assets/php/dbcon.php?uid=" +
      u +
      "&pod=" +
      p +
      "&mode=17&camp_id=" +
      id;
    $.ajax({
      url: html,
      success: function (data) {
        try {
          var jsonObj = JSON.parse(data);
          var sys_user = jsonObj.b_sys_user;
          var html =
            "../assets/php/dbcon.php?uid=" +
            u +
            "&pod=" +
            p +
            "&mode=18&userid=" +
            sys_user;
          $.ajax({
            url: html,
            success: function (data) {
              try {
                var jsonObj = JSON.parse(data);
                jsonObj = JSON.parse(jsonObj.params);
                var datos = [];
                datos.push(jsonObj.iid);
                datos.push(jsonObj.device_id);
                datos.push(jsonObj.openudid);
                datos.push(jsonObj.token);
                datos.push(cm_text);
                datos.push(cid);
                datos.push(aweme);

                var tt = { data: datos };

                var html = "php/comm.php";
                $.ajax({
                  url: html,
                  type: "post",
                  data: tt,
                  success: function (data) {
                    try {
                      //console.log(data);
                      var jsonObj = JSON.parse(data);
                      if (jsonObj.hasOwnProperty("status_code")) {
                        if (jsonObj.status_code == "0") {
                          var newMsg =
                            '{sender: "sys_user", comid: "' +
                            jsonObj.comment.cid +
                            '", text: "' +
                            jsonObj.comment.text +
                            '", touser: "' +
                            jsonObj.comment.reply_comment[0].user.uid +
                            '"}Þ';
                          var html =
                            "../assets/php/dbcon.php?uid=" +
                            u +
                            "&pod=" +
                            p +
                            "&mode=16&camp_id=" +
                            id +
                            "&data=" +
                            newMsg;
                          $.ajax({
                            url: html,
                            success: function (data) {
                              try {
                                //console.log(data);
                              } catch (error) {
                                console.log(
                                  "error trying to parse json from Campaign status"
                                );
                              }
                            },
                            error: function () {
                              //$('#' + user_id).attr('class', 'card bg-danger text-center d-inline-block flex-shrink-0')
                              //console.log("Error Fetching User Info for: " + usr);
                            },
                          });
                        }
                      }
                    } catch (error) {
                      console.log(
                        "error trying to parse json from Campaign status"
                      );
                    }
                  },
                  error: function () {
                    //$('#' + user_id).attr('class', 'card bg-danger text-center d-inline-block flex-shrink-0')
                    //console.log("Error Fetching User Info for: " + usr);
                  },
                });
              } catch (error) {
                console.log("error trying to parse json from Campaign status");
              }
            },
            error: function () {
              //$('#' + user_id).attr('class', 'card bg-danger text-center d-inline-block flex-shrink-0')
              //console.log("Error Fetching User Info for: " + usr);
            },
          });
        } catch (error) {
          console.log("error trying to parse json from Campaign status");
        }
      },
      error: function () {
        //$('#' + user_id).attr('class', 'card bg-danger text-center d-inline-block flex-shrink-0')
        //console.log("Error Fetching User Info for: " + usr);
      },
    });
  });
}

/*async function progressBar(cant, tUsers, i, obj) {
  i = i + 1;
  if (tUsers == i) {
    $("#" + obj).css("width", "100%");
  } else {
    var actualCant = parseInt($("#" + obj)[0].style.width.split("%")[0]);
    //console.log(actualCant);
    var newCant = (actualCant + cant).toString();
    //console.log(newCant);
    $("#" + obj).css("width", newCant + "%");
  }
  $("#" + obj).html(i.toString() + "/" + tUsers);
}*/
