import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            if (data.role === 'admin') {
                login(data);
                navigate('/admin');
            } else {
                setError('Access Denied: Admin privileges required.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '420px',
                padding: '2rem',
            }}>
                {/* Decorative glow */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    background: 'var(--ford-blue)',
                    filter: 'blur(80px)',
                    opacity: '0.15',
                    borderRadius: '50%',
                    zIndex: 0
                }}></div>

                <div style={{
                    position: 'relative',
                    zIndex: 1,
                    backgroundColor: 'white',
                    padding: '3rem 2.5rem',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h1 className="logo-text" style={{
                            fontSize: '2rem',
                            color: 'var(--ford-blue)',
                            marginBottom: '0.5rem',
                            display: 'block'
                        }}>
                            Krimoford
                        </h1>
                        <p style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>Admin Portal Access</p>
                    </div>

                    {error && (
                        <div style={{
                            backgroundColor: '#fee2e2',
                            border: '1px solid #fecaca',
                            color: '#991b1b',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                            fontSize: '0.9rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                color: '#374151',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '1rem',
                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                    outline: 'none'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--ford-blue)';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 51, 153, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d5db';
                                    e.target.style.boxShadow = 'none';
                                }}
                                required
                                placeholder="admin@krimoford.dz"
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                color: '#374151',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '1rem',
                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                    outline: 'none'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--ford-blue)';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 51, 153, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d5db';
                                    e.target.style.boxShadow = 'none';
                                }}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                backgroundColor: 'var(--ford-blue)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s, transform 0.1s',
                                boxShadow: '0 4px 6px rgba(0, 51, 153, 0.2)'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#003d82'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--ford-blue)'}
                            onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
                            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            Sign In
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', marginTop: '2rem', color: '#6b7280', fontSize: '0.85rem' }}>
                    &copy; {new Date().getFullYear()} Krimo Store. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default AdminLoginPage;
