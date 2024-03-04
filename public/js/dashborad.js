// Initialize variables and retrieve mode and status from local storage
const body = document.querySelector("body"),
      modeToggle = body.querySelector(".mode-toggle"),
      sidebar = body.querySelector("nav"),
      sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
  body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
  sidebar.classList.toggle("close");
}

// Event listeners for mode toggle and sidebar toggle buttons
modeToggle.addEventListener("click", () => {
    // Toggle dark mode and update local storage
    body.classList.toggle("dark");
    if (body.classList.contains("dark")) {
        localStorage.setItem("mode", "dark");
    } else {
        localStorage.setItem("mode", "light");
    }
});

sidebarToggle.addEventListener("click", () => {
    // Toggle sidebar visibility and update local storage
    sidebar.classList.toggle("close");
    if (sidebar.classList.contains("close")) {
        localStorage.setItem("status", "close");
    } else {
        localStorage.setItem("status", "open");
    }
});

// Function to retrieve cookie value
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

// Retrieve user data from cookie
var userData = JSON.parse(getCookie("user"));

// Initialize sender_id and receiver_id variables
var sender_id = userData._id;
var receiver_id;
// Initialize socket connection with authentication token
var socket = io("/user-chat", {
  auth: {
    token: sender_id,
  },
});

// Event listener for clicking on user in the user list
$(document).ready(function () {
    $(".user-list").click(function () {
        var userId = $(this).attr("data-id");
        receiver_id = userId;

        // Show chat section
        $(".start-head").show();
        $(".chat-section").show();

        // Emit existsChat event to check if chat exists
        socket.emit("existsChat", {
            sender_id: sender_id,
            receiver_id: receiver_id,
        });
    });
});

// Socket events for updating user online/offline status
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

// Event listener for chat form submission
$("#chat-form").submit((event) => {
    event.preventDefault();
    var message = $("#message").val();
    $.ajax({
        url: "/save-chat",
        type: "POST",
        data: { sender_id: sender_id, receiver_id: receiver_id, message: message },
        success: (res) => {
            if (res.success) {
                // Clear input field and append new chat message
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
                // Emit newChat event
                socket.emit("newChat", res.data);
                // Scroll to bottom of chat container
                scrollChat();
            } else {
                alert("Something Wrong...");
            }
        },
    });
});

// Socket event for loading new chat messages
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
    // Scroll to bottom of chat container
    scrollChat();
});

// Socket event for loading existing chat messages
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
    // Scroll to bottom of chat container
    scrollChat();
});

// Function to scroll to bottom of chat container
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

// Event listener for clicking on delete message icon
$(document).on("click", ".fa-trash", function () {
    let message = $(this).parent().text();
    $(".delete-message").text(message);
    $("#delete-message-id").val($(this).attr("data-id"));
});

// Event listener for delete chat form submission
$("#delete-chat-form").submit((event) => {
    event.preventDefault();
    var id = $("#delete-message-id").val();

    $.ajax({
        url: "/delete-chat",
        type: "POST",
        data: { id: id },
        success: (res) => {
            if (res.success == true) {
                // Remove deleted chat message from UI and emit chatDeleted event
                $("#" + id).remove();
                $("#deleteChatModel").modal("hide");
                socket.emit("chatDeleted", id);
            } else {
                alert("Something Worng...");
            }
        },
    });
});

// Socket event for handling chat message deletion
socket.on("chatMessageDeleted", (id) => {
    $("#" + id).remove();
});

// Event listener for clicking on edit message icon
$(document).on("click", ".fa-edit", function () {
    $("#edit-message-id").val($(this).attr("data-id"));
    $("#update-message").val($(this).attr("data-msg"));
});

// Event listener for edit chat form submission
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
                // Update edited chat message in UI and emit chatUpdated event
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

// Socket event for handling chat message update
socket.on("chatMessageUpdated", (data) => {
    $("#" + data.id)
        .find("span")
        .text(data.message);
});
