import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import RecipeCard from '../components/RecipeCard';

export default function Profile() {
    const { user, token, login } = useAuth();
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState({ username: '', email: '' });
    const [recipes, setRecipes] = useState([]);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // Load user recipes
    useEffect(() => {
        if (!user) return;

        setForm({ username: user.username || '', email: user.email || '' });

        const fetchRecipes = async () => {
            try {
                const res = await fetch(`/recipes/user/${user.id}`);
                if (!res.ok) throw new Error('Failed to fetch recipes');
                const data = await res.json();
                setRecipes(data);
            } catch (err) {
                console.error('Error fetching recipes:', err);
                setRecipes([]);
            }
        };

        fetchRecipes();
    }, [user]);

    // Handle form changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Update profile (frontend context only, you can later add backend update)
    const handleUpdate = (e) => {
        e.preventDefault();
        setMsg('Profile updated!');
        login({ ...user, ...form }, token);
        setEdit(false);
    };

    // Delete a recipe
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this recipe?')) return;

        setLoading(true);
        try {
            const res = await fetch(`/recipes/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ userId: user.id }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Failed to delete');

            setRecipes(recipes.filter(r => r._id !== id));
            setMsg('Recipe deleted!');
        } catch (err) {
            console.error(err);
            setMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <>
            <NavBar />
            <div className="profile-container">
                <h2>My Profile</h2>

                {edit ? (
                    <form className="profile-form" onSubmit={handleUpdate}>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            maxLength={30}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            maxLength={50}
                            required
                        />
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setEdit(false)}>Cancel</button>
                    </form>
                ) : (
                    <div className="profile-details">
                        <p><b>Username:</b> {form.username}</p>
                        <p><b>Email:</b> {form.email}</p>
                        <button onClick={() => setEdit(true)}>Edit Profile</button>
                    </div>
                )}

                {msg && <div className="msg">{msg}</div>}

                <h3>My Recipes</h3>
                <div className="recipe-list">
                    {recipes.length === 0 ? (
                        'No recipes yet!'
                    ) : (
                        recipes.map(r => (
                            <div key={r._id} style={{ position: 'relative' }}>
                                <RecipeCard recipe={r} />
                                <button
                                    className="del-btn"
                                    style={{ position: 'absolute', top: 10, right: 10, zIndex: 5 }}
                                    onClick={() => handleDelete(r._id)}
                                    disabled={loading}
                                >
                                    🗑
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
