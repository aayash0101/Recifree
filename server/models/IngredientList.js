const mongoose = require('mongoose');

const IngredientListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        name: {type: String, required:true},
        done: {type: Boolean, default:false},
    }],
});

module.exports = mongoose.model('IngredientList', IngredientListSchema);