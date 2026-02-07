import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProductCard from '../components/product/ProductCard';
import { useTranslation } from 'react-i18next';
import { Filter, Search, X } from 'lucide-react';
import '../assets/styles/animations.css';

const ShopPage = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        categoryId: searchParams.get('categoryId') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || ''
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [searchParams]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = Object.fromEntries([...searchParams]);
            const response = await api.get('/products', { params });
            setProducts(Array.isArray(response.data) ? response.data : response.data.products || []);
        } catch (error) {
            console.error('Error fetching products', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        const newParams = {};
        if (filters.search) newParams.search = filters.search;
        if (filters.categoryId) newParams.categoryId = filters.categoryId;
        if (filters.minPrice) newParams.minPrice = filters.minPrice;
        if (filters.maxPrice) newParams.maxPrice = filters.maxPrice;
        setSearchParams(newParams);
        setIsFilterOpen(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-body)' }}>
            <Navbar />

            <div className="container" style={{ flex: 1, padding: '2rem 1rem' }}>
                <div style={shopHeaderStyle} className="animate-fade">
                    <h1 style={shopTitleStyle}>{t('shop')}</h1>
                    <button onClick={() => setIsFilterOpen(!isFilterOpen)} style={filterToggleStyle} className="mobile-only">
                        <Filter size={20} /> Filters
                    </button>
                </div>

                <div style={shopLayoutStyle}>
                    {/* PC Filters Sidebar */}
                    <aside style={sidebarStyle} className="mobile-hidden animate-slide">
                        <FilterSidebar
                            t={t}
                            categories={categories}
                            filters={filters}
                            handleFilterChange={handleFilterChange}
                            applyFilters={applyFilters}
                        />
                    </aside>

                    {/* Product Grid Area */}
                    <main style={{ flex: 1 }}>
                        <div style={gridControlsStyle} className="animate-fade">
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                Showing {products.length} products
                            </p>
                        </div>

                        {loading ? (
                            <div style={loadingWrapperStyle}>
                                <div className="animate-spin" style={spinnerStyle}></div>
                            </div>
                        ) : products.length === 0 ? (
                            <div style={emptyWrapperStyle} className="animate-reveal">
                                <Search size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <h3>No products found</h3>
                                <p>Try adjusting your search or filters</p>
                            </div>
                        ) : (
                            <div className="grid-auto">
                                {products && Array.isArray(products) && products.map((product, index) => (
                                    <ProductCard key={product.id} product={product} index={index} />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            {isFilterOpen && (
                <div style={mobileDrawerOverlayStyle}>
                    <div style={mobileDrawerStyle} className="animate-reveal">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '900' }}>Filters</h2>
                            <button onClick={() => setIsFilterOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-body)' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <FilterSidebar
                            t={t}
                            categories={categories}
                            filters={filters}
                            handleFilterChange={handleFilterChange}
                            applyFilters={applyFilters}
                        />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

const FilterSidebar = ({ t, categories, filters, handleFilterChange, applyFilters }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
            <h3 style={filterTitleStyle}>{t('categories')}</h3>
            <select
                name="categoryId"
                value={filters.categoryId}
                onChange={handleFilterChange}
                style={filterInputStyle}
            >
                <option value="">{t('all_categories')}</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
        </div>

        <div>
            <h3 style={filterTitleStyle}>Price Range</h3>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                    type="number"
                    name="minPrice"
                    placeholder={t('min_price')}
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    style={filterInputStyle}
                />
                <span style={{ color: 'var(--text-muted)' }}>-</span>
                <input
                    type="number"
                    name="maxPrice"
                    placeholder={t('max_price')}
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    style={{ ...filterInputStyle }}
                />
            </div>
        </div>

        <button
            onClick={applyFilters}
            className="btn btn-primary"
            style={{ padding: '0.8rem', borderRadius: '12px', fontWeight: '800', width: '100%' }}
        >
            Apply Filters
        </button>

        <button
            onClick={() => window.location.href = '/shop'}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 'bold' }}
        >
            Clear All
        </button>
    </div>
);

// --- Styles ---
const shopHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '3rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '1rem'
};

const shopTitleStyle = {
    fontSize: '3rem',
    fontWeight: '900',
    color: 'var(--text-body)',
    margin: 0
};

const shopLayoutStyle = {
    display: 'flex',
    gap: '3rem'
};

const sidebarStyle = {
    width: '280px',
    backgroundColor: 'var(--bg-surface)',
    padding: '2.5rem',
    borderRadius: '24px',
    height: 'fit-content',
    position: 'sticky',
    top: '100px',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow)'
};

const filterTitleStyle = {
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--text-muted)',
    marginBottom: '1rem',
    fontWeight: '800'
};

const filterInputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-body)',
    color: 'var(--text-body)',
    fontSize: '0.9rem',
    outline: 'none'
};

const gridControlsStyle = {
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'flex-end'
};

const loadingWrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    padding: '5rem'
};

const spinnerStyle = {
    width: '40px',
    height: '40px',
    border: '4px solid var(--border-color)',
    borderTopColor: 'var(--red-primary)',
    borderRadius: '50%'
};

const emptyWrapperStyle = {
    textAlign: 'center',
    padding: '5rem 0',
    color: 'var(--text-muted)'
};

const filterToggleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-color)',
    padding: '0.6rem 1.25rem',
    borderRadius: '25px',
    color: 'var(--text-body)',
    fontWeight: 'bold',
    fontSize: '0.9rem'
};

const mobileDrawerOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 2000,
    display: 'flex',
    justifyContent: 'flex-end'
};

const mobileDrawerStyle = {
    width: '85%',
    height: '100%',
    backgroundColor: 'var(--bg-surface)',
    padding: '2.5rem 1.5rem',
    boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
    overflowY: 'auto'
};

export default ShopPage;
