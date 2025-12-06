const express = require ('express');
const router = express.Router();
const { getList, addItem, updateItem, removeItem } = require('../controllers/ingredientController');

router.get('/:userId', getList);
router.post('/:userId', addItem);
router.put('/:userId', updateItem);
router.delete('/:userId', removeItem);

module.exports = router;