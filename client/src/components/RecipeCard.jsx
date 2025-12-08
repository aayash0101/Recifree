import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RecipeCard({ recipe }) {
    const { user, token } = useAuth();
    const [fav, setFav] = useState(recipe.isFavorite); // expects parent can send isFavorite or fallback
    const [loading, setLoading] = useState(false);

    // Action to add favorite
    const addFavorite = async (e) => {
        e.preventDefault();
        setLoading(true);
        await fetch(`/favorites/${user.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ recipeId: recipe._id })
        });
        setFav(true);
        setLoading(false);
    };
    // Action to remove favorite
    const removeFavorite = async (e) => {
        e.preventDefault();
        setLoading(true);
        await fetch(`/favorites/${user.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ recipeId: recipe._id })
        });
        setFav(false);
        setLoading(false);
    };

    return (
        <div className="recipe-card" style={{ position: 'relative' }}>
            <Link to={`/recipes/${recipe._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img src={recipe.image || 'https://via.placeholder.com/200'} alt={recipe.title} className="recipe-card-img" />
                <h3>{recipe.title}</h3>
                <p className="truncate">{recipe.description}</p>
            </Link>
            {/* Favorite Icon/Button */}
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
                    onClick={fav ? removeFavorite : addFavorite}
                >
                    {fav ? '★' : '☆'}
                </button>
            )}
        </div>
    );
}





