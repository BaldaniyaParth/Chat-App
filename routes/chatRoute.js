const route = require("express").Router();
const chatController = require("../controllers/chatController");

route.post("/save-chat", chatController.saveChat);

module.exports = route;