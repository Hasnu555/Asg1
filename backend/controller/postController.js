const multer = require('multer');

// import cloudinary from "cloudinary";
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Define the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Define the filename for uploaded files
    },
});

// Increase the file size limit (default is 1MB)
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Increase to 10MB or adjust as needed
});



module.exports.createPost = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'hasan secret');

        let user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { content } = req.body;
        const imageUrl = req.file ? req.file.path : '';  // Path where the image is stored

        const newPost = await Post.create({
            content,
            author: decodedToken.id,
            imageUrl  // Save image path to the database
        });
        console.log("Post created ", newPost);

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }

};




module.exports.showPosts = async (req, res) => {
    console.log("Show Posts");
    try {
        const token = req.headers.authorization.split(' ')[1];
        
        jwt.verify(token, 'hasan secret', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.status(401).json({ message: 'Unauthorized' }); // Return unauthorized status if token verification fails
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                const userFriends = user.friends; // Assuming the user.friends contains the list of friend IDs
                        // In your post fetching logic
                const posts = await Post.find({ author: { $in: userFriends } })
                .populate('author')
                .populate({
                    path: 'comments',
                    populate: { 
                        path: 'author',
                        // select: 'name image' // Assuming the user schema has a name and image field
                        }
                });

                // Prepare the response data
                // const responseData = posts.map(post => ({
                //     postId: post._id,
                //     content: post.content,
                //     picture: post.picture // Assuming picture is a property of the Post model
                // }));

                res.status(200).json(posts); // Return the response as JSON
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Return internal server error if any occurs
    }
};

module.exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;
        
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to update this post" });
        }
        
        const updatedPost = await Post.findByIdAndUpdate(postId, { content }, { new: true });
        
        res.status(200).json({ message: "Post updated successfully", post: updatedPost });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }
        
        await Post.findByIdAndDelete(postId);
        
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports.likePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id; 

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: "You have already liked this post" });
        }

        post.likes.push(userId);

        await post.save();

        res.status(200).json({ message: "Post liked successfully", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.unlikePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (!post.likes.includes(userId)) {
            return res.status(400).json({ message: "You have not liked this post" });
        }

        // Remove the user's id from the likes array
        post.likes = post.likes.filter(id => id.toString() !== userId);

        await post.save();

        res.status(200).json({ message: "Post unliked successfully", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


