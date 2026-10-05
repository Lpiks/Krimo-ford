import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getWhatsAppLink } from '../../utils/whatsapp';

const INITIAL_DIAGNOSTICS = [
    {
        id: 'DIAG-104',
        createdAt: '2026-10-04T17:15:00Z',
        customerName: 'Walid Brahimi',
        phone: '0552 14 77 90',
        wilaya: '16 - Alger (Chéraga)',
        vehicle: 'Ford Focus 1.6 TDCi 2013',
        symptomCategory: 'Bruit & Suspension',
        symptomTitle: 'Claquement métallique sourd sur les dos-d\'âne et chaussée dégradée',
        suspectedCauses: [
            'Silentblocs de triangle de suspension HS',
            'Biellettes de barre stabilisatrice avec jeu excessif',
            'Coupelles d\'amortisseur avant usées'
        ],
        recommendedParts: 'Triangles de suspension D/G + 2 Biellettes de barre stabilisatrice Motorcraft',
        status: 'Nouveau',
        notes: 'Client souhaite passer récupérer les pièces au comptoir de la Soummam.'
    },
    {
        id: 'DIAG-103',
        createdAt: '2026-10-04T11:40:00Z',
        customerName: 'Tarek Hamdi',
        phone: '0663 50 19 22',
        wilaya: '35 - Boumerdès',
        vehicle: 'Ford Transit 2.2 TDCi 2015',
        symptomCategory: 'Moteur & Échappement',
        symptomTitle: 'Fumée noire épaisse lors des accélérations franches + perte de puissance en côte',
        suspectedCauses: [
            'Durite d\'intercooler percée ou fissurée',
            'Vanne EGR encrassée ou bloquée ouverte',
            'Filtre à air colmaté'
        ],
        recommendedParts: 'Durite turbo intercooler renforcée + Vanne EGR électrique',
        status: 'Contacté',
        notes: 'Conseillé de vérifier d\'abord la durite avant d\'acheter la vanne.'
    },
    {
        id: 'DIAG-102',
        createdAt: '2026-10-03T19:05:00Z',
        customerName: 'Yacine Benmansour',
        phone: '0771 82 30 15',
        wilaya: '09 - Blida',
        vehicle: 'Ford Fiesta 1.4 TDCi 2011',
        symptomCategory: 'Freinage',
        symptomTitle: 'Vibration forte dans la pédale de frein et volant au freinage appuyé',
        suspectedCauses: [
            'Disques de frein avant voilés',
            'Plaquettes de frein usées inégalement'
        ],
        recommendedParts: 'Jeu de Disques de Frein Avant Ventilés + Plaquettes Motorcraft',
        status: 'Rendez-vous comptoir',
        notes: 'Passe demain samedi matin pour contrôle et achat.'
    }
];

const AdminDiagnosticsPage = () => {
    const [diagnostics, setDiagnostics] = useState(() => {
        const stored = localStorage.getItem('krimo_admin_diagnostics');
        return stored ? JSON.parse(stored) : INITIAL_DIAGNOSTICS;
    });

    const [filterStatus, setFilterStatus] = useState('Tous');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        localStorage.setItem('krimo_admin_diagnostics', JSON.stringify(diagnostics));
    }, [diagnostics]);

    const handleUpdateStatus = (id, newStatus) => {
        setDiagnostics(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
        toast.success(`Statut : ${newStatus}`);
    };

    const handleDelete = (id) => {
        if (window.confirm('Supprimer cette demande de diagnostic ?')) {
            setDiagnostics(prev => prev.filter(d => d.id !== id));
            toast.success('Demande supprimée');
        }
    };

    const filtered = diagnostics.filter(d => {
        const matchesStatus = filterStatus === 'Tous' || d.status === filterStatus;
        const q = searchTerm.toLowerCase();
        const matchesSearch =
            d.customerName.toLowerCase().includes(q) ||
            d.vehicle.toLowerCase().includes(q) ||
            d.symptomTitle.toLowerCase().includes(q) ||
            d.wilaya.toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
    });

    const buildWhatsAppAdvice = (d) => {
        return `Salam ${d.customerName} ! C'est Krimo Spécialiste Ford (Comptoir Soummam, Alger). Concernant le symptôme sur votre ${d.vehicle} (« ${d.symptomTitle} ») : d'après notre expérience atelier, nous vous conseillons de vérifier : ${d.recommendedParts}. Pièces d'origine disponibles au magasin ou expédition 58 wilayas.`;
    };

    return (
        <div style={{ paddingBottom: '3rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                    <h1 className="logo-text admin-header-title" style={{ fontSize: '2.4rem', color: 'var(--ford-blue)', margin: 0 }}>
                        ⚡ Demandes de Diagnostics & Symptômes
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0.4rem 0 0 0' }}>
                        Leads et requêtes générées par l'outil de diagnostic en ligne <code>/diagnostic</code>.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setDiagnostics(INITIAL_DIAGNOSTICS);
                        toast.success('Exemples réinitialisés');
                    }}
                    style={{
                        padding: '0.55rem 1rem',
                        borderRadius: '8px',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        border: '1px solid #cbd5e1',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                    }}
                >
                    🔄 Réinitialiser Démo
                </button>
            </div>

            {/* Quick KPI stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Diagnostics</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0.2rem 0' }}>{diagnostics.length}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Demandes d'assistance</div>
                </div>

                <div style={{ backgroundColor: '#fff7ed', padding: '1.25rem', borderRadius: '12px', border: '1.5px solid #ffedd5', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#ea580c', fontWeight: '700', textTransform: 'uppercase' }}>Nouveaux Leads</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ea580c', margin: '0.2rem 0' }}>
                        {diagnostics.filter(d => d.status === 'Nouveau').length}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#c2410c' }}>À recontacter par téléphone</div>
                </div>

                <div style={{ backgroundColor: '#f0fdf4', padding: '1.25rem', borderRadius: '12px', border: '1.5px solid #bbf7d0', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '700', textTransform: 'uppercase' }}>Passage Comptoir Soummam</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#16a34a', margin: '0.2rem 0' }}>
                        {diagnostics.filter(d => d.status === 'Rendez-vous comptoir').length}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#15803d' }}>Clients attendus au magasin</div>
                </div>
            </div>

            {/* Filter and Search */}
            <div style={{
                backgroundColor: 'white',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['Tous', 'Nouveau', 'Contacté', 'Rendez-vous comptoir'].map(st => (
                        <button
                            key={st}
                            type="button"
                            onClick={() => setFilterStatus(st)}
                            style={{
                                padding: '0.45rem 0.9rem',
                                borderRadius: '8px',
                                border: filterStatus === st ? '1.5px solid var(--ford-blue)' : '1px solid #cbd5e1',
                                backgroundColor: filterStatus === st ? 'rgba(0, 52, 120, 0.08)' : 'white',
                                color: filterStatus === st ? 'var(--ford-blue)' : '#475569',
                                fontWeight: filterStatus === st ? '700' : '500',
                                fontSize: '0.85rem',
                                cursor: 'pointer'
                            }}
                        >
                            {st}
                        </button>
                    ))}
                </div>

                <div style={{ flex: 1, maxWidth: '360px', minWidth: '220px' }}>
                    <input
                        type="text"
                        placeholder="Recherche client, panne, modèle..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.55rem 0.9rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                    />
                </div>
            </div>

            {/* Diagnostics Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {filtered.map(item => (
                    <div
                        key={item.id}
                        className="admin-diag-card"
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '14px',
                            border: item.status === 'Nouveau' ? '1.5px solid #fdba74' : '1px solid #e2e8f0',
                            padding: '1.5rem',
                            display: 'grid',
                            gridTemplateColumns: '1fr auto',
                            gap: '1.5rem',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                                    {item.customerName}
                                </span>
                                <span style={{ padding: '2px 8px', borderRadius: '999px', backgroundColor: '#eff6ff', color: 'var(--ford-blue)', fontSize: '0.8rem', fontWeight: '700' }}>
                                    🚗 {item.vehicle}
                                </span>
                                <span style={{ padding: '2px 8px', borderRadius: '999px', backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.8rem' }}>
                                    📍 {item.wilaya}
                                </span>
                                <span style={{
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: '800',
                                    backgroundColor: item.status === 'Nouveau' ? '#ffedd5' : item.status === 'Contacté' ? '#eff6ff' : '#dcfce7',
                                    color: item.status === 'Nouveau' ? '#c2410c' : item.status === 'Contacté' ? 'var(--ford-blue)' : '#15803d'
                                }}>
                                    ● {item.status}
                                </span>
                            </div>

                            {/* Symptom Card Box */}
                            <div style={{ backgroundColor: '#fff7ed', borderLeft: '4px solid #ea580c', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '0.75rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#c2410c', textTransform: 'uppercase' }}>
                                    {item.symptomCategory} — Symptôme signalé :
                                </div>
                                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>
                                    « {item.symptomTitle} »
                                </div>
                            </div>

                            {/* Recommended parts */}
                            <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '0.5rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                                    Causes suspectées & Pièces recommandées à vendre :
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#15803d', fontWeight: '700', marginTop: '2px' }}>
                                    🔧 {item.recommendedParts}
                                </div>
                            </div>

                            {item.notes && (
                                <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                                    Note : {item.notes}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="admin-card-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '180px' }}>
                            <a
                                href={getWhatsAppLink(buildWhatsAppAdvice(item))}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => handleUpdateStatus(item.id, 'Contacté')}
                                style={{
                                    padding: '0.6rem 0.9rem',
                                    backgroundColor: '#25D366',
                                    color: 'white',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                    fontWeight: '700',
                                    fontSize: '0.85rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                }}
                            >
                                <span>💬</span>
                                <span>Conseil WhatsApp</span>
                            </a>

                            <a
                                href={`tel:${item.phone.replace(/\s+/g, '')}`}
                                onClick={() => handleUpdateStatus(item.id, 'Contacté')}
                                style={{
                                    padding: '0.55rem 0.9rem',
                                    backgroundColor: '#eff6ff',
                                    color: 'var(--ford-blue)',
                                    border: '1px solid #bfdbfe',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                    fontWeight: '700',
                                    fontSize: '0.825rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                }}
                            >
                                <span>📞</span>
                                <span>Appeler : {item.phone}</span>
                            </a>

                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                                <button
                                    type="button"
                                    onClick={() => handleUpdateStatus(item.id, 'Rendez-vous comptoir')}
                                    style={{
                                        flex: 1,
                                        padding: '0.4rem',
                                        backgroundColor: '#f0fdf4',
                                        color: '#16a34a',
                                        border: '1px solid #bbf7d0',
                                        borderRadius: '6px',
                                        fontWeight: '700',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    🏢 RDV Soummam
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(item.id)}
                                    style={{
                                        padding: '0.4rem 0.65rem',
                                        backgroundColor: '#fef2f2',
                                        color: '#ef4444',
                                        border: '1px solid #fecaca',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDiagnosticsPage;
