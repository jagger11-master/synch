import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { getImageUrl } from '../config/config';

const ProductSection = ({ category }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch only a few products for the preview (e.g., limit=5)
                const response = await axiosClient.get(`/products?categoryId=${category.id}&limit=6`);
                setProducts(response.data.products || []);
            } catch (err) {
                console.error(`Failed to fetch products for ${category.name}`, err);
            }
        };
        fetchProducts();
    }, [category.id]);

    if (products.length === 0) return null;

    return (
        <section className="product-section" style={{ marginBottom: '3rem' }}>
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.8rem' }}>{category.name}</h2>
                <Link
                    to={`/products?category=${category.id}`}
                    style={{ display: 'flex', alignItems: 'center', color: 'var(--red-primary)', fontWeight: '600' }}
                >
                    View All <ChevronRight size={20} />
                </Link>
            </div>

            <div className="horizontal-scroll" style={{
                display: 'flex',
                gap: '1.5rem',
                overflowX: 'auto',
                paddingBottom: '1rem',
                scrollBehavior: 'smooth'
            }}>
                {products.map(product => (
                    <div key={product.id} className="card" style={{ minWidth: '250px', maxWidth: '250px', flex: '0 0 auto' }}>
                        <div style={{
                            height: '200px',
                            backgroundColor: '#2a2a2a',
                            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                            marginBottom: '1rem',
                            overflow: 'hidden'
                        }}>
                            {product.ProductImages && product.ProductImages.length > 0 ? (
                                <img
                                    src={getImageUrl(product.ProductImages[0].imageUrl)}
                                    alt={product.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                                    No Image
                                </div>
                            )}
                        </div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h3>
                        <p style={{
                            color: 'var(--red-primary)',
                            fontWeight: 'bold',
                            fontSize: '1.25rem',
                            marginBottom: '1rem'
                        }}>${product.price}</p>
                        <button className="btn btn-secondary text-sm" style={{ width: '100%' }}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProductSection;
