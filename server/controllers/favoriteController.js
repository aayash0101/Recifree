const mongoose = require('mongoose');
const User = require('../models/User');

exports.getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('savedRecipes');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.savedRecipes);
    } catch (err) {
        console.error("GET FAVORITES ERROR:", err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.addFavorite = async (req, res) => {
    try {
        console.log("REQUEST BODY:", req.body);
        console.log("PARAMS:", req.params);

        const user = await User.findById(req.params.userId);
        console.log("FOUND USER:", user);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const recipeId = req.body.recipeId;
        const recipeObjectId = new mongoose.Types.ObjectId(recipeId); // ✅ Use 'new'

        // Only add if not already present
        if (!user.savedRecipes.includes(recipeObjectId)) {
            user.savedRecipes.push(recipeObjectId);
            await user.save();
        }

        res.json({ message: 'Recipe added to favorites' });

    } catch (err) {
        console.error("ADD FAVORITE ERROR:", err);
        res.status(500).json({ message: 'Server error', error: err.message, stack: err.stack });
    }
};


exports.removeFavorite = async (req, res) => {
    try {
        console.log("REMOVE FAVORITE REQUEST:", req.params.userId, req.body.recipeId);

        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Convert recipeId to ObjectId correctly
        const recipeObjectId = new mongoose.Types.ObjectId(req.body.recipeId);

        user.savedRecipes = user.savedRecipes.filter(
            id => id.toString() !== recipeObjectId.toString()
        );

        await user.save();
        res.json({ message: 'Recipe removed from favorites' });
    } catch (err) {
        console.error("REMOVE FAVORITE ERROR:", err);
        res.status(500).json({ message: 'Server error' });
    }
};



