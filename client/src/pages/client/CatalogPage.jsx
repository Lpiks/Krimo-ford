import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import ProductCard from '../../components/shared/ProductCard';

const CatalogPage = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [keyword, setKeyword] = useState('');

    const fetchProducts = async (searchKeyword = '') => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/products?keyword=${searchKeyword}`);
            setProducts(data.products);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const submitHandler = (e) => {
        e.preventDefault();
        fetchProducts(keyword);
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ color: 'var(--ford-blue)', marginBottom: '1.5rem', textAlign: 'center' }}>{t('nav.catalog')}</h1>

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
