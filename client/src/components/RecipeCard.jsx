import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RecipeCard({ recipe }) {
    const { user, token } = useAuth();
    const [fav, setFav] = useState(recipe.isFavorite || false);
    const [loading, setLoading] = useState(false);

    const apiUrl = `/favorites/api/${user?.id}`;

    const handleFavorite = async (add = true) => {
        if (!user) return;

        setLoading(true);
        try {
            const res = await fetch(apiUrl, {
                method: add ? 'POST' : 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ recipeId: recipe._id }),
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            console.log(`FRONTEND - ${add ? 'add' : 'remove'}Favorite response:`, data);
            setFav(add);
        } catch (err) {
            console.error(`FRONTEND - ${add ? 'add' : 'remove'}Favorite error:`, err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recipe-card" style={{ position: 'relative' }}>
            <Link to={`/recipes/${recipe._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img src={recipe.image || 'https://via.placeholder.com/200'} alt={recipe.title} className="recipe-card-img" />
                <h3>{recipe.title}</h3>
                <p className="truncate">{recipe.description}</p>
            </Link>

            {user && (
                <button
                    className="fav-btn-card"
                    style={{
                        position: 'absolute',
                        top: 12,
                        right: 15,
                        zIndex: 2,
                        fontSize: 20,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: fav ? '#e17055' : '#b2bec3'
                    }}
                    title={fav ? 'Remove from favorites' : 'Add to favorites'}
                    disabled={loading}
                    onClick={() => handleFavorite(!fav)}
                >
                    {fav ? '★' : '☆'}
                </button>
            )}
        </div>
    );
}
