import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import FavoritesList from '../components/FavoritesList';
import { useAuth } from '../context/AuthContext';

export default function Favorites() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (user) {
            fetch(`/favorites/${user.id}`)
                .then(res => res.json())
                .then(setFavorites);
        }
    }, [user]);

    if (!user) return <div>Please login to view favorites.</div>;

    return (
        <>
            <NavBar />
            <div className="container">
                <h2>My Favorites</h2>
                <FavoritesList recipes={favorites} />
            </div>
        </>
    );
}





