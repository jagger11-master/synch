import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    // Load initial cart
    useEffect(() => {
        if (token) {
            fetchUserCart();
        } else {
            const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCart(localCart);
            setLoading(false);
        }
    }, [token]);

    // Save to local storage if no token
    useEffect(() => {
        if (!token) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, token]);

    const fetchUserCart = async () => {
        try {
            const response = await api.get('/cart');
            setCart(response.data);
        } catch (err) {
            console.error('Failed to fetch cart', err);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product, quantity = 1, variant = null) => {
        // Optimistic UI update or Local Logic
        const newItem = {
            id: Date.now(), // Temp ID for local, Backend will replace
            productId: product.id,
            Product: product,
            quantity: parseInt(quantity),
            variant: variant // Store variant info locally if needed
        };

        if (token) {
            try {
                // Backend expects: productId, quantity. (Variant support needs backend update, skipping for now)
                await api.post('/cart', { productId: product.id, quantity });
                await fetchUserCart(); // Sync with real backend data
            } catch (err) {
                console.error('Failed to add to cart', err);
                alert('Failed to add to cart');
            }
        } else {
            // Local Guest Cart
            setCart(prevCart => {
                const existingItem = prevCart.find(item => item.productId === product.id);
                if (existingItem) {
                    return prevCart.map(item =>
                        item.productId === product.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                }
                return [...prevCart, newItem];
            });
        }
    };

    const removeFromCart = async (cartId, productId) => {
        if (token) {
            try {
                await api.delete(`/cart/${cartId}`);
                setCart(prev => prev.filter(item => item.id !== cartId));
            } catch (err) {
                console.error('Failed to remove item', err);
            }
        } else {
            setCart(prev => prev.filter(item => item.productId !== productId));
        }
    };

    const updateQuantity = async (cartId, productId, newQuantity) => {
        if (newQuantity < 1) return;

        if (token) {
            try {
                // Optimistic
                setCart(prev => prev.map(item => item.id === cartId ? { ...item, quantity: newQuantity } : item));
                await api.put(`/cart/${cartId}`, { quantity: newQuantity });
            } catch (err) {
                console.error('Failed to update quantity', err);
                fetchUserCart(); // Revert on error
            }
        } else {
            setCart(prev => prev.map(item =>
                item.productId === productId ? { ...item, quantity: newQuantity } : item
            ));
        }
    };

    const cartTotal = cart.reduce((total, item) => {
        const price = parseFloat(item.Product?.price || 0);
        return total + (price * item.quantity);
    }, 0);

    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};
