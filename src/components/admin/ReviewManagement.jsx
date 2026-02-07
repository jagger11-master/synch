import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import { Star, MessageSquare, User, Package } from 'lucide-react';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await api.get('/reviews');
            setReviews(response.data);
        } catch (err) {
            setError('Failed to fetch reviews.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: '#fff', fontSize: '1.8rem' }}>Product Reviews</h2>
                <p style={{ color: '#888' }}>Monitor customer feedback</p>
            </div>

            <ErrorMessage message={error} />

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {reviews.map(review => (
                    <div key={review.id} style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#252525', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={20} color="#888" />
                                </div>
                                <div>
                                    <h4 style={{ color: '#fff', margin: 0 }}>{review.User?.username}</h4>
                                    <span style={{ color: '#666', fontSize: '0.85rem' }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '2px' }}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < review.rating ? "#f59e0b" : "transparent"} color={i < review.rating ? "#f59e0b" : "#444"} />
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--red-primary)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                            <Package size={14} />
                            <strong>{review.Product?.name || 'Unknown Product'}</strong>
                        </div>

                        <p style={{ color: '#ccc', lineHeight: '1.6', margin: 0 }}>
                            <MessageSquare size={16} style={{ marginRight: '8px', verticalAlign: 'middle', opacity: 0.5 }} />
                            "{review.comment}"
                        </p>
                    </div>
                ))}

                {reviews.length === 0 && (
                    <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#1e1e1e', borderRadius: '12px', color: '#666' }}>
                        No reviews found in the system.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewManagement;
