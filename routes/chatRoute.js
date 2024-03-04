const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// Route to save a chat message
router.post("/save-chat", chatController.saveChat);

// Route to delete a chat message
router.post("/delete-chat", chatController.deleteChat);

// Route to update a chat message
router.post("/update-chat", chatController.updateChat);

module.exports = router;
