import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/shared/LanguageSwitcher';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { t } = useTranslation();
    const { userInfo, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!userInfo || userInfo.role !== 'admin') {
            navigate('/admin/login');
        }
    }, [userInfo, navigate]);

    if (!userInfo || userInfo.role !== 'admin') {
        return null;
    }

    const isActive = (path) => {
        if (path === '/admin' && location.pathname === '/admin') return true;
        if (path !== '/admin' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const linkStyle = (path) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        color: isActive(path) ? 'white' : '#9ca3af',
        backgroundColor: isActive(path) ? 'var(--ford-blue)' : 'transparent',
        textDecoration: 'none',
        fontWeight: isActive(path) ? '600' : '500',
        marginBottom: '0.5rem',
        transition: 'all 0.2s',
        border: isActive(path) ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent'
    });

    const handleLogout = () => {
        toast((t) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>Log out?</span>
                <button
                    onClick={() => {
                        logout();
                        navigate('/admin/login');
                        toast.dismiss(t.id);
                    }}
                    style={{
                        padding: '4px 8px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Yes
                </button>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    style={{
                        padding: '4px 8px',
                        backgroundColor: '#eee',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    No
                </button>
            </div>
        ), {
            duration: 4000,
            position: 'top-center',
        });
    };

    const [unreadCount, setUnreadCount] = React.useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (!userInfo) return;
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                // Fetch all messages to count unread - in production, create a dedicated count endpoint
                const { data } = await import('axios').then(m => m.default.get('/api/messages', config));
                const count = data.filter(m => !m.read).length;
                setUnreadCount(count);
            } catch (error) {
                console.error("Failed to fetch unread count", error);
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [userInfo]);

    return (
        <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: '#111827',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                left: 0,
                top: 0,
                overflowY: 'auto',
                boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
                zIndex: 50
            }}>
                <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #1f2937' }}>
                    <h2 className="logo-text" style={{
                        color: 'white',
                        fontSize: '1.5rem',
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        Krimoford
                        <span style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            color: '#9ca3af',
                            fontSize: '0.7rem',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            fontFamily: 'sans-serif',
                            letterSpacing: '0.5px'
                        }}>ADMIN</span>
                    </h2>
                </div>

                <nav style={{ padding: '1.5rem 1rem', flex: 1 }}>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '1rem',
                        paddingLeft: '0.5rem'
                    }}>
                        Menu
                    </p>
                    <Link to="/admin" style={linkStyle('/admin')}
                        onMouseEnter={e => { if (!isActive('/admin')) e.currentTarget.style.color = 'white' }}
                        onMouseLeave={e => { if (!isActive('/admin')) e.currentTarget.style.color = '#9ca3af' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.75rem' }}>
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                        {t('admin.dashboard', 'Dashboard')}
                    </Link>
                    <Link to="/admin/products" style={linkStyle('/admin/products')}
                        onMouseEnter={e => { if (!isActive('/admin/products')) e.currentTarget.style.color = 'white' }}
                        onMouseLeave={e => { if (!isActive('/admin/products')) e.currentTarget.style.color = '#9ca3af' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.75rem' }}>
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        {t('admin.products', 'Products')}
                    </Link>
                    <Link to="/admin/orders" style={linkStyle('/admin/orders')}
                        onMouseEnter={e => { if (!isActive('/admin/orders')) e.currentTarget.style.color = 'white' }}
                        onMouseLeave={e => { if (!isActive('/admin/orders')) e.currentTarget.style.color = '#9ca3af' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.75rem' }}>
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        {t('admin.orders', 'Orders')}
                    </Link>
                    <Link to="/admin/inbox" style={{ ...linkStyle('/admin/inbox'), justifyContent: 'space-between' }}
                        onMouseEnter={e => { if (!isActive('/admin/inbox')) e.currentTarget.style.color = 'white' }}
                        onMouseLeave={e => { if (!isActive('/admin/inbox')) e.currentTarget.style.color = '#9ca3af' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.75rem' }}>
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            {t('admin.inbox', 'Inbox')}
                        </div>
                        {unreadCount > 0 && (
                            <span style={{
                                backgroundColor: '#ef4444',
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                padding: '0.1rem 0.5rem',
                                borderRadius: '999px',
                                minWidth: '20px',
                                textAlign: 'center'
                            }}>
                                {unreadCount}
                            </span>
                        )}
                    </Link>
                </nav>

                <div style={{ padding: '1.5rem', borderTop: '1px solid #1f2937', backgroundColor: '#0f1420' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '0.75rem',
                            fontWeight: 'bold',
                            border: '1px solid #374151'
                        }}>
                            A
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: '600', margin: 0, color: '#e5e7eb' }}>Admin User</p>
                            <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userInfo?.email}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <div style={{ flex: 1 }}>
                            <LanguageSwitcher direction="up" variant="dark" />
                        </div>
                        <button
                            onClick={handleLogout}
                            title="Log Out"
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                color: '#ef4444',
                                padding: '0.5rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                width: '40px'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = '#ef4444';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                e.currentTarget.style.color = '#ef4444';
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main" style={{ flex: 1, marginLeft: '260px', padding: '2rem', maxWidth: 'calc(100vw - 260px)' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
