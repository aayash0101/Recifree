const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favoriteController');

router.get('/:userId', getFavorites);
router.post('/:userId', addFavorite);
router.delete('/:userId', removeFavorite);

module.exports = router;
