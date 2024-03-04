const mongoose = require("mongoose");

// Define the schema for chat messages
const chatSchema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String,
        required: true
    }
},
    // Enable timestamps for createdAt and updatedAt fields
    { timestamps: true }
);


module.exports = mongoose.model("Chat", chatSchema);
