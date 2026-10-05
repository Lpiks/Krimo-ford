import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { wilayas } from '../../data/wilayas';

const ShippingGuidePage = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredWilayas = wilayas.filter(w =>
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.nameAr.includes(searchTerm) ||
        w.code.includes(searchTerm)
    );

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '90vh', padding: 'clamp(1.5rem, 4vw, 3.5rem) 1rem' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 4vw, 3rem)' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 1.25rem',
                        backgroundColor: 'rgba(0, 52, 120, 0.08)',
                        color: 'var(--ford-blue)',
                        borderRadius: '9999px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        marginBottom: '1rem'
                    }}>
                        <span>🚚</span>
                        <span>Réseau Logistique National — 58 Wilayas</span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(1.75rem, 5vw, 2.8rem)',
                        color: 'var(--ford-blue)',
                        fontFamily: 'var(--font-logo)',
                        marginBottom: '0.75rem'
                    }}>
                        Tarifs & Délais de Livraison
                    </h1>

                    <p style={{ color: '#64748b', fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                        Expédition quotidienne depuis notre magasin central du Boulevard de la Soummam (Alger) vers les 58 wilayas d'Algérie avec paiement à la livraison (Cash à la réception).
                    </p>
                </div>

                {/* Key Benefits Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                    gap: '1.25rem',
                    marginBottom: '3rem'
                }}>
                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏱️</div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>Livraison 24h Express</h3>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Alger, Blida, Boumerdès et Tipaza livrés le jour même ou sous 24h.</p>
                    </div>

                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>Stop-Desk Économique</h3>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Récupérez votre colis dans le bureau Yalidine / Procolis le plus proche à tarif réduit.</p>
                    </div>

                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💵</div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>Paiement à Réception</h3>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Réglez en espèces au livreur après ouverture et vérification du colis.</p>
                    </div>

                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛡️</div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>Garantie Compatibilité</h3>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Échange immédiat sans frais si la pièce ne monte pas sur votre Ford.</p>
                    </div>
                </div>

                {/* Wilaya Filter & Table */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        padding: 'clamp(1rem, 3.5vw, 1.5rem) clamp(1rem, 4vw, 2rem)',
                        borderBottom: '1px solid #f1f5f9',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.15rem, 3.5vw, 1.35rem)', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                                Grille Tarifaire des 58 Wilayas
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                                Tarifs officiels en Dinars Algériens (DA)
                            </p>
                        </div>

                        {/* Search input */}
                        <div style={{ position: 'relative', minWidth: 0, width: '100%', maxWidth: '320px' }}>
                            <input
                                type="text"
                                placeholder="Rechercher une wilaya (ex: Oran, 31, سطيف)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.65rem 1rem',
                                    borderRadius: '10px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: 'clamp(0.65rem, 2vw, 1rem) clamp(0.75rem, 2vw, 1.5rem)', fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Code</th>
                                    <th style={{ padding: 'clamp(0.65rem, 2vw, 1rem) clamp(0.75rem, 2vw, 1.5rem)', fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Wilaya</th>
                                    <th style={{ padding: 'clamp(0.65rem, 2vw, 1rem) clamp(0.75rem, 2vw, 1.5rem)', fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>À Domicile</th>
                                    <th style={{ padding: 'clamp(0.65rem, 2vw, 1rem) clamp(0.75rem, 2vw, 1.5rem)', fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Bureau (Stop-Desk)</th>
                                    <th style={{ padding: 'clamp(0.65rem, 2vw, 1rem) clamp(0.75rem, 2vw, 1.5rem)', fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Délai Estimé</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredWilayas.map((w) => (
                                    <tr
                                        key={w.id}
                                        style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <td style={{ padding: 'clamp(0.65rem, 2vw, 1rem) clamp(0.75rem, 2vw, 1.5rem)', fontWeight: '700', color: 'var(--ford-blue)' }}>
                                            {w.code}
                                        </td>
                                        <td style={{ padding: 'clamp(0.65rem, 2vw, 1rem) clamp(0.75rem, 2vw, 1.5rem)', fontWeight: '600', color: '#1e293b' }}>
                                            {w.name} <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>({w.nameAr})</span>
                                        </td>
                                        <td style={{ padding: 'clamp(0.65rem, 2vw, 1rem) clamp(0.75rem, 2vw, 1.5rem)', fontWeight: '700', color: '#0f172a' }}>
                                            {w.price} DA
                                        </td>
                                        <td style={{ padding: 'clamp(0.65rem, 2vw, 1rem) clamp(0.75rem, 2vw, 1.5rem)', fontWeight: '600', color: '#16a34a' }}>
                                            {w.deskPrice} DA
                                        </td>
                                        <td style={{ padding: 'clamp(0.65rem, 2vw, 1rem) clamp(0.75rem, 2vw, 1.5rem)', fontSize: '0.85rem', color: '#475569' }}>
                                            <span style={{
                                                backgroundColor: w.delay.includes('24h') ? '#dcfce7' : '#f1f5f9',
                                                color: w.delay.includes('24h') ? '#166534' : '#334155',
                                                padding: '0.25rem 0.6rem',
                                                borderRadius: '6px',
                                                fontWeight: '600'
                                            }}>
                                                {w.delay}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingGuidePage;
