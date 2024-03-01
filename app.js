const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const session = require("express-session");
const User = require("./models/userModel");
const Chat = require("./models/chatModel");
const cookieParser = require("cookie-parser");
require("./db/connect");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(session({ 
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

app.use("/", userRoute);
app.use("/", chatRoute);

const io = require("socket.io")(server) ;
const userChat = io.of("/user-chat");
userChat.on("connection", async (socket) => {
    console.log("user connected");

    const userId = socket.handshake.auth.token;
    await User.findByIdAndUpdate({ _id : userId}, {
        $set : {
            is_online : "1",
        }
    })

    socket.broadcast.emit("getOnlineStatus", { user_id : userId});

    socket.on("disconnect", async () => {
        console.log("user disconnect");

        const userId = socket.handshake.auth.token;
        await User.findByIdAndUpdate({_id : userId}, {
            $set : {
                is_online : "0",
            }
        })

        socket.broadcast.emit("getOfflineStatus", { user_id : userId});
    })

    socket.on("newChat", (data) => {
        socket.broadcast.emit("loadNewChat", data);
    })

    socket.on("existsChat", async (data) => {
        const chats = await Chat.find({ $or : [
            { sender_id : data.sender_id, receiver_id : data.receiver_id},
            { sender_id : data.receiver_id, receiver_id : data.sender_id}
        ]});
        
        socket.emit("loadChats", { chats : chats});
    }) 

    socket.on("chatDeleted", (id) => {
        socket.broadcast.emit("chatMessageDeleted", id);
    })

    socket.on("chatUpdated", (data) => {
        socket.broadcast.emit("chatMessageUpdated", data);
    })
})


const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server Running at PORT ${PORT}`);
})