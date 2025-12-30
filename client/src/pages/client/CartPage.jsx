import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const CartPage = () => {
    const { t, i18n } = useTranslation();
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate();

    useScrollAnimation();

    const getLocalizedContent = (product, field) => {
        return product[field] && product[field][i18n.language]
            ? product[field][i18n.language]
            : product[field] && product[field]['en']
                ? product[field]['en']
                : 'N/A';
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const checkoutHandler = () => {
        navigate('/checkout');
    };

    const handleQuantityChange = (item, newQty) => {
        if (newQty >= 1) {
            updateQuantity(item._id, newQty);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="animate-on-scroll" style={{ marginBottom: '2rem', color: '#cbd5e1' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                </div>
                <h2 className="animate-on-scroll delay-100" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1e293b', fontWeight: '800' }}>
                    {t('cart.empty', 'Your cart is empty')}
                </h2>
                <p className="animate-on-scroll delay-200" style={{ color: '#64748b', marginBottom: '2.5rem', maxWidth: '450px', fontSize: '1.1rem', lineHeight: '1.6' }}>
                    It looks like you haven't added any parts to your cart yet. Explore our catalog to find exactly what you need.
                </p>
                <Link to="/catalog" className="animate-on-scroll delay-300 btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '50px' }}>
                    {t('cart.continueShopping', 'Start Shopping')}
                </Link>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '3rem 0 5rem' }}>
            <div className="container">
                <h1 className="animate-on-scroll" style={{
                    fontSize: '2.5rem',
                    marginBottom: '2.5rem',
                    color: '#0f172a',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    {t('cart.title', 'Shopping Cart')}
                    <span style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: '500', marginTop: '8px' }}>
                        ({cartItems.reduce((acc, item) => acc + item.qty, 0)} {t('cart.items', 'items')})
                    </span>
                </h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>

                    {/* Left Column: Cart Items List */}
                    <div style={{ flex: '1', minWidth: '0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {cartItems.map((item, index) => (
                                <div key={item._id} className={`animate-on-scroll delay-${(index % 5) * 100}`} style={{
                                    display: 'grid',
                                    gridTemplateColumns: '120px 1fr auto',
                                    gap: '1.5rem',
                                    padding: '1.5rem',
                                    backgroundColor: 'white',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                                    border: '1px solid #e2e8f0',
                                    alignItems: 'center'
                                }}>
                                    {/* Product Image */}
                                    <div style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        backgroundColor: '#f1f5f9',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        <img
                                            src={item.images[0]}
                                            alt={getLocalizedContent(item, 'name')}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>

                                    {/* Product Info & Controls */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: '#0f172a' }}>
                                                <Link to={`/product/${item._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    {getLocalizedContent(item, 'name')}
                                                </Link>
                                            </h3>
                                            <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>
                                                Ref: {item.oemNumber}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                <button
                                                    onClick={() => handleQuantityChange(item, item.qty - 1)}
                                                    disabled={item.qty <= 1}
                                                    style={{ width: '36px', height: '36px', border: 'none', background: 'transparent', cursor: item.qty <= 1 ? 'default' : 'pointer', color: item.qty <= 1 ? '#cbd5e1' : '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}
                                                >−</button>
                                                <span style={{ padding: '0 0.8rem', fontWeight: '600', color: '#0f172a', minWidth: '30px', textAlign: 'center' }}>{item.qty}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item, item.qty + 1)}
                                                    style={{ width: '36px', height: '36px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}
                                                >+</button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: '#ef4444',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '500',
                                                    padding: '0.5rem',
                                                    borderRadius: '6px',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                                {t('cart.remove', 'Remove')}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--ford-blue)' }}>
                                            {(item.qty * item.price).toLocaleString()} DA
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                                            {item.price.toLocaleString()} DA / unit
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div style={{ flex: '0 0 380px' }}> {/* Fixed width sidebar on desktop */}
                        <div className="animate-on-scroll delay-300" style={{
                            position: 'sticky',
                            top: '2rem',
                            backgroundColor: 'white',
                            padding: '2rem',
                            borderRadius: '24px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            border: '1px solid #e2e8f0'
                        }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9', color: '#0f172a', fontWeight: '700' }}>
                                {t('cart.summary', 'Order Summary')}
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '1.05rem' }}>
                                    <span>{t('cart.subtotal', 'Subtotal')}</span>
                                    <span style={{ color: '#0f172a', fontWeight: '600' }}>{totalPrice.toLocaleString()} DA</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '1.05rem' }}>
                                    <span>{t('cart.shipping', 'Shipping')}</span>
                                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{t('cart.calculatedAtCheckout', 'Calculated at checkout')}</span>
                                </div>

                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', paddingTop: '1.5rem', borderTop: '2px dashed #e2e8f0', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{t('cart.total', 'Total')}</span>
                                <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--ford-blue)' }}>{totalPrice.toLocaleString()} <span style={{ fontSize: '1rem', color: '#64748b' }}>DA</span></span>
                            </div>

                            <button
                                type="button"
                                className="btn btn-primary"
                                style={{
                                    width: '100%',
                                    padding: '1.1rem',
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    boxShadow: '0 4px 6px -1px rgba(0, 52, 120, 0.2)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    borderRadius: '12px'
                                }}
                                onClick={checkoutHandler}
                            >
                                {t('cart.checkout', 'Secure Checkout')}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                    <line x1="1" y1="10" x2="23" y2="10"></line>
                                </svg>
                            </button>

                            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', color: '#94a3b8' }}>
                                <i className="fab fa-cc-visa fa-2x"></i>
                                <i className="fab fa-cc-mastercard fa-2x"></i>
                                <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', fontWeight: '600', border: '1px solid #e2e8f0', padding: '0 0.5rem', borderRadius: '4px' }}>COD</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
