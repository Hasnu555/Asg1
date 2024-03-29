const { Router } = require('express');
const { requireAuth } = require('../middleware/authmiddleware');
const groupController = require('../controller/groupController'); 


const router = Router();

// Route to create a new group
router.post('/create', requireAuth, groupController.createGroup);

// Route to add a user to a group
router.post('/group/:groupId/addUser/:userId', requireAuth, groupController.addUserToGroup);

// Route to list all groups for the logged-in user
router.get('/myGroups', requireAuth, groupController.listGroups);

// Route for updating group details
router.put('/group/:groupId', requireAuth, groupController.updateGroup);

// Route for deleting a group
router.delete('/group/:groupId', requireAuth, groupController.deleteGroup);

module.exports = router;
