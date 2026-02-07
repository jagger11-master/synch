import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import SuccessMessage from '../common/SuccessMessage';
import { Tag, Trash2, Plus, Calendar } from 'lucide-react';

const CouponManagement = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ code: '', discountPercentage: '', expiryDate: '' });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await api.get('/coupons');
            setCoupons(response.data);
        } catch (err) {
            setError('Failed to fetch coupons.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this coupon?')) return;
        try {
            await api.delete(`/coupons/${id}`);
            setSuccess('Coupon deleted.');
            fetchCoupons();
        } catch (err) {
            setError('Delete failed.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/coupons', formData);
            setSuccess('Coupon created!');
            setShowForm(false);
            setFormData({ code: '', discountPercentage: '', expiryDate: '' });
            fetchCoupons();
        } catch (err) {
            setError('Creation failed.');
        }
    };

    if (loading) return <Loader />;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ color: '#fff', fontSize: '1.8rem' }}>Coupons</h2>
                    <p style={{ color: '#888' }}>Manage promotional codes</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        backgroundColor: 'var(--red-primary)',
                        color: 'white', border: 'none',
                        padding: '0.75rem 1.5rem', borderRadius: '8px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}
                >
                    <Plus size={18} /> {showForm ? 'Cancel' : 'New Coupon'}
                </button>
            </div>

            <ErrorMessage message={error} />
            <SuccessMessage message={success} />

            {showForm && (
                <div style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #333' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'end' }}>
                        <div>
                            <label style={{ color: '#ccc', display: 'block', marginBottom: '0.5rem' }}>Code</label>
                            <input
                                type="text"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#2d2d2d', border: '1px solid #444', color: '#fff' }}
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ color: '#ccc', display: 'block', marginBottom: '0.5rem' }}>Discount (%)</label>
                            <input
                                type="number"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#2d2d2d', border: '1px solid #444', color: '#fff' }}
                                value={formData.discountPercentage}
                                onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ color: '#ccc', display: 'block', marginBottom: '0.5rem' }}>Expiry Date</label>
                            <input
                                type="date"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#2d2d2d', border: '1px solid #444', color: '#fff' }}
                                value={formData.expiryDate}
                                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" style={{ backgroundColor: '#fff', color: '#000', fontWeight: 'bold', padding: '0.75rem', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                            Create
                        </button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {coupons.map(coupon => (
                    <div key={coupon.id} style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333', position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '10px' }}>
                                <Tag color="#ef4444" />
                            </div>
                            <div>
                                <h3 style={{ color: '#fff', margin: 0 }}>{coupon.code}</h3>
                                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{coupon.discountPercentage}% OFF</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.9rem' }}>
                            <Calendar size={14} />
                            Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                        </div>
                        <button
                            onClick={() => handleDelete(coupon.id)}
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CouponManagement;
