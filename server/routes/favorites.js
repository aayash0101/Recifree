// server/routes/favorites.js
const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favoriteController');

router.get('/api/:userId', getFavorites);
router.post('/api/:userId', addFavorite);
router.delete('/api/:userId', removeFavorite);

module.exports = router;
