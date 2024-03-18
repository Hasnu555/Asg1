const User = require('../models/User');

const friendController = {
    sendFriendRequest: async (req, res) => {
        const senderId = req.user.id;
        const recipientId = req.params.id;

        try {
            // Check if recipient exists
            const recipient = await User.findById(recipientId);
            if (!recipient) {
                return res.status(404).json({ error: 'Recipient user not found' });
            }

            // Check if the recipient is already a friend or has a pending friend request
            const sender = await User.findById(senderId);
            if (sender.friends.includes(recipientId) || sender.pendingFriendRequests.includes(recipientId)) {
                return res.status(400).json({ error: 'Friend request already sent or recipient is already a friend' });
            }

            // Add sender to recipient's pending friend requests
            await User.findByIdAndUpdate(recipientId, { $push: { pendingFriendRequests: senderId } });

            res.status(200).json({ message: 'Friend request sent successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    acceptFriendRequest: async (req, res) => {
        const userId = req.user.id;
        const friendId = req.params.id;

        try {
            // Find the user accepting the friend request
            const user = await User.findById(userId);
            // Find the user who sent the friend request
            const friend = await User.findById(friendId);

            // Check if friend request exists
            if (!user.pendingFriendRequests.includes(friendId)) {
                return res.status(400).json({ error: 'Friend request does not exist' });
            }

            // Add friend to user's friends list
            await User.findByIdAndUpdate(userId, { $push: { friends: friendId } });
            // Remove friend request from pending requests
            await User.findByIdAndUpdate(userId, { $pull: { pendingFriendRequests: friendId } });

            // Add user to friend's friends list
            await User.findByIdAndUpdate(friendId, { $push: { friends: userId } });

            res.status(200).json({ message: 'Friend request accepted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },


    rejectFriendRequest: async (req, res) => {
        const userId = req.user.id;
        const friendId = req.params.id;

        try {
            const user = await User.findById(userId);

            // Remove friend request from pending requests
            user.pendingFriendRequests = user.pendingFriendRequests.filter(request => request.toString() !== friendId);
            await user.save();

            res.status(200).json({ message: 'Friend request rejected successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getFriendRequests: async (req, res) => {
        const userId = req.user.id;

        try {
            const user = await User.findById(userId).populate('pendingFriendRequests', 'name email');
            
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json({ friendRequests: user.pendingFriendRequests });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};

module.exports = friendController;
