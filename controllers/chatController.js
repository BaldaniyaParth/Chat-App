const Chat = require("../models/chatModel");

// Controller function to save a chat message
exports.saveChat = async (req, res) => {
    try {
        // Create a new chat instance with data from the request body
        const chat = new Chat({
            sender_id: req.body.sender_id,
            receiver_id: req.body.receiver_id,
            message: req.body.message
        });

        const newChat = await chat.save();

        return res.status(200).send({
            success: true,
            message: "Chat Insert Successfully...",
            data: newChat
        });

    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Something Worng..."
        });
    }
};

// Controller function to delete a chat message
exports.deleteChat = async (req, res) => {
    try {
        // Delete the chat message using its ID
        await Chat.deleteOne({ _id: req.body.id });

        return res.status(200).send({
            success: true,
            message: "Chat Delete Successfully..."
        });

    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Something Worng..."
        });
    }
};

// Controller function to update a chat message
exports.updateChat = async (req, res) => {
    try {
        // Update the chat message using its ID and set the new message
        await Chat.findByIdAndUpdate({ _id: req.body.id }, {
            $set: {
                message: req.body.message
            }
        });

        return res.status(200).send({
            success: true,
            message: "Chat Update Successfully..."
        });

    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Something Worng..."
        });
    }
};
