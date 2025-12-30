import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const { userInfo } = useAuth();
    const [counts, setCounts] = useState({
        products: 0,
        orders: 0,
        pendingOrders: 0,
        messages: 0,
        unreadMessages: 0
    });

    const cardStyle = {
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        border: '1px solid rgba(0,0,0,0.05)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    };

    useEffect(() => {
        const fetchCounts = async () => {
            if (!userInfo) return;
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

                const productsReq = axios.get('/api/products?pageSize=1'); // Get count from meta
                const ordersReq = axios.get('/api/orders', config);
                const messagesReq = axios.get('/api/messages', config);

                const [productsRes, ordersRes, messagesRes] = await Promise.all([productsReq, ordersReq, messagesReq]);

                setCounts({
                    products: productsRes.data.count,
                    orders: ordersRes.data.length,
                    pendingOrders: ordersRes.data.filter(o => !o.isDelivered).length,
                    messages: messagesRes.data.length,
                    unreadMessages: messagesRes.data.filter(m => !m.read).length
                });

            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };

        fetchCounts();
    }, [userInfo]);

    return (
        <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <div className="container">
                <header style={{ marginBottom: '3rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5rem' }}>
                    <h1 className="logo-text" style={{
                        fontSize: '2.5rem',
                        color: 'var(--ford-blue)',
                        marginBottom: '0.5rem'
                    }}>
                        {t('admin.dashboard', 'Dashboard')}
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Welcome back, Krimo. Here's what's happening today.</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                    {/* Inventory Card */}
                    <div style={cardStyle}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(0, 51, 153, 0.1)',
                                    color: 'var(--ford-blue)'
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                    </svg>
                                </div>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '999px',
                                    backgroundColor: '#d1fae5',
                                    color: '#065f46',
                                    fontSize: '0.875rem',
                                    fontWeight: '600'
                                }}>
                                    Active
                                </span>
                            </div>
                            <h3 style={{ color: '#6b7280', fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem' }}>{t('admin.inventory', 'Total Inventory')}</h3>
                            <p style={{ fontSize: '3rem', fontWeight: '800', color: '#111827', lineHeight: '1' }}>{counts.products}</p>
                            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>Products currently listed</p>
                        </div>
                        <Link to="/admin/products" style={{
                            marginTop: '2rem',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'rgba(0, 51, 153, 0.1)',
                            borderRadius: '8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: 'var(--ford-blue)',
                            fontWeight: '600',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                            alignSelf: 'flex-start'
                        }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0, 51, 153, 0.2)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(0, 51, 153, 0.1)'}
                        >
                            {t('admin.products', 'Manage Products')}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </Link>
                    </div>

                    {/* Orders Card */}
                    <div style={cardStyle}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                    color: '#d97706'
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="9" cy="21" r="1"></circle>
                                        <circle cx="20" cy="21" r="1"></circle>
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                    </svg>
                                </div>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '999px',
                                    backgroundColor: counts.pendingOrders > 0 ? '#ffedd5' : '#e0e7ff',
                                    color: counts.pendingOrders > 0 ? '#9a3412' : '#3730a3',
                                    fontSize: '0.875rem',
                                    fontWeight: '600'
                                }}>
                                    {counts.pendingOrders > 0 ? 'Pending' : 'All Clear'}
                                </span>
                            </div>
                            <h3 style={{ color: '#6b7280', fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem' }}>{t('admin.orders', 'Recent Orders')}</h3>
                            <p style={{ fontSize: '3rem', fontWeight: '800', color: '#111827', lineHeight: '1' }}>{counts.pendingOrders}</p>
                            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>Orders awaiting processing</p>
                        </div>
                        <Link to="/admin/orders" style={{
                            marginTop: '2rem',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            borderRadius: '8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: '#d97706',
                            fontWeight: '600',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                            alignSelf: 'flex-start'
                        }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.2)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)'}
                        >
                            {t('admin.orders', 'View Orders')}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </Link>
                    </div>

                    {/* Messages Card */}
                    <div style={{ ...cardStyle, gridColumn: '1 / -1', flexDirection: 'row', alignItems: 'center' }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                                color: '#7c3aed',
                                height: '64px',
                                width: '64px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </div>
                            <div>
                                <h3 style={{ color: '#6b7280', fontSize: '1rem', fontWeight: '500', marginBottom: '0.25rem' }}>{t('admin.messages', 'Total Messages')}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#111827', lineHeight: '1', margin: 0 }}>{counts.messages}</p>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        backgroundColor: counts.unreadMessages > 0 ? '#fae8ff' : '#f3f4f6',
                                        color: counts.unreadMessages > 0 ? '#86198f' : '#374151',
                                        fontSize: '0.875rem',
                                        fontWeight: '600'
                                    }}>
                                        {counts.unreadMessages > 0 ? `${counts.unreadMessages} New` : 'All Read'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Link to="/admin/inbox" style={{
                            marginTop: '0',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'rgba(124, 58, 237, 0.1)',
                            borderRadius: '8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: '#7c3aed',
                            fontWeight: '600',
                            textDecoration: 'none',
                            transition: 'all 0.2s'
                        }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.2)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.1)'}
                        >
                            {t('admin.viewInbox', 'View Inbox')}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
