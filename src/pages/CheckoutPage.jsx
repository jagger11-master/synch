import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AddressForm from '../components/checkout/AddressForm';
import Loader from '../components/common/Loader';
import { CreditCard, Truck, CheckCircle, ChevronRight, MapPin, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CheckoutPage = () => {
    const { t } = useTranslation();
    const { cart, cartTotal } = useCart();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [loading, setLoading] = useState(false);

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState('mobile_money');
    const [accountNumber, setAccountNumber] = useState('');
    const [pin, setPin] = useState('');

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await api.get('/addresses');
            setAddresses(response.data);
            if (response.data.length > 0) {
                setSelectedAddressId(response.data[0].id);
            } else {
                setShowAddressForm(true);
            }
        } catch (err) {
            console.error('Failed to load addresses');
        }
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const payload = {
                addressId: selectedAddressId,
                paymentMethod,
                accountNumber,
                pin,
                couponCode: ''
            };

            const response = await api.post('/checkout', payload);
            if (response.status === 201) {
                navigate('/order-confirmation', { state: { order: response.data } });
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                    <h2 style={{ color: 'var(--text-body)', marginBottom: '1.5rem' }}>Your cart is empty</h2>
                    <button onClick={() => navigate('/shop')} className="btn btn-primary">Go Shopping</button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main className="container" style={{ flex: 1, padding: '2rem 1rem' }}>
                <h1 style={{ marginBottom: '2rem', color: 'var(--text-body)' }}>Checkout</h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                    {/* Left Column: Steps */}
                    <div>
                        {/* Step 1: Shipping Address */}
                        <div style={{
                            marginBottom: '2rem',
                            padding: '2rem',
                            backgroundColor: 'var(--bg-surface)',
                            borderRadius: '16px',
                            border: step === 1 ? '2px solid var(--red-primary)' : '1px solid var(--border-color)',
                            boxShadow: 'var(--shadow)'
                        }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-body)', marginBottom: '1.5rem' }}>
                                <Truck size={24} color="var(--red-primary)" /> {t('address')}
                            </h2>

                            {step === 1 && (
                                <div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {addresses.map(addr => (
                                            <div
                                                key={addr.id}
                                                onClick={() => setSelectedAddressId(addr.id)}
                                                style={{
                                                    padding: '1.25rem', borderRadius: '10px', cursor: 'pointer',
                                                    backgroundColor: selectedAddressId === addr.id ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-body)',
                                                    border: selectedAddressId === addr.id ? '2px solid var(--red-primary)' : '1px solid var(--border-color)',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div>
                                                        <div style={{ fontWeight: 'bold', color: 'var(--text-body)', marginBottom: '0.25rem' }}>{addr.fullName}</div>
                                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{addr.street}, {addr.city}</div>
                                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{addr.phone}</div>
                                                    </div>
                                                    {selectedAddressId === addr.id && <CheckCircle size={20} color="var(--red-primary)" />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {showAddressForm ? (
                                        <div style={{ marginTop: '1.5rem', padding: '1.5rem', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                                            <AddressForm
                                                onAddressAdded={() => { setShowAddressForm(false); fetchAddresses(); }}
                                                onCancel={() => setShowAddressForm(false)}
                                            />
                                        </div>
                                    ) : (
                                        <button onClick={() => setShowAddressForm(true)} style={{ color: 'var(--red-primary)', background: 'none', border: 'none', cursor: 'pointer', marginTop: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            + {t('profile')}
                                        </button>
                                    )}

                                    <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                                        <button
                                            onClick={() => selectedAddressId && setStep(2)}
                                            disabled={!selectedAddressId}
                                            className="btn btn-primary"
                                            style={{ padding: '0.8rem 1.5rem' }}
                                        >
                                            Continue to Payment <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                            {step > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ color: 'var(--text-muted)' }}>{addresses.find(a => a.id === selectedAddressId)?.street}</div>
                                    <button onClick={() => setStep(1)} style={{ color: 'var(--red-primary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>Change</button>
                                </div>
                            )}
                        </div>

                        {/* Step 2: Payment */}
                        <div style={{
                            padding: '2rem',
                            backgroundColor: 'var(--bg-surface)',
                            borderRadius: '16px',
                            border: step === 2 ? '2px solid var(--red-primary)' : '1px solid var(--border-color)',
                            opacity: step < 2 ? 0.6 : 1,
                            boxShadow: 'var(--shadow)'
                        }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-body)', marginBottom: '1.5rem' }}>
                                <CreditCard size={24} color="var(--red-primary)" /> {t('payment')}
                            </h2>

                            {step === 2 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Select Method</label>
                                        <select
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            style={{ width: '100%' }}
                                        >
                                            <option value="mobile_money">Mobile Money (M-Pesa/Airtel)</option>
                                            <option value="card">Credit Card (Simulated)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Account/Phone Number</label>
                                        <input
                                            type="text"
                                            value={accountNumber}
                                            onChange={(e) => setAccountNumber(e.target.value)}
                                            placeholder="e.g. 0712345678"
                                            style={{ width: '100%' }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>PIN (Simulated)</label>
                                        <input
                                            type="password"
                                            value={pin}
                                            onChange={(e) => setPin(e.target.value)}
                                            placeholder="****"
                                            style={{ width: '100%' }}
                                        />
                                    </div>

                                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: '500' }}>Back</button>
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={loading || !accountNumber || !pin}
                                            className="btn btn-primary"
                                            style={{ padding: '0.8rem 2rem' }}
                                        >
                                            {loading ? 'Processing...' : `${t('confirm')} ($${cartTotal.toFixed(2)})`}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Summary */}
                    <div>
                        <div style={{
                            backgroundColor: 'var(--bg-surface)',
                            padding: '2rem',
                            borderRadius: '16px',
                            border: '1px solid var(--border-color)',
                            position: 'sticky',
                            top: '100px',
                            boxShadow: 'var(--shadow)'
                        }}>
                            <h3 style={{ color: 'var(--text-body)', marginBottom: '1.5rem' }}>Order Summary</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                                {cart.map(item => (
                                    <div key={item.id || item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ color: 'var(--text-body)', fontSize: '0.95rem', fontWeight: '500' }}>{item.Product.name}</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Qty: {item.quantity}</div>
                                        </div>
                                        <div style={{ color: 'var(--text-body)', fontWeight: 'bold' }}>${(item.Product.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', color: 'var(--text-body)', fontSize: '1.3rem', fontWeight: 'bold' }}>
                                <span>Total</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CheckoutPage;
