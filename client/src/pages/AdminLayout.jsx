import React, { useState, useEffect } from 'react';
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

    // Mobile sidebar toggle
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Auto-close sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

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
        justifyContent: 'space-between',
        padding: '0.65rem 0.85rem',
        borderRadius: '8px',
        color: isActive(path) ? '#ffffff' : '#94a3b8',
        backgroundColor: isActive(path) ? 'var(--ford-blue)' : 'transparent',
        textDecoration: 'none',
        fontWeight: isActive(path) ? '700' : '500',
        fontSize: '0.88rem',
        marginBottom: '0.25rem',
        transition: 'all 0.15s ease',
        border: isActive(path) ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent'
    });

    const handleLogout = () => {
        toast((toastObj) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Déconnexion Admin ?</span>
                <button
                    onClick={() => {
                        logout();
                        navigate('/admin/login');
                        toast.dismiss(toastObj.id);
                    }}
                    style={{
                        padding: '4px 10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '700'
                    }}
                >
                    Oui
                </button>
                <button
                    onClick={() => toast.dismiss(toastObj.id)}
                    style={{
                        padding: '4px 10px',
                        backgroundColor: '#eee',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Non
                </button>
            </div>
        ), {
            duration: 4000,
            position: 'top-center',
        });
    };

    // Calculate unread indicators
    const [unreadMessages, setUnreadMessages] = useState(2);
    const [pendingVinCount, setPendingVinCount] = useState(2);

    useEffect(() => {
        try {
            const vinStored = localStorage.getItem('krimo_vin_requests');
            if (vinStored) {
                const arr = JSON.parse(vinStored);
                setPendingVinCount(arr.filter(r => r.status === 'En attente').length);
            }
        } catch (e) {
            console.error(e);
        }
    }, [location.pathname]);

    return (
        <div className="admin-layout-wrapper" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
            {/* Mobile Top Navbar (Visible only on mobile/tablet) */}
            <div className="admin-mobile-top-bar" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '60px',
                backgroundColor: '#071d49',
                color: 'white',
                zIndex: 900,
                display: 'none', // Handled via CSS media query below
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
                <button
                    type="button"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    aria-label="Toggle admin menu"
                >
                    ☰
                </button>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span className="logo-text" style={{ fontSize: '1.6rem', color: '#60a5fa' }}>Krimoford</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#93c5fd', textTransform: 'uppercase' }}>ADMIN</span>
                </div>

                <Link
                    to="/"
                    style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textDecoration: 'none'
                    }}
                >
                    Boutique ↗
                </Link>
            </div>

            {/* Mobile Sidebar Backdrop Overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(3px)',
                        zIndex: 950
                    }}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}
                style={{
                    width: '270px',
                    backgroundColor: '#0b1329',
                    color: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    height: '100vh',
                    left: 0,
                    top: 0,
                    overflowY: 'auto',
                    boxShadow: '4px 0 15px rgba(0,0,0,0.15)',
                    zIndex: 999,
                    transition: 'transform 0.3s ease'
                }}
            >
                {/* Brand Logo & Store Link */}
                <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 className="logo-text" style={{ color: 'white', fontSize: '1.75rem', margin: 0, lineHeight: 1 }}>
                                Krimoford
                            </h2>
                            <span style={{
                                backgroundColor: 'rgba(0, 52, 120, 0.4)',
                                color: '#93c5fd',
                                fontSize: '0.65rem',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                textTransform: 'uppercase',
                                fontWeight: '800',
                                letterSpacing: '0.08em',
                                display: 'inline-block',
                                marginTop: '4px'
                            }}>
                                Comptoir Soummam • Admin
                            </span>
                        </div>

                        {sidebarOpen && (
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(false)}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.25rem', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            marginTop: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '0.45rem',
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            color: '#cbd5e1',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            border: '1px solid rgba(255,255,255,0.1)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
                    >
                        <span>🌐</span>
                        <span>Voir la Boutique en direct ↗</span>
                    </a>
                </div>

                {/* Navigation Links Grouped */}
                <nav style={{ padding: '1rem 0.85rem', flex: 1 }}>
                    {/* Section 1: Pilotage */}
                    <p style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0.5rem 0 0.5rem 0.5rem' }}>
                        Tableau de Bord
                    </p>
                    <Link to="/admin" style={linkStyle('/admin')}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>📊</span>
                            <span>Vue d'ensemble</span>
                        </span>
                    </Link>
                    <Link to="/admin/analytics" style={linkStyle('/admin/analytics')}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>📈</span>
                            <span>Chiffre d'Affaires & Ventes</span>
                        </span>
                    </Link>

                    {/* Section 2: Ventes & Demandes Clients */}
                    <p style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '1.25rem 0 0.5rem 0.5rem' }}>
                        Demandes Clients & Ventes
                    </p>
                    <Link to="/admin/vin-requests" style={linkStyle('/admin/vin-requests')}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>📸</span>
                            <span>Devis Carte Grise & VIN</span>
                        </span>
                        {pendingVinCount > 0 && (
                            <span style={{ backgroundColor: '#ea580c', color: 'white', fontSize: '0.7rem', fontWeight: '800', padding: '1px 6px', borderRadius: '999px' }}>
                                {pendingVinCount}
                            </span>
                        )}
                    </Link>
                    <Link to="/admin/orders" style={linkStyle('/admin/orders')}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>📦</span>
                            <span>Commandes (58 Wilayas)</span>
                        </span>
                    </Link>
                    <Link to="/admin/diagnostics" style={linkStyle('/admin/diagnostics')}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>⚡</span>
                            <span>Diagnostics & Pannes</span>
                        </span>
                    </Link>
                    <Link to="/admin/inbox" style={linkStyle('/admin/inbox')}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>📬</span>
                            <span>Messages & Demandes</span>
                        </span>
                        {unreadMessages > 0 && (
                            <span style={{ backgroundColor: '#dc2626', color: 'white', fontSize: '0.7rem', fontWeight: '800', padding: '1px 6px', borderRadius: '999px' }}>
                                {unreadMessages}
                            </span>
                        )}
                    </Link>

                    {/* Section 3: Catalogue & Véhicules */}
                    <p style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '1.25rem 0 0.5rem 0.5rem' }}>
                        Catalogue & Véhicules Ford
                    </p>
                    <Link to="/admin/kits" style={linkStyle('/admin/kits')}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>🛠️</span>
                            <span>Packs Entretien & Vidange</span>
                        </span>
                        <span style={{ backgroundColor: '#16a34a', color: 'white', fontSize: '0.65rem', fontWeight: '800', padding: '1px 5px', borderRadius: '4px' }}>
                            -15%
                        </span>
                    </Link>
                    <Link to="/admin/products" style={linkStyle('/admin/products')}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>🏷️</span>
                            <span>Stock Pièces Détachées</span>
                        </span>
                    </Link>
                    <Link to="/admin/categories" style={linkStyle('/admin/categories')}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>📂</span>
                            <span>Catégories Pièces</span>
                        </span>
                    </Link>
                    <Link to="/admin/carmodels" style={linkStyle('/admin/carmodels')}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>🚗</span>
                            <span>Modèles Ford Supportés</span>
                        </span>
                    </Link>

                    {/* Section 4: Configuration & Expédition */}
                    <p style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '1.25rem 0 0.5rem 0.5rem' }}>
                        Livraison & Configuration
                    </p>
                    <Link to="/admin/shipping" style={linkStyle('/admin/shipping')}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>🚚</span>
                            <span>Tarifs 58 Wilayas (Yalidine)</span>
                        </span>
                    </Link>
                </nav>

                {/* Footer Admin User & Logout */}
                <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#070d1e' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--ford-blue)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '800',
                                fontSize: '0.9rem'
                            }}>
                                K
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {userInfo?.name || 'Krimo (Admin)'}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {userInfo?.email || 'admin@krimoford.dz'}
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            title="Se déconnecter"
                            style={{
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#ef4444',
                                padding: '0.45rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            🚪
                        </button>
                    </div>

                    <LanguageSwitcher direction="up" variant="dark" />
                </div>
            </aside>

            {/* Main Content Viewport */}
            <main
                className="admin-main-content"
                style={{
                    flex: 1,
                    marginLeft: '270px',
                    padding: '2rem',
                    maxWidth: 'calc(100vw - 270px)',
                    minHeight: '100vh',
                    overflowX: 'hidden'
                }}
            >
                <Outlet />
            </main>

            {/* Injected Admin Media Query Styles */}
            <style>{`
                @media (max-width: 900px) {
                    .admin-mobile-top-bar {
                        display: flex !important;
                    }
                    .admin-sidebar {
                        transform: translateX(-100%);
                    }
                    .admin-sidebar.open {
                        transform: translateX(0);
                    }
                    .admin-main-content {
                        margin-left: 0 !important;
                        max-width: 100vw !important;
                        padding: 4.75rem 0.85rem 2rem 0.85rem !important;
                        overflow-x: hidden !important;
                    }
                }

                /* Mobile Card & Grid Adaptations for Admin */
                @media (max-width: 768px) {
                    .admin-responsive-grid-2 {
                        grid-template-columns: 1fr !important;
                    }
                    .admin-vin-card {
                        grid-template-columns: 1fr !important;
                        gap: 1rem !important;
                    }
                    .admin-vin-card .admin-card-actions {
                        width: 100% !important;
                        min-width: 100% !important;
                    }
                    .admin-diag-card {
                        grid-template-columns: 1fr !important;
                        gap: 1rem !important;
                    }
                    .admin-diag-card .admin-card-actions {
                        width: 100% !important;
                        min-width: 100% !important;
                    }
                    .admin-form-row-2 {
                        grid-template-columns: 1fr !important;
                    }
                    .admin-header-title {
                        font-size: 1.75rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminLayout;
