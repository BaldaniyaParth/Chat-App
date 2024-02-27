const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const cloudinary = require("../helper/cloudinary");

exports.registerLoad = async (req,res) => {
    try {
        res.render("register.ejs");
    }catch (err) {
        res.status.json({
            status : 500,
            message : "Something Worng..."
        })
    }
}

exports.register = async (req,res) => {
    try {

        const passwordHash = await bcrypt.hash(req.body.password, 10);

        const profile_pic = req.file;
        const result = await cloudinary.uploader.upload(profile_pic.path, { folder : 'TestFolder' },  function(error, result) {
            if (error) {
              console.error(error);
              return;
            };
            console.log(result)
        });
        const profilePicUrl = result.secure_url;


        const newUser = new User({
            name : req.body.name,
            email : req.body.email,
            passoword : passwordHash,
            image : profilePicUrl
        })

        const user = await newUser.save();

        return res.status(201).json({
            status : 201,
            message : "User Register Succesfully...",
            userData : user
        })

    }catch (err) {
        return res.status(500).json({
            status : 500,
            message : "Something Worng..."
        })
    }
}