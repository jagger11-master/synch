import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css'; // Assuming we will create this or use a global css

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section about">
                    <h3>SynchShop</h3>
                    <p>Your one-stop shop for everything you need. Quality products, best prices, and fast delivery.</p>
                    <div className="socials">
                        <a href="#"><Facebook /></a>
                        <a href="#"><Twitter /></a>
                        <a href="#"><Instagram /></a>
                    </div>
                </div>
                <div className="footer-section links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/products">Shop</a></li>
                        <li><a href="/cart">Cart</a></li>
                        <li><a href="/contact">Contact Us</a></li>
                    </ul>
                </div>
                <div className="footer-section contact">
                    <h3>Contact Us</h3>
                    <div className="contact-item">
                        <MapPin size={18} />
                        <span>123 Commerce St, Market City</span>
                    </div>
                    <div className="contact-item">
                        <Phone size={18} />
                        <span>+1 234 567 890</span>
                    </div>
                    <div className="contact-item">
                        <Mail size={18} />
                        <span>support@synchshop.com</span>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} SynchShop. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
