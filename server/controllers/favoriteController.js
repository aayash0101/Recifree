const User = require('../models/User');

exports.getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('savedRecipes');
        if (!user) return res.status(404).json({ message : 'User not found'});
        res.json(user.savedRecipes);
    } catch (err) {
        res.status(500).json( { message: 'Server error'});
    }
};

exports.addFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found'});
        const recipeId = req.body.recipeId;
        if (!user.savedRecipes.includes(recipeId)){
            user.savedRecipes.push(recipeId);
            await user.save();
        }
        res.json({ message: 'Recipe added to favorites'});
    } catch (err) {
        res.status(500).json({ message: 'Server error'});
    }
};

exports.removeFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found'});
        const recipeId = req.body.recipeId;
        user.savedRecipes = user.savedRecipes.filter(
            id => id.toString() !== recipeId
        );
        await user.save();
        res.json({ message: 'Recipe removed from favorites'});
    } catch (err) {
        res.status(500).json({ message: 'Server error'});
    }
};