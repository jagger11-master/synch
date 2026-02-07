import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import ErrorMessage from '../common/ErrorMessage';
import Loader from '../common/Loader';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Role-based redirection
            if (response.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Login error detail:', err.response?.data);
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', backgroundColor: '#1e1e1e', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#fff' }}>Login</h2>

            <ErrorMessage message={error} />

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#2d2d2d', color: '#fff' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#2d2d2d', color: '#fff' }}
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '0.75rem', marginTop: '1rem' }}>
                    {loading ? <Loader /> : 'Login'}
                </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#888' }}>
                Don't have an account? <Link to="/signup" style={{ color: 'var(--red-primary)' }}>Sign Up</Link>
            </div>
            <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                <Link to="/forgot-password" style={{ color: '#888', fontSize: '0.9rem' }}>Forgot Password?</Link>
            </div>
        </div>
    );
};

export default Login;
