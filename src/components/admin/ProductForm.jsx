import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import VariantManager from './VariantManager';
import { Upload, X } from 'lucide-react';

const ProductForm = () => {
    const { id } = useParams();
    const isEditing = !!id;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
    });
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]); // Files to upload
    const [existingImages, setExistingImages] = useState([]); // URLs of existing images
    const [variants, setVariants] = useState([]); // New variants
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
        if (isEditing) {
            fetchProduct();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (err) {
            console.error('Failed to fetch categories');
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            const p = response.data;
            setFormData({
                name: p.name,
                description: p.description,
                price: p.price,
                stock: p.stock,
                categoryId: p.categoryId
            });
            setExistingImages(p.images || []);
        } catch (err) {
            setError('Failed to load product details.');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('categoryId', formData.categoryId);

        // Stringify variants for backend to parse if processing multipart
        // Note: You must ensure your backend parses this field from req.body
        if (variants.length > 0) {
            // We might need to loop and append if backend expects array format specifically,
            // but seeing as we use multipart, sending a JSON string for complex arrays is safer
            // IF the backend is set up to parse it. 
            // Given standard express + multer, req.body fields are strings.
            // However, productController.js expects `variants` to be an object/array directly from req.body?
            // If using multer, we might need `JSON.parse` in the controller.
            // Let's assume for now we append individual items or try the JSON approach.
            // Let's rely on `req.body.variants` being parsed. To do that with FormData, it's tricky.
            // Strategy: Append as indexed keys or just one JSON string.
            // Let's go with JSON string and I might need to patch backend small quick.
            data.append('variants', JSON.stringify(variants));
        }

        // Append new images
        for (let i = 0; i < images.length; i++) {
            data.append('images', images[i]);
        }

        try {
            if (isEditing) {
                await api.put(`/products/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate('/admin/products');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: '#fff', marginBottom: '2rem' }}>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>

            <ErrorMessage message={error} />

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem' }}>Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem' }}>Category</label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem' }}>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={5}
                        style={inputStyle}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem' }}>Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            step="0.01"
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem' }}>Stock Quantity</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem' }}>Product Images</label>
                    <div style={{ border: '2px dashed #444', padding: '2rem', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' }}>
                        <input
                            type="file"
                            multiple
                            onChange={handleImageChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="image-upload"
                        />
                        <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#888' }}>
                            <Upload size={32} />
                            <span>Click to upload images</span>
                        </label>
                    </div>
                    {images.length > 0 && (
                        <div style={{ marginTop: '0.5rem', color: '#10b981' }}>
                            {images.length} new file(s) selected
                        </div>
                    )}
                </div>

                <VariantManager variants={variants} setVariants={setVariants} />

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '1rem', fontSize: '1rem' }}>
                    {loading ? <Loader /> : (isEditing ? 'Update Product' : 'Create Product')}
                </button>
            </form>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #333',
    backgroundColor: '#2d2d2d',
    color: '#fff'
};

export default ProductForm;
