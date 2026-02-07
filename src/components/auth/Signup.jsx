import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import ErrorMessage from '../common/ErrorMessage';
import Loader from '../common/Loader';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
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

        setLoading(true);

        try {
            // Note: Updated backend to accept confirmPassword or we filter it out here. 
            // Previous fix added confirmPassword to payload, so we send it all.
            await api.post('/auth/signup', formData);
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '2rem', backgroundColor: '#1e1e1e', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#fff' }}>Create Account</h2>

            <ErrorMessage message={error} />

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#2d2d2d', color: '#fff' }}
                    />
                </div>
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
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#2d2d2d', color: '#fff' }}
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '0.75rem', marginTop: '1rem' }}>
                    {loading ? <Loader /> : 'Sign Up'}
                </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#888' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--red-primary)' }}>Login</Link>
            </div>
            <div style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                <Link to="/admin-signup" style={{ color: 'var(--text-muted)' }}>Register as Admin</Link>
            </div>
        </div>
    );
};

export default Signup;
