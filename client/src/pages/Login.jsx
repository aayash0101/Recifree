import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';


export default function Login() {
    const [inputs, setInputs] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Login failed');
            login(data.user, data.token);
            navigate('/profile');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            
            <div className="form-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <input type="email" name="email" placeholder="Email" value={inputs.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={inputs.password} onChange={handleChange} required />
                    <button type="submit">Login</button>
                </form>
                {error && <div className="error-msg">{error}</div>}
                <div>Don't have an account? <Link to="/signup">Sign up</Link></div>
            </div>
        </>
    );
}



