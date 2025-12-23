const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    default: "",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  servings: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  ingredients: [
    { type: String }
  ],
  instructions: [
    { type: String }
  ],
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  cookingTime: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviews: {
    type: [ReviewSchema],
    default: [],
  }
});

module.exports = mongoose.model('Recipe', RecipeSchema);