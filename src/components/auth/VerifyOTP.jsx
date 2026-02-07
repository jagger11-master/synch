import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../services/api';
import ErrorMessage from '../common/ErrorMessage';
import SuccessMessage from '../common/SuccessMessage';
import Loader from '../common/Loader';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email) {
            setError("Email context missing. Please signup again.");
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/auth/verify-otp', { email, otp });
            localStorage.setItem('token', response.data.token);
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // Role-based redirection after verification
                if (response.data.user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setSuccess('');
        try {
            await api.post('/auth/resend-otp', { email });
            setSuccess("OTP resent successfully.");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to resend OTP.");
        }
    };

    if (!email) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
                <h2>Access Denied</h2>
                <p>Please <Link to="/signup" style={{ color: 'var(--red-primary)' }}>Sign Up</Link> first.</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', backgroundColor: '#1e1e1e', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#fff' }}>Verify Email</h2>
            <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#888' }}>
                Enter the code sent to <strong>{email}</strong>
            </p>

            <ErrorMessage message={error} />
            <SuccessMessage message={success} />

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="ENTER CODE"
                    maxLength={6}
                    style={{
                        width: '100%', padding: '0.75rem', borderRadius: '4px',
                        border: '1px solid #333', backgroundColor: '#2d2d2d', color: '#fff',
                        textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.5rem'
                    }}
                />

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '0.75rem' }}>
                    {loading ? <Loader /> : 'Verify'}
                </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button onClick={handleResend} style={{ background: 'none', border: 'none', color: 'var(--red-primary)', cursor: 'pointer', textDecoration: 'underline' }}>
                    Resend Code
                </button>
            </div>
        </div>
    );
};

export default VerifyOTP;
