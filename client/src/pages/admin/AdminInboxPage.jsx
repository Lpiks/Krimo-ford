import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { getWhatsAppLink } from '../../utils/whatsapp';

const INITIAL_MESSAGES = [
    {
        _id: 'msg-01',
        name: 'Mohamed Lamine',
        email: 'm.lamine.alger@gmail.com',
        phone: '0555 12 34 56',
        wilaya: '16 - Alger Centre',
        subject: 'Disponibilité crémaillère assistée Ford Focus 3',
        message: 'Salam Krimo, je cherche une crémaillère de direction assistée complète pour ma Ford Focus 3 1.6 TDCi (2015). Avez-vous la référence Motorcraft d\'origine en stock au comptoir de la Soummam ? Je peux passer demain matin si disponible.',
        read: false,
        createdAt: '2026-10-04T16:30:00Z'
    },
    {
        _id: 'msg-02',
        name: 'Kamel Touati',
        email: 'touati.kamel31@yahoo.fr',
        phone: '0661 45 89 20',
        wilaya: '31 - Oran',
        subject: 'Injecteurs Ford Ranger 2.2 TDCi + Livraison',
        message: 'Bonjour, avez-vous 4 injecteurs neufs d\'origine pour Ford Ranger 2.2 TDCi (2017) ? Faites-vous la livraison vers Oran en contre-remboursement avec Yalidine Express ? Quel est le délai de réception svp ?',
        read: false,
        createdAt: '2026-10-04T14:15:00Z'
    },
    {
        _id: 'msg-03',
        name: 'Mourad Benkhelifa',
        email: 'mourad.setif@gmail.com',
        phone: '0770 33 21 09',
        wilaya: '19 - Sétif',
        subject: 'Confirmation de réception colis Yalidine',
        message: 'Salam l\'équipe Krimoford ! J\'ai bien récupéré mon colis de filtres et plaquettes de frein ce matin au bureau Yalidine de Sétif. Emballage d\'origine très soigné et pièces conformes. Merci beaucoup pour votre réactivité !',
        read: true,
        createdAt: '2026-10-03T10:20:00Z'
    }
];

const AdminInboxPage = () => {
    const { t } = useTranslation();
    const { userInfo } = useAuth();
    const [messages, setMessages] = useState(() => {
        try {
            const stored = localStorage.getItem('krimo_admin_inbox');
            return stored ? JSON.parse(stored) : INITIAL_MESSAGES;
        } catch {
            return INITIAL_MESSAGES;
        }
    });
    const [loading, setLoading] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        try {
            localStorage.setItem('krimo_admin_inbox', JSON.stringify(messages));
        } catch (e) {
            console.error(e);
        }
    }, [messages]);

    useEffect(() => {
        const tryFetchFromBackend = async () => {
            if (!userInfo?.token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get('/api/messages', config);
                if (Array.isArray(data) && data.length > 0) {
                    setMessages(data);
                }
            } catch (error) {
                // Backend is offline - gracefully keep demo messages without error toast
            }
        };

        tryFetchFromBackend();
    }, [userInfo]);

    const handleMarkAsRead = (id) => {
        setMessages(prev => prev.map(m => m._id === id ? { ...m, read: true } : m));
    };

    const openMessage = (msg) => {
        setSelectedMessage(msg);
        if (!msg.read) {
            handleMarkAsRead(msg._id);
        }
    };

    const handleDelete = (id) => {
        setMessages(prev => prev.filter(m => m._id !== id));
        if (selectedMessage?._id === id) {
            setSelectedMessage(null);
        }
        toast.success('Message supprimé');
    };

    const unreadCount = messages.filter(m => !m.read).length;

    return (
        <div style={{ paddingBottom: '3rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                    <h1 className="logo-text admin-header-title" style={{ fontSize: '2.4rem', color: 'var(--ford-blue)', margin: 0 }}>
                        📬 Boîte de Réception & Demandes
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0.4rem 0 0 0' }}>
                        Messages envoyés depuis la page contact et les formulaires de renseignements.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: '999px',
                        backgroundColor: unreadCount > 0 ? '#fee2e2' : '#f1f5f9',
                        color: unreadCount > 0 ? '#991b1b' : '#475569',
                        fontWeight: '700',
                        fontSize: '0.825rem'
                    }}>
                        {unreadCount} message{unreadCount > 1 ? 's' : ''} non-lu{unreadCount > 1 ? 's' : ''}
                    </span>

                    <button
                        type="button"
                        onClick={() => {
                            setMessages(INITIAL_MESSAGES);
                            toast.success('Messages réinitialisés');
                        }}
                        style={{
                            padding: '0.5rem 0.85rem',
                            borderRadius: '8px',
                            backgroundColor: 'white',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        🔄 Démo
                    </button>
                </div>
            </div>

            {/* Messages List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {messages.length === 0 ? (
                    <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '12px', textAlign: 'center', color: '#64748b' }}>
                        Aucun message dans la boîte de réception.
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg._id}
                            onClick={() => openMessage(msg)}
                            style={{
                                backgroundColor: msg.read ? 'white' : '#f0fdf4',
                                padding: '1.25rem',
                                borderRadius: '12px',
                                border: msg.read ? '1px solid #e2e8f0' : '1.5px solid #86efac',
                                borderLeft: msg.read ? '4px solid #cbd5e1' : '5px solid #22c55e',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '1rem',
                                boxShadow: 'var(--shadow-sm)'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '1rem', fontWeight: msg.read ? '600' : '800', color: '#0f172a' }}>
                                        {msg.name}
                                    </span>
                                    {msg.wilaya && (
                                        <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#eff6ff', color: 'var(--ford-blue)', fontWeight: '700' }}>
                                            📍 {msg.wilaya}
                                        </span>
                                    )}
                                    {!msg.read && (
                                        <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '999px', backgroundColor: '#22c55e', color: 'white', fontWeight: '800' }}>
                                            NOUVEAU
                                        </span>
                                    )}
                                </div>

                                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#334155', marginBottom: '2px' }}>
                                    {msg.subject || 'Demande de pièce détachée'}
                                </div>

                                <div style={{
                                    fontSize: '0.85rem',
                                    color: '#64748b',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {msg.message}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                                    {new Date(msg.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                </span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--ford-blue)', fontWeight: '700' }}>
                                    Lire ➔
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal: View Message Detail & WhatsApp Reply */}
            {selectedMessage && (
                <div
                    onClick={() => setSelectedMessage(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
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
                            maxWidth: '560px',
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#071d49', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{selectedMessage.subject || 'Message Client'}</h3>
                                <div style={{ fontSize: '0.8rem', color: '#93c5fd', marginTop: '2px' }}>De : {selectedMessage.name} ({selectedMessage.wilaya})</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedMessage(null)}
                                style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="admin-form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem', backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                                <div>
                                    <span style={{ color: '#64748b' }}>Téléphone :</span>{' '}
                                    <strong>{selectedMessage.phone || 'Non renseigné'}</strong>
                                </div>
                                <div>
                                    <span style={{ color: '#64748b' }}>Email :</span>{' '}
                                    <strong>{selectedMessage.email || 'Non renseigné'}</strong>
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>
                                    Message complet :
                                </div>
                                <div style={{
                                    fontSize: '0.92rem',
                                    color: '#0f172a',
                                    lineHeight: 1.6,
                                    backgroundColor: '#ffffff',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {selectedMessage.message}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                {selectedMessage.phone && (
                                    <>
                                        <a
                                            href={getWhatsAppLink(`Salam ${selectedMessage.name} ! C'est Krimo Pièces Auto (Boulevard de la Soummam, Alger). Concernant votre message (« ${selectedMessage.subject} »)...`)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                flex: 1,
                                                padding: '0.65rem',
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
                                            <span>Répondre sur WhatsApp</span>
                                        </a>

                                        <a
                                            href={`tel:${selectedMessage.phone.replace(/\s+/g, '')}`}
                                            style={{
                                                padding: '0.65rem 1rem',
                                                backgroundColor: 'var(--ford-blue)',
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
                                            <span>📞</span>
                                            <span>Appeler</span>
                                        </a>
                                    </>
                                )}

                                <button
                                    type="button"
                                    onClick={() => handleDelete(selectedMessage._id)}
                                    style={{
                                        padding: '0.65rem 0.85rem',
                                        backgroundColor: '#fee2e2',
                                        color: '#991b1b',
                                        border: '1px solid #fecaca',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminInboxPage;
