import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getImageUrl } from '../config/config';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import { Package, ChevronRight, Hash, Calendar, DollarSign, Tag, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const OrdersPage = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/checkout/history');
            setOrders(response.data);
        } catch (err) {
            setError('Failed to load order history');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'paid': return '#3b82f6';
            case 'pending': return '#f59e0b';
            case 'shipped': return '#8b5cf6';
            case 'delivered': return '#10b981';
            case 'failed': return '#ef4444';
            default: return '#6b7280';
        }
    };

    if (loading) return <Loader />;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />

            <main className="container" style={{ flex: 1, padding: '2rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <ShoppingBag size={32} color="var(--red-primary)" />
                    <h1 style={{ fontSize: '2rem', color: 'var(--text-body)' }}>{t('orders')}</h1>
                </div>

                {error && <div style={{ color: '#ef4444', marginBottom: '2rem' }}>{error}</div>}

                {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <Package size={64} style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', opacity: 0.5 }} />
                        <h2 style={{ color: 'var(--text-body)', marginBottom: '1rem' }}>{t('no_orders')}</h2>
                        <a href="/shop" className="btn btn-primary">{t('shop')}</a>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {orders.map(order => (
                            <div key={order.id} style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                                {/* Order Header */}
                                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Order ID</div>
                                            <div style={{ color: 'var(--text-body)', fontWeight: 'bold' }}>#{order.id}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Date</div>
                                            <div style={{ color: 'var(--text-body)' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>{t('total')}</div>
                                            <div style={{ color: 'var(--red-primary)', fontWeight: 'bold' }}>${parseFloat(order.totalAmount).toFixed(2)}</div>
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '0.4rem 1rem',
                                        borderRadius: '20px',
                                        backgroundColor: `${getStatusColor(order.status)}15`,
                                        color: getStatusColor(order.status),
                                        fontSize: '0.8rem',
                                        fontWeight: '800',
                                        textTransform: 'uppercase',
                                        border: `1px solid ${getStatusColor(order.status)}40`
                                    }}>
                                        {order.status}
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'grid', gap: '1.25rem' }}>
                                        {order.OrderItems?.map(item => (
                                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--bg-body)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)', flexShrink: 0 }}>
                                                        {item.Product?.ProductImages?.[0] ? (
                                                            <img
                                                                src={getImageUrl(item.Product.ProductImages[0].imageUrl)}
                                                                alt={item.Product.name}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}><Package size={20} /></div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div style={{ color: 'var(--text-body)', fontWeight: 'bold', fontSize: '1rem' }}>{item.Product?.name || 'Unknown Product'}</div>
                                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ${parseFloat(item.priceAtPurchase).toFixed(2)}</div>
                                                    </div>
                                                </div>
                                                <div style={{ color: 'var(--text-body)', fontWeight: 'bold' }}>
                                                    ${(item.quantity * item.priceAtPurchase).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                                        <button
                                            onClick={() => alert('Detail view coming soon!')}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: 'var(--red-primary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}
                                        >
                                            View Support <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default OrdersPage;
