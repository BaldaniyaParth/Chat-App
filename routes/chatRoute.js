const route = require("express").Router();
const chatController = require("../controllers/chatController");

route.post("/save-chat", chatController.saveChat);
route.post("/delete-chat", chatController.deleteChat);
route.post("/update-chat", chatController.updateChat);

module.exports = route;