import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/shared/LanguageSwitcher';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { t } = useTranslation();
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo || userInfo.role !== 'admin') {
            navigate('/admin/login');
        }
    }, [userInfo, navigate]);

    if (!userInfo || userInfo.role !== 'admin') {
        return null; // Or a loading spinner
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{ width: '250px', backgroundColor: 'var(--ford-blue)', color: 'white', padding: '1rem' }}>
                <h2 className="logo-text" style={{ color: 'white', marginBottom: '2rem' }}>Krimoford Admin</h2>
                <nav>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li><Link to="/admin" style={{ color: 'white' }}>{t('admin.dashboard', 'Dashboard')}</Link></li>
                        <li><Link to="/admin/products" style={{ color: 'white' }}>{t('admin.products', 'Products')}</Link></li>
                        <li><Link to="/admin/orders" style={{ color: 'white' }}>{t('admin.orders', 'Orders')}</Link></li>
                    </ul>
                </nav>
                <div style={{ marginTop: '2rem' }}>
                    <LanguageSwitcher />
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', backgroundColor: 'var(--gray-100)' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
