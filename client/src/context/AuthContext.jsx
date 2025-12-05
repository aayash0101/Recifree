import React, { createContext, userState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = creatContext();

export function AuthProvider( { childrem} ) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            const userData = JSON.parse(localStorage.getItem('user'));
            setUser(userData || null);
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    };
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };
    return (
        <AuthContext.Provider value = { { user, token, loading, login, logout } }>
        {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => React.useContext(AuthContext);