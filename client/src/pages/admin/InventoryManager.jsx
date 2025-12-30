import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const InventoryManager = () => {
    const { t } = useTranslation();
    const { userInfo } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const deleteHandler = async (id) => {
        try {
            await axios.delete(`/api/products/${id}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            toast.success('Product Deleted');
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete product');
        }
    };

    const confirmDelete = (id) => {
        toast((t) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>Delete this product?</span>
                <button
                    onClick={() => {
                        deleteHandler(id);
                        toast.dismiss(t.id);
                    }}
                    style={{
                        padding: '4px 8px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Yes
                </button>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    style={{
                        padding: '4px 8px',
                        backgroundColor: '#eee',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    No
                </button>
            </div>
        ), {
            duration: 5000,
            position: 'top-center',
        });
    };

    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (search = '') => {
        try {
            const { data } = await axios.get(`/api/products?keyword=${search}`);
            setProducts(data.products);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts(keyword);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="logo-text" style={{ fontSize: '2.5rem', color: 'var(--ford-blue)' }}>{t('admin.inventory')}</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/admin/categories" className="btn" style={{ backgroundColor: '#e5e7eb', color: '#374151' }}>{t('admin.categories', 'Categories')}</Link>
                    <Link to="/admin/carmodels" className="btn" style={{ backgroundColor: '#e5e7eb', color: '#374151' }}>{t('admin.carModels', 'Car Models')}</Link>
                    <Link to="/admin/product/new" className="btn btn-primary">{t('admin.addProduct')}</Link>
                </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <input
                    type="text"
                    placeholder="Search by Name, OEM, Car Model (e.g. Golf) or Year (e.g. 2015)..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        flex: 1,
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--ford-blue)'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
                <button
                    type="submit"
                    style={{
                        padding: '0.75rem 2rem',
                        backgroundColor: 'var(--ford-blue)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    Search
                </button>
            </form>

            <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: 'var(--ford-silver)' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>SKU</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>OEM</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>{t('cart.item', 'Name')}</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>{t('cart.price', 'Price')}</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>{t('catalog.stock', 'Stock')}</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>{t('admin.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id} style={{ borderTop: '1px solid #eee' }}>
                                <td style={{ padding: '1rem' }}>{product.sku || '-'}</td>
                                <td style={{ padding: '1rem' }}>{product.oemNumber}</td>
                                <td style={{ padding: '1rem' }}>{product.name?.en || 'N/A'}</td>
                                <td style={{ padding: '1rem' }}>{product.price} DA</td>
                                <td style={{ padding: '1rem' }}>{product.stock}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Link to={`/admin/product/${product._id}/edit`} style={{
                                            display: 'inline-block',
                                            textDecoration: 'none',
                                            backgroundColor: '#e7f1ff',
                                            color: 'var(--ford-blue)',
                                            padding: '0.4rem 1rem',
                                            borderRadius: '50px',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            transition: 'background-color 0.2s'
                                        }}>
                                            {t('admin.editProduct', 'Edit')}
                                        </Link>
                                        <button
                                            onClick={() => confirmDelete(product._id)}
                                            style={{
                                                backgroundColor: '#ffe7e7',
                                                color: '#dc3545',
                                                border: 'none',
                                                padding: '0.4rem 1rem',
                                                borderRadius: '50px',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                transition: 'background-color 0.2s'
                                            }}
                                        >
                                            {t('admin.delete', 'Delete')}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && !loading && (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>{t('catalog.noProducts')}</div>
                )}
            </div>
        </div >
    );
};

export default InventoryManager;
