const Group = require('../models/Group');
const User = require('../models/User');

const groupController = {
    createGroup: async (req, res) => {
        const { name } = req.body;
        const userId = req.user.id;
        const admin = userId;
    
        try {
            // also make the admin as a member
            const newGroup = new Group({ name, admin, members: [admin] });
            await newGroup.save();
            
            res.status(201).json({ message: "Group created successfully", group: newGroup });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    ,
    addUserToGroup: async (req, res) => {
        const { groupId, userId } = req.params;
        try {
            const group = await Group.findById(groupId);
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }
            if (!group.members.map(member => member.toString()).includes(userId)) { // Convert to strings before comparing
                group.members.push(userId);
                await group.save();
                res.status(200).json({ message: "User added to the group successfully", group });
            } else {
                res.status(400).json({ message: "User already in the group" });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    
    updateGroup: async (req, res) => {
        const { groupId } = req.params;
        const { newName, newDescription } = req.body;
        
        try {
            const group = await Group.findById(groupId);
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }
            
            if (newName !== undefined) {
                group.name = newName;
            }
            
            if (newDescription !== undefined) {
                group.description = newDescription;
            }
            
            await group.save();
            
            res.status(200).json({ message: 'Group updated successfully', group });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
       

    listGroups: async (req, res) => {
        try {
            const groups = await Group.find({ members: { $in: [req.user.id] } });
            res.status(200).json(groups);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    ,
    deleteGroup: async (req, res) => {
        const { groupId } = req.params;

        try {
            // Find the group by ID
            const group = await Group.findById(groupId);
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }

            // Check if the current user is the admin of the group
            const userId = req.user.id;
            if (group.admin.toString() !== userId) {
                return res.status(403).json({ message: 'You are not authorized to delete this group' });
            }

            // Remove the group from the database
            await group.remove();

            res.status(200).json({ message: 'Group deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};


module.exports = groupController;
