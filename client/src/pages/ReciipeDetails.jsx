import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';

export default function RecipeDetails() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const { user, token } = useAuth();
    const [favMsg, setFavMsg] = useState('');

    useEffect(() => {
        fetch(`/recipes/${id}`)
            .then(res => res.json())
            .then(setRecipe);
    }, [id]);

    const addFavorite = async () => {
        const res = await fetch(`/favorites/${user.id}`, {
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

    if (!recipe) return <div>Loading...</div>;
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
                </div>
            </div>
        </>
    );
}



