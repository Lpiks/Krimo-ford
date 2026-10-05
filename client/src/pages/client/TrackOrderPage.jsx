import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { getWhatsAppLink } from '../../utils/whatsapp';

const DEMO_ORDERS = {
    'KF-9421': {
        id: 'KF-9421',
        date: '2026-03-28',
        customerName: 'Karim Benali',
        phone: '0555123456',
        wilaya: 'Blida (09)',
        deliveryType: 'Livraison à domicile',
        statusIndex: 3, // 0: Reçue, 1: Confirmée, 2: Préparation, 3: Expédiée, 4: Livrée
        statusText: 'Expédiée avec Yalidine Express',
        driverPhone: '0661998877',
        estimatedDelivery: 'Demain avant 14h',
        items: [
            { name: 'Kit Plaquettes de Frein Avant Ford Focus Mk3', qty: 1, price: 6800, image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=300&q=80' },
            { name: 'Filtre à Huile Motorcraft 1.6 TDCi', qty: 2, price: 1400, image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=300&q=80' }
        ],
        shippingFee: 500,
        total: 10100
    },
    'KF-8812': {
        id: 'KF-8812',
        date: '2026-03-29',
        customerName: 'Samir Mansouri',
        phone: '0770987654',
        wilaya: 'Alger (16) - Bab Ezzouar',
        deliveryType: 'Express 24h - Domicile',
        statusIndex: 2,
        statusText: 'En préparation au magasin Soummam',
        estimatedDelivery: 'Aujourd\'hui à 17h',
        items: [
            { name: 'Kit Courroie de Distribution + Pompe à Eau Ford Fiesta', qty: 1, price: 21500, image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=300&q=80' }
        ],
        shippingFee: 400,
        total: 21900
    }
};

const STEPS = [
    { title: 'Commande Reçue', subtitle: 'Enregistrée sur le système', icon: '📝' },
    { title: 'Confirmée', subtitle: 'Validée par Krimo', icon: '📞' },
    { title: 'En Préparation', subtitle: 'Emballée au dépôt Soummam', icon: '📦' },
    { title: 'En Route', subtitle: 'Confie au service livraison', icon: '🚚' },
    { title: 'Livrée', subtitle: 'Paiement réglé au livreur', icon: '✅' }
];

const TrackOrderPage = () => {
    const { t, i18n } = useTranslation();
    const [orderQuery, setOrderQuery] = useState('');
    const [phoneQuery, setPhoneQuery] = useState('');
    const [searchedOrder, setSearchedOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        const cleanQuery = orderQuery.trim().toUpperCase();
        if (!cleanQuery) {
            toast.error(t('track.enterOrderNumber', 'Veuillez saisir votre numéro de commande'));
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (DEMO_ORDERS[cleanQuery]) {
                setSearchedOrder(DEMO_ORDERS[cleanQuery]);
                toast.success(t('track.orderFound', 'Commande localisée avec succès'));
            } else {
                // Generate a simulated dynamic order matching the user's input so any ID works!
                const dynamicOrder = {
                    id: cleanQuery,
                    date: new Date().toISOString().split('T')[0],
                    customerName: 'Client Ford',
                    phone: phoneQuery || '0660******',
                    wilaya: 'Alger (16)',
                    deliveryType: 'Livraison Standard 58 Wilayas',
                    statusIndex: 1,
                    statusText: 'Confirmée - En cours de traitement au magasin Soummam',
                    estimatedDelivery: 'Sous 24h à 48h',
                    items: [
                        { name: 'Pièces détachées d\'Origine Ford (Commande ' + cleanQuery + ')', qty: 1, price: 12500, image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=300&q=80' }
                    ],
                    shippingFee: 400,
                    total: 12900
                };
                setSearchedOrder(dynamicOrder);
                toast.success(t('track.orderFound', 'Commande trouvée'));
            }
        }, 500);
    };

    const loadDemo = (demoId) => {
        setOrderQuery(demoId);
        setSearchedOrder(DEMO_ORDERS[demoId]);
    };

    return (
        <div style={{ backgroundColor: '#f9fafb', minHeight: '90vh', padding: '3rem 1rem' }}>
            <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 1rem',
                        backgroundColor: 'rgba(0, 52, 120, 0.08)',
                        color: 'var(--ford-blue)',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        marginBottom: '1rem'
                    }}>
                        <span>📦</span>
                        <span>{t('track.badge', 'Suivi en Temps Réel 58 Wilayas')}</span>
                    </div>
                    <h1 style={{
                        fontSize: '2.4rem',
                        color: 'var(--ford-blue)',
                        fontFamily: 'var(--font-logo)',
                        marginBottom: '0.5rem'
                    }}>
                        {t('track.title', 'Suivre ma Commande Ford')}
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
                        {t('track.subtitle', 'Entrez votre référence de commande ou votre numéro de téléphone pour vérifier l\'état d\'avancement de votre livraison.')}
                    </p>
                </div>

                {/* Search Box */}
                <div style={{
                    backgroundColor: 'white',
                    padding: 'clamp(1rem, 3.5vw, 2rem)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    border: '1px solid #e5e7eb',
                    marginBottom: '2rem'
                }}>
                    <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem', alignItems: 'end' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>
                                {t('track.orderIdLabel', 'N° de Commande (ex: KF-9421)')}
                            </label>
                            <input
                                type="text"
                                placeholder="KF-9421"
                                value={orderQuery}
                                onChange={(e) => setOrderQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 1rem',
                                    borderRadius: '10px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    textTransform: 'uppercase'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>
                                {t('track.phoneLabel', 'N° Téléphone (Optionnel)')}
                            </label>
                            <input
                                type="text"
                                placeholder="0550 12 34 56"
                                value={phoneQuery}
                                onChange={(e) => setPhoneQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 1rem',
                                    borderRadius: '10px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '0.85rem 1.5rem',
                                backgroundColor: 'var(--ford-blue)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '1rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 4px 12px rgba(0, 52, 120, 0.25)'
                            }}
                        >
                            {loading ? t('common.loading', 'Recherche...') : t('track.searchBtn', 'Localiser la commande')}
                        </button>
                    </form>

                    {/* Quick Demo links */}
                    <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{t('track.tryDemo', 'Tester un exemple direct :')}</span>
                        <button
                            type="button"
                            onClick={() => loadDemo('KF-9421')}
                            style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}
                        >
                            KF-9421 (Expédiée)
                        </button>
                        <button
                            type="button"
                            onClick={() => loadDemo('KF-8812')}
                            style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}
                        >
                            KF-8812 (En préparation)
                        </button>
                    </div>
                </div>

                {/* Order Result Card */}
                {searchedOrder && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                            border: '1px solid #e5e7eb',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Status banner */}
                        <div style={{
                            background: 'linear-gradient(135deg, var(--ford-blue) 0%, #002255 100%)',
                            color: 'white',
                            padding: '1.5rem 2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem'
                        }}>
                            <div>
                                <span style={{ fontSize: '0.85rem', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {t('track.orderNumber', 'Commande')}
                                </span>
                                <h2 style={{ fontSize: '1.75rem', margin: 0, fontWeight: '800' }}>#{searchedOrder.id}</h2>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
                                    {t('track.client', 'Destinataire :')} {searchedOrder.customerName} • {searchedOrder.wilaya}
                                </p>
                            </div>

                            <div style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                padding: '0.6rem 1.25rem',
                                borderRadius: '10px',
                                textAlign: 'right'
                            }}>
                                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.85 }}>
                                    {t('track.estimated', 'Livraison estimée')}
                                </span>
                                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#60a5fa' }}>
                                    {searchedOrder.estimatedDelivery}
                                </div>
                            </div>
                        </div>

                        {/* Interactive Stepper */}
                        <div style={{ padding: 'clamp(1.25rem, 3.5vw, 2.5rem) clamp(1rem, 3vw, 2rem)', borderBottom: '1px solid #f3f4f6' }}>
                            {/* Desktop 5-column Stepper */}
                            <div className="desktop-stepper" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', position: 'relative' }}>
                                {STEPS.map((step, idx) => {
                                    const isCompleted = idx <= searchedOrder.statusIndex;
                                    const isCurrent = idx === searchedOrder.statusIndex;

                                    return (
                                        <div key={idx} style={{ textAlign: 'center', position: 'relative' }}>
                                            <div style={{
                                                width: '44px',
                                                height: '44px',
                                                borderRadius: '50%',
                                                backgroundColor: isCurrent ? 'var(--ford-blue)' : isCompleted ? '#10b981' : '#f3f4f6',
                                                color: isCompleted ? 'white' : '#9ca3af',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto 0.75rem auto',
                                                fontSize: '1.25rem',
                                                fontWeight: 'bold',
                                                boxShadow: isCurrent ? '0 0 0 4px rgba(0, 52, 120, 0.2)' : 'none',
                                                transition: 'all 0.3s'
                                            }}>
                                                {step.icon}
                                            </div>
                                            <div style={{
                                                fontSize: '0.85rem',
                                                fontWeight: isCurrent ? '700' : '600',
                                                color: isCurrent ? 'var(--ford-blue)' : isCompleted ? '#111827' : '#9ca3af'
                                            }}>
                                                {step.title}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                                                {step.subtitle}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Mobile Vertical Timeline Stepper */}
                            <div className="mobile-stepper" style={{ display: 'none', flexDirection: 'column', gap: '1.25rem' }}>
                                {STEPS.map((step, idx) => {
                                    const isCompleted = idx <= searchedOrder.statusIndex;
                                    const isCurrent = idx === searchedOrder.statusIndex;
                                    const isLast = idx === STEPS.length - 1;

                                    return (
                                        <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', position: 'relative' }}>
                                            {/* Icon & connecting line */}
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <div style={{
                                                    width: '38px',
                                                    height: '38px',
                                                    borderRadius: '50%',
                                                    backgroundColor: isCurrent ? 'var(--ford-blue)' : isCompleted ? '#10b981' : '#f3f4f6',
                                                    color: isCompleted ? 'white' : '#9ca3af',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.1rem',
                                                    fontWeight: 'bold',
                                                    boxShadow: isCurrent ? '0 0 0 4px rgba(0, 52, 120, 0.2)' : 'none',
                                                    flexShrink: 0
                                                }}>
                                                    {step.icon}
                                                </div>
                                                {!isLast && (
                                                    <div style={{
                                                        width: '2px',
                                                        minHeight: '26px',
                                                        backgroundColor: isCompleted && !isCurrent ? '#10b981' : '#e5e7eb',
                                                        margin: '4px 0'
                                                    }} />
                                                )}
                                            </div>

                                            {/* Step details */}
                                            <div style={{ flex: 1, paddingTop: '4px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    <span style={{
                                                        fontSize: '0.92rem',
                                                        fontWeight: isCurrent ? '800' : '600',
                                                        color: isCurrent ? 'var(--ford-blue)' : isCompleted ? '#111827' : '#9ca3af'
                                                    }}>
                                                        {step.title}
                                                    </span>
                                                    {isCurrent && (
                                                        <span style={{
                                                            backgroundColor: 'rgba(0, 52, 120, 0.1)',
                                                            color: 'var(--ford-blue)',
                                                            fontSize: '0.7rem',
                                                            fontWeight: '700',
                                                            padding: '2px 8px',
                                                            borderRadius: '9999px'
                                                        }}>
                                                            En cours
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '2px' }}>
                                                    {step.subtitle}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Items & Breakdown */}
                        <div style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.15rem', color: '#111827', marginBottom: '1rem', fontWeight: '700' }}>
                                {t('track.articles', 'Articles dans le colis')}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                {searchedOrder.items.map((item, i) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem 1rem',
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '10px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                            <div>
                                                <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.95rem' }}>{item.name}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Qté: {item.qty} × {item.price.toLocaleString()} DA</div>
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: '700', color: 'var(--ford-blue)' }}>
                                            {(item.qty * item.price).toLocaleString()} DA
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total summary */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderTop: '2px dashed #e5e7eb',
                                paddingTop: '1rem',
                                marginBottom: '1.5rem'
                            }}>
                                <div>
                                    <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Frais de port ({searchedOrder.deliveryType}) : {searchedOrder.shippingFee} DA</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111827' }}>Total à régler au livreur (Cash)</div>
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--ford-blue)' }}>
                                    {searchedOrder.total.toLocaleString()} DA
                                </div>
                            </div>

                            {/* Support CTA */}
                            <div style={{
                                backgroundColor: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                padding: '1rem 1.25rem',
                                borderRadius: '12px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '1rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span style={{ fontSize: '1.5rem' }}>💬</span>
                                    <div>
                                        <div style={{ fontWeight: '700', color: '#166534', fontSize: '0.95rem' }}>
                                            Besoin d'une précision sur votre livraison ?
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#15803d' }}>
                                            Krimo et l'équipe Soummam sont disponibles sur WhatsApp.
                                        </div>
                                    </div>
                                </div>
                                <a
                                    href={getWhatsAppLink(`Salam Krimo, je m'informe au sujet de ma commande #${searchedOrder.id} (${searchedOrder.customerName}).`)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        backgroundColor: '#25D366',
                                        color: 'white',
                                        padding: '0.6rem 1.2rem',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        fontSize: '0.9rem',
                                        textDecoration: 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    Contacter Krimo sur WhatsApp
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TrackOrderPage;
