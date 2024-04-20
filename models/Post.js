const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    shares: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    imagePaths: [{ // Renamed for clarity, assuming multiple images can be uploaded
        type: String
    }]
});

// Middleware hooks
postSchema.pre('save', async function(next) {
    console.log('Post about to be saved', this);
    next();
});

postSchema.post('save', function(doc, next) {
    console.log('Post has been saved', doc);
    next();
});

// Create the Post model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
