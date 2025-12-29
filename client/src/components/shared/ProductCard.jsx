import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
    const { t, i18n } = useTranslation();
    const { addToCart } = useCart();

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
            border: '1px solid var(--gray-200)',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: 'white',
            transition: 'transform 0.2s',
            boxShadow: 'var(--shadow-sm)'
        }}>
            <div style={{ height: '200px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={getLocalizedContent('name')} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                ) : (
                    <span style={{ color: '#999' }}>No Image</span>
                )}
            </div>
            <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{getLocalizedContent('name')}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>OEM: {product.oemNumber}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--ford-blue)' }}>
                        {product.price} DA
                    </span>
                    <button
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                        onClick={() => addToCart(product)}
                    >
                        {t('catalog.addToCart', 'Add to Cart')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
