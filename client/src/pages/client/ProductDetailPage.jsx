import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-hot-toast';

const ProductDetailPage = () => {
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [qty, setQty] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
                if (data.images && data.images.length > 0) {
                    setMainImage(data.images[0]);
                }
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
                toast.error(t('common.errorLoadingProduct', 'Error loading product details'));
            }
        };

        fetchProduct();
        window.scrollTo(0, 0);
    }, [id, t]);

    const handleQuantityChange = (delta) => {
        setQty(prev => Math.max(1, prev + delta));
    };

    const getLocalizedContent = (field) => {
        if (!product) return '';
        return product[field] && product[field][i18n.language]
            ? product[field][i18n.language]
            : product[field] && product[field]['en']
                ? product[field]['en']
                : 'N/A';
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div className="spinner" style={{ color: 'var(--ford-blue)', fontSize: '1.2rem' }}>{t('common.loading', 'Loading...')}</div>
        </div>
    );

    if (error) return (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h2 style={{ color: 'red' }}>{t('common.error', 'Error')}</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/catalog')} style={{ marginTop: '1rem' }}>
                {t('nav.backToCatalog', 'Back to Catalog')}
            </button>
        </div>
    );

    if (!product) return null;

    return (
        <div className="container" style={{ padding: '2rem 1rem 4rem' }}>
            {/* Breadcrumb / Back Button */}
            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--ford-blue)',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '1rem'
                    }}
                >
                    <i className="fas fa-arrow-left"></i>
                    {t('common.back', 'Back')}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>

                {/* Left Column: Images */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{
                        width: '100%',
                        height: '400px',
                        backgroundColor: '#fff',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-md)',
                        border: '1px solid var(--gray-200)'
                    }}>
                        {mainImage ? (
                            <img
                                src={mainImage}
                                alt={getLocalizedContent('name')}
                                style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                            />
                        ) : (
                            <span style={{ color: '#ccc' }}>No Image</span>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {product.images.map((img, index) => (
                                <div
                                    key={index}
                                    onClick={() => setMainImage(img)}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '8px',
                                        border: mainImage === img ? '2px solid var(--ford-blue)' : '1px solid var(--gray-200)',
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#fff'
                                    }}
                                >
                                    <img src={img} alt={`Thumbnail ${index}`} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Details */}
                <div>
                    <h5 style={{ color: '#6b7280', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: '600' }}>
                        OEM: {product.oemNumber} | {product.category}
                    </h5>

                    {product.fuelType && (
                        <span style={{
                            display: 'inline-block',
                            backgroundColor: product.fuelType === 'Diesel' ? '#fef3c7' : '#dbeafe',
                            color: product.fuelType === 'Diesel' ? '#92400e' : '#1e40af',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            marginBottom: '0.5rem'
                        }}>
                            {product.fuelType === 'All' ? 'All Fuel Types' : product.fuelType}
                        </span>
                    )}

                    <h1 style={{
                        fontSize: '2rem',
                        color: 'var(--text-dark)',
                        marginBottom: '1rem',
                        lineHeight: 1.2
                    }}>
                        {getLocalizedContent('name')}
                    </h1>

                    <div style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        color: 'var(--ford-blue)',
                        marginBottom: '2rem'
                    }}>
                        {product.price.toLocaleString()} DA
                    </div>

                    <div style={{
                        backgroundColor: '#f9fafb',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        marginBottom: '2rem',
                        border: '1px solid #e5e7eb'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <label style={{ fontWeight: '600', color: '#374151' }}>{t('common.quantity', 'Quantity')}:</label>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    padding: '4px'
                                }}>
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={qty <= 1}
                                        style={{
                                            width: '32px', height: '32px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: '#f3f4f6',
                                            color: qty <= 1 ? '#9ca3af' : 'var(--text-dark)',
                                            cursor: qty <= 1 ? 'default' : 'pointer',
                                            fontWeight: 'bold',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        -
                                    </button>
                                    <span style={{ width: '40px', textAlign: 'center', fontWeight: '600' }}>{qty}</span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        style={{
                                            width: '32px', height: '32px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: '#f3f4f6',
                                            color: 'var(--text-dark)',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1.1rem',
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '0.8rem'
                            }}
                            onClick={() => {
                                addToCart(product, qty);
                                setQty(1);
                                toast.success(t('cart.added', 'Added to cart'));
                            }}
                        >
                            <i className="fas fa-shopping-cart"></i>
                            {t('common.addToCart', 'Add to Cart')}
                        </button>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', borderBottom: '2px solid var(--gray-200)', paddingBottom: '0.5rem' }}>
                            {t('common.description', 'Description')}
                        </h3>
                        <p style={{ lineHeight: '1.6', color: '#4b5563', fontSize: '1.05rem' }}>
                            {getLocalizedContent('description')}
                        </p>
                    </div>

                    {product.compatibility && product.compatibility.length > 0 && (
                        <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', borderBottom: '2px solid var(--gray-200)', paddingBottom: '0.5rem' }}>
                                {t('common.compatibility', 'Compatibility')}
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {product.compatibility.map((item, idx) => (
                                    <span key={idx} style={{
                                        backgroundColor: '#e0e7ff',
                                        color: 'var(--ford-blue)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        fontSize: '0.95rem',
                                        fontWeight: '500',
                                        border: '1px solid #c7d2fe'
                                    }}>
                                        {item.make} {item.model} {item.year}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
