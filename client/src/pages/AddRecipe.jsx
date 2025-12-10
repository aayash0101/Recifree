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

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async e => {
        e.preventDefault();
        setErr('');
        setLoading(true);
        try {
            const body = {
                ...form,
                ingredients: form.ingredients.split(',').map(s => s.trim()).filter(Boolean),
                instructions: form.instructions.split('\n').map(s => s.trim()).filter(Boolean),
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
                    <input type="text" name="title" placeholder="Recipe Title" value={form.title} onChange={handleChange} required />
                    <textarea name="description" placeholder="Short description" value={form.description} onChange={handleChange} required />
                    <input type="text" name="ingredients" placeholder="Ingredients (comma separated)" value={form.ingredients} onChange={handleChange} required />
                    <textarea name="instructions" placeholder="Instructions (new line for each step)" value={form.instructions} onChange={handleChange} required />
                    <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
                    <input type="text" name="image" placeholder="Image URL (optional)" value={form.image} onChange={handleChange} />
                    <input type="number" name="cookingTime" placeholder="Cooking Time (minutes)" value={form.cookingTime} onChange={handleChange} required />
                    <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Recipe'}</button>
                </form>
                {err && <div className="error-msg">{err}</div>}
            </div>
        </>
    );
}
