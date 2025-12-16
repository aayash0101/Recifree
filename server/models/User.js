const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: 'Home Chef and Food Enthusiast | Sharing My Favorite Recipe and Cooking Tips | Making Cooking Easier For Everyone',
        maxlength: 200
    },
    tags: {
        type: [String],
        default: ['Italian Cuisine', 'Baking', 'Healthy'],
        validate: {
            validator: function(tags) {
                return tags.length <= 5;
            },
            message: 'Cannot have more than 5 tags'
        }
    },
    savedRecipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);