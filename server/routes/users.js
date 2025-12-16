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

/* SEARCH users */
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.trim() === '') {
            return res.json([]);
        }
        
        const users = await User.find({
            $or: [
                { username: { $regex: q, $options: 'i' } },
                { bio: { $regex: q, $options: 'i' } },
                { tags: { $in: [new RegExp(q, 'i')] } }
            ]
        })
        .select('-password -email')
        .limit(20);
        
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* FOLLOW a user */
router.post('/:id/follow', auth, async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);
        
        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (req.params.id === req.user.id) {
            return res.status(400).json({ message: 'Cannot follow yourself' });
        }
        
        // Check if already following
        if (currentUser.following.includes(req.params.id)) {
            return res.status(400).json({ message: 'Already following this user' });
        }
        
        // Add to following and followers
        currentUser.following.push(req.params.id);
        userToFollow.followers.push(req.user.id);
        
        await currentUser.save();
        await userToFollow.save();
        
        res.json({ message: 'Successfully followed user' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* UNFOLLOW a user */
router.delete('/:id/follow', auth, async (req, res) => {
    try {
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);
        
        if (!userToUnfollow) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Remove from following and followers
        currentUser.following = currentUser.following.filter(
            id => id.toString() !== req.params.id
        );
        userToUnfollow.followers = userToUnfollow.followers.filter(
            id => id.toString() !== req.user.id
        );
        
        await currentUser.save();
        await userToUnfollow.save();
        
        res.json({ message: 'Successfully unfollowed user' });
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