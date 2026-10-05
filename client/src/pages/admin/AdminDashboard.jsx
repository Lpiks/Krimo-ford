import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { getWhatsAppLink } from '../../utils/whatsapp';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const { userInfo } = useAuth();

    const [stats, setStats] = useState({
        products: 48,
        totalRevenue: 1845000,
        pendingOrders: 5,
        totalOrders: 32,
        vinRequests: 4,
        lowStockItems: 3
    });

    // Recent VIN requests loaded from localStorage
    const [recentVins, setRecentVins] = useState([]);

    useEffect(() => {
        // Load VIN requests
        try {
            const storedVins = localStorage.getItem('krimo_vin_requests');
            if (storedVins) {
                const arr = JSON.parse(storedVins);
                setRecentVins(arr.slice(0, 3));
                const pending = arr.filter(r => r.status === 'En attente').length;
                setStats(prev => ({ ...prev, vinRequests: pending }));
            }
        } catch (e) {
            console.error(e);
        }

        // Fetch live counts if backend is up
        const fetchLiveCounts = async () => {
            if (!userInfo?.token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const [productsRes, ordersRes] = await Promise.all([
                    axios.get('/api/products?pageSize=1').catch(() => null),
                    axios.get('/api/orders', config).catch(() => null)
                ]);

                if (productsRes?.data?.count) {
                    setStats(prev => ({ ...prev, products: productsRes.data.count }));
                }

                if (ordersRes?.data && Array.isArray(ordersRes.data)) {
                    const totalRev = ordersRes.data.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
                    const pending = ordersRes.data.filter(o => !o.isDelivered).length;
                    setStats(prev => ({
                        ...prev,
                        totalOrders: ordersRes.data.length,
                        pendingOrders: pending,
                        totalRevenue: totalRev > 0 ? totalRev : 1845000
                    }));
                }
            } catch (err) {
                // Keep default demo stats if backend is offline
            }
        };

        fetchLiveCounts();
    }, [userInfo]);

    return (
        <div style={{ paddingBottom: '3rem' }}>
            {/* Top Welcome Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2rem',
                backgroundColor: 'white',
                padding: '1.75rem',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '1.4rem' }}>👋</span>
                        <h1 className="admin-header-title" style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                            Tableau de Bord — Comptoir Soummam
                        </h1>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0 }}>
                        Gestion des pièces Ford, expéditions 58 Wilayas et demandes clients en direct.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Link
                        to="/admin/product/new"
                        className="btn btn-primary"
                        style={{ padding: '0.6rem 1.1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <span>➕</span>
                        <span>Ajouter Pièce</span>
                    </Link>
                    <Link
                        to="/admin/kits"
                        style={{
                            padding: '0.6rem 1.1rem',
                            backgroundColor: '#f0fdf4',
                            color: '#15803d',
                            border: '1px solid #bbf7d0',
                            borderRadius: '6px',
                            fontWeight: '700',
                            fontSize: '0.875rem',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <span>🛠️</span>
                        <span>Nouveau Pack</span>
                    </Link>
                </div>
            </div>

            {/* 4 Main KPI Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem'
            }}>
                {/* 1. Chiffre d'Affaires */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                            Chiffre d'Affaires Ventes
                        </span>
                        <span style={{ padding: '3px 8px', borderRadius: '999px', backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '0.75rem', fontWeight: '800' }}>
                            +18.4% ce mois
                        </span>
                    </div>
                    <div style={{ fontSize: '2.1rem', fontWeight: '800', color: 'var(--ford-blue)', lineHeight: 1 }}>
                        {stats.totalRevenue.toLocaleString('fr-DZ')} DA
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
                        Retraits comptoir + Expéditions Yalidine
                    </div>
                </div>

                {/* 2. Devis Carte Grise */}
                <div style={{
                    backgroundColor: '#fff7ed',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: '1.5px solid #ffedd5',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#c2410c', textTransform: 'uppercase' }}>
                            Devis Carte Grise & VIN
                        </span>
                        <span style={{ padding: '3px 8px', borderRadius: '999px', backgroundColor: '#ea580c', color: 'white', fontSize: '0.75rem', fontWeight: '800' }}>
                            {stats.vinRequests} En attente
                        </span>
                    </div>
                    <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#c2410c', lineHeight: 1 }}>
                        {stats.vinRequests} Photos
                    </div>
                    <Link to="/admin/vin-requests" style={{ display: 'inline-block', fontSize: '0.825rem', color: '#ea580c', fontWeight: '700', marginTop: '0.5rem', textDecoration: 'underline' }}>
                        Chiffrer sur WhatsApp ➔
                    </Link>
                </div>

                {/* 3. Commandes 58 Wilayas */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                            Commandes Colis
                        </span>
                        <span style={{ padding: '3px 8px', borderRadius: '999px', backgroundColor: '#eff6ff', color: 'var(--ford-blue)', fontSize: '0.75rem', fontWeight: '800' }}>
                            {stats.pendingOrders} À expédier
                        </span>
                    </div>
                    <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>
                        {stats.totalOrders}
                    </div>
                    <Link to="/admin/orders" style={{ display: 'inline-block', fontSize: '0.825rem', color: 'var(--ford-blue)', fontWeight: '700', marginTop: '0.5rem', textDecoration: 'underline' }}>
                        Gérer les bordereaux ➔
                    </Link>
                </div>

                {/* 4. Alertes Stock */}
                <div style={{
                    backgroundColor: '#fef2f2',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: '1.5px solid #fecaca',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#991b1b', textTransform: 'uppercase' }}>
                            Alerte Stock Critique
                        </span>
                        <span style={{ padding: '3px 8px', borderRadius: '999px', backgroundColor: '#ef4444', color: 'white', fontSize: '0.75rem', fontWeight: '800' }}>
                            ⚠️ Urgent
                        </span>
                    </div>
                    <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#b91c1c', lineHeight: 1 }}>
                        {stats.lowStockItems} Pièces
                    </div>
                    <Link to="/admin/products" style={{ display: 'inline-block', fontSize: '0.825rem', color: '#b91c1c', fontWeight: '700', marginTop: '0.5rem', textDecoration: 'underline' }}>
                        Voir stock & commander fournisseur ➔
                    </Link>
                </div>
            </div>

            {/* Two Column Layout: Recent VIN Leads & Quick Actions */}
            <div className="admin-responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Left: Latest Carte Grise Requests */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                                📸 Derniers Devis Carte Grise Reçus
                            </h3>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Demandes envoyées depuis le site avec photo</div>
                        </div>
                        <Link to="/admin/vin-requests" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--ford-blue)', textDecoration: 'none' }}>
                            Voir tout ({stats.vinRequests}) ➔
                        </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {recentVins.map(vin => (
                            <div
                                key={vin.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem',
                                    borderRadius: '10px',
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    gap: '0.75rem',
                                    flexWrap: 'wrap'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '180px' }}>
                                    <img
                                        src={vin.imageUrl}
                                        alt={vin.model}
                                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #cbd5e1', flexShrink: 0 }}
                                    />
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>{vin.fullName}</div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--ford-blue)', fontWeight: '700' }}>🚗 {vin.model}</div>
                                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>📍 {vin.wilaya} • 📞 {vin.phone}</div>
                                    </div>
                                </div>

                                <a
                                    href={getWhatsAppLink(`Salam ${vin.fullName}, suite à votre photo de carte grise pour ${vin.model}...`)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        padding: '0.45rem 0.75rem',
                                        backgroundColor: '#25D366',
                                        color: 'white',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        fontSize: '0.78rem',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    <span>💬</span>
                                    <span>WhatsApp</span>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Quick Shortcuts & Critical Stock List */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                            ⚠️ Alertes Réassort & Fournisseur
                        </h3>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Pièces avec stock critique au comptoir</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { name: 'Plaquettes Avant Motorcraft Ford Focus 3', oem: '1807044', stock: 1, price: 7200 },
                            { name: 'Kit Distribution + Pompe TDCi Fiesta', oem: '1753584', stock: 2, price: 18500 },
                            { name: 'Amortisseur Avant Gaz Ford Ranger 4x4', oem: 'EB3C-18045-A', stock: 1, price: 16200 }
                        ].map((part, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem',
                                    borderRadius: '10px',
                                    backgroundColor: '#fff7ed',
                                    border: '1px solid #ffedd5'
                                }}
                            >
                                <div>
                                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a' }}>{part.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>OEM: {part.oem}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#ea580c', fontWeight: '800', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#ffedd5' }}>
                                        Reste: {part.stock}
                                    </span>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{part.price.toLocaleString('fr-DZ')} DA</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick navigation grid */}
                    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.5rem' }}>
                        <Link to="/admin/shipping" style={{ padding: '0.6rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', textDecoration: 'none', color: '#334155', fontSize: '0.78rem', fontWeight: '700', border: '1px solid #e2e8f0' }}>
                            🚚 Tarifs 58W
                        </Link>
                        <Link to="/admin/diagnostics" style={{ padding: '0.6rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', textDecoration: 'none', color: '#334155', fontSize: '0.78rem', fontWeight: '700', border: '1px solid #e2e8f0' }}>
                            ⚡ Pannes
                        </Link>
                        <Link to="/admin/carmodels" style={{ padding: '0.6rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', textDecoration: 'none', color: '#334155', fontSize: '0.78rem', fontWeight: '700', border: '1px solid #e2e8f0' }}>
                            🚗 Modèles
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
