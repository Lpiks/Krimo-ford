import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') ? '/' + searchParams.get('redirect') : '/';

    const { login } = useAuth();
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            login(data);
            navigate(redirect);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '500px' }}>
            <h1 style={{ marginBottom: '2rem', color: 'var(--ford-blue)', textAlign: 'center' }}>Login</h1>
            {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
            <form onSubmit={handleLogin} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign In</button>
            </form>
        </div>
    );
};

export default LoginPage;
