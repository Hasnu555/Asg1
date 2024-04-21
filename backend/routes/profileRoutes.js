const { Router } = require('express');
const { requireAuth, requireAdmin } = require('../middleware/authmiddleware');
const profileController = require('../controller/profileController');

const router = Router();

router.get('/:userId/posts', requireAuth, profileController.getUserPosts);

router.get('/selfProfile', requireAuth, profileController.getCurrentUserPosts);

router.put('/selfProfile', requireAuth, profileController.updateSelfProfile);

router.put('/selfProfile/:id', requireAuth, profileController.update_profile);

module.exports = router;
