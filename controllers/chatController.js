const Chat = require("../models/chatModel");

exports.saveChat = async (req,res) => {
    try {

        const chat =  new Chat({
            sender_id : req.body.sender_id,
            receiver_id : req.body.receiver_id,
            message : req.body.message
        })

        const newChat = await chat.save();

        return res.status(200).send({
            success : true,
            message : "Chat Insert Successfully...",
            data : newChat
        })

    }catch (err) {
        return res.status(500).json({
            status : 500,
            message: "Something Worng..."
        })
    }
}

exports.deleteChat = async (req,res) => {
    try {
        
        await Chat.deleteOne( { _id : req.body.id });

        return res.status(200).send({
            success : true,
            message : "Chat Delete Successfully..."
        })

    }catch (err) {
        return res.status(500).json({
            status : 500,
            message: "Something Worng..."
        })
    }
}

exports.updateChat = async (req,res) => {
    try {
        
        await Chat.findByIdAndUpdate( { _id : req.body.id },{
            $set : {
                message : req.body.message
            }
        });

        return res.status(200).send({
            success : true,
            message : "Chat Update Successfully..."
        })

    }catch (err) {
        return res.status(500).json({
            status : 500,
            message: "Something Worng..."
        })
    }
}




