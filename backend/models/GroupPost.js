const mongoose = require("mongoose");

const groupPostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("GroupPost", groupPostSchema);
