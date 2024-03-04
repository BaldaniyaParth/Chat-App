const route = require("express").Router();
const { uploader } = require("../helper/multer");
const userController = require("../controllers/userController");
const { isLogin, isLogout } = require("../middlewares/userAuth");



route.get("/", isLogout, userController.loginLoad);
route.post("/login", userController.login);
route.post("/register", uploader.single("image"), userController.register);
route.get("/logout", isLogin, userController.logout);
route.get("/dashboard", isLogin, userController.dashboardLoad);


route.get("*", (req,res) => {
    res.redirect("/");
})
module.exports = route;


