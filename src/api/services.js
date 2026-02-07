import apiClient from './client';

// Authentication API endpoints
export const authAPI = {
    // Login user
    login: async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data;
    },

    // Register new user
    signup: async (username, email, password) => {
        const response = await apiClient.post('/auth/register', { username, email, password });
        return response.data;
    },

    // Verify OTP
    verifyOTP: async (email, otp) => {
        const response = await apiClient.post('/auth/verify-otp', { email, otp });
        return response.data;
    },

    // Reset password
    resetPassword: async (email) => {
        const response = await apiClient.post('/auth/reset-password', { email });
        return response.data;
    },
};

// Products API endpoints
export const productsAPI = {
    // Get all products with optional filters
    getProducts: async (params = {}) => {
        const response = await apiClient.get('/products', { params });
        return response.data;
    },

    // Get single product by ID
    getProductById: async (id) => {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    },
};

// Cart API endpoints
export const cartAPI = {
    // Get user's cart
    getCart: async () => {
        const response = await apiClient.get('/cart');
        return response.data;
    },

    // Add item to cart
    addToCart: async (productId, quantity, variantId = null) => {
        const response = await apiClient.post('/cart', { productId, quantity, variantId });
        return response.data;
    },

    // Update cart item quantity
    updateCartItem: async (itemId, quantity) => {
        const response = await apiClient.put(`/cart/${itemId}`, { quantity });
        return response.data;
    },

    // Remove item from cart
    removeFromCart: async (itemId) => {
        const response = await apiClient.delete(`/cart/${itemId}`);
        return response.data;
    },
};

// User API endpoints
export const userAPI = {
    // Get user profile
    getProfile: async () => {
        const response = await apiClient.get('/user/profile');
        return response.data;
    },

    // Get user addresses
    getAddresses: async () => {
        const response = await apiClient.get('/user/addresses');
        return response.data;
    },

    // Add new address
    addAddress: async (addressData) => {
        const response = await apiClient.post('/user/addresses', addressData);
        return response.data;
    },
};

// Checkout API endpoints
export const checkoutAPI = {
    // Create order from cart
    checkout: async (shippingAddressId) => {
        const response = await apiClient.post('/checkout', { shippingAddressId });
        return response.data;
    },
};
