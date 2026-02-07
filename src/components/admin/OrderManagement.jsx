import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Truck, CheckCircle, Clock, AlertCircle, RefreshCcw } from 'lucide-react';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/admin/orders');
            setOrders(response.data);
        } catch (err) {
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdating(orderId);
        try {
            await api.put('/admin/status', { orderId, status: newStatus });
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            alert('Failed to update status');
        } finally {
            setUpdating(null);
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return <Clock size={16} color="#f59e0b" />;
            case 'paid': return <CheckCircle size={16} color="#3b82f6" />;
            case 'shipped': return <Truck size={16} color="#8b5cf6" />;
            case 'delivered': return <CheckCircle size={16} color="#10b981" />;
            default: return <AlertCircle size={16} color="#ef4444" />;
        }
    };

    if (loading) return <div style={{ color: 'var(--text-body)', padding: '2rem' }}>Loading orders...</div>;

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ color: 'var(--text-body)', margin: 0, fontWeight: '900', fontSize: '1.8rem' }}>Order Management</h2>
                <button onClick={fetchOrders} className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <RefreshCcw size={16} /> Refresh
                </button>
            </div>

            {error && <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}

            <div style={{ overflowX: 'auto', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-body)', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: 'rgba(0,0,0,0.05)', borderBottom: '1px solid var(--border-color)' }}>
                        <tr>
                            <th style={thStyle}>Order ID</th>
                            <th style={thStyle}>Customer</th>
                            <th style={thStyle}>Date</th>
                            <th style={thStyle}>Total</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                                <td style={tdStyle}><span style={{ fontWeight: '800', color: 'var(--red-primary)' }}>#{order.id}</span></td>
                                <td style={tdStyle}>
                                    <div style={{ fontWeight: 'bold' }}>{order.User?.username}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.User?.email}</div>
                                </td>
                                <td style={tdStyle}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td style={tdStyle}><span style={{ fontWeight: '900' }}>${parseFloat(order.totalAmount).toFixed(2)}</span></td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-body)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                        {getStatusIcon(order.status)}
                                        <span style={{ textTransform: 'capitalize' }}>{order.status}</span>
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                        disabled={updating === order.id}
                                        style={selectStyle}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const thStyle = { padding: '1.25rem 1.5rem', fontWeight: '800', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' };
const tdStyle = { padding: '1.25rem 1.5rem', verticalAlign: 'middle', fontSize: '0.95rem' };
const selectStyle = {
    backgroundColor: 'var(--bg-body)',
    color: 'var(--text-body)',
    border: '1px solid var(--border-color)',
    padding: '0.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600'
};

export default OrderManagement;
