import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const OrderManager = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userInfo) {
                setLoading(false);
                return;
            }
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get('/api/orders', config);
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchOrders();

        const interval = setInterval(fetchOrders, 10000); // Refresh every 10 seconds

        return () => clearInterval(interval);
    }, [userInfo]);

    return (
        <div>
            <h1 className="logo-text" style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--ford-blue)' }}>{t('admin.orders')}</h1>

            {loading ? <p>{t('common.loading')}</p> : (
                <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: 'var(--ford-silver)' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>ID</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Customer</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>{t('cart.total')}</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Address</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Method</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>{t('admin.status')}</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>{t('admin.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} style={{ borderTop: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{order._id.substring(20, 24)}</td>
                                    <td style={{ padding: '1rem' }}>{order.createdAt.substring(0, 10)}</td>
                                    <td style={{ padding: '1rem' }}>{order.user ? order.user.name : t('admin.guest')}</td>
                                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{order.totalPrice} DA</td>
                                    <td style={{ padding: '1rem' }}>{order.shippingAddress.city}</td>
                                    <td style={{ padding: '1rem' }}>{t(`paymentMethods.${order.paymentMethod}`, order.paymentMethod)}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            backgroundColor: order.isDelivered ? '#d4edda' : '#fff3cd',
                                            color: order.isDelivered ? '#155724' : '#856404',
                                            fontSize: '0.85rem'
                                        }}>
                                            {order.isDelivered ? t('admin.delivered') : t('admin.pending')}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <Link to={`/admin/orders/${order._id}`} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.9rem' }}>{t('common.details')}</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.length === 0 && (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>{t('catalog.noProducts', 'No orders found.')}</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderManager;
