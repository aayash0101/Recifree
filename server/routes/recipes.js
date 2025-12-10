const express = require('express');
const router = express.Router();
const { getAllRecipes, getRecipe, seedRecipes, createRecipe, deleteRecipe, getUserRecipes } = require('../controllers/recipeController');

router.get('/', getAllRecipes);
router.get('/seed', seedRecipes);
router.get('/:id', getRecipe);
router.post('/', createRecipe);
router.delete('/:id', deleteRecipe);
router.get('/user/:userId', getUserRecipes);

module.exports = router;