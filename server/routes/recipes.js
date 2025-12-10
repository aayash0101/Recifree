const express = require('express');
const router = express.Router();
const { getAllRecipes, getRecipe, seedRecipes, createRecipe } = require('../controllers/recipeController');

router.get('/', getAllRecipes);
router.get('/seed', seedRecipes);
router.get('/:id', getRecipe);
router.post('/', createRecipe);

module.exports = router;