const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const cloudinary = require("../helper/cloudinary");

exports.loginLoad = async (req, res) => {
    try {
        res.render("register.ejs");
    }catch (err) {
        return res.status(500).json({
            status : 500,
            message : "Something Worng..."
        })
    }
}

exports.register = async (req,res) => {
    try {
        const passwordHash = await bcrypt.hash(req.body.password, 10);

        const profile_pic = req.file;
        const result = await cloudinary.uploader.upload(profile_pic.path);
        const profilePicUrl = result.secure_url;

        const newUser = new User({
            name : req.body.name,
            email : req.body.email,
            password : passwordHash,
            image : profilePicUrl
        })

        await newUser.save();
        return res.redirect("/");

    }catch (err) {
        console.log(err);
        return res.status(500).json({
            status : 500,
            message : "Something Worng..."
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const userData = await User.findOne({email});

        if(userData){
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if(passwordMatch){
                req.session.user = userData;
                res.redirect("/dashboard");
            }else{
                res.redirect("/")
            }
        }else{
            res.redirect("/")
        }
    }catch (err) {
        return res.status(500).json({
            status : 500,
            message : "Something Worng..."
        })
    }
}

exports.logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect("/");
    }catch (err) {
        return res.status(500).json({
            status : 500,
            message : "Something Worng..."
        })
    }
}

exports.dashboardLoad = async (req, res) => {
    try {
        res.render("dashboard.ejs", {user : req.session.user});

    }catch (err) {
        return res.status(500).json({
            status : 500,
            message : "Something Worng..."
        })
    }
}