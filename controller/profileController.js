const User = require('../models/User');
const Post = require('../models/Post');

const profileController = {
    update_profile: async (req, res) => {
        try {
            const userId = req.user.id;
            const { name,age } = req.body;

            if (!name || !age) {
                return res.status(400).json({ error: "Name and age are required" });
            }

            const updatedProfile = await User.findByIdAndUpdate(userId, { name, age }, { new: true });

            res.json(updatedProfile);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    getUserPosts : async (req, res) => {
        try {
            const userId = req.params.userId;
    
            // Query the database for posts authored by the specified user
            const posts = await Post.find({ author: userId });
    
            // Return the posts as JSON response
            res.status(200).json(posts);
        } catch (error) {
            // Handle errors
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    getCurrentUserPosts : async (req, res) => {
        try {
            const userId = req.user.id;
    
            // Query the database for posts authored by the current user
            const posts = await Post.find({ author: userId });
    
            // Return the posts as JSON response
            res.status(200).json(posts);
        } catch (error) {
            // Handle errors
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    updateSelfProfile : async (req, res) => {
        try {
            const userId = req.user.id;
            const { name, age } = req.body;
    
            if (!name || !age) {
                return res.status(400).json({ error: "Name and age are required" });
            }
    
            const updatedProfile = await User.findByIdAndUpdate(userId, { name, age }, { new: true });
    
            res.json(updatedProfile);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};



module.exports = profileController;
