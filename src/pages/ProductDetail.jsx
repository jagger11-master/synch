import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, cartAPI } from '../api/services';
import { getImageUrl } from '../config/config';
import Navbar from '../components/Navbar';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const data = await productsAPI.getProductById(id);
            setProduct(data.product);
        } catch (err) {
            setError('Product not found');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            setAddingToCart(true);
            await cartAPI.addToCart(product.id, quantity);
            alert('Product added to cart!');
        } catch (err) {
            alert('Failed to add to cart');
            console.error(err);
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="product-detail-page">
                <Navbar />
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading product...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-detail-page">
                <Navbar />
                <div className="error-container">
                    <h2>Product Not Found</h2>
                    <button className="btn btn-primary" onClick={() => navigate('/products')}>
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="product-detail-page">
            <Navbar />

            <div className="product-detail-container">
                <div className="container">
                    <button className="back-btn" onClick={() => navigate('/products')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Products
                    </button>

                    <div className="product-detail-content">
                        {/* Image Gallery */}
                        <div className="product-gallery">
                            <div className="main-image">
                                {product.ProductImages && product.ProductImages[selectedImage] ? (
                                    <img
                                        src={getImageUrl(product.ProductImages[selectedImage].imageUrl)}
                                        alt={product.name}
                                    />
                                ) : (
                                    <div className="no-image-large">
                                        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {product.ProductImages && product.ProductImages.length > 1 && (
                                <div className="thumbnail-list">
                                    {product.ProductImages.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                            onClick={() => setSelectedImage(index)}
                                        >
                                            <img src={getImageUrl(image.imageUrl)} alt={`${product.name} ${index + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="product-info-section">
                            <h1 className="product-title">{product.name}</h1>
                            <p className="product-price-large">${product.price}</p>

                            <div className="product-description-section">
                                <h3>Description</h3>
                                <p>{product.description}</p>
                            </div>

                            {product.stock > 0 ? (
                                <div className="stock-info in-stock">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    In Stock ({product.stock} available)
                                </div>
                            ) : (
                                <div className="stock-info out-of-stock">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="15" y1="9" x2="9" y2="15" />
                                        <line x1="9" y1="9" x2="15" y2="15" />
                                    </svg>
                                    Out of Stock
                                </div>
                            )}

                            <div className="quantity-selector">
                                <label>Quantity:</label>
                                <div className="quantity-controls">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span>{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        disabled={quantity >= product.stock}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary btn-large"
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || addingToCart}
                            >
                                {addingToCart ? 'Adding...' : 'Add to Cart'}
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

export default ProductDetail;
