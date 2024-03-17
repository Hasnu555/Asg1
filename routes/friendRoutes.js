const { Router } = require('express');
const { requireAuth } = require('../middleware/authmiddleware');
const friendController = require('../controller/friendController');

const router = Router();
// Send friend request route
router.post('/send-friend-request/:id', requireAuth, friendController.sendFriendRequest);

// Accept friend request route
router.post('/accept-friend-request/:id', requireAuth, friendController.acceptFriendRequest);

// Reject friend request route
router.post('/reject-friend-request/:id', requireAuth, friendController.rejectFriendRequest);

// Get all friend requests route
router.get('/friend-requests', requireAuth, friendController.getFriendRequests);


module.exports = router;
