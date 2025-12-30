import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const wilayas = [
    { id: 1, name: "Adrar", price: 1200 },
    { id: 2, name: "Chlef", price: 600 },
    { id: 3, name: "Laghouat", price: 900 },
    { id: 4, name: "Oum El Bouaghi", price: 800 },
    { id: 5, name: "Batna", price: 800 },
    { id: 6, name: "Béjaïa", price: 600 },
    { id: 7, name: "Biskra", price: 900 },
    { id: 8, name: "Béchar", price: 1200 },
    { id: 9, name: "Blida", price: 500 },
    { id: 10, name: "Bouira", price: 600 },
    { id: 11, name: "Tamanrasset", price: 1500 },
    { id: 12, name: "Tébessa", price: 900 },
    { id: 13, name: "Tlemcen", price: 800 },
    { id: 14, name: "Tiaret", price: 800 },
    { id: 15, name: "Tizi Ouzou", price: 600 },
    { id: 16, name: "Alger", price: 400 },
    { id: 17, name: "Djelfa", price: 900 },
    { id: 18, name: "Jijel", price: 700 },
    { id: 19, name: "Sétif", price: 700 },
    { id: 20, name: "Saïda", price: 800 },
    { id: 21, name: "Skikda", price: 700 },
    { id: 22, name: "Sidi Bel Abbès", price: 800 },
    { id: 23, name: "Annaba", price: 700 },
    { id: 24, name: "Guelma", price: 700 },
    { id: 25, name: "Constantine", price: 700 },
    { id: 26, name: "Médéa", price: 600 },
    { id: 27, name: "Mostaganem", price: 700 },
    { id: 28, name: "M'Sila", price: 800 },
    { id: 29, name: "Mascara", price: 800 },
    { id: 30, name: "Ouargla", price: 1000 },
    { id: 31, name: "Oran", price: 700 },
    { id: 32, name: "El Bayadh", price: 1000 },
    { id: 33, name: "Illizi", price: 1500 },
    { id: 34, name: "Bordj Bou Arreridj", price: 700 },
    { id: 35, name: "Boumerdès", price: 500 },
    { id: 36, name: "El Tarf", price: 800 },
    { id: 37, name: "Tindouf", price: 1500 },
    { id: 38, name: "Tissemsilt", price: 800 },
    { id: 39, name: "El Oued", price: 1000 },
    { id: 40, name: "Khenchela", price: 900 },
    { id: 41, name: "Souk Ahras", price: 900 },
    { id: 42, name: "Tipaza", price: 500 },
    { id: 43, name: "Mila", price: 700 },
    { id: 44, name: "Aïn Defla", price: 600 },
    { id: 45, name: "Naâma", price: 1000 },
    { id: 46, name: "Aïn Témouchent", price: 700 },
    { id: 47, name: "Ghardaïa", price: 1000 },
    { id: 48, name: "Relizane", price: 700 },
    { id: 49, name: "Timimoun", price: 1200 },
    { id: 50, name: "Bordj Badji Mokhtar", price: 1500 },
    { id: 51, name: "Ouled Djellal", price: 1000 },
    { id: 52, name: "Béni Abbès", price: 1200 },
    { id: 53, name: "In Salah", price: 1500 },
    { id: 54, name: "In Guezzam", price: 1500 },
    { id: 55, name: "Touggourt", price: 1000 },
    { id: 56, name: "Djanet", price: 1500 },
    { id: 57, name: "El M'Ghair", price: 1000 },
    { id: 58, name: "El Meniaa", price: 1200 }
];

const CheckoutPage = () => {
    const { t } = useTranslation();
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Algeria',
        phone: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [selectedWilaya, setSelectedWilaya] = useState(null);

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const shippingPrice = selectedWilaya ? selectedWilaya.price : 0;
    const finalTotal = itemsPrice + shippingPrice;

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };

            const orderData = {
                orderItems: cartItems.map(item => ({
                    product: item._id,
                    name: item.name,
                    qty: item.qty,
                    image: item.images[0],
                    price: item.price
                })),
                shippingAddress: {
                    ...shippingAddress,
                    wilaya: selectedWilaya ? selectedWilaya.name : ''
                },
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice: 0,
                totalPrice: finalTotal,
            };

            await axios.post('/api/orders', orderData, config);
            clearCart();
            toast.success("Order Placed Successfully!");
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error("Order Failed: " + (error.response?.data?.message || error.message));
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.9rem 1rem',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        backgroundColor: '#f8fafc',
        fontSize: '1rem',
        transition: 'all 0.2s',
        outline: 'none'
    };

    const handleFocus = (e) => {
        e.target.style.borderColor = 'var(--ford-blue)';
        e.target.style.backgroundColor = 'white';
        e.target.style.boxShadow = '0 0 0 3px rgba(16, 124, 237, 0.1)';
    };

    const handleBlur = (e) => {
        e.target.style.borderColor = '#cbd5e1';
        e.target.style.backgroundColor = '#f8fafc';
        e.target.style.boxShadow = 'none';
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '3rem 0' }}>
            <div className="container">
                <h1 className="animate-on-scroll" style={{ marginBottom: '2.5rem', color: '#0f172a', fontSize: '2.2rem', fontWeight: '800' }}>{t('checkout.title', 'Secure Checkout')}</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '2.5rem', alignItems: 'start' }}>

                    {/* Left Column: Form */}
                    <form onSubmit={submitHandler} className="animate-on-scroll delay-100">

                        {/* 1. Contact Info Section */}
                        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', border: '1px solid #e2e8f0' }}>
                            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', backgroundColor: '#eff6ff', color: 'var(--ford-blue)', borderRadius: '50%', fontSize: '0.9rem' }}>1</span>
                                {t('checkout.contactInfo', 'Contact Information')}
                            </h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#475569' }}>{t('checkout.fullName', 'Full Name')}</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Karim Benali"
                                        value={shippingAddress.fullName}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                                        style={inputStyle}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#475569' }}>{t('checkout.phone', 'Phone Number')}</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="05 XX XX XX XX"
                                        value={shippingAddress.phone}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                        style={inputStyle}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Shipping Details Section */}
                        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', border: '1px solid #e2e8f0' }}>
                            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', backgroundColor: '#eff6ff', color: 'var(--ford-blue)', borderRadius: '50%', fontSize: '0.9rem' }}>2</span>
                                {t('checkout.shippingDetails', 'Shipping Address')}
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#475569' }}>{t('checkout.wilaya', 'Wilaya')}</label>
                                    <select
                                        required
                                        value={selectedWilaya ? selectedWilaya.id : ''}
                                        onChange={(e) => {
                                            const wilaya = wilayas.find(w => w.id === parseInt(e.target.value));
                                            setSelectedWilaya(wilaya);
                                        }}
                                        style={{ ...inputStyle, appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    >
                                        <option value="">{t('checkout.selectWilaya', 'Select your Wilaya')}</option>
                                        {wilayas.map(w => (
                                            <option key={w.id} value={w.id}>{w.id} - {w.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#475569' }}>{t('checkout.city', 'Commune / City')}</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Bab Ezzouar"
                                            value={shippingAddress.city}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                            style={inputStyle}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#475569' }}>{t('checkout.postalCode', 'Postal Code')}</label>
                                        <input
                                            type="text"
                                            placeholder="Optional"
                                            value={shippingAddress.postalCode}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                            style={inputStyle}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#475569' }}>{t('checkout.address', 'Street Address')}</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Cité 5 Juillet, Bt A, N 12"
                                        value={shippingAddress.address}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                        style={inputStyle}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. Payment Method */}
                        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', border: '1px solid #e2e8f0' }}>
                            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', backgroundColor: '#eff6ff', color: 'var(--ford-blue)', borderRadius: '50%', fontSize: '0.9rem' }}>3</span>
                                {t('checkout.payment', 'Payment Method')}
                            </h2>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: `2px solid ${paymentMethod === 'COD' ? 'var(--ford-blue)' : '#e2e8f0'}`,
                                backgroundColor: paymentMethod === 'COD' ? '#eff6ff' : 'transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}>
                                <input
                                    type="radio"
                                    value="COD"
                                    checked={paymentMethod === 'COD'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    style={{ width: '1.2rem', height: '1.2rem' }}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: '600', color: '#0f172a' }}>{t('checkout.cod', 'Cash on Delivery')}</span>
                                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Pay when you receive your order</span>
                                </div>
                            </label>
                        </div>
                    </form>

                    <div style={{ height: 'fit-content' }}>
                        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '2rem' }}>
                            <h2 style={{ marginBottom: '1rem' }}>{t('checkout.summary')}</h2>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>{t('cart.item', 'Items')}</span>
                                <span>{itemsPrice.toLocaleString()} DA</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>{t('checkout.shipping', 'Shipping')}</span>
                                <span>{shippingPrice > 0 ? `${shippingPrice.toLocaleString()} DA` : '-'}</span>
                            </div>
                            <div style={{ borderTop: '1px solid #eee', margin: '1rem 0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                <span>{t('cart.total')}</span>
                                <span style={{ color: 'var(--ford-blue)' }}>{finalTotal.toLocaleString()} DA</span>
                            </div>
                            <button type="submit" onClick={submitHandler} className="btn btn-primary" style={{ width: '100%' }}>{t('checkout.placeOrder')}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CheckoutPage;
