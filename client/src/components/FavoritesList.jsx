import React from 'react';
import RecipeCard from './RecipeCard';

export default function FavoritesList({ favorites }) {
    if (!favorites || favorites.length === 0)
        return <div>No favorites yet!</div>;

    return (
        <div className="recipe-list">
            {favorites.map(recipe => (
                <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
        </div>
    );
}
