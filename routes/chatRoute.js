const route = require("express").Router();
const chatController = require("../controllers/chatController");

route.post("/save-chat", chatController.saveChat);
route.post("/delete-chat", chatController.deleteChat);

module.exports = route;