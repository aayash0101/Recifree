import React, {useEffect, useState} from "react";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import RecipeCard from "../components/RecipeCard";

export default function Profile() {
    const { user, token, Logout } = useAuth();
    const { edit, setEdit } = useState(false);
    const { form, setForm } = useState({ username: '', email: ''});
    const { recipes, setRecipes } = useState([]);
    const { msg, setMsg } = useState('');

    useEffect(() => {
        if (user) {
            setForm({ username: user.username || '', email: user.email || ''});
            fetch(`/favorites/${user.id}`)
                .then(res => res.json())
                .then(setRecipes);
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMsg('Profile Updated');
        login ({ ...user, ...form}, token);
        setEdit (False);
    };
    if (!user) return <div>Loading...</div>
    return (
        <>
            <NavBar />
            <div className="profile-container">
                <h2>My Profile</h2>
                {edit ? (
                    <form className="profile-form" onSubmit={handleUpdate}>
                        <input type="text" name="username" value={form.username} onChange={handleChange} required />
                        <input type="email" name="email" value={form.email} onChange={handleChange} required />
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
                {msg && <div>{msg}</div>}
                <h3>Saved Recipes</h3>
                <div className="recipe-list">
                    {recipes.length === 0 ? "No favorites yet!" : recipes.map(r => <RecipeCard key={r._id} recipe={r} />)}
                </div>
            </div>
        </>
    );
}