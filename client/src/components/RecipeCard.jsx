import React from 'react';
import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe }){
    return (
        <div className='recipe-card'>
             <Link to={`/recipes/${recipe._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img src={recipe.image || 'https://via.placeholder.com/200'} alt={recipe.title} className="recipe-card-img" />
                <h3>{recipe.title}</h3>
                <p className="truncate">{recipe.description}</p>
            </Link>
        </div>
    );
}