import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on refresh
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(storedUser);
            setToken(storedToken);
        }

        setLoading(false);
    }, []);

    // Normalize and save user during login
    const login = (apiUser, apiToken) => {
        const normalizedUser = {
            id: apiUser._id || apiUser.id,  // ensures consistent ID
            username: apiUser.username,
            email: apiUser.email,
            image: apiUser.image || null,
        };

        setUser(normalizedUser);
        setToken(apiToken);

        localStorage.setItem("user", JSON.stringify(normalizedUser));
        localStorage.setItem("token", apiToken);
    };

    // Logout user
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

// Hook to access auth data
export const useAuth = () => useContext(AuthContext);
