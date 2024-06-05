const Group = require("../models/Group");
const GroupPost = require("../models/GroupPost");
const User = require("../models/User");

const groupController = {
  createGroup: async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.id;
    const admin = userId;
    const image = req.file ? req.file.path : "";

    try {
      const newGroup = new Group({ name, description, admin, image });
      await newGroup.save();
      res
        .status(201)
        .json({ message: "Group created successfully", group: newGroup });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  addUserToGroup: async (req, res) => {
    const { groupId, userId } = req.params;
    try {
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      if (!group.members.includes(userId)) {
        group.members.push(userId);
        await group.save();
        res
          .status(200)
          .json({ message: "User added to the group successfully", group });
      } else {
        res.status(400).json({ message: "User already in the group" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  listGroups: async (req, res) => {
    try {
      const userId = req.user.id;
      const groups = await Group.find({
        $or: [{ members: userId }, { admin: userId }],
      });
      res.status(200).json(groups);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateGroup: async (req, res) => {
    const { groupId } = req.params;
    const { name, description } = req.body;
    const image = req.file ? req.file.path : "";
    try {
      const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        { name, description, image },
        { new: true }
      );
      res
        .status(200)
        .json({ message: "Group updated successfully", group: updatedGroup });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  joinGroup: async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.id;
    try {
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      if (!group.members.includes(userId)) {
        group.members.push(userId);
        await group.save();
        res
          .status(200)
          .json({ message: "Joined the group successfully", group });
      } else {
        res.status(400).json({ message: "Already a member of the group" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  leaveGroup: async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.id;
    try {
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      if (group.members.includes(userId)) {
        group.members = group.members.filter(
          (member) => member.toString() !== userId
        );
        await group.save();
        res.status(200).json({ message: "Left the group successfully", group });
      } else {
        res.status(400).json({ message: "Not a member of the group" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  createGroupPost: async (req, res) => {
    const { groupId } = req.params;
    const { content } = req.body;
    const image = req.file ? req.file.path : "";
    const userId = req.user.id;

    try {
      const groupPost = new GroupPost({
        content,
        image,
        group: groupId,
        postedBy: userId,
      });
      await groupPost.save();
      res
        .status(201)
        .json({ message: "Group post created successfully", post: groupPost });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  likeGroupPost: async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    try {
      const post = await GroupPost.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (!post.likes.includes(userId)) {
        post.likes.push(userId);
        await post.save();
        res.status(200).json({ message: "Post liked successfully", post });
      } else {
        res.status(400).json({ message: "Already liked the post" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  dislikeGroupPost: async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    try {
      const post = await GroupPost.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (!post.dislikes.includes(userId)) {
        post.dislikes.push(userId);
        await post.save();
        res.status(200).json({ message: "Post disliked successfully", post });
      } else {
        res.status(400).json({ message: "Already disliked the post" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  unlikeGroupPost: async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    try {
      const post = await GroupPost.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      post.likes = post.likes.filter((like) => like.toString() !== userId);
      await post.save();
      res.status(200).json({ message: "Post unliked successfully", post });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getGroupDetails: async (req, res) => {
    const { groupId } = req.params;
    try {
      const group = await Group.findById(groupId)
        .populate("admin", "name")
        .populate("members", "name");
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      res.status(200).json(group);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getGroupPosts: async (req, res) => {
    const { groupId } = req.params;
    try {
      const posts = await GroupPost.find({ group: groupId }).populate(
        "postedBy",
        "name"
      );
      res.status(200).json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = groupController;
