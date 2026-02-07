import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import { User, Mail, Lock, Save, Key, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/profile');
            setUser(response.data);
            setUsername(response.data.username);
            setEmail(response.data.email);
        } catch (err) {
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setMessage('');
        setError('');
        try {
            const response = await api.put('/users/profile', { username, email });
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            setMessage('Profile updated successfully!');
        } catch (err) {
            setError(err.response?.data?.error || 'Update failed');
        } finally {
            setUpdating(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }
        setUpdating(true);
        setMessage('');
        setError('');
        try {
            await api.put('/users/profile/password', { currentPassword, newPassword });
            setMessage('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response?.data?.error || 'Password change failed');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main className="container" style={{ flex: 1, padding: '2rem 1rem' }}>
                <h1 style={{ color: 'var(--text-body)', marginBottom: '2.5rem' }}>{t('profile')}</h1>

                {message && <div style={{ backgroundColor: '#10b981', color: '#fff', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', fontWeight: 'bold' }}>{message}</div>}
                {error && <div style={{ backgroundColor: '#ef4444', color: '#fff', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', fontWeight: 'bold' }}>{error}</div>}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>

                    {/* Profile Form */}
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
                        <h2 style={{ color: 'var(--text-body)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <User size={24} color="var(--red-primary)" /> Basic Info
                        </h2>
                        <form onSubmit={handleUpdateProfile}>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Username</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={updating} className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                <Save size={18} /> {updating ? 'Saving...' : 'Save Profile'}
                            </button>
                        </form>
                    </div>

                    {/* Security Form */}
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
                        <h2 style={{ color: 'var(--text-body)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Shield size={24} color="var(--red-primary)" /> Security
                        </h2>
                        <form onSubmit={handleChangePassword}>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Current Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Confirm New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={updating} className="btn btn-secondary" style={{ width: '100%', padding: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                <Key size={18} /> {updating ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '0.8rem 1rem 0.8rem 2.8rem',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-body)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-body)',
    fontSize: '0.95rem'
};

export default ProfilePage;
