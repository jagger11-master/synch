import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import SuccessMessage from '../common/SuccessMessage';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch categories.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (isEditing) {
                await api.put(`/categories/${currentCategory.id}`, currentCategory);
                setSuccess('Category updated successfully!');
            } else {
                await api.post('/categories', currentCategory);
                setSuccess('Category created successfully!');
            }
            setIsModalOpen(false);
            fetchCategories();
            setCurrentCategory({ name: '', description: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Operation failed.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            await api.delete(`/categories/${id}`);
            setSuccess('Category deleted successfully!');
            fetchCategories();
        } catch (err) {
            setError('Failed to delete category.');
        }
    };

    const openEditModal = (category) => {
        setIsEditing(true);
        setCurrentCategory(category);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setIsEditing(false);
        setCurrentCategory({ name: '', description: '' });
        setIsModalOpen(true);
    };

    if (loading) return <Loader />;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: '#fff' }}>Categories</h2>
                <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Add Category
                </button>
            </div>

            <ErrorMessage message={error} />
            <SuccessMessage message={success} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {categories.map((cat) => (
                    <div key={cat.id} style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>{cat.name}</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => openEditModal(cat)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}>
                                    <Pencil size={18} />
                                </button>
                                <button onClick={() => handleDelete(cat.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <p style={{ color: '#888', fontSize: '0.9rem' }}>{cat.description || 'No description'}</p>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '500px', position: 'relative' }}>
                        <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>

                        <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>{isEditing ? 'Edit Category' : 'New Category'}</h3>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem' }}>Name</label>
                                <input
                                    type="text"
                                    value={currentCategory.name}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#2d2d2d', color: '#fff' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem' }}>Description</label>
                                <textarea
                                    value={currentCategory.description}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                                    rows={4}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#2d2d2d', color: '#fff' }}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                {isEditing ? 'Update Category' : 'Create Category'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
