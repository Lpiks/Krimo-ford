import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
    const { t, i18n } = useTranslation();
    const { addToCart } = useCart();
    const [qty, setQty] = useState(1);

    const handleQuantityChange = (delta) => {
        setQty(prev => Math.max(1, prev + delta));
    };

    // Helper to get translated content safely
    const getLocalizedContent = (field) => {
        return product[field] && product[field][i18n.language]
            ? product[field][i18n.language]
            : product[field] && product[field]['en'] // Fallback to EN
                ? product[field]['en']
                : 'N/A';
    };

    return (
        <div className="product-card" style={{
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: 'white',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.05)',
            cursor: 'pointer',
            position: 'relative'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                const img = e.currentTarget.querySelector('.product-image');
                if (img) img.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.05)';
                const img = e.currentTarget.querySelector('.product-image');
                if (img) img.style.transform = 'scale(1)';
            }}
        >
            <div style={{
                height: '240px',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative'
            }}>
                {product.images && product.images.length > 0 ? (
                    <img
                        src={product.images[0]}
                        alt={getLocalizedContent('name')}
                        className="product-image"
                        style={{
                            maxWidth: '90%',
                            maxHeight: '90%',
                            objectFit: 'contain',
                            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    />
                ) : (
                    <span style={{ color: '#ccc', fontWeight: '500' }}>No Image</span>
                )}
            </div>

            <div style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <p style={{
                        color: '#888',
                        fontSize: '0.85rem',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: '600'
                    }}>
                        OEM: {product.oemNumber}
                    </p>
                    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h3 style={{
                            fontSize: '1.25rem',
                            marginBottom: '0.5rem',
                            fontWeight: '700',
                            color: '#1f2937',
                            lineHeight: '1.4',
                            minHeight: '2.8em', // Reserve space for 2 lines
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}>
                            {getLocalizedContent('name')}
                        </h3>
                    </Link>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                    <div>
                        <span style={{
                            fontSize: '1.5rem',
                            fontWeight: '800',
                            color: 'var(--ford-blue)',
                            display: 'block',
                            marginBottom: '0.5rem'
                        }}>
                            {product.price.toLocaleString()} DA
                        </span>

                        {/* Modern Quantity Capsule */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '9999px',
                            padding: '2px',
                        }}>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleQuantityChange(-1); }}
                                disabled={qty <= 1}
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: qty <= 1 ? 'transparent' : 'white',
                                    color: qty <= 1 ? '#9ca3af' : 'var(--ford-blue)',
                                    cursor: qty <= 1 ? 'default' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    boxShadow: qty <= 1 ? 'none' : '0 1px 2px rgba(0,0,0,0.1)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                -
                            </button>
                            <span style={{
                                width: '30px',
                                textAlign: 'center',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                color: '#374151',
                                userSelect: 'none'
                            }}>
                                {qty}
                            </span>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleQuantityChange(1); }}
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: 'white',
                                    color: 'var(--ford-blue)',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{
                            padding: '0.8rem 1.2rem',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            boxShadow: '0 4px 6px rgba(0, 51, 153, 0.2)',
                            transition: 'all 0.2s',
                            fontSize: '1rem'
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, qty);
                            setQty(1);
                        }}
                    >
                        <i className="fas fa-shopping-cart" style={{ fontSize: '1.2rem' }}></i>
                        <span style={{ fontWeight: '600', fontSize: '1rem' }}>Add</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
