import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useTranslation } from 'react-i18next';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckoutPage = () => {
    const { t } = useTranslation();
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: 'Algeria',
        phone: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('COD');

    const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const orderData = {
                orderItems: cartItems.map(item => ({
                    product: item._id,
                    name: item.name, // Ensure localized name logic if needed, backend schema expects object or string? Schema has {en,fr,ar} but here we might send one. Let's send localized object if backend supports, otherwise simplify. Schema says name: {en, fr, ar}.
                    // The cart item has full product object, so it has name: {en, fr, ar}.
                    qty: item.qty,
                    image: item.images[0],
                    price: item.price
                })),
                shippingAddress,
                paymentMethod,
                itemsPrice: totalPrice,
                shippingPrice: 0, // Logic for shipping can be added
                taxPrice: 0,
                totalPrice,
            };

            await axios.post('/api/orders', orderData, config);
            clearCart();
            navigate('/'); // Redirect to home or order success page
            alert("Order Placed Successfully!");
        } catch (error) {
            console.error(error);
            alert("Order Failed: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ marginBottom: '2rem', color: 'var(--ford-blue)' }}>{t('checkout.title')}</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                <form onSubmit={submitHandler}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
                        <h2 style={{ marginBottom: '1rem' }}>{t('checkout.shipping')}</h2>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('checkout.address')}</label>
                            <input type="text" required value={shippingAddress.address} onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('checkout.city')}</label>
                                <input type="text" required value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('checkout.postalCode')}</label>
                                <input type="text" required value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('checkout.phone')}</label>
                            <input type="text" required value={shippingAddress.phone} onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                        <h2 style={{ marginBottom: '1rem' }}>{t('checkout.payment')}</h2>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
                                <input type="radio" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                {t('checkout.cod')}
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="radio" value="BankTransfer" checked={paymentMethod === 'BankTransfer'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                {t('checkout.bank')}
                            </label>
                        </div>
                    </div>
                </form>

                <div style={{ height: 'fit-content' }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                        <h2 style={{ marginBottom: '1rem' }}>{t('checkout.summary')}</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>{t('cart.item', 'Items')}</span>
                            <span>{totalPrice} DA</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>{t('checkout.shipping', 'Shipping')}</span>
                            <span>0.00 DA</span>
                        </div>
                        <div style={{ borderTop: '1px solid #eee', margin: '1rem 0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span>{t('cart.total')}</span>
                            <span>{totalPrice} DA</span>
                        </div>
                        <button type="submit" onClick={submitHandler} className="btn btn-primary" style={{ width: '100%' }}>{t('checkout.placeOrder')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
