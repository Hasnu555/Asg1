const express = require('express');
const { reportUser, blockUser } = require('../controller/userController');
const User = require('../models/User');

const { requireAuth } = require('../middleware/authmiddleware');

const router = express.Router();

router.post('/report', requireAuth, reportUser);
router.post('/block/:userId', requireAuth, blockUser);

router.get('/current-user', async (req, res) => {
    console.log("Pohanch gaye idhr");
    console.log(req.user);
    try {
      // Fetch the current user from the database using the authenticated user's ID


      const user = await User.findById(req.user.id);
      if (user) {
        res.json({ ok: true, user });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

module.exports = router;
