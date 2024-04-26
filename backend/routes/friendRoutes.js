const { Router } = require('express');
const { requireAuth } = require('../middleware/authmiddleware');
const friendController = require('../controller/friendController');

const router = Router();

router.get('/suggested-friends', requireAuth, friendController.getSuggestedFriends);

router.post('/send-friend-request/:id', requireAuth, friendController.sendFriendRequest);

router.post('/accept-friend-request/:id', requireAuth, friendController.acceptFriendRequest);

router.post('/reject-friend-request/:id', requireAuth, friendController.rejectFriendRequest);

router.get('/friend-requests', requireAuth, friendController.getFriendRequests);


module.exports = router;
