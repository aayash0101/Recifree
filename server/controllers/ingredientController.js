const IngredientList = require('../models/IngredientList');

exports.getList = async (req, res) => {
    try {
        const list = await IngredientList.findOne({ userId: req.params.userId});
        res.json(list || { items: [] } );
    } catch(err) {
        res.status(500).json({ message: 'Server error'});
    }
};

exports.addItem = async (req, res) => {
    try {
        let list = await IngredientList.findOne({ userId: req.params.userId});
        if (!list) {
            list = new IngredientList({ userId: req.params.userId, items: [] });
        }
        list.items.push({ name: req.body.name, done: false });
        await list.save();
        res.json(list);
    } catch (err) {
        res.status(500).json({ message: 'Server error'});
    }
};

exports.updateItem = async (req, res) => {
  try {
    const { itemIndex, done } = req.body;
    let list = await IngredientList.findOne({ userId: req.params.userId });
    if (!list || list.items.length <= itemIndex) return res.status(404).json({ msg: 'Item not found' });
    list.items[itemIndex].done = done;
    await list.save();
    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const { itemIndex } = req.body;
    let list = await IngredientList.findOne({ userId: req.params.userId });
    if (!list || list.items.length <= itemIndex) return res.status(404).json({ msg: 'Item not found' });
    list.items.splice(itemIndex, 1);
    await list.save();
    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};