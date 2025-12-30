import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/shared/ProductCard';

const CatalogPage = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const categoryParam = searchParams.get('category');

    const categories = ['Brakes', 'Filters', 'Suspension', 'Engine', 'Electrical', 'Body', 'Accessories'];

    const handleCategoryClick = (cat) => {
        if (cat) {
            navigate(`/catalog?category=${cat}`);
        } else {
            navigate('/catalog');
        }
    };

    const [keyword, setKeyword] = useState('');

    const fetchProducts = async (searchKeyword = '') => {
        setLoading(true);
        try {
            // Build query string
            let query = `/api/products?keyword=${searchKeyword}`;
            if (categoryParam) {
                query += `&category=${categoryParam}`;
            }

            const { data } = await axios.get(query);
            setProducts(data.products);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(keyword);
    }, [categoryParam]); // Re-fetch when category changes

    const submitHandler = (e) => {
        e.preventDefault();
        fetchProducts(keyword);
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ color: 'var(--ford-blue)', marginBottom: '1.5rem', textAlign: 'center' }}>
                {categoryParam ? `${t('nav.catalog')} - ${categoryParam}` : t('nav.catalog')}
            </h1>

            {/* Category Filter Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => handleCategoryClick(null)}
                    style={{
                        padding: '0.6rem 1.2rem',
                        borderRadius: '999px',
                        border: !categoryParam ? '1px solid var(--ford-blue)' : '1px solid #e5e7eb',
                        backgroundColor: !categoryParam ? 'var(--ford-blue)' : 'white',
                        color: !categoryParam ? 'white' : '#4b5563',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                >
                    {t('common.all', 'All')}
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        style={{
                            padding: '0.6rem 1.2rem',
                            borderRadius: '999px',
                            border: categoryParam === cat ? '1px solid var(--ford-blue)' : '1px solid #e5e7eb',
                            backgroundColor: categoryParam === cat ? 'var(--ford-blue)' : 'white',
                            color: categoryParam === cat ? 'white' : '#4b5563',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
                <form onSubmit={submitHandler} className="search-container" style={{ width: '100%', maxWidth: '500px' }}>
                    <input
                        type="text"
                        name="q"
                        className="search-input"
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder={t('search.placeholder', 'Search by Name or OEM...')}
                    />
                    <button type="submit" className="search-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </form>
            </div>

            {loading ? (
                <p>{t('common.loading')}</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{t('common.error')}: {error}</p>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '2rem'
                }}>
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}

            {products.length === 0 && !loading && !error && (
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <p>{t('catalog.noProducts')}</p>
                    {keyword && (
                        <button
                            className="btn btn-light"
                            onClick={() => { setKeyword(''); fetchProducts(''); }}
                            style={{ marginTop: '1rem' }}
                        >
                            {t('common.clearSearch', 'Clear Search')}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default CatalogPage;
