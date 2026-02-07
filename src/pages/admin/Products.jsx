import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Pencil, Trash2, Plus, Upload } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', stock: '', categoryId: '', videoUrl: ''
    });
    const [images, setImages] = useState([]);
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                axiosClient.get('/products'),
                axiosClient.get('/categories')
            ]);
            setProducts(prodRes.data.products || prodRes.data); // Adjust based on pagination response structure
            setCategories(catRes.data);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));

        for (let i = 0; i < images.length; i++) {
            data.append('images', images[i]);
        }

        try {
            if (editId) {
                // For update, typically sending JSON is easier unless updating images too which might require different handling
                // Assuming simple update for now without new images or separate endpoint
                await axiosClient.put(`/products/${editId}`, formData);
                setSuccess('Product updated successfully');
            } else {
                await axiosClient.post('/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' } // Axios sets boundary auto
                });
                setSuccess('Product created successfully');
            }
            setFormData({ name: '', description: '', price: '', stock: '', categoryId: '', videoUrl: '' });
            setImages([]);
            setEditId(null);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.error || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axiosClient.delete(`/products/${id}`);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.error || 'Delete failed');
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            categoryId: product.categoryId,
            videoUrl: product.videoUrl || ''
        });
        setEditId(product.id);
    };

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>Product Management</h2>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>{editId ? 'Edit Product' : 'Add New Product'}</h3>
                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%', padding: '0.75rem 1rem',
                                    backgroundColor: 'var(--bg-card)',
                                    border: '1px solid var(--border-dark)',
                                    color: 'var(--text-white)',
                                    borderRadius: 'var(--radius-md)'
                                }}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="3"
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Price ($)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Stock</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Video URL (Optional)</label>
                            <input type="text" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="YouTube/Vimeo View URL" />
                        </div>
                        {!editId && (
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Images (Max 5)</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ padding: '0.5rem' }}
                                />
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary">
                            {editId ? 'Update Product' : <><Upload size={18} /> Upload Product</>}
                        </button>
                        {editId && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => { setEditId(null); setFormData({ name: '', description: '', price: '', stock: '', categoryId: '', videoUrl: '' }) }}
                                style={{ marginLeft: '1rem' }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Inventory</h3>
                {loading ? <p>Loading...</p> : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-dark)' }}>
                                    <th style={{ padding: '1rem' }}>Name</th>
                                    <th style={{ padding: '1rem' }}>Category</th>
                                    <th style={{ padding: '1rem' }}>Price</th>
                                    <th style={{ padding: '1rem' }}>Stock</th>
                                    <th style={{ padding: '1rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(!products || products.length === 0) ? (
                                    <tr><td colSpan="5" style={{ padding: '1rem', textAlign: 'center' }}>No products found</td></tr>
                                ) : (
                                    products.map(prod => (
                                        <tr key={prod.id} style={{ borderBottom: '1px solid var(--border-dark)' }}>
                                            <td style={{ padding: '1rem', fontWeight: 'bold' }}>{prod.name}</td>
                                            <td style={{ padding: '1rem' }}>{prod.Category?.name || '-'}</td>
                                            <td style={{ padding: '1rem' }}>${prod.price}</td>
                                            <td style={{ padding: '1rem' }}>{prod.stock}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <button
                                                    onClick={() => handleEdit(prod)}
                                                    style={{ background: 'none', border: 'none', color: 'var(--text-white)', marginRight: '1rem', cursor: 'pointer' }}
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(prod.id)}
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

export default Products;
