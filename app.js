const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const session = require("express-session");
const User = require("./models/userModel");
require("./db/connect");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(session({ secret:process.env.SESSION_SECRET}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

app.use("/", userRoute);

const io = require("socket.io")(server);
const userChat = io.of("/user-chat");
userChat.on("connection", async (socket) => {
    console.log("user connected");

    const userId = socket.handshake.auth.token;
    await User.findByIdAndUpdate({ _id : userId}, {
        $set : {
            is_online : "1",
        }
    })

    socket.on("disconnect", async () => {
        console.log("user disconnect");

        const userId = socket.handshake.auth.token;
        await User.findByIdAndUpdate({_id : userId}, {
            $set : {
                is_online : "0",
            }
        })
    })
})


const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server Running at PORT ${PORT}`);
})