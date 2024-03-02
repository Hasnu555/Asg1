const User = require('../models/User');

const profileController = {
    update_profile: async (req, res) => {
        try {
            const userId = req.user.id;
            const { name,age } = req.body; // Assuming 'name' and 'age' are fields that can be updated

            // Check if the name and age are provided in the request body
            if (!name || !age) {
                return res.status(400).json({ error: "Name and bio are required" });
            }

            // Update the user's profile
            const updatedProfile = await User.findByIdAndUpdate(userId, { name, age }, { new: true });

            // Return the updated profile
            res.json(updatedProfile);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = profileController;
