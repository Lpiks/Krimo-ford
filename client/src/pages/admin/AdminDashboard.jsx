import React from 'react';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
    const { t } = useTranslation();
    return (
        <div>
            <h1 className="logo-text" style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--ford-blue)' }}>{t('admin.dashboard')}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ marginBottom: '1rem' }}>{t('admin.inventory', 'Inventory')}</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>120</p>
                    <p style={{ color: '#666' }}>Active Products</p>
                    <Link to="/admin/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>{t('admin.products')}</Link>
                </div>

                <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ marginBottom: '1rem' }}>{t('admin.orders', 'Orders')}</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>5</p>
                    <p style={{ color: '#666' }}>Pending Orders</p>
                    <Link to="/admin/orders" className="btn btn-primary" style={{ marginTop: '1rem' }}>{t('admin.orders')}</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
