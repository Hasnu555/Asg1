const express = require('express');
const { reportUser, blockUser } = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware'); 

const router = express.Router();

router.post('/report', requireAuth, reportUser);
router.post('/block/:userId', requireAuth, blockUser);

module.exports = router;
