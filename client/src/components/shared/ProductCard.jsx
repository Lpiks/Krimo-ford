import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useGarage } from '../../context/GarageContext';
import { getWhatsAppLink, createProductInquiryWhatsAppMessage } from '../../utils/whatsapp';

const ProductCard = ({ product }) => {
    const { t, i18n } = useTranslation();
    const { addToCart } = useCart();
    const { selectedVehicle, checkFitment } = useGarage();
    const [qty, setQty] = useState(1);
    const navigate = useNavigate();

    const handleQuantityChange = (delta) => {
        setQty(prev => Math.max(1, prev + delta));
    };

    const getLocalizedContent = (field) => {
        return product[field] && product[field][i18n.language]
            ? product[field][i18n.language]
            : product[field] && product[field]['en']
                ? product[field]['en']
                : 'N/A';
    };

    const fitment = checkFitment(product);

    const waMsg = createProductInquiryWhatsAppMessage({
        product,
        vehicle: selectedVehicle,
        language: i18n.language
    });

    const isAvailable = product.stock === undefined || product.stock > 0;

    return (
        <div
            className="product-card"
            style={{
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: 'white',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
            onClick={() => navigate(`/product/${product._id}`)}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 30px -10px rgba(0, 52, 120, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.borderColor = '#93c5fd';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)';
                e.currentTarget.style.borderColor = '#e2e8f0';
            }}
        >
            <div>
                {/* Image Section & Badges */}
                <div style={{
                    height: '220px',
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                    borderBottom: '1px solid #f1f5f9'
                }}>
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[0]}
                            alt={getLocalizedContent('name')}
                            className="product-image"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.4s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    ) : (
                        <div style={{ color: '#94a3b8', fontWeight: '700', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
                            ⚙️ Pièce Ford d'Origine
                        </div>
                    )}

                    {/* Stock Pill with live dot */}
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        backgroundColor: isAvailable ? 'rgba(240, 253, 244, 0.95)' : 'rgba(254, 242, 242, 0.95)',
                        backdropFilter: 'blur(4px)',
                        color: isAvailable ? '#15803d' : '#991b1b',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '20px',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        border: isAvailable ? '1px solid #bbf7d0' : '1px solid #fecaca'
                    }}>
                        <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: isAvailable ? '#22c55e' : '#ef4444'
                        }} />
                        <span>{isAvailable ? 'En Stock Soummam' : 'Sur Commande'}</span>
                    </div>

                    {/* Quick WhatsApp order icon on image */}
                    <a
                        href={getWhatsAppLink(waMsg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Commander directement par WhatsApp"
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            backgroundColor: '#25D366',
                            color: 'white',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
                            transition: 'transform 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.12)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.97.529 1.942.81 2.8.81h.005c3.18 0 5.767-2.587 5.768-5.766 0-3.181-2.587-5.767-5.777-5.777zm7.394 5.767c0 4.075-3.317 7.391-7.391 7.391-.002 0-.005 0-.007 0-1.21 0-2.399-.312-3.447-.905l-4.58 1.2 1.222-4.462c-.672-1.12-1.026-2.404-1.026-3.724 0-4.075 3.318-7.391 7.393-7.391s7.391 3.316 7.391 7.391zm-4.708 2.062c-.179-.09-1.061-.523-1.225-.583-.164-.06-.283-.09-.402.09-.119.18-.462.583-.566.703-.104.119-.209.134-.388.045-.179-.09-.757-.279-1.442-.89-.533-.475-.893-1.062-.998-1.242-.104-.179-.011-.276.079-.365.08-.08.179-.209.269-.313.089-.104.119-.179.179-.298.06-.119.03-.224-.015-.313-.045-.09-.402-.97-.552-1.328-.145-.349-.293-.301-.402-.307-.104-.005-.224-.007-.343-.007-.119 0-.313.045-.477.224-.164.179-.627.613-.627 1.494 0 .881.642 1.733.731 1.852.09.119 1.264 1.93 3.062 2.706.428.185.762.296 1.023.379.43.137.822.117 1.131.071.345-.052 1.061-.433 1.21-.852.149-.418.149-.776.104-.852-.044-.075-.164-.119-.343-.209z" />
                        </svg>
                    </a>
                </div>

                {/* Card Content */}
                <div style={{ padding: '1.25rem 1.25rem 0.75rem 1.25rem' }}>
                    {/* Garage Fitment Alert Pill */}
                    {fitment.checked && (
                        <div
                            className={fitment.compatible ? 'pulse-compatible' : ''}
                            style={{
                                padding: '0.35rem 0.75rem',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                marginBottom: '0.75rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                backgroundColor: fitment.compatible ? '#dcfce7' : '#fee2e2',
                                color: fitment.compatible ? '#15803d' : '#991b1b',
                                border: fitment.compatible ? '1px solid #86efac' : '1px solid #fecaca'
                            }}
                        >
                            <span>{fitment.compatible ? '✓' : '⚠'}</span>
                            <span>
                                {fitment.compatible
                                    ? `Compatible Ford ${selectedVehicle.model}`
                                    : `Non vérifié sur Ford ${selectedVehicle.model}`}
                            </span>
                        </div>
                    )}

                    {/* Monospace OEM Number */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                        <span className="badge-oem" style={{
                            fontSize: '0.72rem',
                            color: 'var(--ford-blue)',
                            backgroundColor: '#eff6ff',
                            padding: '2px 7px',
                            borderRadius: '4px',
                            border: '1px solid #bfdbfe'
                        }}>
                            OEM {product.oemNumber || 'MOTORCRAFT'}
                        </span>

                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                            {product.category || 'Ford'}
                        </span>
                    </div>

                    {/* Product Title */}
                    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h3 style={{
                            fontSize: '1.05rem',
                            marginBottom: '0.5rem',
                            fontWeight: '700',
                            color: '#0f172a',
                            lineHeight: '1.4',
                            minHeight: '2.8em',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            letterSpacing: '-0.01em'
                        }}>
                            {getLocalizedContent('name')}
                        </h3>
                    </Link>
                </div>
            </div>

            {/* Price & Cart Actions */}
            <div style={{
                padding: '0.85rem 1.25rem 1.25rem 1.25rem',
                borderTop: '1px solid #f1f5f9',
                backgroundColor: '#ffffff'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <div>
                        <div className="tabular-price" style={{
                            fontSize: '1.35rem',
                            fontWeight: '900',
                            color: 'var(--ford-blue)',
                            lineHeight: 1.1
                        }}>
                            {product.price ? product.price.toLocaleString('fr-DZ') : 0} <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>DA</span>
                        </div>

                        {/* Quantity Capsule */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '9999px',
                            padding: '2px',
                            marginTop: '0.35rem',
                            border: '1px solid #e2e8f0'
                        }}>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleQuantityChange(-1); }}
                                disabled={qty <= 1}
                                style={{
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: qty <= 1 ? 'transparent' : 'white',
                                    color: qty <= 1 ? '#cbd5e1' : 'var(--ford-blue)',
                                    cursor: qty <= 1 ? 'default' : 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                -
                            </button>
                            <span style={{ width: '22px', textAlign: 'center', fontWeight: '700', fontSize: '0.8rem', color: '#1e293b' }}>
                                {qty}
                            </span>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleQuantityChange(1); }}
                                style={{
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: 'white',
                                    color: 'var(--ford-blue)',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        style={{
                            padding: '0.65rem 1rem',
                            borderRadius: '10px',
                            backgroundColor: 'var(--ford-blue)',
                            color: 'white',
                            border: 'none',
                            fontWeight: '700',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            boxShadow: '0 4px 12px rgba(0, 52, 120, 0.22)',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--ford-light-blue)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--ford-blue)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, qty);
                            setQty(1);
                        }}
                    >
                        <span>🛒</span>
                        <span>{t('catalog.addToCart', 'Ajouter')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
