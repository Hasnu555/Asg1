const Message = require('../models/chatModel');


module.exports.createChat = async (req, res)=>
  {
    const newChat = new ChatModel(
      {
        members: [req.body.senderId, req.body.recieverId]
      }
    )
    try {
      const result = await newChat.save();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  }

module.exports.userChats = async (req, res)=>{
  try {
    
    const chat = await ChatMode.find({
      memebers: {$in: [req.params.userId]}
    })

    res.status(200).json(chat)


  } catch (error) {
    res.status(500).json(error);
  }

}


module.exports.findChat = async(req, res)=>{

  try {
    const chat = await ChatModel.findOne(
      {
        members: {$all: [req.params.firstId, req.params.secondID]}
      }
    )
    res.status(200).json(chat)
  } catch (error) {
    res.status(500).json(error)
  }
}
