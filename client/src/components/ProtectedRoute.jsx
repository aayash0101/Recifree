import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, Loading } = useAuth();
    if (Loading) return <div>Loading...</div>
    return user ? children : <Navigate to="/Login" />;
}