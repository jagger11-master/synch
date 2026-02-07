import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Sun, Moon, Search, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTranslation } from 'react-i18next';
import '../../assets/styles/animations.css';

const Navbar = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { cartCount } = useCart();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const token = localStorage.getItem('token');
    const userBuffer = localStorage.getItem('user');
    const user = userBuffer ? JSON.parse(userBuffer) : null;

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${searchQuery}`);
            setIsMenuOpen(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className={`glass-nav ${scrolled ? 'nav-scrolled' : ''}`} style={navContainerStyle}>
            <div className="container" style={headerRowStyle}>

                {/* Left: Brand & Menu Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={iconBtnStyle} className="mobile-only">
                        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                    <Link to="/" style={brandStyle} className="animate-fade">
                        SynchShop
                    </Link>
                </div>

                {/* Center: Search Bar (Visible on all devices, compact on small) */}
                <form onSubmit={handleSearch} style={searchWrapperStyle} className="animate-reveal">
                    <input
                        type="text"
                        placeholder={t('search_placeholder').split('...')[0]}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={searchInputStyle}
                    />
                    <Search size={16} style={searchIconStyle} />
                </form>

                {/* Right: Integrated Controls (Flags, Theme, Cart, Profile) */}
                <div style={controlsRowStyle}>

                    {/* Desktop Navigation Links */}
                    <div className="mobile-hidden" style={{ display: 'flex', gap: '0.75rem', marginRight: '0.5rem' }}>
                        <Link to="/shop" style={navLinkStyle}>{t('shop')}</Link>
                        <Link to="/about" style={navLinkStyle}>About</Link>
                    </div>

                    <div style={unifiedControlsStyle}>
                        {/* Language Selection - Always Visible */}
                        <div style={flagContainerStyle}>
                            <button onClick={() => changeLanguage('en')} style={{ ...inlineFlagStyle, opacity: i18n.language === 'en' ? 1 : 0.4, border: i18n.language === 'en' ? '1.5px solid var(--red-primary)' : '1.5px solid transparent' }}>
                                <img src="https://flagcdn.com/w40/us.png" alt="English" style={{ width: '20px', borderRadius: '2px' }} />
                            </button>
                            <button onClick={() => changeLanguage('sw')} style={{ ...inlineFlagStyle, opacity: i18n.language === 'sw' ? 1 : 0.4, border: i18n.language === 'sw' ? '1.5px solid var(--red-primary)' : '1.5px solid transparent' }}>
                                <img src="https://flagcdn.com/w40/tz.png" alt="Swahili" style={{ width: '20px', borderRadius: '2px' }} />
                            </button>
                        </div>

                        {/* Theme Toggle */}
                        <button onClick={toggleTheme} style={themeToggleStyle} title="Toggle Theme">
                            {theme === 'dark' ? <Sun size={18} className="animate-scale" /> : <Moon size={18} className="animate-scale" />}
                        </button>

                        {/* Cart */}
                        <Link to="/cart" style={cartIconWrapperStyle}>
                            <ShoppingCart size={18} />
                            {cartCount > 0 && <span style={badgeStyle}>{cartCount}</span>}
                        </Link>
                    </div>

                    {/* Desktop User/Auth */}
                    <div className="mobile-hidden" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
                        {token ? (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Link to="/profile" style={profileBtnStyle} title="Profile">
                                    <User size={18} />
                                </Link>
                                <button onClick={handleLogout} style={logoutBtnStyle} title="Logout">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary" style={{ borderRadius: '20px', padding: '0.4rem 1.2rem', fontSize: '0.85rem' }}>{t('login')}</Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Expansion (Drawer) */}
            {isMenuOpen && (
                <div style={mobileOverlayStyle} className="animate-reveal">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <Link to="/" onClick={() => setIsMenuOpen(false)} style={mobileNavLinkStyle}>{t('home')}</Link>
                        <Link to="/shop" onClick={() => setIsMenuOpen(false)} style={mobileNavLinkStyle}>{t('shop')}</Link>
                        {token ? (
                            <>
                                <Link to="/orders" onClick={() => setIsMenuOpen(false)} style={mobileNavLinkStyle}>{t('orders')}</Link>
                                <Link to="/profile" onClick={() => setIsMenuOpen(false)} style={mobileNavLinkStyle}>{t('profile')}</Link>
                                <button onClick={handleLogout} style={mobileLogoutStyle}>{t('logout')}</button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} style={mobileNavLinkStyle}>{t('login')}</Link>
                        )}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '2rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold' }}>SYNCHSHOP v2.0</p>
                    </div>
                </div>
            )}
        </nav>
    );
};

// --- Styles ---
const navContainerStyle = {
    backgroundColor: 'var(--bg-surface)',
    height: '70px',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease',
    boxShadow: 'var(--shadow)'
};

const headerRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    gap: '0.25rem',
    padding: '0 0.5rem'
};

const brandStyle = {
    fontSize: '1.2rem',
    fontWeight: '950',
    color: 'var(--red-primary)',
    textDecoration: 'none',
    letterSpacing: '-1.5px'
};

const searchWrapperStyle = {
    position: 'relative',
    flex: 1,
    maxWidth: '450px',
    minWidth: '80px',
    marginLeft: '0px'
};

const searchInputStyle = {
    width: '100%',
    height: '38px',
    padding: '0 0.75rem 0 2.4rem',
    borderRadius: '19px',
    backgroundColor: 'var(--bg-body)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-body)',
    fontSize: '0.85rem',
    outline: 'none',
    transition: 'all 0.2s ease'
};

const searchIconStyle = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    opacity: 0.7
};

const controlsRowStyle = {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0
};

const unifiedControlsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: '1px 2px',
    borderRadius: '25px',
    border: '1px solid var(--border-color)'
};

const flagContainerStyle = {
    display: 'flex',
    gap: '1px',
    paddingRight: '4px',
    borderRight: '1px solid var(--border-color)'
};

const inlineFlagStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.2s',
    padding: 0
};

const themeToggleStyle = {
    background: 'none',
    border: 'none',
    color: 'var(--text-body)',
    cursor: 'pointer',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background 0.2s'
};

const cartIconWrapperStyle = {
    color: 'var(--text-body)',
    position: 'relative',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const badgeStyle = {
    position: 'absolute',
    top: '2px',
    right: '2px',
    backgroundColor: 'var(--red-primary)',
    color: 'white',
    borderRadius: '50%',
    minWidth: '15px',
    height: '15px',
    padding: '2px',
    fontSize: '9px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1.5px solid var(--bg-surface)'
};

const navLinkStyle = {
    color: 'var(--text-body)',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '0.8rem',
    whiteSpace: 'nowrap'
};

const profileBtnStyle = {
    color: 'var(--text-body)',
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-body)',
    border: '1px solid var(--border-color)'
};

const logoutBtnStyle = {
    ...profileBtnStyle,
    color: '#ef4444',
    cursor: 'pointer',
    background: 'none'
};

const iconBtnStyle = {
    background: 'none',
    border: 'none',
    color: 'var(--text-body)',
    cursor: 'pointer',
    padding: '4px'
};

const mobileOverlayStyle = {
    position: 'absolute',
    top: '70px',
    left: 0,
    right: 0,
    backgroundColor: 'var(--bg-surface)',
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
    borderTop: '1px solid var(--border-color)',
    height: 'calc(100vh - 70px)',
    overflowY: 'auto',
    zIndex: 999
};

const mobileNavLinkStyle = {
    color: 'var(--text-body)',
    textDecoration: 'none',
    fontSize: '1.4rem',
    fontWeight: '900',
    padding: '0.5rem 0'
};

const mobileLogoutStyle = {
    ...mobileNavLinkStyle,
    color: '#ef4444',
    background: 'none',
    border: 'none',
    textAlign: 'left'
};

export default Navbar;
