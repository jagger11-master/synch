import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { CheckCircle, Package, ArrowRight, Printer } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const OrderConfirmation = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { order } = location.state || {};

    if (!order) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <h2 style={{ color: 'var(--text-body)' }}>Order not found</h2>
                    <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Shop</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-body)' }}>
            <Navbar />

            <main className="container" style={{ flex: 1, padding: '4rem 1rem', textAlign: 'center' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'var(--bg-surface)', padding: '3rem 2rem', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <CheckCircle size={80} color="#10b981" style={{ margin: '0 auto', marginBottom: '1.5rem' }} />
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-body)', marginBottom: '0.5rem' }}>Thank You!</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Your order has been placed successfully.</p>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-body)', padding: '2rem', borderRadius: '16px', marginBottom: '2.5rem', border: '1px solid var(--border-color)' }}>
                        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px dashed var(--border-color)' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Order Number</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--red-primary)' }}>#{order.id}</div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', textAlign: 'left' }}>
                            <div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold' }}>Amount Paid</div>
                                <div style={{ color: 'var(--text-body)', fontWeight: 'bold' }}>${parseFloat(order.totalAmount).toFixed(2)}</div>
                            </div>
                            <div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold' }}>Status</div>
                                <div style={{ color: '#10b981', fontWeight: 'bold' }}>{order.status.toUpperCase()}</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Link to="/orders" className="btn btn-primary" style={{ padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', borderRadius: '12px' }}>
                            <Package size={20} /> View Order Status
                        </Link>
                        <button onClick={() => window.print()} style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-body)', padding: '0.8rem', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '600' }}>
                            <Printer size={18} /> Print Receipt
                        </button>
                    </div>

                    <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '2.5rem', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.95rem' }}>
                        Continue Shopping <ArrowRight size={18} />
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default OrderConfirmation;
