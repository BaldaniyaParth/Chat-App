const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const cloudinary = require("../helper/cloudinary");

// Controller function to render login page
exports.loginLoad = async (req, res) => {
    try {
        // Render the register page
        res.render("register.ejs");

    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Something Worng..."
        });
    }
}

// Controller function to register a new user
exports.register = async (req, res) => {
    try {
        // Hash the password
        const passwordHash = await bcrypt.hash(req.body.password, 10);

        // Upload profile picture to cloudinary
        const profile_pic = req.file;
        const result = await cloudinary.uploader.upload(profile_pic.path);
        const profilePicUrl = result.secure_url;

        // Create a new user instance with hashed password and profile picture URL
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: passwordHash,
            image: profilePicUrl
        });

        await newUser.save();

        // Redirect to home page
        return res.redirect("/");

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 500,
            message: "Something Worng..."
        });
    }
}

// Controller function to handle user login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const userData = await User.findOne({ email });

        if (userData) {
            // Compare passwords
            const passwordMatch = await bcrypt.compare(password, userData.password);

            if (passwordMatch) {
                // Store user data in session and redirect to dashboard
                req.session.user = userData;
                res.cookie("user", JSON.stringify(userData));
                return res.redirect("/dashboard");
            } else {

                return res.redirect("/");
            }
        } else {

            return res.redirect("/");
        }
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Something Worng..."
        });
    }
}

// Controller function to handle user logout
exports.logout = async (req, res) => {
    try {
        // Destroy session and clear user cookie, then redirect to home page
        req.session.destroy();
        res.clearCookie("user");
        res.redirect("/");

    } catch (err) {
        
        return res.status(500).json({
            status: 500,
            message: "Something Worng..."
        });
    }
}

// Controller function to render dashboard page
exports.dashboardLoad = async (req, res) => {
    try {
        // Find all users except the currently logged in user
        const users = await User.find({ _id: { $nin: [req.session.user._id] } });

        res.render("dashboard.ejs", { user: req.session.user, users: users });

    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Something Worng..."
        });
    }
}
