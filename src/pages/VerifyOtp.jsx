import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email) {
            setError("Email not found. Please sign up again.");
            return;
        }

        try {
            const response = await axiosClient.post('/auth/verify-otp', { email, otp });
            // The backend returns a token on verification, so we can log them in directly
            localStorage.setItem('token', response.data.token);
            if (response.data.user) {
                // Determine user object if sent, otherwise we might need to fetch profile
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed. Invalid or expired OTP.');
        }
    };

    const handleResend = async () => {
        setError('');
        setMessage('');
        try {
            await axiosClient.post('/auth/resend-otp', { email });
            setMessage("A new OTP has been sent to your email.");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to resend OTP.");
        }
    };

    if (!email) {
        return (
            <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
                <h2>Error</h2>
                <p>No email provided. Please <Link to="/signup" style={{ color: 'var(--red-primary)' }}>Sign Up</Link> first.</p>
            </div>
        )
    }

    return (
        <div className="container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center" style={{ marginBottom: '1rem' }}>Verify Email</h2>
                <p className="text-center" style={{ marginBottom: '2rem', color: 'var(--text-gray)' }}>
                    Enter the code sent to <strong>{email}</strong>
                </p>

                {error && <div style={{
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    color: '#ef4444',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1rem',
                    textAlign: 'center'
                }}>{error}</div>}

                {message && <div style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1rem',
                    textAlign: 'center'
                }}>{message}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            placeholder="Enter 6-digit OTP"
                            style={{ textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.5rem' }}
                            maxLength={6}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        Verify Account
                    </button>
                </form>

                <div className="text-center" style={{ marginTop: '1.5rem' }}>
                    <button
                        onClick={handleResend}
                        style={{ background: 'none', border: 'none', color: 'var(--red-primary)', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Resend OTP
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
