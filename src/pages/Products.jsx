import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../api/services';
import { getImageUrl } from '../config/config';
import Navbar from '../components/Navbar';
import './Products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productsAPI.getProducts();
            setProducts(data.products || []);
        } catch (err) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="products-page">
            <Navbar />

            <div className="products-container">
                <div className="container">
                    <div className="products-header">
                        <h1>All Products</h1>
                        <p>Discover our complete collection of premium electronics</p>
                    </div>

                    {loading && (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading products...</p>
                        </div>
                    )}

                    {error && (
                        <div className="error-state">
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && products.length === 0 && (
                        <div className="empty-state">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            <h3>No Products Available</h3>
                            <p>Products will appear here once the admin adds them to the store.</p>
                        </div>
                    )}

                    {!loading && products.length > 0 && (
                        <div className="products-grid">
                            {products.map((product) => (
                                <Link to={`/products/${product.id}`} key={product.id} className="product-card card">
                                    <div className="product-image">
                                        {product.ProductImages && product.ProductImages[0] ? (
                                            <img
                                                src={getImageUrl(product.ProductImages[0].imageUrl)}
                                                alt={product.name}
                                            />
                                        ) : (
                                            <div className="no-image">
                                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                                    <polyline points="21 15 16 10 5 21" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    <div className="product-info">
                                        <h3 className="product-name">{product.name}</h3>
                                        <p className="product-description">{product.description}</p>
                                        <div className="product-footer">
                                            <span className="product-price">${product.price}</span>
                                            <button className="btn btn-primary btn-sm">View Details</button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
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

export default Products;
