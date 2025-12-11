const Recipe = require('../models/Recipe');

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    const recipesWithRating = recipes.map(recipe => {
      const avgRating = recipe.reviews && recipe.reviews.length > 0
        ? (recipe.reviews.reduce((sum, r) => sum + r.rating, 0) / recipe.reviews.length).toFixed(1)
        : 0;
      return { ...recipe.toObject(), averageRating: parseFloat(avgRating), reviewCount: recipe.reviews?.length || 0 };
    });
    res.json(recipesWithRating);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });
    const avgRating = recipe.reviews && recipe.reviews.length > 0
      ? (recipe.reviews.reduce((sum, r) => sum + r.rating, 0) / recipe.reviews.length).toFixed(1)
      : 0;
    const recipeObj = recipe.toObject();
    recipeObj.averageRating = parseFloat(avgRating);
    recipeObj.reviewCount = recipe.reviews?.length || 0;
    res.json(recipeObj);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Seed sample recipes
exports.seedRecipes = async (req, res) => {
  try {
    const count = await Recipe.countDocuments();
    if (count > 0) return res.status(400).json({ msg: 'Recipes already seeded.' });
    const sampleRecipes = [
      {
        title: 'Classic Margherita Pizza',
        description: 'An Italian pizza with tomato sauce, mozzarella, and basil.',
        ingredients: ['Pizza dough', 'Tomato sauce', 'Mozzarella cheese', 'Fresh basil', 'Olive oil', 'Salt'],
        instructions: [
          'Preheat oven to 475°F (245°C).',
          'Spread tomato sauce over dough.',
          'Top with mozzarella and basil.',
          'Bake for 10-12 min until crust is golden.'
        ],
        category: 'Italian',
        image: 'https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg',
        cookingTime: '20',
      },
      {
        title: 'Chicken Biryani',
        description: 'A savory Indian rice and chicken dish with aromatic spices.',
        ingredients: ['Chicken', 'Basmati rice', 'Onions', 'Yogurt', 'Spices', 'Ghee', 'Mint', 'Cilantro'],
        instructions: [
          'Marinate chicken in yogurt and spices.',
          'Fry onions and layer with chicken and rice.',
          'Cook on low heat until rice is done.'
        ],
        category: 'Indian',
        image: 'https://www.themealdb.com/images/media/meals/uwxqwy1483389553.jpg',
        cookingTime: '60',
      },
      {
        title: 'Avocado Toast',
        description: 'Simple healthy toast topped with mashed avocado and seasonings.',
        ingredients: ['Bread slices', 'Avocado', 'Lemon juice', 'Salt', 'Pepper', 'Chili flakes'],
        instructions: [
          'Toast the bread.',
          'Mash avocado with lemon juice, salt, and pepper.',
          'Spread on toast and top with chili flakes.'
        ],
        category: 'Breakfast',
        image: 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
        cookingTime: '10',
      },
    ];
    await Recipe.insertMany(sampleRecipes);
    res.json({ msg: 'Recipes seeded.' });
  } catch (err) {
    res.status(500).json({ msg: 'Seed Error' });
  }
};

exports.createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions, category, image, cookingTime, createdBy } = req.body;
    if (!title || !description || !ingredients?.length || !instructions?.length || !category || !cookingTime || !createdBy) {
      return res.status(400).json({ msg: 'All required fields must be provided.' });
    }
    const recipe = new Recipe({
      title,
      description,
      ingredients,
      instructions,
      category,
      image,
      cookingTime,
      createdBy,
    });
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ msg: 'Error creating recipe.' });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });
    if (recipe.createdBy.toString() !== req.body.userId) {
      return res.status(403).json({ msg: 'Not authorized to delete this recipe.' });
    }
    await recipe.deleteOne();
    res.json({ msg: 'Recipe deleted.' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting recipe.' });
  }
};

exports.getUserRecipes = async (req, res) => {
  try {
    const userId = req.params.userId;
    const recipes = await Recipe.find({ createdBy: userId }).sort({ _id: -1 });
    const recipesWithRating = recipes.map(recipe => {
      const avgRating = recipe.reviews && recipe.reviews.length > 0
        ? (recipe.reviews.reduce((sum, r) => sum + r.rating, 0) / recipe.reviews.length).toFixed(1)
        : 0;
      return { ...recipe.toObject(), averageRating: parseFloat(avgRating), reviewCount: recipe.reviews?.length || 0 };
    });
    res.json(recipesWithRating);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching user recipes.' });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment, userId, username } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be between 1 and 5.' });
    }
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });
    
    // Check if user already reviewed
    const existingReview = recipe.reviews.find(r => r.userId.toString() === userId);
    if (existingReview) {
      return res.status(400).json({ msg: 'You have already reviewed this recipe.' });
    }
    
    recipe.reviews.push({ rating, comment, userId, username });
    await recipe.save();
    
    const avgRating = recipe.reviews.length > 0
      ? (recipe.reviews.reduce((sum, r) => sum + r.rating, 0) / recipe.reviews.length).toFixed(1)
      : 0;
    
    res.json({ 
      msg: 'Review added successfully.',
      averageRating: parseFloat(avgRating),
      reviewCount: recipe.reviews.length
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error adding review.' });
  }
};






