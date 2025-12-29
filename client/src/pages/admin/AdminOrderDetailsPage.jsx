import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const AdminOrderDetailsPage = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useAuth();

    useEffect(() => {
        const fetchOrder = async () => {
            if (!userInfo) {
                setLoading(false);
                return;
            }
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                const { data } = await axios.get(`/api/orders/${id}`, config);
                setOrder(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, userInfo]);

    const deliverHandler = async () => {
        if (!userInfo) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };
            await axios.put(`/api/orders/${id}/deliver`, {}, config);
            setOrder({ ...order, isDelivered: true, status: 'Delivered' }); // Optimistic update
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <Link to="/admin/orders" className="btn btn-light" style={{ marginBottom: '1rem', display: 'inline-block' }}>{t('orderDetails.back')}</Link>

            {loading ? <p>{t('common.loading')}</p> : order ? (
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--ford-blue)' }}>{t('orderDetails.title')} #{order._id.substring(20, 24)}</h1>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                            <h2 style={{ marginBottom: '1rem' }}>{t('checkout.shipping')}</h2>
                            <p><strong>{t('orderDetails.customer')}:</strong> {order.user ? order.user.name : t('admin.guest')}</p>
                            <p><strong>{t('checkout.phone')}:</strong> {order.shippingAddress.phone}</p>
                            <p><strong>{t('checkout.address')}:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>

                            <div style={{ margin: '1rem 0', padding: '1rem', backgroundColor: order.isDelivered ? '#d4edda' : '#fff3cd' }}>
                                {order.isDelivered ? `${t('admin.delivered')} ${order.deliveredAt ? order.deliveredAt.substring(0, 10) : ''}` : t('admin.pending')}
                            </div>

                            <h2 style={{ marginBottom: '1rem', marginTop: '2rem' }}>{t('checkout.payment')}</h2>
                            <p><strong>{t('checkout.payment')}:</strong> {t(`paymentMethods.${order.paymentMethod}`, order.paymentMethod)}</p>
                        </div>

                        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                            <h2 style={{ marginBottom: '1rem' }}>{t('orderDetails.items')}</h2>
                            {order.orderItems.map((item, index) => (
                                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '0.5rem 0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                    </div>
                                    <div>
                                        {item.qty} x {item.price} = {item.qty * item.price} DA
                                    </div>
                                </div>
                            ))}

                            <div style={{ marginTop: '1rem', fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'right' }}>
                                {t('cart.total')}: {order.totalPrice} DA
                            </div>

                            {!order.isDelivered && (
                                <button
                                    onClick={deliverHandler}
                                    className="btn btn-primary"
                                    style={{ width: '100%', marginTop: '2rem' }}
                                >
                                    {t('orderDetails.markDelivered')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ) : <p>Order not found</p>}
        </div>
    );
};

export default AdminOrderDetailsPage;
