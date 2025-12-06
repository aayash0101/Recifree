import React from 'react';
import RecipeCard from './RecipeCard';

export default function FavoritesList({ favorites }) {
    if (recipes.length === 0) return <div>No favorites yet!</div>;
    return (
        <div className='recipe-list'>
            {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
        </div>
    )
}