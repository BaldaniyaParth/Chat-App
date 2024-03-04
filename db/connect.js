const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB using the provided URL from environment variables
mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        
        console.log("Connection Succesfulyy...");
    })
    .catch((err) => {
        
        console.log("error : ", err);
    });
