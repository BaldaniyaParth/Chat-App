const body = document.querySelector("body"),
  modeToggle = body.querySelector(".mode-toggle");
sidebar = body.querySelector("nav");
sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
  body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
  sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    localStorage.setItem("mode", "dark");
  } else {
    localStorage.setItem("mode", "light");
  }
});

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
  if (sidebar.classList.contains("close")) {
    localStorage.setItem("status", "close");
  } else {
    localStorage.setItem("status", "open");
  }
});

function getCookie(name) {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

var userData = JSON.parse(getCookie("user"));

var sender_id = userData._id;
var receiver_id;
var socket = io("/user-chat", {
  auth: {
    token: sender_id,
  },
});

$(document).ready(function () {
  $(".user-list").click(function () {
    var userId = $(this).attr("data-id");
    receiver_id = userId;

    $(".start-head").show();
    $(".chat-section").show();

    socket.emit("existsChat", {
      sender_id: sender_id,
      receiver_id: receiver_id,
    });
  });
});

socket.on("getOnlineStatus", (data) => {
  $("#" + data.user_id + "-status").text("Online");
  $("#" + data.user_id + "-status").removeClass("offline-status");
  $("#" + data.user_id + "-status").addClass("online-status");
});

socket.on("getOfflineStatus", (data) => {
  $("#" + data.user_id + "-status").text("Offline");
  $("#" + data.user_id + "-status").removeClass("online-status");
  $("#" + data.user_id + "-status").addClass("offline-status");
});

$("#chat-form").submit((event) => {
  event.preventDefault();
  var message = $("#message").val();
  $.ajax({
    url: "/save-chat",
    type: "POST",
    data: { sender_id: sender_id, receiver_id: receiver_id, message: message },
    success: (res) => {
      if (res.success) {
        $("#message").val(" ");
        let chat = res.data.message;
        let html = `
                    <div id="${res.data._id}" class="current-user-chat">
                        <h5><span>${chat}</span>
                            <i class="fa fa-trash" aria-hidden="true" data-id="${res.data._id}" data-toggle="modal" data-target="#deleteChatModel" style="cursor: pointer"></i> 
                            <i class="fa fa-edit" aria-hidden="true" data-msg="${res.data.message}" data-id="${res.data._id}" data-toggle="modal" data-target="#editChatModel" style="cursor: pointer"></i> 
                        </h5>
                    </div>
                `;
        $(".chat-container").append(html);
        socket.emit("newChat", res.data);

        scrollChat();
      } else {
        alert("Something Wrong...");
      }
    },
  });
});

socket.on("loadNewChat", (data) => {
  if (sender_id == data.receiver_id && receiver_id == data.sender_id) {
    let html =
      ` 
                    <div class="distance-user-chat" id="` +
      data._id +
      `">
                        <h5><span>` +
      data.message +
      `</span></h5>
                    </div>
                `;
    $(".chat-container").append(html);
  }
  scrollChat();
});

socket.on("loadChats", (data) => {
  $(".chat-container").html(" ");
  const chats = data.chats;
  let html = " ";
  for (let x = 0; x < chats.length; x++) {
    let addClass = " ";
    if (chats[x]["sender_id"] == sender_id) {
      addClass = "current-user-chat";
    } else {
      addClass = "distance-user-chat";
    }

    html += `
    <div class="${addClass}" id="${chats[x]["_id"]}">
        <h5>
            <span>${chats[x]["message"]}</span>`;
    if (chats[x]["sender_id"] == sender_id) {
      html += `
                <i class="fa fa-trash" aria-hidden="true" data-id="${chats[x]["_id"]}" data-toggle="modal" data-target="#deleteChatModel" style="cursor: pointer"></i> 
                <i class="fa fa-edit" aria-hidden="true" data-msg="${chats[x]["message"]}" data-id="${chats[x]["_id"]}" data-toggle="modal" data-target="#editChatModel" style="cursor: pointer"></i>`;
    }
    html += `
        </h5>
    </div>`;
  }

  $(".chat-container").append(html);
  scrollChat();
});

const scrollChat = () => {
  $(".chat-container").animate(
    {
      scrollTop:
        $(".chat-container").offset().top +
        $(".chat-container")[0].scrollHeight,
    },
    0
  );
};

$(document).on("click", ".fa-trash", function () {
  let message = $(this).parent().text();
  $(".delete-message").text(message);
  $("#delete-message-id").val($(this).attr("data-id"));
});

$("#delete-chat-form").submit((event) => {
  event.preventDefault();
  var id = $("#delete-message-id").val();

  $.ajax({
    url: "/delete-chat",
    type: "POST",
    data: { id: id },
    success: (res) => {
      if (res.success == true) {
        $("#" + id).remove();
        $("#deleteChatModel").modal("hide");
        socket.emit("chatDeleted", id);
      } else {
        alert("Something Worng...");
      }
    },
  });
});

socket.on("chatMessageDeleted", (id) => {
  $("#" + id).remove();
});

$(document).on("click", ".fa-edit", function () {
  $("#edit-message-id").val($(this).attr("data-id"));
  $("#update-message").val($(this).attr("data-msg"));
});

$("#update-chat-form").submit((event) => {
  event.preventDefault();
  var id = $("#edit-message-id").val();
  var message = $("#update-message").val();

  $.ajax({
    url: "/update-chat",
    type: "POST",
    data: { id: id, message: message },
    success: (res) => {
      if (res.success == true) {
        $("#editChatModel").modal("hide");
        $("#" + id)
          .find("span")
          .text(message);
        $("#" + id)
          .find(".fa-edit")
          .attr("data-msg", message);
        socket.emit("chatUpdated", { id: id, message: message });
      } else {
        alert("Something Worng...");
      }
    },
  });
});

socket.on("chatMessageUpdated", (data) => {
  $("#" + data.id)
    .find("span")
    .text(data.message);
});
