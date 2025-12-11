const Recipe = require('../models/Recipe');

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();

    const formatted = recipes.map(recipe => {
      const avgRating =
        recipe.reviews.length > 0
          ? (recipe.reviews.reduce((s, r) => s + r.rating, 0) / recipe.reviews.length).toFixed(1)
          : 0;

      return {
        ...recipe.toObject(),
        averageRating: parseFloat(avgRating),
        reviewCount: recipe.reviews.length,
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) return res.status(404).json({ msg: "Recipe not found" });

    const avgRating =
      recipe.reviews.length > 0
        ? (recipe.reviews.reduce((s, r) => s + r.rating, 0) / recipe.reviews.length).toFixed(1)
        : 0;

    const data = {
      ...recipe.toObject(),
      averageRating: parseFloat(avgRating),
      reviewCount: recipe.reviews.length,
    };

    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};


exports.seedRecipes = async (req, res) => {
  try {
    const count = await Recipe.countDocuments();
    if (count > 0) return res.status(400).json({ msg: "Already seeded" });

    const sampleRecipes = [
      {
        title: "Classic Margherita Pizza",
        description: "An Italian pizza with tomato sauce, mozzarella, and basil.",
        ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella", "Basil"],
        instructions: ["Spread sauce", "Add mozzarella", "Bake"],
        category: "Italian",
        image: "",
        cookingTime: "20",
        createdBy: "000000000000000000000000", // Placeholder
        reviews: [],
      },
      {
        title: "Chicken Biryani",
        description: "A savory Indian rice and chicken dish.",
        ingredients: ["Chicken", "Rice", "Yogurt", "Spices"],
        instructions: ["Marinate", "Layer", "Cook"],
        category: "Indian",
        image: "",
        cookingTime: "60",
        createdBy: "000000000000000000000000",
        reviews: [],
      }
    ];

    await Recipe.insertMany(sampleRecipes);
    res.json({ msg: "Recipes seeded." });
  } catch (err) {
    res.status(500).json({ msg: "Seed Error" });
  }
};

exports.createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions, category, image, cookingTime, createdBy } = req.body;

    if (!title || !description || !ingredients.length || !instructions.length || !category || !cookingTime || !createdBy) {
      return res.status(400).json({ msg: "Missing required fields" });
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
      reviews: [],
    });

    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ msg: "Error creating recipe" });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) return res.status(404).json({ msg: "Recipe not found" });

    if (recipe.createdBy.toString() !== req.body.userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await recipe.deleteOne();
    res.json({ msg: "Recipe deleted." });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting recipe" });
  }
};

exports.getUserRecipes = async (req, res) => {
  try {
    const userId = req.params.userId;
    const recipes = await Recipe.find({ createdBy: userId }).sort({ _id: -1 });

    const formatted = recipes.map(recipe => {
      const avgRating =
        recipe.reviews.length > 0
          ? (recipe.reviews.reduce((s, r) => s + r.rating, 0) / recipe.reviews.length).toFixed(1)
          : 0;

      return {
        ...recipe.toObject(),
        averageRating: parseFloat(avgRating),
        reviewCount: recipe.reviews.length,
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching user recipes" });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment, userId, username } = req.body;
    const recipeId = req.params.id;

    // Validate input
    if (!rating || !comment || !userId || !username) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    // Find recipe
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found." });
    }

    // Create review object
    const review = {
      rating,
      comment,
      userId,
      username,
      createdAt: new Date(),
    };

    // Add review
    recipe.reviews.push(review);

    // SAVE WITHOUT VALIDATING THE WHOLE DOCUMENT
    await recipe.save({ validateBeforeSave: false });

    res.json({ msg: "Review added successfully!", review });
  } catch (err) {
    console.error("Error in addReview:", err);
    res.status(500).json({ msg: "Error adding review." });
  }
};

