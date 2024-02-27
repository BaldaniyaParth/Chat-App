const route = require("express").Router();
const { uploader } = require("../helper/multer");
const userController = require("../controllers/userController");

route.get("/register", userController.registerLoad);
route.post("/register", uploader.single("image"), userController.register);

module.exports = route;


