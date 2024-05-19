const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');
const { createChat, userChats, findChat } = require('../controller/messageController.js');


router.post("/",createChat)
router.get(":/userId",userChats)
router.get("/find/:/firstId/:secondId",findChat)



// // Get all messages
// router.get('/', async (req, res) => {
//   try {
//     const messages = await Message.find();
//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Create a new message
// router.post('/', async (req, res) => {
//   const message = new Message({
//     content: req.body.content,
//     sender: req.body.sender
//   });
//   try {
//     const newMessage = await message.save();
//     res.status(201).json(newMessage);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

module.exports = router;
