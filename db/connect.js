const mongoose = require("mongoose");
require("dotenv").config();

mongoose
    .connect(process.env.MONGODB_URL)
    .then( () => {
        console.log("Connection Succesfulyy...");
    })
    .catch( (err) => {
        console.log("error : ", err);
    })