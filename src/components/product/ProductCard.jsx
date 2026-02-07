import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../../config/config';
import '../../assets/styles/animations.css';

const ProductCard = ({ product, index }) => {
    const { addToCart } = useCart();
    const { t } = useTranslation();

    const handleAdd = (e) => {
        e.preventDefault();
        addToCart(product, 1);
        alert(t('add_to_cart') + ' successful!');
    };

    // Staggered delay based on index
    const staggerDelay = { animationDelay: `${index * 0.1}s` };

    return (
        <Link
            to={`/products/${product.id}`}
            className="hover-lift animate-reveal"
            style={{ ...cardStyle, ...staggerDelay }}
        >
            <div style={imageWrapperStyle}>
                {product.ProductImages && product.ProductImages.length > 0 ? (
                    <img
                        src={getImageUrl(product.ProductImages[0].imageUrl)}
                        alt={product.name}
                        style={imageStyle}
                    />
                ) : (
                    <div style={placeholderStyle}>No Image</div>
                )}
                <div style={categoryBadgeStyle}>{product.Category?.name}</div>
            </div>

            <div style={contentStyle}>
                <h3 style={titleStyle}>{product.name}</h3>

                <div style={ratingWrapperStyle}>
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < 4 ? "#f59e0b" : "none"} color="#f59e0b" />
                    ))}
                    <span style={ratingTextStyle}>(4.0)</span>
                </div>

                <div style={footerStyle}>
                    <span style={priceStyle}>${parseFloat(product.price).toFixed(2)}</span>
                    <button
                        onClick={handleAdd}
                        style={cartBtnStyle}
                        className="animate-scale"
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </Link>
    );
};

const cardStyle = {
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '16px',
    overflow: 'hidden',
    textDecoration: 'none',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
};

const imageWrapperStyle = {
    height: '220px',
    backgroundColor: 'var(--bg-body)',
    position: 'relative',
    overflow: 'hidden'
};

const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease'
};

const categoryBadgeStyle = {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    textTransform: 'uppercase'
};

const contentStyle = {
    padding: '1.25rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
};

const titleStyle = {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text-body)',
    marginBottom: '0.5rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
};

const ratingWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    marginBottom: '1rem'
};

const ratingTextStyle = {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginLeft: '4px'
};

const footerStyle = {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const priceStyle = {
    fontSize: '1.3rem',
    fontWeight: '900',
    color: 'var(--red-primary)'
};

const cartBtnStyle = {
    backgroundColor: 'var(--red-primary)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
};

const placeholderStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666'
};

export default ProductCard;
