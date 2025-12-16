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
        e.stopPropagation();
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
        e.stopPropagation();
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
        <div className="recipe-card">
            <Link to={`/recipes/${recipe._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img src={recipe.image || 'https://via.placeholder.com/200'} alt={recipe.title} className="recipe-card-img" />
                
                {/* Title with Heart Button */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    gap: '8px',
                    margin: '1rem 1.2rem 0.4rem 1.2rem'
                }}>
                    <h3 style={{ margin: 0, flex: 1 }}>{recipe.title}</h3>
                    
                    {/* Favorite Heart Button */}
                    {user && (
                        <button
                            className="fav-heart-btn"
                            title={fav ? 'Remove from favorites' : 'Add to favorites'}
                            disabled={loading}
                            onClick={fav ? removeFavorite : addFavorite}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.2s ease',
                                flexShrink: 0
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <svg 
                                width="22" 
                                height="22" 
                                viewBox="0 0 24 24" 
                                fill={fav ? '#ff6b35' : 'none'}
                                stroke={fav ? '#ff6b35' : '#999'}
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                style={{ transition: 'all 0.2s ease' }}
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                    )}
                </div>
                
                <p className="truncate" style={{ margin: '0 1.2rem 1.2rem 1.2rem' }}>{recipe.description}</p>
                
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
        </div>
    );
}