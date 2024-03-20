const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');
const multer = require('multer');

// Controller function to handle creating a new post
module.exports.createPost = async (req, res) => {
    const token = req.cookies.jwt;
    console.log('Token', token);
    //added an additional add image function
    //this will be optional
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'public/uploads/'); 
        },
        filename: function(req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });

    const upload = multer({ storage: storage });
    if (token) {
        jwt.verify(token, 'hasan secret', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = {
                    id: user.id,
                    email: user.email,
                    role: user.role // assuming user schema has a 'role' field
                };
                try 
                {
                    // Assuming you have a User model for retrieving the current user
                    const author = decodedToken.id; // Retrieve the current user from the request
                    console.log('User Current', decodedToken.id);
                    const { content } = req.body;
                    console.log( 'Content', content, ' Author', author);
                    const newPost = await Post.create({ content, author });
                    
                    console.log('New Post', newPost);
                    res.redirect('/social'); // Redirect back to the home page after creating the post
                } catch (error) {
                    res.status(400).json({ message: error.message });
                }
                // next();
            }
        });
    }
    else {
        res.locals.user = null;
        // next();
    }

};


module.exports.showPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author');
        res.render('social', { posts }); // Pass the retrieved posts to the view template
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
};


module.exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;
        
        // Find the post by ID
        const post = await Post.findById(postId);
        
        // Check if the post exists
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        
        // Check if the current user is the author of the post
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to update this post" });
        }
        
        // Update the post content
        const updatedPost = await Post.findByIdAndUpdate(postId, { content }, { new: true });
        
        res.status(200).json({ message: "Post updated successfully", post: updatedPost });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        
        // Find the post by ID
        const post = await Post.findById(postId);
        
        // Check if the post exists
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        
        // Check if the current user is the author of the post
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }
        
        // Delete the post
        await Post.findByIdAndDelete(postId);
        
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Controller function to add a like to a post
module.exports.likePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id; // Assuming you have authentication middleware

        // Find the post by ID
        const post = await Post.findById(postId);

        // Check if the post exists
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the user has already liked the post
        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: "You have already liked this post" });
        }

        // Add the user's ID to the likes array
        post.likes.push(userId);

        // Save the updated post
        await post.save();

        res.status(200).json({ message: "Post liked successfully", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function to remove a like from a post
module.exports.unlikePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id; // Assuming you have authentication middleware

        // Find the post by ID
        const post = await Post.findById(postId);

        // Check if the post exists
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the user has liked the post
        if (!post.likes.includes(userId)) {
            return res.status(400).json({ message: "You have not liked this post" });
        }

        // Remove the user's ID from the likes array
        post.likes = post.likes.filter(id => id !== userId);

        // Save the updated post
        await post.save();

        res.status(200).json({ message: "Post unliked successfully", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
