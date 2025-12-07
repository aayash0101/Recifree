import React, {useState} from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Signup() {
    const [inputs, setInputs] = useState({ username: '', email: '', password: '' });
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
            const res = await fetch('/auth/signup', {
                method: 'POST',
                headers:{ 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Signup failed');
            login(data.user, data.token);
            navigate('/profile');
        } catch (err) {
            setError(err.message);
        }
    };

        return (
        <>
            <NavBar />
            <div className="form-container">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <input type="text" name="username" placeholder="Username" value={inputs.username} onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" value={inputs.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={inputs.password} onChange={handleChange} required />
                    <button type="submit">Create Account</button>
                </form>
                {error && <div className="error-msg">{error}</div>}
                <div>Already have an account? <Link to="/login">Login</Link></div>
            </div>
        </>
    );
}