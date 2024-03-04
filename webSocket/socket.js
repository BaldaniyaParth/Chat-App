const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const socketIO = require("socket.io");

module.exports = function (server) {
  const io = socketIO(server);

  // Create a namespace for handling user chat
  const userChat = io.of("/user-chat");

  // Handle connection event
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

      // Broadcast user's online status to other users
      socket.broadcast.emit("getOnlineStatus", { user_id: userId });

      // Handle disconnection event
      socket.on("disconnect", async () => {
          console.log("user disconnect");

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

      // Handle new chat event
      socket.on("newChat", (data) => {
          
          socket.broadcast.emit("loadNewChat", data);
      });

      // Handle existing chat event
      socket.on("existsChat", async (data) => {
          // Find existing chats between sender and receiver
          const chats = await Chat.find({
              $or: [
                  { sender_id: data.sender_id, receiver_id: data.receiver_id },
                  { sender_id: data.receiver_id, receiver_id: data.sender_id },
              ],
          });
          // Emit existing chats to the requesting user
          socket.emit("loadChats", { chats: chats });
      });

      // Handle chat deletion event
      socket.on("chatDeleted", (id) => {
          
          socket.broadcast.emit("chatMessageDeleted", id);
      });

      // Handle chat update event
      socket.on("chatUpdated", (data) => {
          
          socket.broadcast.emit("chatMessageUpdated", data);
      });
  });
};
