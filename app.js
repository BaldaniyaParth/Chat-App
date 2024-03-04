const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("./db/connect");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(session({ 
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

app.use("/", userRoute);
app.use("/", chatRoute);

const PORT = process.env.PORT || 8000;

const socketSetup = require("./webSocket/socket");
socketSetup(server); 

server.listen(PORT, () => {
    console.log(`Server Running at PORT ${PORT}`);
});
