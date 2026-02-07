import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Zap, Globe, Heart, ShieldCheck, Users } from 'lucide-react';
import '../assets/styles/animations.css';

const AboutPage = () => {
    const { t } = useTranslation();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-body)' }}>
            <Navbar />

            <main style={{ flex: 1 }}>
                {/* Hero Section */}
                <section style={heroSectionStyle} className="animate-fade">
                    <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                        <h1 style={titleStyle} className="animate-reveal">About Synch<span style={{ color: 'var(--red-primary)' }}>Shop</span></h1>
                        <p style={subtitleStyle} className="animate-reveal">Synchronizing quality, trend, and accessibility for the modern shopper.</p>
                    </div>
                    <div style={overlayStyle}></div>
                </section>

                {/* Content Section */}
                <section className="container" style={{ padding: '6rem 1rem' }}>
                    <div style={gridStyle}>
                        <div className="animate-reveal" style={{ animationDelay: '0.2s' }}>
                            <h2 style={sectionTitleStyle}>Who We Are</h2>
                            <p style={textStyle}>
                                SynchShop is a premium e-commerce destination founded on the principle of synchronization. We believe that your lifestyle and your shopping experience should move in harmony.
                            </p>
                            <p style={textStyle}>
                                Based in the heart of digital commerce, we bridge the gap between global trends and local accessibility. Our platform is designed to provide a seamless, secure, and stylish journey from discovery to delivery.
                            </p>
                        </div>
                        <div className="animate-reveal" style={{ animationDelay: '0.4s' }}>
                            <h2 style={sectionTitleStyle}>What We Deal With</h2>
                            <p style={textStyle}>
                                We curate a diverse ecosystem of products across multiple high-demand categories:
                            </p>
                            <ul style={listStyle}>
                                <li>✨ <strong>Fashion & Apparel:</strong> The latest trends in street wear and luxury fashion.</li>
                                <li>💻 <strong>Technology & Gadgets:</strong> Cutting-edge electronics that power your day.</li>
                                <li>🏠 <strong>Home & Lifestyle:</strong> Premium essentials to elevate your living space.</li>
                                <li>⚡ <strong>Innovative Trends:</strong> Rare and unique items that define the next generation of style.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section style={{ backgroundColor: 'var(--bg-surface)', padding: '6rem 1rem', borderTop: '1px solid var(--border-color)' }}>
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            <h2 style={sectionTitleStyle}>Our Core Values</h2>
                        </div>
                        <div style={valuesGridStyle}>
                            <ValueCard icon={<Heart color="var(--red-primary)" />} title="Customer First" desc="Your satisfaction is the heartbeat of our operation." />
                            <ValueCard icon={<ShieldCheck color="var(--red-primary)" />} title="Security" desc="100% secure transactions and data privacy protection." />
                            <ValueCard icon={<Zap color="var(--red-primary)" />} title="Speed" desc="Fast logistics to get your favorites to you in record time." />
                            <ValueCard icon={<Globe color="var(--red-primary)" />} title="Accessibility" desc="Bridging global markets with a local, easy-to-use interface." />
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

const ValueCard = ({ icon, title, desc }) => (
    <div className="animate-reveal hover-lift" style={valueCardStyle}>
        <div style={iconWrapperStyle}>{icon}</div>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-body)' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>{desc}</p>
    </div>
);

// --- Styles ---
const heroSectionStyle = {
    padding: '10rem 1rem',
    background: 'url("https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    position: 'relative',
    color: 'white'
};

const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 1
};

const titleStyle = {
    fontSize: '4rem',
    fontWeight: '900',
    marginBottom: '1rem',
    textShadow: '0 4px 10px rgba(0,0,0,0.5)'
};

const subtitleStyle = {
    fontSize: '1.4rem',
    maxWidth: '700px',
    margin: '0 auto',
    opacity: 0.9,
    fontWeight: '500'
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '4rem'
};

const sectionTitleStyle = {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: 'var(--text-body)',
    marginBottom: '2rem'
};

const textStyle = {
    fontSize: '1.1rem',
    color: 'var(--text-muted)',
    lineHeight: '1.8',
    marginBottom: '1.5rem'
};

const listStyle = {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    color: 'var(--text-muted)',
    fontSize: '1.1rem'
};

const valuesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '2rem'
};

const valueCardStyle = {
    backgroundColor: 'var(--bg-body)',
    padding: '3rem 2rem',
    borderRadius: '24px',
    textAlign: 'center',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow)'
};

const iconWrapperStyle = {
    width: '64px',
    height: '64px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 2rem',
    border: '1px solid rgba(239, 68, 68, 0.2)'
};

export default AboutPage;
