import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getImageUrl } from '../config/config';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, ChevronRight, Minus, Plus, Trash2 } from 'lucide-react';

const Cart = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await api.get('/cart');
            setCart(response.data.cart);
        } catch (err) {
            console.error('Failed to load cart', err);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            setUpdating(true);
            await api.put(`/cart/${itemId}`, { quantity: newQuantity });
            fetchCart();
        } catch (err) {
            alert('Failed to update quantity');
        } finally {
            setUpdating(false);
        }
    };

    const removeItem = async (itemId) => {
        if (!confirm('Remove this item?')) return;
        try {
            setUpdating(true);
            await api.delete(`/cart/${itemId}`);
            fetchCart();
        } catch (err) {
            alert('Failed to remove item');
        } finally {
            setUpdating(false);
        }
    };

    const calculateTotal = () => {
        if (!cart || !cart.CartItems) return 0;
        return cart.CartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2);
    };

    if (loading) return <Loader />;

    const cartItems = cart?.CartItems || [];
    const isEmpty = cartItems.length === 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main className="container" style={{ flex: 1, padding: '2rem 1rem' }}>
                <h1 style={{ marginBottom: '2rem', color: 'var(--text-body)' }}>{t('cart')}</h1>

                {isEmpty ? (
                    <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <ShoppingBag size={64} color="var(--text-muted)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                        <h2 style={{ color: 'var(--text-body)', marginBottom: '1rem' }}>Your cart is empty</h2>
                        <Link to="/shop" className="btn btn-primary">{t('shop')}</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>

                        {/* Cart Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {cartItems.map((item) => (
                                <div key={item.id} style={{
                                    display: 'flex',
                                    gap: '1.5rem',
                                    backgroundColor: 'var(--bg-surface)',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)',
                                    alignItems: 'center'
                                }}>
                                    <div style={{ width: '100px', height: '100px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--bg-body)' }}>
                                        {item.Product?.ProductImages?.[0] ? (
                                            <img src={getImageUrl(item.Product.ProductImages[0].imageUrl)} alt={item.Product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>No Image</div>
                                        )}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <Link to={`/products/${item.Product.id}`} style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-body)', textDecoration: 'none' }}>
                                            {item.Product.name}
                                        </Link>
                                        <p style={{ color: 'var(--red-primary)', fontWeight: 'bold', marginTop: '0.25rem' }}>${item.price}</p>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--bg-body)' }}>
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={updating || item.quantity <= 1} style={qtyBtnStyle}><Minus size={14} /></button>
                                                <span style={{ padding: '0 0.75rem', fontWeight: 'bold', color: 'var(--text-body)' }}>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={updating} style={qtyBtnStyle}><Plus size={14} /></button>
                                            </div>
                                            <button onClick={() => removeItem(item.id)} disabled={updating} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', position: 'sticky', top: '100px' }}>
                            <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-body)' }}>Order Summary</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                    <span>Subtotal</span>
                                    <span>${calculateTotal()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                    <span>Shipping</span>
                                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>FREE</span>
                                </div>
                                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', color: 'var(--text-body)', fontSize: '1.4rem', fontWeight: 'bold' }}>
                                    <span>Total</span>
                                    <span>${calculateTotal()}</span>
                                </div>
                            </div>
                            <button onClick={() => navigate('/checkout')} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                {t('checkout')} <ChevronRight size={20} />
                            </button>
                        </div>

                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

const qtyBtnStyle = {
    background: 'none',
    border: 'none',
    color: 'var(--text-body)',
    cursor: 'pointer',
    padding: '0.5rem',
    display: 'flex',
    alignItems: 'center'
};

export default Cart;
