import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Loader from '../common/Loader';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area, BarChart, Bar
} from 'recharts';
import { TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-react';

const Analytics = () => {
    const [data, setData] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [analyticsRes, statsRes] = await Promise.all([
                    api.get('/admin/analytics'),
                    api.get('/admin/stats')
                ]);
                setData(analyticsRes.data);
                setStats(statsRes.data.stats);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (loading) return <Loader />;

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: '#fff', fontSize: '1.8rem' }}>Store Analytics</h2>
                <p style={{ color: '#888' }}>Visualizing your business growth</p>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard icon={<DollarSign color="#10b981" />} label="Total Revenue" value={`$${stats?.totalRevenue}`} color="#10b981" />
                <StatCard icon={<ShoppingBag color="#3b82f6" />} label="Total Orders" value={stats?.totalOrders} color="#3b82f6" />
                <StatCard icon={<Users color="#f59e0b" />} label="Total Users" value={stats?.totalUsers} color="#f59e0b" />
                <StatCard icon={<TrendingUp color="#ef4444" />} label="Products" value={stats?.totalProducts} color="#ef4444" />
            </div>

            {/* Main Chart */}
            <div style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '15px', border: '1px solid #333', marginBottom: '2rem' }}>
                <h3 style={{ color: '#fff', marginBottom: '2rem' }}>Revenue Overview</h3>
                <div style={{ height: '350px', minHeight: '350px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666', fontSize: 12 }} />
                            <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #444', color: '#fff' }}
                                itemStyle={{ color: '#ef4444' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '15px', border: '1px solid #333' }}>
                    <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Order Volume</h3>
                    {/* Placeholder for small chart */}
                    <div style={{ height: '200px', minHeight: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '15px', border: '1px solid #333' }}>
                    <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Traffic Overview</h3>
                    <p style={{ color: '#666', textAlign: 'center', marginTop: '3rem' }}>Traffic data will appear once you connect Google Analytics API.</p>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <div style={{ backgroundColor: `${color}15`, padding: '0.5rem', borderRadius: '8px' }}>
                {icon}
            </div>
            <span style={{ color: '#888', fontSize: '0.9rem' }}>{label}</span>
        </div>
        <h3 style={{ color: '#fff', fontSize: '1.8rem', margin: 0 }}>{value}</h3>
    </div>
);

export default Analytics;
