import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartPage = () => {
    const { t, i18n } = useTranslation();
    const { cartItems, removeFromCart } = useCart();
    const navigate = useNavigate();

    const getLocalizedContent = (product, field) => {
        return product[field] && product[field][i18n.language]
            ? product[field][i18n.language]
            : product[field] && product[field]['en']
                ? product[field]['en']
                : 'N/A';
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const checkoutHandler = () => {
        navigate('/login?redirect=checkout'); // Redirect to login, then checkout
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 className="logo-text" style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--ford-blue)' }}>
                {t('cart.title', 'Shopping Cart')}
            </h1>

            {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{t('cart.empty')}</p>
                    <Link to="/catalog" className="btn btn-primary">{t('cart.continueShopping', 'Continue Shopping')}</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                    {/* Cart Items */}
                    <div>
                        {cartItems.map((item) => (
                            <div key={item._id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1rem',
                                borderBottom: '1px solid #eee',
                                backgroundColor: 'white'
                            }}>
                                <img src={item.images[0]} alt={getLocalizedContent(item, 'name')} style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '1rem' }} />
                                <div style={{ flex: 1 }}>
                                    <Link to={`/product/${item._id}`} style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        {getLocalizedContent(item, 'name')}
                                    </Link>
                                    <p style={{ color: '#666' }}>{item.price} DA</p>
                                </div>
                                <div style={{ margin: '0 1rem' }}>
                                    {t('cart.qty', 'Qty')}: {item.qty}
                                </div>
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
                                >
                                    <i className="fas fa-trash"></i> {t('cart.remove', 'Remove')}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div style={{
                        padding: '1.5rem',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: 'var(--shadow-sm)',
                        height: 'fit-content'
                    }}>
                        <h2 style={{ marginBottom: '1rem' }}>{t('cart.subtotal', 'Subtotal')} ({cartItems.reduce((acc, item) => acc + item.qty, 0)} {t('cart.item', 'items')})</h2>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>{totalPrice} DA</p>
                        <button
                            type="button"
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            onClick={checkoutHandler}
                        >
                            {t('cart.checkout')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
