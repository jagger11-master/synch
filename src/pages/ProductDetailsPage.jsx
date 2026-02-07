import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getImageUrl } from '../config/config';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft, Check, Star, MessageSquare, Send, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState('');

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            const data = response.data;
            setProduct(data);
            if (data.ProductImages && data.ProductImages.length > 0) {
                setSelectedImage(data.ProductImages[0].imageUrl);
            }
        } catch (err) {
            setError('Failed to load product details.');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/reviews/${id}`);
            setReviews(response.data);
        } catch (err) {
            console.error('Failed to fetch reviews', err);
        }
    };

    const handleAddToCart = async () => {
        if (!product) return;
        await addToCart(product, quantity, selectedVariant);
        alert(t('add_to_cart') + ' successful!');
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        setReviewError('');
        try {
            await api.post('/reviews', { productId: id, rating, comment });
            setComment('');
            fetchReviews();
            alert('Review submitted successfully!');
        } catch (err) {
            setReviewError(err.response?.data?.error || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
        : 0;

    const currentPrice = selectedVariant
        ? parseFloat(product.price) + parseFloat(selectedVariant.priceModifier)
        : product?.price;

    const currentStock = selectedVariant
        ? selectedVariant.stock
        : product?.stock;

    if (loading) return <Loader />;
    if (error) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ flex: 1, padding: '2rem', textAlign: 'center' }}>
                <ErrorMessage message={error} />
                <button onClick={() => navigate('/shop')} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                    {t('home')}
                </button>
            </div>
            <Footer />
        </div>
    );

    if (!product) return null;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <main className="container" style={{ flex: 1, padding: '2rem 1rem' }}>
                <button
                    onClick={() => navigate('/shop')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', cursor: 'pointer', fontWeight: '600' }}
                >
                    <ArrowLeft size={20} /> {t('shop')}
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '4rem', marginBottom: '4rem' }}>
                    {/* Image Gallery */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{
                            aspectRatio: '1/1', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: 'var(--shadow)'
                        }}>
                            {selectedImage ? (
                                <img src={getImageUrl(selectedImage)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }} />
                            ) : (
                                <div style={{ color: 'var(--text-muted)' }}>No Image Available</div>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'thin' }}>
                            {product.ProductImages?.map((img, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedImage(img.imageUrl)}
                                    style={{
                                        width: '80px', height: '80px', borderRadius: '10px', border: selectedImage === img.imageUrl ? '2px solid var(--red-primary)' : '1px solid var(--border-color)',
                                        overflow: 'hidden', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s', backgroundColor: 'var(--bg-surface)'
                                    }}
                                >
                                    <img src={getImageUrl(img.imageUrl)} alt={`Thumbnail ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <span style={{ backgroundColor: 'var(--red-primary)', color: '#fff', fontSize: '0.75rem', fontWeight: '800', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase' }}>
                                {product.Category?.name}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b' }}>
                                <Star size={18} fill={averageRating > 0 ? "#f59e0b" : "none"} />
                                <span style={{ fontWeight: '800', color: 'var(--text-body)', fontSize: '1.1rem' }}>{averageRating}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({reviews.length})</span>
                            </div>
                        </div>

                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', color: 'var(--text-body)', marginBottom: '1rem', lineHeight: 1.1 }}>{product.name}</h1>
                        <p style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--red-primary)', marginBottom: '2rem' }}>
                            ${parseFloat(currentPrice).toFixed(2)}
                        </p>

                        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
                            <p style={{ color: 'var(--text-body)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                                {product.description}
                            </p>
                        </div>

                        {/* Variants Selection */}
                        {product.ProductVariants && product.ProductVariants.length > 0 && (
                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={{ display: 'block', color: 'var(--text-body)', fontWeight: 'bold', marginBottom: '1rem' }}>Choose Variant:</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    {product.ProductVariants.map(variant => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedVariant(selectedVariant?.id === variant.id ? null : variant)}
                                            style={{
                                                padding: '0.75rem 1.5rem',
                                                borderRadius: '10px',
                                                border: selectedVariant?.id === variant.id ? '2px solid var(--red-primary)' : '1px solid var(--border-color)',
                                                backgroundColor: selectedVariant?.id === variant.id ? 'var(--bg-body)' : 'var(--bg-surface)',
                                                color: 'var(--text-body)',
                                                cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                transition: 'all 0.2s',
                                                fontWeight: selectedVariant?.id === variant.id ? '800' : '500'
                                            }}
                                        >
                                            {variant.name}: {variant.value}
                                            {selectedVariant?.id === variant.id && <Check size={18} color="var(--red-primary)" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add to Cart Section */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border-color)', overflow: 'hidden'
                            }}>
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    style={qtyBtnStyle}
                                >−</button>
                                <span style={{ width: '40px', textAlign: 'center', color: 'var(--text-body)', fontWeight: '800' }}>{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    style={qtyBtnStyle}
                                >+</button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={currentStock <= 0}
                                className="btn btn-primary"
                                style={{ flex: 1, minWidth: '200px', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', opacity: currentStock <= 0 ? 0.5 : 1, fontSize: '1.1rem', borderRadius: '10px' }}
                            >
                                <ShoppingCart size={22} />
                                {currentStock > 0 ? t('add_to_cart') : t('out_of_stock')}
                            </button>
                        </div>
                        <div style={{ marginTop: '1rem', color: currentStock > 0 ? '#10b981' : '#ef4444', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <ShieldCheck size={16} /> {currentStock > 0 ? `${currentStock} items in stock` : 'Sold Out'}
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '4rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '4rem' }}>

                        {/* Review List */}
                        <div>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', color: 'var(--text-body)' }}>
                                <MessageSquare size={28} color="var(--red-primary)" /> Customer Stories
                            </h2>
                            {reviews.length === 0 ? (
                                <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
                                    <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to share your experience!</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {reviews.map(review => (
                                        <div key={review.id} style={{ backgroundColor: 'var(--bg-surface)', padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red-primary)', fontWeight: 'bold', border: '1px solid var(--border-color)' }}>
                                                        {review.User?.username?.[0].toUpperCase()}
                                                    </div>
                                                    <span style={{ fontWeight: '800', color: 'var(--text-body)' }}>{review.User?.username}</span>
                                                </div>
                                                <div style={{ display: 'flex', color: '#f59e0b' }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={14} fill={i < review.rating ? "#f59e0b" : "none"} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p style={{ color: 'var(--text-body)', lineHeight: 1.6 }}>{review.comment}</p>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem' }}>{new Date(review.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Leave a Review Form */}
                        <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
                            <h2 style={{ marginBottom: '2rem', color: 'var(--text-body)' }}>Share Your Feedback</h2>
                            <form onSubmit={handleReviewSubmit} style={{ backgroundColor: 'var(--bg-surface)', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
                                {reviewError && <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>{reviewError}</div>}
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 'bold' }}>Your Rating</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {[1, 2, 3, 4, 5].map(num => (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => setRating(num)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.1s' }}
                                                onMouseDown={(e) => e.target.style.transform = 'scale(0.9)'}
                                                onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                                            >
                                                <Star size={32} color={rating >= num ? '#f59e0b' : 'var(--border-color)'} fill={rating >= num ? "#f59e0b" : "none"} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 'bold' }}>Detailed Comment</label>
                                    <textarea
                                        rows="5"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Tell others what you thought about this product..."
                                        required
                                        style={{ width: '100%', resize: 'none', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-body)' }}
                                    />
                                </div>
                                <button type="submit" disabled={submittingReview} className="btn btn-primary" style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', fontWeight: '800' }}>
                                    <Send size={20} /> {submittingReview ? 'Sending...' : 'Post Review'}
                                </button>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1.5rem', justifyContent: 'center' }}>
                                    <ShieldCheck size={14} /> Only verified buyers can leave reviews.
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

const qtyBtnStyle = {
    padding: '0.8rem 1.25rem',
    background: 'none',
    border: 'none',
    color: 'var(--text-body)',
    cursor: 'pointer',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    transition: 'background 0.2s',
    '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.05)'
    }
};

export default ProductDetailsPage;
