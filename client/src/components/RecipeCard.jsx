import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RecipeCard({ recipe }) {
    const { user, token } = useAuth();
    const [fav, setFav] = useState(recipe.isFavorite);
    const [loading, setLoading] = useState(false);

    // Action to add favorite
    const addFavorite = async (e) => {
        e.preventDefault();
        setLoading(true);
        await fetch(`/favorites/api/${user.id}`, {
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
        await fetch(`/favorites/api/${user.id}`, {
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

    const renderStars = (rating) => {
        const numRating = Number(rating) || 0;
        const fullStars = Math.floor(numRating);
        const hasHalfStar = numRating % 1 >= 0.5;
        return (
            <div className="rating-stars" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                {[...Array(5)].map((_, i) => (
                    <span 
                        key={i} 
                        style={{ 
                            color: i < fullStars ? '#ffd700' : i === fullStars && hasHalfStar ? '#ffd700' : '#ddd',
                            fontSize: '16px',
                            lineHeight: '1'
                        }}
                    >
                        ★
                    </span>
                ))}
                <span style={{ marginLeft: '4px', fontWeight: '600', color: '#333', fontSize: '0.95em' }}>
                    {numRating.toFixed(1)}
                </span>
            </div>
        );
    };

    return (
        <div className="recipe-card" style={{ position: 'relative' }}>
            <Link to={`/recipes/${recipe._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img src={recipe.image || 'https://via.placeholder.com/200'} alt={recipe.title} className="recipe-card-img" />
                <h3>{recipe.title}</h3>
                <p className="truncate">{recipe.description}</p>
                <div style={{ marginTop: '10px', padding: '0 15px 12px 15px' }}>
                    {recipe.averageRating > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '6px' }}>
                            {renderStars(recipe.averageRating)}
                            <span style={{ fontSize: '0.9em', color: '#666', fontWeight: '500' }}>
                                ({recipe.reviewCount || 0} review{(recipe.reviewCount || 0) !== 1 ? 's' : ''})
                            </span>
                        </div>
                    ) : (
                        <div style={{ fontSize: '0.85em', color: '#999', fontStyle: 'italic' }}>
                            No reviews yet
                        </div>
                    )}
                </div>
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