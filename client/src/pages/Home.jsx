import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';

export default function Home() {
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch('/recipes')
            .then(res => res.json())
            .then(data => {
                setRecipes(data);
                setFiltered(data);
                setCategories([...new Set(data.map((r) => r.category))]);
            });
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setFiltered(recipes.filter(r =>
            r.title.toLowerCase().includes(search.toLowerCase()) ||
            r.description.toLowerCase().includes(search.toLowerCase())
        ));
    };

    const filterByCategory = (cat) => {
        setFiltered(recipes.filter(r => r.category === cat));
    };

    return (
        <>
            <NavBar />
            <div className="container">
                <SearchBar value={search} onChange={e => setSearch(e.target.value)} onSubmit={handleSearch} />
                <div className="categories">
                    <button onClick={() => setFiltered(recipes)}>All</button>
                    {categories.map(cat => (
                        <button key={cat} onClick={() => filterByCategory(cat)}>{cat}</button>
                    ))}
                </div>
                <div className="recipe-list">
                    {filtered.map(recipe => (
                        <RecipeCard key={recipe._id} recipe={recipe} />
                    ))}
                </div>
            </div>
        </>
    );
}



