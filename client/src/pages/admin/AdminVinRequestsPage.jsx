import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getWhatsAppLink } from '../../utils/whatsapp';

// Realistic sample requests for immediate demo & offline resilience
const INITIAL_VIN_REQUESTS = [
    {
        id: 'VIN-2026-081',
        createdAt: '2026-10-04T18:42:00Z',
        fullName: 'Sofiane Benali',
        phone: '0555 42 19 88',
        wilaya: '16 - Alger (Bachdjerrah)',
        model: 'Ford Focus 1.6 TDCi 115ch',
        year: '2014',
        vin: 'WF0KXXGCEK128941',
        partsNeeded: 'Kit embrayage complet (butée hydraulique incluse) + 2 amortisseurs avant avec coupelles',
        imageUrl: 'https://images.unsplash.com/photo-1632823471565-40df5f7397b9?auto=format&fit=crop&w=800&q=80',
        status: 'En attente',
        quoteAmount: '',
        notes: 'Client pressé, passage comptoir Soummam possible demain matin.'
    },
    {
        id: 'VIN-2026-080',
        createdAt: '2026-10-04T15:10:00Z',
        fullName: 'Karim Bouzid',
        phone: '0661 88 34 12',
        wilaya: '09 - Blida',
        model: 'Ford Ranger 2.2 TDCi 4x4',
        year: '2018',
        vin: 'MNBUMFF50HW784120',
        partsNeeded: 'Kit courroie de distribution + galet tendeur + pompe à eau d\'origine Motorcraft',
        imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
        status: 'Devis envoyé',
        quoteAmount: '38 500 DA',
        notes: 'Devis transmis sur WhatsApp avec disponibilité immédiate en magasin.'
    },
    {
        id: 'VIN-2026-079',
        createdAt: '2026-10-04T11:25:00Z',
        fullName: 'Amine Meziane',
        phone: '0770 19 45 60',
        wilaya: '15 - Tizi Ouzou',
        model: 'Ford Fiesta 1.4 TDCi',
        year: '2012',
        vin: 'WF0JXXGAJJCR54902',
        partsNeeded: 'Triangles de suspension D/G + biellettes de barre stabilisatrice',
        imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
        status: 'Confirmé',
        quoteAmount: '16 200 DA',
        notes: 'Commande validée avec livraison Yalidine Stopdesk Tizi Ouzou.'
    },
    {
        id: 'VIN-2026-078',
        createdAt: '2026-10-03T16:05:00Z',
        fullName: 'Nabil Khelif',
        phone: '0550 92 11 40',
        wilaya: '31 - Oran',
        model: 'Ford Transit 2.2 TDCi V363',
        year: '2016',
        vin: 'WF0XXXTTGXGY33190',
        partsNeeded: 'Vanne EGR électrique Motorcraft + filtre à gasoil avec capteur',
        imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
        status: 'En attente',
        quoteAmount: '',
        notes: 'Besoin pour utilitaire en panne d\'activité.'
    }
];

const AdminVinRequestsPage = () => {
    const [requests, setRequests] = useState(() => {
        const stored = localStorage.getItem('krimo_vin_requests');
        return stored ? JSON.parse(stored) : INITIAL_VIN_REQUESTS;
    });

    const [filterStatus, setFilterStatus] = useState('Tous');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeImageModal, setActiveImageModal] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [editQuoteModal, setEditQuoteModal] = useState(false);
    const [quotePrice, setQuotePrice] = useState('');
    const [quoteNotes, setQuoteNotes] = useState('');

    useEffect(() => {
        localStorage.setItem('krimo_vin_requests', JSON.stringify(requests));
    }, [requests]);

    const handleUpdateStatus = (id, newStatus) => {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
        toast.success(`Statut mis à jour : ${newStatus}`);
    };

    const handleDelete = (id) => {
        if (window.confirm('Supprimer cette demande de devis carte grise ?')) {
            setRequests(prev => prev.filter(req => req.id !== id));
            toast.success('Demande supprimée');
        }
    };

    const handleSaveQuote = () => {
        if (!selectedRequest) return;
        setRequests(prev => prev.map(req => {
            if (req.id === selectedRequest.id) {
                return {
                    ...req,
                    quoteAmount: quotePrice ? `${quotePrice} DA` : req.quoteAmount,
                    notes: quoteNotes || req.notes,
                    status: 'Devis envoyé'
                };
            }
            return req;
        }));
        setEditQuoteModal(false);
        toast.success('Devis enregistré et marqué comme envoyé !');
    };

    const filteredRequests = requests.filter(req => {
        const matchesStatus = filterStatus === 'Tous' || req.status === filterStatus;
        const q = searchTerm.toLowerCase();
        const matchesSearch =
            req.fullName.toLowerCase().includes(q) ||
            req.phone.toLowerCase().includes(q) ||
            req.model.toLowerCase().includes(q) ||
            req.vin.toLowerCase().includes(q) ||
            req.wilaya.toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
    });

    const pendingCount = requests.filter(r => r.status === 'En attente').length;
    const sentCount = requests.filter(r => r.status === 'Devis envoyé').length;
    const confirmedCount = requests.filter(r => r.status === 'Confirmé').length;

    const buildWhatsAppMsg = (req) => {
        return `Salam ${req.fullName} ! C'est Krimo Pièces Auto (Boulevard de la Soummam, Alger). Suite à votre demande de carte grise pour votre ${req.model} (VIN: ${req.vin}), voici notre proposition : ${req.quoteAmount || '[Prix à préciser]'} pour : ${req.partsNeeded}. Pièces d'origine disponibles au comptoir ou livraison 58 Wilayas.`;
    };

    return (
        <div style={{ paddingBottom: '3rem' }}>
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                    <h1 className="logo-text admin-header-title" style={{ fontSize: '2.4rem', color: 'var(--ford-blue)', margin: 0 }}>
                        📸 Devis par Carte Grise & VIN
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0.4rem 0 0 0' }}>
                        Demandes clients reçues avec photos de carte grise depuis la boutique en ligne.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        type="button"
                        onClick={() => {
                            setRequests(INITIAL_VIN_REQUESTS);
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
            </div>

            {/* Quick KPI Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem'
            }}>
                <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Demandes</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0.3rem 0' }}>{requests.length}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Historique comptoir</div>
                </div>

                <div style={{ backgroundColor: '#fff7ed', padding: '1.25rem', borderRadius: '12px', border: '1.5px solid #ffedd5', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#c2410c', fontWeight: '700', textTransform: 'uppercase' }}>À Traiter Urgent</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ea580c', margin: '0.3rem 0' }}>{pendingCount}</div>
                    <div style={{ fontSize: '0.8rem', color: '#9a3412', fontWeight: '600' }}>En attente de chiffrage</div>
                </div>

                <div style={{ backgroundColor: '#eff6ff', padding: '1.25rem', borderRadius: '12px', border: '1.5px solid #dbeafe', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ford-blue)', fontWeight: '700', textTransform: 'uppercase' }}>Devis Transmis</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--ford-blue)', margin: '0.3rem 0' }}>{sentCount}</div>
                    <div style={{ fontSize: '0.8rem', color: '#1e40af' }}>Sur WhatsApp client</div>
                </div>

                <div style={{ backgroundColor: '#f0fdf4', padding: '1.25rem', borderRadius: '12px', border: '1.5px solid #bbf7d0', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: '700', textTransform: 'uppercase' }}>Commandes Validées</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#16a34a', margin: '0.3rem 0' }}>{confirmedCount}</div>
                    <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: '600' }}>Confirmées après devis</div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div style={{
                backgroundColor: 'white',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['Tous', 'En attente', 'Devis envoyé', 'Confirmé'].map(status => (
                        <button
                            key={status}
                            type="button"
                            onClick={() => setFilterStatus(status)}
                            style={{
                                padding: '0.45rem 0.9rem',
                                borderRadius: '8px',
                                border: filterStatus === status ? '1.5px solid var(--ford-blue)' : '1px solid #cbd5e1',
                                backgroundColor: filterStatus === status ? 'rgba(0, 52, 120, 0.08)' : 'white',
                                color: filterStatus === status ? 'var(--ford-blue)' : '#475569',
                                fontWeight: filterStatus === status ? '700' : '500',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s'
                            }}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div style={{ flex: '1', maxWidth: '380px', minWidth: '240px' }}>
                    <input
                        type="text"
                        placeholder="Recherche client, téléphone, VIN, modèle..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.55rem 0.9rem',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.875rem',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            {/* Requests Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {filteredRequests.length > 0 ? (
                    filteredRequests.map(req => (
                        <div
                            key={req.id}
                            className="admin-vin-card"
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '14px',
                                border: req.status === 'En attente' ? '1.5px solid #fdba74' : '1px solid #e2e8f0',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                padding: '1.5rem',
                                display: 'grid',
                                gridTemplateColumns: 'minmax(120px, 160px) 1fr auto',
                                gap: '1.5rem',
                                alignItems: 'start'
                            }}
                        >
                            {/* Carte Grise Thumbnail */}
                            <div style={{ position: 'relative' }}>
                                <div
                                    onClick={() => setActiveImageModal(req.imageUrl)}
                                    style={{
                                        width: '100%',
                                        height: '120px',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        border: '1px solid #cbd5e1',
                                        cursor: 'zoom-in',
                                        position: 'relative'
                                    }}
                                >
                                    <img
                                        src={req.imageUrl}
                                        alt={`Carte Grise ${req.model}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '4px',
                                        right: '4px',
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                        color: 'white',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        fontSize: '0.68rem',
                                        fontWeight: '700'
                                    }}>
                                        🔍 Agrandir
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center', marginTop: '4px', fontFamily: 'monospace' }}>
                                    {req.id}
                                </div>
                            </div>

                            {/* Client & Vehicle Details */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                                        {req.fullName}
                                    </span>
                                    <span style={{
                                        fontSize: '0.8rem',
                                        padding: '2px 8px',
                                        borderRadius: '999px',
                                        backgroundColor: '#eff6ff',
                                        color: 'var(--ford-blue)',
                                        fontWeight: '700'
                                    }}>
                                        📍 {req.wilaya}
                                    </span>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                        fontWeight: '800',
                                        backgroundColor:
                                            req.status === 'Confirmé' ? '#dcfce7' :
                                            req.status === 'Devis envoyé' ? '#eff6ff' : '#ffedd5',
                                        color:
                                            req.status === 'Confirmé' ? '#15803d' :
                                            req.status === 'Devis envoyé' ? 'var(--ford-blue)' : '#c2410c'
                                    }}>
                                        ● {req.status}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.875rem', color: '#334155', marginBottom: '0.75rem' }}>
                                    <div>
                                        <span style={{ color: '#64748b', fontWeight: '600' }}>Véhicule :</span>{' '}
                                        <strong style={{ color: 'var(--ford-blue)' }}>{req.model} ({req.year})</strong>
                                    </div>
                                    <div>
                                        <span style={{ color: '#64748b', fontWeight: '600' }}>N° Châssis (VIN) :</span>{' '}
                                        <code style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>{req.vin}</code>
                                    </div>
                                    <div>
                                        <span style={{ color: '#64748b', fontWeight: '600' }}>Téléphone :</span>{' '}
                                        <strong>{req.phone}</strong>
                                    </div>
                                </div>

                                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', borderLeft: '4px solid var(--ford-blue)', marginBottom: '0.65rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Pièces demandées :</div>
                                    <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: '600', marginTop: '2px' }}>
                                        {req.partsNeeded}
                                    </div>
                                </div>

                                {req.quoteAmount && (
                                    <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: '700' }}>
                                        💰 Montant chiffré : <span style={{ fontSize: '1.05rem', color: '#15803d' }}>{req.quoteAmount}</span>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons Column */}
                            <div className="admin-card-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '180px' }}>
                                <a
                                    href={getWhatsAppLink(buildWhatsAppMsg(req))}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => handleUpdateStatus(req.id, 'Devis envoyé')}
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
                                        gap: '6px',
                                        boxShadow: '0 2px 4px rgba(37, 211, 102, 0.2)'
                                    }}
                                >
                                    <span>💬</span>
                                    <span>Devis WhatsApp</span>
                                </a>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedRequest(req);
                                        setQuotePrice(req.quoteAmount.replace(' DA', ''));
                                        setQuoteNotes(req.notes || '');
                                        setEditQuoteModal(true);
                                    }}
                                    style={{
                                        padding: '0.55rem 0.9rem',
                                        backgroundColor: '#eff6ff',
                                        color: 'var(--ford-blue)',
                                        border: '1px solid #bfdbfe',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        fontSize: '0.825rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ✏️ Chiffrer Prix & Note
                                </button>

                                <div style={{ display: 'flex', gap: '0.35rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateStatus(req.id, 'Confirmé')}
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
                                        title="Marquer comme commande confirmée"
                                    >
                                        ✓ Valider
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(req.id)}
                                        style={{
                                            padding: '0.4rem 0.65rem',
                                            backgroundColor: '#fef2f2',
                                            color: '#ef4444',
                                            border: '1px solid #fecaca',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            cursor: 'pointer'
                                        }}
                                        title="Supprimer"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '12px', textAlign: 'center', color: '#64748b' }}>
                        <p style={{ fontSize: '1.1rem', margin: 0 }}>Aucune demande de devis carte grise ne correspond aux filtres.</p>
                    </div>
                )}
            </div>

            {/* Modal: Fullscreen Carte Grise Zoom */}
            {activeImageModal && (
                <div
                    onClick={() => setActiveImageModal(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 99999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{
                            padding: '1rem 1.5rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#071d49',
                            color: 'white'
                        }}>
                            <span style={{ fontWeight: '700' }}>Inspection Carte Grise Haute Résolution</span>
                            <button
                                type="button"
                                onClick={() => setActiveImageModal(null)}
                                style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        </div>
                        <img
                            src={activeImageModal}
                            alt="Agrandissement Carte Grise"
                            style={{ maxHeight: '78vh', objectFit: 'contain', backgroundColor: '#000' }}
                        />
                    </div>
                </div>
            )}

            {/* Modal: Edit Quote Price & Notes */}
            {editQuoteModal && selectedRequest && (
                <div
                    onClick={() => setEditQuoteModal(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 99999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: '100%',
                            maxWidth: '500px',
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div style={{ padding: '1.25rem 1.5rem', backgroundColor: 'var(--ford-blue)', color: 'white' }}>
                            <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Chiffrer le devis : {selectedRequest.fullName}</h3>
                            <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '2px' }}>{selectedRequest.model} (VIN: {selectedRequest.vin})</div>
                        </div>

                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                                    Prix total proposé (DA) :
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: 24500"
                                    value={quotePrice}
                                    onChange={(e) => setQuotePrice(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.65rem',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '1rem',
                                        fontWeight: '700'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                                    Note interne ou disponibilité comptoir :
                                </label>
                                <textarea
                                    rows="3"
                                    placeholder="Ex: Pièces en stock au comptoir Soummam. Filtres Motorcraft d'origine disponibles..."
                                    value={quoteNotes}
                                    onChange={(e) => setQuoteNotes(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.65rem',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.875rem'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={handleSaveQuote}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        backgroundColor: 'var(--ford-blue)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Enregistrer & Marquer Envoyé
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditQuoteModal(false)}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        backgroundColor: '#f1f5f9',
                                        color: '#64748b',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVinRequestsPage;
