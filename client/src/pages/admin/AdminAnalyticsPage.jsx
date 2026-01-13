import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AdminAnalyticsPage = () => {
    const { t } = useTranslation();
    const { userInfo } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        monthlyGrowth: 0,
        revenueData: [],
        topProducts: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

                // In a real app, we would have a dedicated analytics endpoint
                // For now, we'll fetch orders and calculate client-side
                const { data: orders } = await axios.get('/api/orders', config);

                // Calculate Total Revenue
                const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

                // MOCK DATA for Chart (since we might not have enough historical data)
                const mockRevenueData = [
                    { month: 'Jan', value: 120000 },
                    { month: 'Feb', value: 150000 },
                    { month: 'Mar', value: 180000 },
                    { month: 'Apr', value: 140000 },
                    { month: 'May', value: 210000 },
                    { month: 'Jun', value: 250000 },
                ];

                // Mock Top Products
                const mockTopProducts = [
                    { name: 'Brake Pads (Front)', sales: 145, revenue: 435000 },
                    { name: 'Oil Filter Ford Focus', sales: 120, revenue: 180000 },
                    { name: 'Spark Plugs Set', sales: 98, revenue: 294000 },
                    { name: 'Air Filter Fiesta', sales: 85, revenue: 127500 },
                    { name: 'Shock Absorber Rear', sales: 62, revenue: 558000 },
                ];

                setStats({
                    totalRevenue,
                    monthlyGrowth: 12.5, // Mock growth
                    revenueData: mockRevenueData,
                    topProducts: mockTopProducts
                });
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [userInfo]);

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', color: '#111827', marginBottom: '2rem' }}>{t('admin.analytics', 'Analytics')}</h1>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>{t('admin.totalRevenue', 'Total Revenue')}</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>{stats.totalRevenue.toLocaleString()} DA</p>
                    <span style={{ color: '#059669', fontSize: '0.875rem', fontWeight: '500' }}>+{stats.monthlyGrowth}% from last month</span>
                </div>
                {/* Add more stats cards here if needed */}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

                {/* Revenue Chart */}
                <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '2rem', color: '#1f2937' }}>{t('admin.revenueChart', 'Revenue Overview')}</h3>

                    <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem' }}>
                        {stats.revenueData.map((data, index) => (
                            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                                <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(data.value / 300000) * 100}%` }}
                                        transition={{ duration: 0.8, delay: index * 0.1, type: 'spring' }}
                                        style={{
                                            width: '60%',
                                            backgroundColor: 'var(--ford-blue)',
                                            borderRadius: '8px 8px 0 0',
                                            opacity: 0.8,
                                            position: 'relative'
                                        }}
                                        whileHover={{ opacity: 1, scaleY: 1.05 }}
                                    >
                                        <div style={{
                                            position: 'absolute',
                                            top: '-25px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            fontSize: '0.75rem',
                                            color: '#6b7280',
                                            fontWeight: '500'
                                        }}>
                                            {(data.value / 1000).toFixed(0)}k
                                        </div>
                                    </motion.div>
                                </div>
                                <span style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>{data.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '2rem', color: '#1f2937' }}>{t('admin.topProducts', 'Top Products')}</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {stats.topProducts.map((product, index) => (
                            <div key={index}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: '500', color: '#374151' }}>{product.name}</span>
                                    <span style={{ color: '#6b7280' }}>{product.sales} {t('admin.sales', 'Sales')}</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(product.sales / 200) * 100}%` }} // normalized to max sales of ~200
                                        transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                                        style={{
                                            height: '100%',
                                            backgroundColor: index === 0 ? '#10b981' : 'var(--ford-blue)',
                                            borderRadius: '4px'
                                        }}
                                    />
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem', textAlign: 'right' }}>
                                    {product.revenue.toLocaleString()} DA
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminAnalyticsPage;
