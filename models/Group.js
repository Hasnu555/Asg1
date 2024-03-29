const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''  
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    admin: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    //adding the refernce to the post from here
    posts: [{  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
});

module.exports = mongoose.model('Group', groupSchema);
