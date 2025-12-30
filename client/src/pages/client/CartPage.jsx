import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const CartPage = () => {
    const { t, i18n } = useTranslation();
    const { cartItems, removeFromCart } = useCart();
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
        navigate('/login?redirect=checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="animate-on-scroll" style={{ marginBottom: '2rem', color: '#ccc' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                </div>
                <h2 className="animate-on-scroll delay-100" style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>
                    {t('cart.empty', 'Your cart is empty')}
                </h2>
                <p className="animate-on-scroll delay-200" style={{ color: '#666', marginBottom: '2rem', maxWidth: '400px' }}>
                    Looks like you haven't added anything to your cart yet. Browse our catalog to find the best parts for your Ford.
                </p>
                <Link to="/catalog" className="animate-on-scroll delay-300 btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
                    {t('cart.continueShopping', 'Start Shopping')}
                </Link>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '4rem 0' }}>
            <div className="container">
                <h1 className="animate-on-scroll" style={{
                    fontSize: '2.5rem',
                    marginBottom: '3rem',
                    color: 'var(--ford-blue)',
                    fontFamily: 'var(--font-logo)',
                    borderBottom: '2px solid #e9ecef',
                    paddingBottom: '1rem'
                }}>
                    {t('cart.title', 'Shopping Cart')}
                </h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
                    {/* Cart Items Column */}
                    <div style={{ flex: '2', minWidth: '0' }}> {/* minWidth 0 prevents grid overflow */}
                        {cartItems.map((item, index) => (
                            <div key={item._id} className={`animate-on-scroll delay-${(index + 1) * 100}`} style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1.5rem',
                                marginBottom: '1.5rem',
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                border: '1px solid #eee'
                            }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.05)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)';
                                }}
                            >
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    marginRight: '1.5rem',
                                    flexShrink: 0
                                }}>
                                    <img
                                        src={item.images[0]}
                                        alt={getLocalizedContent(item, 'name')}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>

                                <div style={{ flex: 1, marginRight: '1rem' }}>
                                    <Link to={`/product/${item._id}`} style={{
                                        display: 'block',
                                        fontWeight: 'bold',
                                        fontSize: '1.2rem',
                                        marginBottom: '0.5rem',
                                        color: '#333',
                                        textDecoration: 'none'
                                    }}>
                                        {getLocalizedContent(item, 'name')}
                                    </Link>
                                    <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                        {t('cart.qty', 'Qty')}: <span style={{ fontWeight: 'bold', color: '#333' }}>{item.qty}</span>
                                    </div>
                                    <div style={{ color: 'var(--ford-blue)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        {item.price.toLocaleString()} DA
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    style={{
                                        background: '#fff0f0',
                                        border: 'none',
                                        color: '#dc3545',
                                        cursor: 'pointer',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'background 0.2s'
                                    }}
                                    title={t('cart.remove', 'Remove')}
                                    onMouseEnter={e => e.currentTarget.style.background = '#ffe0e0'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#fff0f0'}
                                >
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Summary Column - Sticky */}
                    <div className="animate-on-scroll delay-300" style={{
                        flex: '1',
                        position: 'sticky',
                        top: '2rem',
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        border: '1px solid #eee'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                            {t('cart.summary', 'Order Summary')}
                        </h2>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem', color: '#555' }}>
                            <span>{t('cart.items', 'Items')} ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                            <span>{totalPrice.toLocaleString()} DA</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
                            <span>{t('cart.total', 'Total')}</span>
                            <span style={{ color: 'var(--ford-blue)' }}>{totalPrice.toLocaleString()} DA</span>
                        </div>

                        <button
                            type="button"
                            className="btn btn-primary"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1.1rem',
                                boxShadow: '0 4px 10px rgba(0, 51, 153, 0.3)',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onClick={checkoutHandler}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 51, 153, 0.4)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 51, 153, 0.3)';
                            }}
                        >
                            {t('cart.checkout', 'Proceed to Checkout')}
                        </button>

                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.9rem', color: '#999' }}>
                                <i className="fas fa-lock" style={{ marginRight: '0.5rem' }}></i>
                                {t('cart.secure', 'Secure Checkout')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
