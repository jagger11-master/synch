import React, { useState, useEffect } from 'react';
import { Users, DollarSign, ShoppingCart, Clock, BarChart3, TrendingUp, Package } from 'lucide-react';
import api from '../../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon, color }) => (
    <div style={{
        backgroundColor: 'var(--bg-surface)',
        padding: '1.5rem',
        borderRadius: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow)'
    }}>
        <div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</p>
            <h3 style={{ fontSize: '2rem', color: 'var(--text-body)', fontWeight: '900' }}>{value}</h3>
        </div>
        <div style={{
            backgroundColor: `${color}15`,
            padding: '1rem',
            borderRadius: '12px',
            color: color,
            border: `1px solid ${color}30`
        }}>
            {icon}
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalUsers: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, analyticsRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/analytics')
                ]);
                setStats(statsRes.data.stats);
                setRecentOrders(statsRes.data.recentOrders);
                setAnalytics(analyticsRes.data);
            } catch (error) {
                console.error('Failed to fetch admin data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div style={{ color: 'var(--text-body)', padding: '2rem', fontWeight: 'bold' }}>Syncing dashboard data...</div>;

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--text-body)', marginBottom: '0.5rem' }}>Dashboard Overview</h1>
                <p style={{ color: 'var(--text-muted)' }}>Welcome back, Admin. Here's what's happening today.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <StatCard
                    title="Revenue"
                    value={`$${parseFloat(stats.totalRevenue).toFixed(2)}`}
                    icon={<DollarSign size={24} />}
                    color="#10b981"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={<ShoppingCart size={24} />}
                    color="var(--red-primary)"
                />
                <StatCard
                    title="Pending"
                    value={stats.pendingOrders}
                    icon={<Clock size={24} />}
                    color="#f59e0b"
                />
                <StatCard
                    title="Customers"
                    value={stats.totalUsers}
                    icon={<Users size={24} />}
                    color="#3b82f6"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))', gap: '2.5rem' }}>

                {/* Revenue Chart */}
                <div style={{
                    backgroundColor: 'var(--bg-surface)',
                    padding: '2rem',
                    borderRadius: '20px',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow)'
                }}>
                    <h3 style={{ marginBottom: '2rem', color: 'var(--text-body)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '800' }}>
                        <TrendingUp size={24} color="#10b981" /> Revenue Performance
                    </h3>
                    <div style={{ height: '350px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--bg-surface)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '12px',
                                        color: 'var(--text-body)',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                    }}
                                    itemStyle={{ color: 'var(--red-primary)', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="var(--red-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity */}
                <div style={{
                    backgroundColor: 'var(--bg-surface)',
                    padding: '2rem',
                    borderRadius: '20px',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow)'
                }}>
                    <h3 style={{ marginBottom: '2rem', color: 'var(--text-body)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '800' }}>
                        <BarChart3 size={24} color="var(--red-primary)" /> Fresh Orders
                    </h3>
                    {recentOrders.length === 0 ? (
                        <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                            <p>No recent activity detected.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {recentOrders.map(order => (
                                <div key={order.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1.25rem',
                                    backgroundColor: 'var(--bg-body)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)',
                                    transition: 'transform 0.2s'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red-primary)', border: '1px solid var(--border-color)' }}>
                                            <ShoppingCart size={20} />
                                        </div>
                                        <div>
                                            <div style={{ color: 'var(--text-body)', fontWeight: 'bold', fontSize: '1rem' }}>Order #{order.id}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.User?.username} • {new Date(order.createdAt).toLocaleTimeString()}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: 'var(--text-body)', fontWeight: '900', fontSize: '1.1rem' }}>${parseFloat(order.totalAmount).toFixed(2)}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase' }}>{order.status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
