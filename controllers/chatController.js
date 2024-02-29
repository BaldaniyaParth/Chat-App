const Chat = require("../models/chatModel");

exports.saveChat = async (req,res) => {
    try {

        const chat =  new Chat({
            sender_id : req.body.sender_id,
            receiver_id : req.body.receiver_id,
            message : req.body.message
        })

        const newChat = await chat.save();

        res.status(200).send({
            success : true,
            message : "Chat Insert...",
            data : newChat
        })

    }catch (err) {
        return res.status(500).json({
            status : 500,
            message: "Something Worng..."
        })
    }
}