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
        ingredients: '',
        instructions: '',
        category: '',
        image: '',
        cookingTime: '',
    });

    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);

    // Limit fields directly inside the onChange handler
    const handleChange = e => {
        const { name, value } = e.target;

        const limits = {
            title: 60,
            description: 300,
            ingredients: 300,
            instructions: 1000,
            image: 300,
        };

        // If field has a limit → trim automatically
        const limitedValue = limits[name] ? value.slice(0, limits[name]) : value;

        setForm({ ...form, [name]: limitedValue });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setErr('');
        setLoading(true);

        try {
            const body = {
                ...form,
                ingredients: form.ingredients
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean),
                instructions: form.instructions
                    .split('\n')
                    .map(s => s.trim())
                    .filter(Boolean),
            };

            const res = await fetch('/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Could not add recipe');

            navigate('/');
        } catch (e) {
            setErr(e.message);
        }

        setLoading(false);
    };

    if (!user) return <div>Please log in to add a recipe.</div>;

    return (
        <>
            <NavBar />
            <div className="form-container">
                <h2>Add a Recipe</h2>

                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        type="text"
                        name="title"
                        placeholder="Recipe Title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        maxLength={60}
                    />

                    <textarea
                        name="description"
                        placeholder="Short description (max 300 chars)"
                        value={form.description}
                        onChange={handleChange}
                        required
                        maxLength={300}
                    />

                    <input
                        type="text"
                        name="ingredients"
                        placeholder="Ingredients (comma separated)"
                        value={form.ingredients}
                        onChange={handleChange}
                        required
                        maxLength={300}
                    />

                    <textarea
                        name="instructions"
                        placeholder="Instructions (one step per line)"
                        value={form.instructions}
                        onChange={handleChange}
                        required
                        maxLength={1000}
                    />

                    {/* CATEGORY DROPDOWN (Prevents random text entries) */}
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Snacks">Snacks</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Beverage">Beverage</option>
                        <option value="Healthy">Healthy</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                    </select>

                    <input
                        type="text"
                        name="image"
                        placeholder="Image URL (optional)"
                        value={form.image}
                        onChange={handleChange}
                        maxLength={300}
                    />

                    <input
                        type="number"
                        name="cookingTime"
                        placeholder="Cooking Time (minutes)"
                        value={form.cookingTime}
                        onChange={handleChange}
                        required
                        min={1}
                        max={500}
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Recipe'}
                    </button>
                </form>

                {err && <div className="error-msg">{err}</div>}
            </div>
        </>
    );
}
