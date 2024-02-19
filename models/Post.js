const mongoose = require('mongoose');


// Define the Post schema
const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    images: {
        type: String, // Array of strings (URLs)
        required: false // Assuming images are optional
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//Fire a function before the doc is saved to the database
postSchema.pre('save', async function(next){
    console.log('Post about to be saved', this);
    next();
});

//Fire a function after the doc is saved to the database
postSchema.post('save', function(doc, next){
    console.log('Post has been saved', doc);
    next();
});

// Create the Post model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
