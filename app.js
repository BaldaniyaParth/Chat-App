const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
require("./db/connect");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

app.use("/", userRoute);

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server Running at PORT ${PORT}`);
})