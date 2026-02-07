import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Pencil, Trash2, Plus } from 'lucide-react';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosClient.get('/categories');
            setCategories(response.data);
        } catch (err) {
            console.error("Failed to fetch categories", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editId) {
                await axiosClient.put(`/categories/${editId}`, formData);
                setSuccess('Category updated successfully');
            } else {
                await axiosClient.post('/categories', formData);
                setSuccess('Category created successfully');
            }
            setFormData({ name: '', description: '' });
            setEditId(null);
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.error || 'Operation failed');
        }
    };

    const handleEdit = (category) => {
        setFormData({ name: category.name, description: category.description });
        setEditId(category.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This will delete all products in this category.')) return;

        try {
            await axiosClient.delete(`/categories/${id}`);
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.error || 'Delete failed');
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>Category Management</h2>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>{editId ? 'Edit Category' : 'Add New Category'}</h3>
                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Category Name"
                        />
                    </div>
                    <div style={{ flex: 2, minWidth: '300px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Short description"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>
                        {editId ? 'Update' : <><Plus size={18} /> Add Category</>}
                    </button>
                    {editId && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => { setEditId(null); setFormData({ name: '', description: '' }) }}
                            style={{ height: '42px' }}
                        >
                            Cancel
                        </button>
                    )}
                </form>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Existing Categories</h3>
                {loading ? <p>Loading...</p> : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-dark)' }}>
                                    <th style={{ padding: '1rem' }}>ID</th>
                                    <th style={{ padding: '1rem' }}>Name</th>
                                    <th style={{ padding: '1rem' }}>Description</th>
                                    <th style={{ padding: '1rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 ? (
                                    <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center' }}>No categories found</td></tr>
                                ) : (
                                    categories.map(cat => (
                                        <tr key={cat.id} style={{ borderBottom: '1px solid var(--border-dark)' }}>
                                            <td style={{ padding: '1rem' }}>{cat.id}</td>
                                            <td style={{ padding: '1rem', fontWeight: 'bold' }}>{cat.name}</td>
                                            <td style={{ padding: '1rem' }}>{cat.description}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <button
                                                    onClick={() => handleEdit(cat)}
                                                    style={{ background: 'none', border: 'none', color: 'var(--text-white)', marginRight: '1rem', cursor: 'pointer' }}
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    style={{ background: 'none', border: 'none', color: 'var(--red-primary)', cursor: 'pointer' }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;
