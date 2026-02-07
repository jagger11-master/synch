import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProductCard from '../components/product/ProductCard';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Star, Zap, ShieldCheck, Truck } from 'lucide-react';
import '../assets/styles/animations.css';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            const data = Array.isArray(response.data) ? response.data : response.data.products || [];
            setProducts(data.slice(0, 8));
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-body)' }}>
            <Navbar />

            {/* Hero Section */}
            <section style={heroSectionStyle} className="animate-fade">
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="animate-reveal" style={{ animationDelay: '0.2s' }}>
                        <span style={heroSubtitleStyle}>{t('welcome')}</span>
                        <h1 style={heroTitleStyle}>
                            Synch<span style={{ color: 'var(--red-primary)' }}>Shop</span>
                        </h1>
                        <p style={heroDescriptionStyle}>
                            Discover the latest trends in fashion and technology. Premium quality products at unbeatable prices.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <a href="/shop" className="btn btn-primary" style={heroBtnStyle}>
                                {t('shop')} Now
                            </a>
                            <a href="#featured" className="btn btn-secondary" style={{ ...heroBtnStyle, backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(5px)' }}>
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>
                <div style={heroOverlayStyle}></div>
            </section>

            {/* Floating Products Showcase */}
            <section className="container" style={floatingSectionStyle}>
                <div style={floatingGridStyle}>
                    <div className="animate-float float-delayed-1" style={floatingItemStyle}>
                        <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Watch" style={floatingImgStyle} />
                        <div style={floatingBadgeStyle}>Trends</div>
                    </div>
                    <div className="animate-float float-delayed-2" style={{ ...floatingItemStyle, marginTop: '4rem' }}>
                        <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Headphones" style={floatingImgStyle} />
                        <div style={floatingBadgeStyle}>Tech</div>
                    </div>
                    <div className="animate-float float-delayed-3" style={floatingItemStyle}>
                        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Shoes" style={floatingImgStyle} />
                        <div style={floatingBadgeStyle}>Fashion</div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <main id="featured" className="container" style={{ flex: 1, padding: '4rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }} className="animate-reveal">
                    <div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-body)' }}>{t('featured_products')}</h2>
                        <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--red-primary)', marginTop: '0.5rem', borderRadius: '2px' }}></div>
                    </div>
                    <a href="/shop" style={{ color: 'var(--red-primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        View All <ShoppingBag size={18} />
                    </a>
                </div>

                <div className="grid-auto">
                    {products.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
    <div className="animate-reveal hover-lift" style={{ ...featureCardStyle, animationDelay: delay }}>
        <div style={featureIconStyle}>{icon}</div>
        <h3 style={{ color: 'var(--text-body)', marginBottom: '0.5rem', fontWeight: '700' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{desc}</p>
    </div>
);

// --- Styles ---
const heroSectionStyle = {
    padding: '10rem 1rem',
    textAlign: 'center',
    background: 'url("https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    position: 'relative',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh'
};

const heroOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%)',
    zIndex: 1
};

const heroSubtitleStyle = {
    display: 'inline-block',
    backgroundColor: 'var(--red-primary)',
    color: 'white',
    padding: '8px 24px',
    borderRadius: '40px',
    fontSize: '0.9rem',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '3px',
    marginBottom: '2rem',
    boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)',
    border: 'none'
};

const heroTitleStyle = {
    fontSize: 'clamp(3rem, 10vw, 5rem)',
    fontWeight: '900',
    marginBottom: '1rem',
    textShadow: '0 10px 30px rgba(0,0,0,0.5)'
};

const heroDescriptionStyle = {
    fontSize: '1.25rem',
    maxWidth: '600px',
    margin: '0 auto 2.5rem',
    opacity: 0.9,
    lineHeight: '1.6'
};

const heroBtnStyle = {
    padding: '1rem 2.5rem',
    fontSize: '1.1rem',
    borderRadius: '30px',
    fontWeight: 'bold',
    boxShadow: '0 10px 20px -5px rgba(239, 68, 68, 0.5)'
};

const floatingSectionStyle = {
    padding: '4rem 1rem',
    marginTop: '-6rem',
    position: 'relative',
    zIndex: 10
};

const floatingGridStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '4rem',
    flexWrap: 'wrap'
};

const floatingItemStyle = {
    width: '280px',
    height: '340px',
    position: 'relative',
    borderRadius: '32px',
    overflow: 'hidden',
    boxShadow: '0 30px 60px -12px rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.1)'
};

const floatingImgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
};

const floatingBadgeStyle = {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    padding: '8px 20px',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    color: 'white',
    borderRadius: '20px',
    fontWeight: '800',
    fontSize: '0.9rem',
    backdropFilter: 'blur(10px)'
};

export default HomePage;
