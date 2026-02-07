import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { getImageUrl } from '../../config/config';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import SuccessMessage from '../common/SuccessMessage';
import { Pencil, Trash2, Plus } from 'lucide-react';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            // Backend returns { products: [], totalItems: ... }
            setProducts(response.data.products || []);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch products.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await api.delete(`/products/${id}`);
            setSuccess('Product deleted successfully!');
            fetchProducts();
        } catch (err) {
            setError('Failed to delete product.');
        }
    };

    if (loading) return <Loader />;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: '#fff' }}>Products</h2>
                <Link to="/admin/products/add" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Add Product
                </Link>
            </div>

            <ErrorMessage message={error} />
            <SuccessMessage message={success} />

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Image</th>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Category</th>
                            <th style={{ padding: '1rem' }}>Price</th>
                            <th style={{ padding: '1rem' }}>Stock</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} style={{ borderBottom: '1px solid #222' }}>
                                <td style={{ padding: '1rem' }}>
                                    {product.ProductImages && product.ProductImages.length > 0 ? (
                                        <img
                                            src={getImageUrl(product.ProductImages[0].imageUrl)}
                                            alt={product.name}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    ) : (
                                        <div style={{ width: '50px', height: '50px', backgroundColor: '#333', borderRadius: '4px' }}></div>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>{product.name}</td>
                                <td style={{ padding: '1rem' }}>{product.Category?.name || 'Uncategorized'}</td>
                                <td style={{ padding: '1rem' }}>${product.price}</td>
                                <td style={{ padding: '1rem' }}>{product.stock}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Link to={`/admin/products/edit/${product.id}`} style={{ color: '#3b82f6' }}>
                                            <Pencil size={18} />
                                        </Link>
                                        <button onClick={() => handleDelete(product.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                        No products found. Add one to get started.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductManagement;
