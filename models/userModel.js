const mongoose = require("mongoose");

// Define the schema for users
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    is_online: {
        type: String,
        default: "0"
    }
},
    // Enable timestamps for createdAt and updatedAt fields
    { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);
