import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import FavoritesList from '../components/FavoritesList';
import { useAuth } from '../context/AuthContext';

export default function Favorites() {
    const { user, loading } = useAuth();
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (!loading && user?.id) {
            fetch(`/favorites/api/${user.id}`)  // Fixed: use parentheses, not backticks
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);  // Fixed
                    return res.json();
                })
                .then(setFavorites)
                .catch(err => console.error("Favorites error:", err));
        }
    }, [user, loading]);

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Please login to view favorites.</div>;

    return (
        <>
            <NavBar />
            <div className="container">
                <h2>My Favorites</h2>
                <FavoritesList favorites={favorites} />
            </div>
        </>
    );
}