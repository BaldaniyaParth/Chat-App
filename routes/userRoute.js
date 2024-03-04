const express = require("express");
const router = express.Router();
const { uploader } = require("../helper/multer");
const userController = require("../controllers/userController");
const { isLogin, isLogout } = require("../middlewares/userAuth");

// Route to load login page
router.get("/", isLogout, userController.loginLoad);

// Route to handle user login
router.post("/login", userController.login);

// Route to handle user registration
router.post("/register", uploader.single("image"), userController.register);

// Route to handle user logout
router.get("/logout", isLogin, userController.logout);

// Route to load dashboard page
router.get("/dashboard", isLogin, userController.dashboardLoad);

// Catch-all route for invalid URLs
router.get("*", (req, res) => {
    res.redirect("/");
});

module.exports = router;
