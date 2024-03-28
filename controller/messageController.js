// controllers/messageController.js
const Message = require('../models/Message');
const md5 = require('md5');
const mongoose = require('mongoose');


const messageController = {
    sendMessage: async (senderId, recipientId, content) => {
        try {
            const conversationId = new mongoose.Types.ObjectId();

            const message = new Message({
                sender: senderId,
                recipient: recipientId,
                content: content,
                conversationId: conversationId
            });

            await message.save();

            return { success: true, message: 'Message sent successfully' };
        } catch (err) {
            console.error(err);
            return { success: false, message: 'Internal server error' };
        }
    },

    getConversationIdsForUser: async (userId) => {
        try {
            // Find distinct conversation IDs where the user is the sender or recipient
            const conversations = await Message.distinct('conversationId', {
                $or: [{ sender: userId }, { recipient: userId }]
            });

            return { success: true, conversations };
        } catch (err) {
            console.error(err);
            return { success: false, message: 'Internal server error' };
        }
    },

    getMessagesForConversation: async (conversationId) => {
        try {
            // Query messages for the specified conversation
            const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

            return { success: true, messages };
        } catch (err) {
            console.error(err);
            return { success: false, message: 'Internal server error' };
        }
    }
};

function generateConversationId(senderId, recipientId) {
    // Concatenate sender and recipient IDs
    const combinedIds = senderId.toString() + recipientId.toString();
    // Hash the combined IDs using md5
    const conversationId = md5(combinedIds);
    return conversationId;
}


module.exports = messageController;
