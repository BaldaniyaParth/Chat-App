const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const socketIO = require("socket.io");

module.exports = function (server) {
  const io = socketIO(server);
  const userChat = io.of("/user-chat");

  userChat.on("connection", async (socket) => {
    console.log("user connected");

    const userId = socket.handshake.auth.token;
    await User.findByIdAndUpdate(
      { _id: userId },
      {
        $set: {
          is_online: "1",
        },
      }
    );

    socket.broadcast.emit("getOnlineStatus", { user_id: userId });

    socket.on("disconnect", async () => {
      console.log("user disconnect");

      const userId = socket.handshake.auth.token;
      await User.findByIdAndUpdate(
        { _id: userId },
        {
          $set: {
            is_online: "0",
          },
        }
      );

      socket.broadcast.emit("getOfflineStatus", { user_id: userId });
    });

    socket.on("newChat", (data) => {
      socket.broadcast.emit("loadNewChat", data);
    });

    socket.on("existsChat", async (data) => {
      const chats = await Chat.find({
        $or: [
          { sender_id: data.sender_id, receiver_id: data.receiver_id },
          { sender_id: data.receiver_id, receiver_id: data.sender_id },
        ],
      });
      socket.emit("loadChats", { chats: chats });
    });

    socket.on("chatDeleted", (id) => {
      socket.broadcast.emit("chatMessageDeleted", id);
    });

    socket.on("chatUpdated", (data) => {
      socket.broadcast.emit("chatMessageUpdated", data);
    });
  });
};
