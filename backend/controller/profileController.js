const User = require('../models/User');
const Post = require('../models/Post');


const multer = require('multer');

// Set up multer storage for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save to uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Append the date and the original file extension
    }
});

// Initialize multer upload middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Set file size limit to 10MB or adjust as needed
});


const profileController = {
    getCurrentUser: async (req, res) => {
        try {
            // Get the current user's ID from the request
            const userId = req.user.id;

            // Find the current user by ID
            const currentUser = await User.findById(userId);

            // Return the current user's data as JSON response
            res.status(200).json(currentUser);
        } catch (error) {
            // Handle errors
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
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
            const { name, age,email } = req.body;
    
            if (!name || !age) {
                return res.status(400).json({ error: "Name and age are required" });
            }
    
            // Check if there's an uploaded image
            let imageUrl = '';
            if (req.file) {
                imageUrl = req.file.path; // Path where the image is stored
            }
    
            // Update user information, including the image URL if available
            const updatedProfile = await User.findByIdAndUpdate(
                userId,
                { name, age, email, imageUrl }, // Include imageUrl in the update
                { new: true }
            );
    
            res.json(updatedProfile);
            console.log('Profile updated successfully');
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};



module.exports = profileController;
