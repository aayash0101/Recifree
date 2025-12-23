import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AddRecipe() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: '',
        description: '',
        servings: '',
        ingredients: '',
        instructions: '',
        category: '',
        image: '',
        cookingTime: '',
        createdBy: user?.id || '', // keep for frontend reference
    });

    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);

    // Handles input changes with character limits
    const handleChange = e => {
        const { name, value } = e.target;

        const limits = {
            title: 60,
            description: 300,
            ingredients: 300,
            instructions: 1000,
            image: 300,
        };

        const limitedValue = limits[name] ? value.slice(0, limits[name]) : value;
        setForm({ ...form, [name]: limitedValue });
    };

    // Submit handler
    const handleSubmit = async e => {
        e.preventDefault();
        setErr('');
        setLoading(true);

        try {
            // Prepare payload
            const body = {
                ...form,
                userId: form.createdBy, // send userId for backend
                servings: parseInt(form.servings, 10),
                ingredients: form.ingredients
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean),
                instructions: form.instructions
                    .split('\n')
                    .map(s => s.trim())
                    .filter(Boolean),
            };

            // Send request to backend (Vite proxy handles /recipes)
            const res = await fetch('/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) throw new Error(data.msg || 'Could not add recipe');

            navigate('/'); // redirect to home after success
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <>
                <NavBar />
                <div className="form-container">
                    <div style={{ textAlign: 'center', color: '#666' }}>
                        <p>Please log in to add a recipe.</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <NavBar />
            <div className="add-recipe-container">
                <div className="add-recipe-header">
                    <h2>Create New Recipe</h2>
                    <p className="add-recipe-subtitle">Share your culinary creation with the community</p>
                </div>

                <form onSubmit={handleSubmit} className="add-recipe-form">
                    {err && <div className="error-msg">{err}</div>}

                    <div className="form-group">
                        <label htmlFor="title">Recipe Title *</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            placeholder="e.g., Grandma's Chocolate Chip Cookies"
                            value={form.title}
                            onChange={handleChange}
                            required
                            maxLength={60}
                        />
                        <span className="char-count">{form.title.length}/60</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="A brief description of your recipe..."
                            value={form.description}
                            onChange={handleChange}
                            required
                            maxLength={300}
                            rows={3}
                        />
                        <span className="char-count">{form.description.length}/300</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="servings">Servings *</label>
                        <input
                            id="servings"
                            type="number"
                            name="servings"
                            placeholder="e.g., 4"
                            value={form.servings}
                            onChange={handleChange}
                            required
                            min={1}
                            max={100}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Category *</label>
                            <select
                                id="category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a category</option>
                                <option value="Breakfast">🌅 Breakfast</option>
                                <option value="Lunch">🌞 Lunch</option>
                                <option value="Dinner">🌙 Dinner</option>
                                <option value="Snacks">🍿 Snacks</option>
                                <option value="Dessert">🍰 Dessert</option>
                                <option value="Beverage">☕ Beverage</option>
                                <option value="Healthy">🥗 Healthy</option>
                                <option value="Vegetarian">🥕 Vegetarian</option>
                                <option value="Vegan">🌱 Vegan</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="cookingTime">Cooking Time (min) *</label>
                            <input
                                id="cookingTime"
                                type="number"
                                name="cookingTime"
                                placeholder="e.g., 30"
                                value={form.cookingTime}
                                onChange={handleChange}
                                required
                                min={1}
                                max={500}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="ingredients">Ingredients *</label>
                        <textarea
                            id="ingredients"
                            name="ingredients"
                            placeholder="Enter ingredients separated by commas&#10;e.g., 2 cups flour, 1 cup sugar, 3 eggs"
                            value={form.ingredients}
                            onChange={handleChange}
                            required
                            maxLength={300}
                            rows={4}
                        />
                        <span className="char-count">{form.ingredients.length}/300</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="instructions">Instructions *</label>
                        <textarea
                            id="instructions"
                            name="instructions"
                            placeholder="Enter each step on a new line&#10;&#10;Step 1: Preheat oven to 350°F&#10;Step 2: Mix dry ingredients..."
                            value={form.instructions}
                            onChange={handleChange}
                            required
                            maxLength={1000}
                            rows={6}
                        />
                        <span className="char-count">{form.instructions.length}/1000</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Image URL</label>
                        <input
                            id="image"
                            type="text"
                            name="image"
                            placeholder="https://example.com/image.jpg (optional)"
                            value={form.image}
                            onChange={handleChange}
                            maxLength={300}
                        />
                        <span className="char-count">{form.image.length}/300</span>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Creating Recipe...' : 'Create Recipe'}
                    </button>
                </form>
            </div>
        </>
    );
}