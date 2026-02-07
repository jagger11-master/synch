import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-content">
                    <div className="navbar-brand">
                        <Link to="/" className="brand-logo">
                            <span className="brand-text">SynchShop</span>
                        </Link>
                    </div>

                    <div className="navbar-desktop">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="search-input"
                            />
                            <Search className="search-icon" />
                        </div>
                        <div className="nav-links">
                            <Link to="/" className="nav-link">Home</Link>
                            <Link to="/products" className="nav-link">Shop</Link>
                        </div>

                        <div className="nav-actions">
                            <Link to="/cart" className="nav-action-item">
                                <ShoppingCart className="icon" />
                                {/* <span className="cart-badge">0</span> */}
                            </Link>

                            {token ? (
                                <div className="user-menu-container">
                                    <button className="nav-action-item user-btn">
                                        <User className="icon" />
                                    </button>
                                    <div className="user-dropdown">
                                        <Link to="/profile" className="dropdown-item">Profile</Link>
                                        <button onClick={handleLogout} className="dropdown-item logout-btn">Logout</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="auth-buttons">
                                    <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                                    <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="navbar-mobile-toggle">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="toggle-btn"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="icon" /> : <Menu className="icon" />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="navbar-mobile-menu">
                    <div className="mobile-menu-content">
                        <form className="mobile-search">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="mobile-search-input"
                            />
                        </form>
                        <Link to="/" className="mobile-link">Home</Link>
                        <Link to="/products" className="mobile-link">Shop</Link>
                        <Link to="/cart" className="mobile-link">Cart</Link>
                        {token ? (
                            <>
                                <Link to="/profile" className="mobile-link">Profile</Link>
                                <button onClick={handleLogout} className="mobile-link logout-btn-mobile">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="mobile-link">Login</Link>
                                <Link to="/signup" className="mobile-link">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
