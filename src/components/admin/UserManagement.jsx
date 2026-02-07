import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import { User, Shield, Mail, Calendar } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: '#fff', fontSize: '1.8rem' }}>User Management</h2>
                <p style={{ color: '#888' }}>View and manage platform users</p>
            </div>

            <ErrorMessage message={error} />

            <div style={{ overflowX: 'auto', backgroundColor: '#1e1e1e', borderRadius: '12px', border: '1px solid #333' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #333', textAlign: 'left', backgroundColor: '#252525' }}>
                            <th style={{ padding: '1.2rem' }}>User</th>
                            <th style={{ padding: '1.2rem' }}>Email</th>
                            <th style={{ padding: '1.2rem' }}>Role</th>
                            <th style={{ padding: '1.2rem' }}>Status</th>
                            <th style={{ padding: '1.2rem' }}>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #222' }}>
                                <td style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={18} color="#888" />
                                    </div>
                                    <span>{u.username}</span>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaa' }}>
                                        <Mail size={14} />
                                        {u.email}
                                    </div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        backgroundColor: u.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                        color: u.role === 'admin' ? '#ef4444' : '#3b82f6',
                                        border: `1px solid ${u.role === 'admin' ? '#ef4444' : '#3b82f6'}`
                                    }}>
                                        {u.role.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <span style={{ color: u.isVerified ? '#10b981' : '#f59e0b' }}>
                                        {u.isVerified ? 'Verified' : 'Pending'}
                                    </span>
                                </td>
                                <td style={{ padding: '1.2rem', color: '#888' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={14} />
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
