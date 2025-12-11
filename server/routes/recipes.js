const express = require('express');
const router = express.Router();
const { getAllRecipes, getRecipe, seedRecipes, createRecipe, deleteRecipe, getUserRecipes, addReview } = require('../controllers/recipeController');

router.get('/', getAllRecipes);
router.get('/seed', seedRecipes);
router.get('/user/:userId', getUserRecipes);  // MUST COME BEFORE /:id
router.get('/:id', getRecipe);
router.post('/', createRecipe);
router.delete('/:id', deleteRecipe);
router.post('/:id/reviews', addReview);
module.exports = router;