const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');

// Controller function to handle creating a new post
module.exports.createPost = async (req, res) => {
    const token = req.cookies.jwt;
    console.log('Token', token);
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
        
        const updatedPost = await Post.findByIdAndUpdate(postId, { content }, { new: true });
        
        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        
        res.status(200).json({ message: "Post updated successfully", post: updatedPost, postId : postId });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        
        const deletedPost = await Post.findByIdAndDelete(postId);
        
        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

