import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
    const { user, logout } = useAuth();
    const userId = user?.id || null;

    return (
        <nav className='navbar'>
            <div className='nav-logo'>
                <Link to="/">Recifree</Link>
            </div>

            <div className='nav-links'>
                <Link to="/">Home</Link>
                <Link to="/recipes">Recipes</Link>

                {userId && <Link to="/favorites">Favorites</Link>}

                <Link to="/ingredients">Shopping List</Link>

                {user ? (
                    <>
                        <Link to="/profile">Profile</Link>
                        <button className='nav-btn' onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
