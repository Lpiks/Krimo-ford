import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const INITIAL_SHIPPING_DATA = [
    { code: '16', name: 'Alger', zone: 'Centre', homePrice: 500, deskPrice: 350, delay: '24h', active: true },
    { code: '09', name: 'Blida', zone: 'Centre', homePrice: 650, deskPrice: 450, delay: '24h', active: true },
    { code: '35', name: 'Boumerdès', zone: 'Centre', homePrice: 650, deskPrice: 450, delay: '24h', active: true },
    { code: '42', name: 'Tipaza', zone: 'Centre', homePrice: 700, deskPrice: 500, delay: '24h', active: true },
    { code: '15', name: 'Tizi Ouzou', zone: 'Centre-Est', homePrice: 800, deskPrice: 550, delay: '24h/48h', active: true },
    { code: '06', name: 'Béjaïa', zone: 'Est', homePrice: 850, deskPrice: 600, delay: '48h', active: true },
    { code: '19', name: 'Sétif', zone: 'Est', homePrice: 850, deskPrice: 600, delay: '24h/48h', active: true },
    { code: '25', name: 'Constantine', zone: 'Est', homePrice: 900, deskPrice: 650, delay: '24h/48h', active: true },
    { code: '23', name: 'Annaba', zone: 'Est', homePrice: 950, deskPrice: 700, delay: '48h', active: true },
    { code: '31', name: 'Oran', zone: 'Ouest', homePrice: 850, deskPrice: 600, delay: '24h/48h', active: true },
    { code: '13', name: 'Tlemcen', zone: 'Ouest', homePrice: 950, deskPrice: 700, delay: '48h', active: true },
    { code: '27', name: 'Mostaganem', zone: 'Ouest', homePrice: 850, deskPrice: 600, delay: '48h', active: true },
    { code: '17', name: 'Djelfa', zone: 'Hauts Plateaux', homePrice: 950, deskPrice: 700, delay: '48h', active: true },
    { code: '07', name: 'Biskra', zone: 'Sud', homePrice: 1100, deskPrice: 800, delay: '48h/72h', active: true },
    { code: '30', name: 'Ouargla', zone: 'Sud', homePrice: 1300, deskPrice: 950, delay: '48h/72h', active: true },
    { code: '47', name: 'Ghardaïa', zone: 'Sud', homePrice: 1200, deskPrice: 900, delay: '48h/72h', active: true },
    { code: '11', name: 'Tamanrasset', zone: 'Grand Sud', homePrice: 1800, deskPrice: 1400, delay: '72h/96h', active: true },
    { code: '39', name: 'El Oued', zone: 'Sud', homePrice: 1250, deskPrice: 900, delay: '48h/72h', active: true }
];

const AdminShippingManager = () => {
    const [wilayas, setWilayas] = useState(() => {
        const stored = localStorage.getItem('krimo_admin_shipping');
        return stored ? JSON.parse(stored) : INITIAL_SHIPPING_DATA;
    });

    const [carrier, setCarrier] = useState('Yalidine Express');
    const [freeShippingThreshold, setFreeShippingThreshold] = useState('35000');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        localStorage.setItem('krimo_admin_shipping', JSON.stringify(wilayas));
    }, [wilayas]);

    const handlePriceChange = (code, field, value) => {
        const val = Number(value) || 0;
        setWilayas(prev => prev.map(w => w.code === code ? { ...w, [field]: val } : w));
    };

    const handleToggleActive = (code) => {
        setWilayas(prev => prev.map(w => w.code === code ? { ...w, active: !w.active } : w));
        toast.success('Statut Wilaya mis à jour');
    };

    const handleSaveAll = () => {
        localStorage.setItem('krimo_admin_shipping', JSON.stringify(wilayas));
        toast.success('Grille des tarifs enregistrée avec succès !');
    };

    const filtered = wilayas.filter(w =>
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.code.includes(searchTerm) ||
        w.zone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ paddingBottom: '3rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                    <h1 className="logo-text admin-header-title" style={{ fontSize: '2.4rem', color: 'var(--ford-blue)', margin: 0 }}>
                        🚚 Tarifs de Livraison & 58 Wilayas
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0.4rem 0 0 0' }}>
                        Gestion des coûts d'expédition Domicile & Stopdesk affichés sur <code>/shipping</code> et au checkout.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        type="button"
                        onClick={handleSaveAll}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <span>💾</span>
                        <span>Enregistrer les Tarifs</span>
                    </button>
                </div>
            </div>

            {/* Global Dispatch Settings */}
            <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                marginBottom: '2rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.5rem'
            }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                        Transporteur Express Partenaire :
                    </label>
                    <select
                        value={carrier}
                        onChange={(e) => setCarrier(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: '600' }}
                    >
                        <option value="Yalidine Express">Yalidine Express (Réseau 58 Wilayas)</option>
                        <option value="ZR Express">ZR Express</option>
                        <option value="Procolis">Procolis</option>
                        <option value="Kazi Tour">Kazi Tour Logistique</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                        Seuil Livraison Gratuite (Dinars DA) :
                    </label>
                    <input
                        type="number"
                        value={freeShippingThreshold}
                        onChange={(e) => setFreeShippingThreshold(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: '700' }}
                    />
                    <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '4px', fontWeight: '600' }}>
                        Offert pour toute commande ≥ {Number(freeShippingThreshold).toLocaleString('fr-DZ')} DA
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                        Retrait Magasin Gratuit :
                    </label>
                    <div style={{
                        padding: '0.65rem',
                        backgroundColor: '#f0fdf4',
                        color: '#15803d',
                        borderRadius: '8px',
                        border: '1px solid #bbf7d0',
                        fontSize: '0.85rem',
                        fontWeight: '700'
                    }}>
                        🏢 Comptoir Soummam, Alger Centre (0 DA)
                    </div>
                </div>
            </div>

            {/* Filter and Search */}
            <div style={{
                backgroundColor: 'white',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <input
                    type="text"
                    placeholder="Filtrer par nom de Wilaya ou n° (ex: 16 Alger, 31 Oran)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', maxWidth: '400px', padding: '0.55rem 0.9rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />

                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
                    {filtered.length} wilayas affichées
                </span>
            </div>

            {/* Wilayas Tariff Table */}
            <div style={{ backgroundColor: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', overflowX: 'auto', WebkitOverflowScrolling: 'touch', boxShadow: 'var(--shadow-sm)' }}>
                <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#071d49', color: 'white', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                        <tr>
                            <th style={{ padding: '0.9rem 1.25rem' }}>N°</th>
                            <th style={{ padding: '0.9rem 1.25rem' }}>Wilaya</th>
                            <th style={{ padding: '0.9rem 1.25rem' }}>Zone</th>
                            <th style={{ padding: '0.9rem 1.25rem' }}>Livraison Domicile (DA)</th>
                            <th style={{ padding: '0.9rem 1.25rem' }}>Stopdesk / Bureau (DA)</th>
                            <th style={{ padding: '0.9rem 1.25rem' }}>Délai</th>
                            <th style={{ padding: '0.9rem 1.25rem' }}>Statut</th>
                        </tr>
                    </thead>
                    <tbody style={{ fontSize: '0.9rem' }}>
                        {filtered.map((w) => (
                            <tr key={w.code} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: w.active ? 'white' : '#f8fafc' }}>
                                <td style={{ padding: '0.85rem 1.25rem', fontWeight: '800', color: 'var(--ford-blue)' }}>
                                    {w.code}
                                </td>
                                <td style={{ padding: '0.85rem 1.25rem', fontWeight: '700', color: '#0f172a' }}>
                                    {w.name}
                                </td>
                                <td style={{ padding: '0.85rem 1.25rem', color: '#64748b' }}>
                                    {w.zone}
                                </td>
                                <td style={{ padding: '0.85rem 1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <input
                                            type="number"
                                            value={w.homePrice}
                                            onChange={(e) => handlePriceChange(w.code, 'homePrice', e.target.value)}
                                            style={{
                                                width: '90px',
                                                padding: '0.4rem 0.6rem',
                                                borderRadius: '6px',
                                                border: '1px solid #cbd5e1',
                                                fontWeight: '700',
                                                fontSize: '0.9rem'
                                            }}
                                        />
                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>DA</span>
                                    </div>
                                </td>
                                <td style={{ padding: '0.85rem 1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <input
                                            type="number"
                                            value={w.deskPrice}
                                            onChange={(e) => handlePriceChange(w.code, 'deskPrice', e.target.value)}
                                            style={{
                                                width: '90px',
                                                padding: '0.4rem 0.6rem',
                                                borderRadius: '6px',
                                                border: '1px solid #cbd5e1',
                                                fontWeight: '700',
                                                fontSize: '0.9rem'
                                            }}
                                        />
                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>DA</span>
                                    </div>
                                </td>
                                <td style={{ padding: '0.85rem 1.25rem', fontWeight: '600', color: '#334155' }}>
                                    ⚡ {w.delay}
                                </td>
                                <td style={{ padding: '0.85rem 1.25rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleActive(w.code)}
                                        style={{
                                            padding: '0.3rem 0.75rem',
                                            borderRadius: '999px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontWeight: '700',
                                            fontSize: '0.75rem',
                                            backgroundColor: w.active ? '#dcfce7' : '#fee2e2',
                                            color: w.active ? '#15803d' : '#991b1b'
                                        }}
                                    >
                                        {w.active ? '● Ouvert' : '✕ Suspendu'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminShippingManager;
