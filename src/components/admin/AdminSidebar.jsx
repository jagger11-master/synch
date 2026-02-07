import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, FolderTree, Users, Tag, Star, BarChart, LogOut } from 'lucide-react';

const AdminSidebar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/admin/products', icon: <ShoppingBag size={20} />, label: 'Products' },
        { path: '/admin/categories', icon: <FolderTree size={20} />, label: 'Categories' },
        { path: '/admin/orders', icon: <Tag size={20} />, label: 'Orders' },
        { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
        { path: '/admin/coupons', icon: <Tag size={20} />, label: 'Coupons' },
        { path: '/admin/reviews', icon: <Star size={20} />, label: 'Reviews' },
        { path: '/admin/analytics', icon: <BarChart size={20} />, label: 'Analytics' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <aside style={{
            width: '260px',
            backgroundColor: '#1e1e1e',
            borderRight: '1px solid #333',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: 'fixed'
        }}>
            <div style={{ padding: '2rem', borderBottom: '1px solid #333' }}>
                <h2 style={{ color: 'var(--red-primary)', fontSize: '1.5rem' }}>SynchAdmin</h2>
            </div>

            <nav style={{ flex: 1, padding: '1rem' }}>
                <ul style={{ listStyle: 'none' }}>
                    {navItems.map((item) => (
                        <li key={item.path} style={{ marginBottom: '0.5rem' }}>
                            <Link to={item.path} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                color: isActive(item.path) ? '#fff' : '#888',
                                backgroundColor: isActive(item.path) ? 'var(--red-primary)' : 'transparent',
                                transition: 'all 0.2s'
                            }}>
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div style={{ padding: '1rem', borderTop: '1px solid #333' }}>
                <button onClick={handleLogout} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    borderRadius: '8px'
                }}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
