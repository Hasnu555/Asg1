const { Router } = require('express');
const { requireAuth, requireAdmin } = require('../middleware/authmiddleware');

const router = Router();

const postController = require('../controller/postController');

// Routes for creating, retrieving, updating, and deleting posts
router.get('/social', requireAuth, postController.showPosts);
router.post('/social', requireAuth, postController.createPost);
router.put('/social/:id', requireAuth, postController.updatePost);
router.delete('/social/:id', requireAuth, postController.deletePost);

module.exports = router;
