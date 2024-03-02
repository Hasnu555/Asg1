const jwt = require('jsonwebtoken');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');

module.exports.createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const postId = req.params.postId;
        const userId = req.user.id;

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Create the comment
        const comment = await Comment.create({ content, author: userId, post: postId });
        
        // Add the comment to the post's comments array
        post.comments.push(comment._id);
        await post.save();

        res.status(201).json({ message: "Comment created successfully", comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.getCommentsByPostId = async (req, res) => {
    try {
        const postId = req.params.postId;

        // Find the post and populate its comments
        const post = await Post.findById(postId).populate('comments');
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ comments: post.comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.updateComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const { content } = req.body;

        // Find the comment by ID
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if the current user is the author of the comment
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to update this comment" });
        }

        // Update the comment content
        comment.content = content;
        await comment.save();

        res.status(200).json({ message: "Comment updated successfully", comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;

        // Find the comment by ID
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if the current user is the author of the comment
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }

        // Remove the comment from the post's comments array
        const postId = comment.post;
        const post = await Post.findById(postId);
        post.comments = post.comments.filter(comment => comment.toString() !== commentId);
        await post.save();

        // Delete the comment
        await comment.delete();

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
