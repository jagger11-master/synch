import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const AdminSignup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        adminSecret: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!formData.adminSecret) {
            setError("Admin Secret Key is required");
            return;
        }

        setLoading(true);

        try {
            await apiClient.post('/auth/admin/signup', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                adminSecret: formData.adminSecret
            });
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Admin registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
                paddingTop: '2rem',
                paddingBottom: '2rem'
            }}>
                <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                    <h2 className="text-center" style={{ marginBottom: '1rem' }}>Admin Registration</h2>
                    <p style={{
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        marginBottom: '2rem',
                        fontSize: '0.9rem'
                    }}>
                        Register as an administrator
                    </p>

                    {error && <div style={{
                        backgroundColor: 'rgba(220, 38, 38, 0.1)',
                        color: '#ef4444',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                placeholder="Choose a username"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Create a password"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Confirm your password"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Admin Secret Key</label>
                            <input
                                type="password"
                                name="adminSecret"
                                value={formData.adminSecret}
                                onChange={handleChange}
                                required
                                placeholder="Enter admin secret key"
                            />
                            <small style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                Contact system administrator for the secret key
                            </small>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register as Admin'}
                        </button>
                    </form>
                    <p className="text-center" style={{ marginTop: '1.5rem' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--red-primary)' }}>Login</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AdminSignup;
