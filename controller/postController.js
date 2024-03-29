const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');
const Group = require('../models/Group');

const multer = require('multer');
module.exports.createPost = async (req, res) => {
    const token = req.cookies.jwt;
    console.log('Token', token);

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
                    role: user.role
                };
                try {
                    const author = decodedToken.id;
                    console.log('User Current', decodedToken.id);
                    const { content } = req.body;
                    console.log('Content', content, ' Author', author);
                    const newPost = await Post.create({ content, author, visibleTo: [author] }); // Only visible to the author initially

                    console.log('New Post', newPost);
                    res.redirect('/social');
                } catch (error) {
                    res.status(400).json({ message: error.message });
                }
            }
        });
    } else {
        res.locals.user = null;
        // next();
    }
};
module.exports.showPosts = async (req, res) => {
    try {
        const token = req.cookies.jwt;
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
                    role: user.role
                };
                
                // Fetch posts created by the user and their friends
                const userFriends = user.friends;
                const userPosts = await Post.find({ author: user.id }).populate('author');
                const friendPosts = await Post.find({ author: { $in: userFriends } }).populate('author');

                // Combine user's posts and friend's posts
                const posts = [...userPosts, ...friendPosts];

                res.render('social', { posts });
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
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

        post.likes = post.likes.filter(id => id !== userId);

        await post.save();

        res.status(200).json({ message: "Post unliked successfully", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Function to create a post in a group
module.exports.createPostInGroup = async (req, res) => {
    const token = req.cookies.jwt;

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
                    role: user.role
                };
                try {
                    const author = decodedToken.id;
                    const { groupId, content } = req.body;
                    
                    // Check if user is a member of the group
                    const group = await Group.findById(groupId);
                    if (!group) {
                        return res.status(404).json({ message: 'Group not found' });
                    }
                    if (!group.members.includes(author)) {
                        return res.status(403).json({ message: 'You are not a member of this group' });
                    }
                    
                    // Create a new post within the group
                    const newPost = await Post.create({ content, author, group: groupId });
                    
                    res.status(201).json({ message: 'Post created in the group successfully', post: newPost });
                } catch (error) {
                    res.status(400).json({ message: error.message });
                }
            }
        });
    } else {
        res.locals.user = null;
        // next();
    }
};

// Function to get posts in a group
module.exports.getPostsInGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        
        // Fetch posts belonging to the specified group
        const posts = await Post.find({ group: groupId });
        
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
module.exports.deletePostInGroup = async (req, res) => {
    try {
        const { postId } = req.params;
        const token = req.cookies.jwt;

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
                        role: user.role
                    };
                    try {
                        // Check if the user has permission to delete the post
                        const post = await Post.findById(postId);
                        if (!post) {
                            return res.status(404).json({ message: 'Post not found' });
                        }

                        // Check if the user is the author of the post or an admin of the group
                        const group = await Group.findById(post.group);
                        if (!group) {
                            return res.status(404).json({ message: 'Group not found' });
                        }
                        if (group.admin.toString() !== user.id && post.author.toString() !== user.id) {
                            return res.status(403).json({ message: 'You are not authorized to delete this post' });
                        }

                        // Delete the post
                        await Post.findByIdAndDelete(postId);

                        res.status(200).json({ message: 'Post deleted successfully' });
                    } catch (error) {
                        res.status(400).json({ message: error.message });
                    }
                }
            });
        } else {
            res.locals.user = null;
            // next();
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
// Function to like a post in a group
module.exports.likePostInGroup = async (req, res) => {
    try {
        const { postId } = req.params;
        const token = req.cookies.jwt;

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
                        role: user.role
                    };
                    try {
                        // Check if the post exists
                        const post = await Post.findById(postId);
                        if (!post) {
                            return res.status(404).json({ message: 'Post not found' });
                        }

                        // Check if the user has already liked the post
                        if (post.likes.includes(user.id)) {
                            return res.status(400).json({ message: 'You have already liked this post' });
                        }

                        // Add user's id to the likes array
                        post.likes.push(user.id);
                        await post.save();

                        res.status(200).json({ message: 'Post liked successfully', post });
                    } catch (error) {
                        res.status(400).json({ message: error.message });
                    }
                }
            });
        } else {
            res.locals.user = null;
            // next();
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to unlike a post in a group
module.exports.unlikePostInGroup = async (req, res) => {
    try {
        const { postId } = req.params;
        const token = req.cookies.jwt;

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
                        role: user.role
                    };
                    try {
                        // Check if the post exists
                        const post = await Post.findById(postId);
                        if (!post) {
                            return res.status(404).json({ message: 'Post not found' });
                        }

                        // Check if the user has liked the post
                        if (!post.likes.includes(user.id)) {
                            return res.status(400).json({ message: 'You have not liked this post' });
                        }

                        // Remove user's id from the likes array
                        post.likes = post.likes.filter(userId => userId !== user.id);
                        await post.save();

                        res.status(200).json({ message: 'Post unliked successfully', post });
                    } catch (error) {
                        res.status(400).json({ message: error.message });
                    }
                }
            });
        } else {
            res.locals.user = null;
            // next();
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
// Function to update a post in a group
module.exports.updatePostInGroup = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const token = req.cookies.jwt;

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
                        role: user.role
                    };
                    try {
                        // Check if the post exists
                        const post = await Post.findById(postId);
                        if (!post) {
                            return res.status(404).json({ message: 'Post not found' });
                        }

                        // Check if the user is the author of the post or an admin of the group
                        const group = await Group.findById(post.group);
                        if (!group) {
                            return res.status(404).json({ message: 'Group not found' });
                        }
                        if (group.admin.toString() !== user.id && post.author.toString() !== user.id) {
                            return res.status(403).json({ message: 'You are not authorized to update this post' });
                        }

                        // Update the content of the post
                        post.content = content;
                        await post.save();

                        res.status(200).json({ message: 'Post updated successfully', post });
                    } catch (error) {
                        res.status(400).json({ message: error.message });
                    }
                }
            });
        } else {
            res.locals.user = null;
            // next();
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to show posts in a group
module.exports.showPostsInGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const token = req.cookies.jwt;

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
                        role: user.role
                    };
                    try {
                        // Check if the user is a member of the group
                        const group = await Group.findById(groupId);
                        if (!group) {
                            return res.status(404).json({ message: 'Group not found' });
                        }
                        if (!group.members.includes(user.id)) {
                            return res.status(403).json({ message: 'You are not a member of this group' });
                        }

                        // Fetch posts belonging to the specified group
                        const posts = await Post.find({ group: groupId });
                        res.status(200).json(posts);
                    } catch (error) {
                        res.status(400).json({ message: error.message });
                    }
                }
            });
        } else {
            res.locals.user = null;
            // next();
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
