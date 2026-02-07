import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import ProductSection from '../components/ProductSection';
import { Link } from 'react-router-dom';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosClient.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) return <div className="text-center" style={{ padding: '5rem' }}>Loading...</div>;

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
            <section className="hero" style={{ marginBottom: '5rem', textAlign: 'center', padding: '4rem 2rem', background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 'var(--radius-lg)' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Welcome to <span style={{ color: 'var(--red-primary)' }}>SynchShop</span></h1>
                <p style={{ fontSize: '1.5rem', maxWidth: '600px', margin: '0 auto 2rem', color: '#e5e5e5' }}>
                    Experience the future of shopping with our synchronized platform.
                </p>
                <Link to="/products" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2.5rem' }}>Shop Now</Link>
            </section>

            {categories.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <h2>No categories found</h2>
                    <p>Check back later for new products!</p>
                </div>
            ) : (
                categories.map(category => (
                    <ProductSection key={category.id} category={category} />
                ))
            )}
        </div>
    );
};

export default Home;
