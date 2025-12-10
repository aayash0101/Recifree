const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth'); 

/* GET user profile */
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* UPDATE user profile */
router.put('/profile', auth, async (req, res) => {
    try {
        const { username, email, bio, tags } = req.body;
        
        // Validate tags length
        if (tags && tags.length > 5) {
            return res.status(400).json({ message: 'Cannot have more than 5 tags' });
        }
        
        // Validate bio length
        if (bio && bio.length > 200) {
            return res.status(400).json({ message: 'Bio cannot exceed 200 characters' });
        }
        
        // Check if username or email is being changed to an existing one
        if (username || email) {
            const existingUser = await User.findOne({
                _id: { $ne: req.user.id },
                $or: [
                    ...(username ? [{ username }] : []),
                    ...(email ? [{ email }] : [])
                ]
            });
            
            if (existingUser) {
                return res.status(400).json({ 
                    message: 'Username or email already in use' 
                });
            }
        }
        
        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                ...(username && { username }),
                ...(email && { email }),
                ...(bio !== undefined && { bio }),
                ...(tags !== undefined && { tags })
            },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                bio: updatedUser.bio,
                tags: updatedUser.tags
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* GET user by ID (public profile) */
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;