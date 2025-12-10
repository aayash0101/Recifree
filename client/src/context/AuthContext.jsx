import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user and token from localStorage on refresh
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        if (storedUser && storedUser !== "null") {
            setUser(JSON.parse(storedUser));
        }
        if (storedToken && storedToken !== "null") {
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = (apiUser, apiToken) => {
        const normalizedUser = {
            id: apiUser._id || apiUser.id,
            username: apiUser.username,
            email: apiUser.email,
            image: apiUser.image || null,
            bio: apiUser.bio || 'Home Chef and Food Enthusiast | Sharing My Favorite Recipe and Cooking Tips | Making Cooking Easier For Everyone',
            tags: apiUser.tags || ['Italian Cuisine', 'Baking', 'Healthy']
        };
        setUser(normalizedUser);
        setToken(apiToken);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
        localStorage.setItem("token", apiToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);