import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../config/config';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import { Trash2, ArrowRight, ShoppingBag, Minus, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CartPage = () => {
    const { t } = useTranslation();
    const { cart, loading, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    if (loading) return <Loader />;

    const isEmpty = cart.length === 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />

            <main className="container" style={{ flex: 1, padding: '2rem 1rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-body)', marginBottom: '2rem' }}>{t('cart')}</h1>

                {isEmpty ? (
                    <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
                        <ShoppingBag size={64} style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', opacity: 0.5 }} />
                        <h2 style={{ color: 'var(--text-body)', marginBottom: '1rem' }}>{t('no_orders').replace('orders', 'items')}</h2>
                        <Link to="/shop" className="btn btn-primary">{t('shop')}</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>

                        {/* Cart Items List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {cart.map(item => (
                                <div key={item.id || item.productId} style={{
                                    display: 'flex',
                                    gap: '1.5rem',
                                    backgroundColor: 'var(--bg-surface)',
                                    padding: '1.5rem',
                                    borderRadius: '16px',
                                    border: '1px solid var(--border-color)',
                                    alignItems: 'center',
                                    boxShadow: 'var(--shadow)'
                                }}>
                                    <div style={{ width: '100px', height: '100px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                                        {item.Product?.ProductImages?.[0] ? (
                                            <img src={getImageUrl(item.Product.ProductImages[0].imageUrl)} alt={item.Product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}><ShoppingBag size={24} /></div>
                                        )}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <Link to={`/products/${item.Product.id}`} style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-body)', textDecoration: 'none' }}>
                                            {item.Product.name}
                                        </Link>
                                        <p style={{ color: 'var(--red-primary)', fontWeight: '800', marginTop: '0.25rem' }}>${item.Product.price}</p>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-body)' }}>
                                                <button
                                                    onClick={() => updateQuantity(item.id || item.productId, item.productId, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    style={qtyBtnStyle}
                                                ><Minus size={16} /></button>
                                                <span style={{ padding: '0 0.75rem', fontWeight: '800', color: 'var(--text-body)', minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id || item.productId, item.productId, item.quantity + 1)}
                                                    style={qtyBtnStyle}
                                                ><Plus size={16} /></button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id || item.productId, item.productId)}
                                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 'bold', fontSize: '0.9rem' }}
                                            >
                                                <Trash2 size={18} /> {t('logout').replace('Logout', 'Remove')}
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right', display: 'none' /* Hidden on small cards, shown on desktop maybe */ }}>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-body)' }}>${(item.Product.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div style={{ position: 'sticky', top: '100px' }}>
                            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
                                <h2 style={{ color: 'var(--text-body)', marginBottom: '2rem', fontSize: '1.4rem' }}>Order Summary</h2>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                        <span>Subtotal</span>
                                        <span style={{ fontWeight: '600' }}>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                        <span>Shipping</span>
                                        <span style={{ color: '#10b981', fontWeight: '800' }}>FREE</span>
                                    </div>
                                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', color: 'var(--text-body)', fontSize: '1.5rem', fontWeight: '900' }}>
                                        <span>{t('total')}</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', borderRadius: '12px' }}
                                    onClick={() => navigate('/checkout')}
                                >
                                    {t('checkout')} <ArrowRight size={20} />
                                </button>

                                <Link to="/shop" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                                    {t('home').replace('Home', 'Continue Shopping')}
                                </Link>
                            </div>
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
    padding: '0.6rem 0.8rem',
    display: 'flex',
    alignItems: 'center',
    transition: 'background 0.2s'
};

export default CartPage;
