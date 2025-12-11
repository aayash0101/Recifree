import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';

export default function RecipeDetails() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const { user, token } = useAuth();
    const [favMsg, setFavMsg] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewMsg, setReviewMsg] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRecipe();
    }, [id]);

    const fetchRecipe = () => {
        fetch(`/recipes/${id}`)
            .then(res => res.json())
            .then(setRecipe);
    };

    const addFavorite = async () => {
        const res = await fetch(`/favorites/api/${user.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ recipeId: id })
        });
        const data = await res.json();
        setFavMsg(data.msg || 'Saved!');
    };

    const submitReview = async (e) => {
        e.preventDefault();
        setLoading(true);
        setReviewMsg('');
        try {
            const res = await fetch(`/recipes/${id}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rating: reviewRating,
                    comment: reviewComment,
                    userId: user.id,
                    username: user.username,
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Failed to add review');
            setReviewMsg('Review added successfully!');
            setReviewComment('');
            fetchRecipe(); // Refresh recipe data
        } catch (err) {
            setReviewMsg(err.message);
        }
        setLoading(false);
    };

    const renderStars = (rating) => {
        const numRating = Number(rating) || 0;
        const fullStars = Math.floor(numRating);
        const hasHalfStar = numRating % 1 >= 0.5;
        return (
            <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: i < fullStars ? '#ffd700' : i === fullStars && hasHalfStar ? '#ffd700' : '#ddd', fontSize: '18px' }}>
                        {i < fullStars ? '★' : i === fullStars && hasHalfStar ? '☆' : '☆'}
                    </span>
                ))}
            </div>
        );
    };

    const renderInteractiveStars = () => {
        return (
            <div className="interactive-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className="star-input"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setReviewRating(star)}
                        style={{
                            color: star <= (hoverRating || reviewRating) ? '#ffd700' : '#ddd',
                            fontSize: '32px',
                            cursor: 'pointer',
                            transition: 'color 0.2s ease'
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    if (!recipe) return <div>Loading...</div>;
    
    const userAlreadyReviewed = user && recipe.reviews && recipe.reviews.some(r => r.userId === user.id);
    
    return (
        <>
            <NavBar />
            <div className="container">
                <div className="recipe-details">
                    <img src={recipe.image || 'https://via.placeholder.com/250'} alt={recipe.title} />
                    <h2>{recipe.title}</h2>
                    <div className="details-meta">
                        <span className="badge">{recipe.category}</span>
                        <span>Cooking Time: {recipe.cookingTime} min</span>
                        {recipe.averageRating > 0 && (
                            <div style={{ marginTop: '10px' }}>
                                {renderStars(recipe.averageRating)}
                                <span style={{ marginLeft: '8px' }}>{(recipe.averageRating || 0).toFixed(1)} ({recipe.reviewCount || 0} review{(recipe.reviewCount || 0) !== 1 ? 's' : ''})</span>
                            </div>
                        )}
                    </div>
                    <h3>Ingredients</h3>
                    <ul>
                        {recipe.ingredients.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                    <h3>Instructions</h3>
                    <ol>
                        {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                    {user && <button className="fav-btn" onClick={addFavorite}>Add to Favorites</button>}
                    <div>{favMsg}</div>

                    <h3>Reviews</h3>
                    {user && !userAlreadyReviewed && (
                        <form onSubmit={submitReview} className="review-form">
                            <div className="rating-input-group">
                                <label>Your Rating:</label>
                                {renderInteractiveStars()}
                                <span className="rating-label">
                                    {reviewRating === 5 ? 'Excellent' : 
                                     reviewRating === 4 ? 'Very Good' : 
                                     reviewRating === 3 ? 'Good' : 
                                     reviewRating === 2 ? 'Fair' : 'Poor'}
                                </span>
                            </div>
                            <textarea
                                placeholder="Write your review (optional)"
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                rows="3"
                            />
                            <button type="submit" disabled={loading}>Submit Review</button>
                            {reviewMsg && <div className={reviewMsg.includes('success') ? 'success-msg' : 'error-msg'}>{reviewMsg}</div>}
                        </form>
                    )}
                    {userAlreadyReviewed && <p>You have already reviewed this recipe.</p>}
                    
                    <div className="reviews-list">
                        {recipe.reviews && recipe.reviews.length > 0 ? (
                            recipe.reviews.map((review, i) => (
                                <div key={i} className="review-item">
                                    <div className="review-header">
                                        <strong>{review.username}</strong>
                                        <div>{renderStars(review.rating)}</div>
                                        <span style={{ fontSize: '0.9em', color: '#666' }}>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {review.comment && <p>{review.comment}</p>}
                                </div>
                            ))
                        ) : (
                            <p>No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}