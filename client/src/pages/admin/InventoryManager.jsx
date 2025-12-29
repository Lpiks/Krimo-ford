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

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/products');
            setProducts(data.products);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="logo-text" style={{ fontSize: '2.5rem', color: 'var(--ford-blue)' }}>{t('admin.inventory')}</h1>
                <Link to="/admin/product/new" className="btn btn-primary">{t('admin.addProduct')}</Link>
            </div>

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
