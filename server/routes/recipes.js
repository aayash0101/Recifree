const express = require('express');
const router = express.Router();
const { getAllRecipes, getRecipe, seedRecipes } = require('../controllers/recipeController');

router.get('/', getAllRecipes);
router.get('/seed', seedRecipes);
router.get('/:id', getRecipe);

module.exports = router;