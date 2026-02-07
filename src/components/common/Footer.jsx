import React from 'react';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#111', padding: '3rem 2rem', marginTop: 'auto', borderTop: '1px solid #333' }}>
            <div className="container" style={{ textAlign: 'center', color: '#888' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>SynchShop</h3>
                    <p>Synchronize your shopping experience.</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
                    <a href="/cart" style={{ color: '#888', textDecoration: 'none' }}>Cart</a>
                    <a href="/shop" style={{ color: '#888', textDecoration: 'none' }}>Shop</a>
                    <a href="#" style={{ color: '#888', textDecoration: 'none' }}>Privacy</a>
                </div>
                <p>&copy; {new Date().getFullYear()} SynchShop. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
