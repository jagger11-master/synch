import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, userAPI, checkoutAPI } from '../api/services';
import Navbar from '../components/Navbar';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [cartData, addressData] = await Promise.all([
                cartAPI.getCart(),
                userAPI.getAddresses()
            ]);

            setCart(cartData.cart);
            setAddresses(addressData.addresses || []);

            // Auto-select default address
            const defaultAddr = addressData.addresses?.find(addr => addr.isDefault);
            if (defaultAddr) {
                setSelectedAddress(defaultAddr.id.toString());
            }
        } catch (err) {
            setError('Failed to load checkout data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        if (!cart || !cart.CartItems) return 0;
        return cart.CartItems.reduce((total, item) => {
            return total + (parseFloat(item.price) * item.quantity);
        }, 0).toFixed(2);
    };

    const handleCheckout = async () => {
        if (!selectedAddress) {
            alert('Please select a shipping address');
            return;
        }

        try {
            setProcessing(true);
            await checkoutAPI.checkout(parseInt(selectedAddress));
            alert('Order placed successfully!');
            navigate('/orders');
        } catch (err) {
            alert(err.response?.data?.error || 'Checkout failed');
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="checkout-page">
                <Navbar />
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading checkout...</p>
                </div>
            </div>
        );
    }

    const cartItems = cart?.CartItems || [];
    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="checkout-page">
            <Navbar />

            <div className="checkout-container">
                <div className="container">
                    <h1>Checkout</h1>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="checkout-content">
                        {/* Left Column - Shipping & Payment */}
                        <div className="checkout-main">
                            {/* Shipping Address */}
                            <div className="checkout-section card">
                                <h2>Shipping Address</h2>

                                {addresses.length === 0 ? (
                                    <div className="no-addresses">
                                        <p>No addresses found. Please add an address in your profile.</p>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => navigate('/profile')}
                                        >
                                            Go to Profile
                                        </button>
                                    </div>
                                ) : (
                                    <div className="address-list">
                                        {addresses.map((address) => (
                                            <label key={address.id} className="address-option">
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    value={address.id}
                                                    checked={selectedAddress === address.id.toString()}
                                                    onChange={(e) => setSelectedAddress(e.target.value)}
                                                />
                                                <div className="address-details">
                                                    <p className="address-name">{address.fullName}</p>
                                                    <p>{address.addressLine1}</p>
                                                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                                                    <p>{address.city}, {address.state} {address.postalCode}</p>
                                                    <p>{address.country}</p>
                                                    {address.isDefault && <span className="default-badge">Default</span>}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Payment Method */}
                            <div className="checkout-section card">
                                <h2>Payment Method</h2>
                                <div className="payment-info">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                        <line x1="1" y1="10" x2="23" y2="10" />
                                    </svg>
                                    <p>Cash on Delivery</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="checkout-summary card">
                            <h2>Order Summary</h2>

                            <div className="summary-items">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="summary-item">
                                        <div className="summary-item-info">
                                            <p className="summary-item-name">{item.Product.name}</p>
                                            <p className="summary-item-qty">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="summary-item-price">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-totals">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>${calculateTotal()}</span>
                                </div>

                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>

                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>${calculateTotal()}</span>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary btn-full"
                                onClick={handleCheckout}
                                disabled={processing || !selectedAddress || addresses.length === 0}
                            >
                                {processing ? 'Processing...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-bottom">
                        <p>&copy; 2026 SynchShop. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Checkout;
