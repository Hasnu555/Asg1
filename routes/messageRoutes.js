// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authmiddleware');
const messageController = require('../controller/messageController');

router.post('/send-message', requireAuth, async (req, res) => {
    const { recipientId, content } = req.body;
    const senderId = req.user.id;
    const result = await messageController.sendMessage(senderId, recipientId, content);
    if (result.success) {
        res.status(200).json({ message: result.message });
    } else {
        res.status(500).json({ message: result.message });
    }
});

router.get('/conversations', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const result = await messageController.getConversationIdsForUser(userId);
    if (result.success) {
        res.status(200).json({ conversations: result.conversations });
    } else {
        res.status(500).json({ message: result.message });
    }
});

router.get('/messages/:conversationId', requireAuth, async (req, res) => {
    const conversationId = req.params.conversationId;
    const result = await messageController.getMessagesForConversation(conversationId);
    if (result.success) {
        res.status(200).json({ messages: result.messages });
    } else {
        res.status(500).json({ message: result.message });
    }
});

module.exports = router;
