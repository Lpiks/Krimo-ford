import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import YMMLookup from '../../components/shared/YMMLookup';
import FeaturesSection from '../../components/home/FeaturesSection';
import { MAINTENANCE_KITS } from './KitsPage';
import { getWhatsAppLink } from '../../utils/whatsapp';

// The 8 Core Spare Parts Departments (Rayons de Pièces Détachées)
const SPARE_PARTS_DEPARTMENTS = [
    {
        id: 'Brakes',
        name: 'Système de Freinage',
        nameAr: 'نظام الفرامل',
        items: 'Plaquettes, Disques ventilés, Étriers, Flexibles',
        icon: '🛑',
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=600&q=80',
        badge: 'Essentiel Sécurité',
        count: '85+ références'
    },
    {
        id: 'Filters',
        name: 'Filtration & Huiles',
        nameAr: 'الفلاتر والزيوت',
        items: 'Filtres à huile, Filtres gazole/essence, Air, Huile Motorcraft',
        icon: '🛢️',
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
        badge: 'Entretien Courant',
        count: '120+ références'
    },
    {
        id: 'Engine',
        name: 'Moteur & Distribution',
        nameAr: 'المحرك وسير الكاتينة',
        items: 'Kits distribution, Pompes à eau, Vannes EGR, Injecteurs TDCi',
        icon: '⚙️',
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
        badge: 'Gros Entretien',
        count: '160+ références'
    },
    {
        id: 'Suspension',
        name: 'Suspension & Train Avant',
        nameAr: 'التعليق والمساعدين',
        items: 'Amortisseurs, Triangles de suspension, Rotules, Biellettes',
        icon: '🔩',
        image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&q=80',
        badge: 'Tenue de Route',
        count: '95+ références'
    },
    {
        id: 'Transmission',
        name: 'Embrayage & Boîte',
        nameAr: 'طقم الدبرياج والفتيس',
        items: 'Kits embrayage, Butées hydrauliques, Volants moteurs, Cardans',
        icon: '🔄',
        image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80',
        badge: 'Transmission',
        count: '60+ références'
    },
    {
        id: 'Electrical',
        name: 'Électricité & Allumage',
        nameAr: 'الكهرباء وشمعات الاحتراق',
        items: 'Bougies Iridium, Bobines, Démarreurs, Alternateurs, Capteurs',
        icon: '⚡',
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
        badge: 'Allumage',
        count: '70+ références'
    },
    {
        id: 'Body',
        name: 'Éclairage & Carrosserie',
        nameAr: 'الإضاءة وهيكل السيارة',
        items: 'Optiques de phares, Feux arrière, Rétroviseurs, Pare-chocs',
        icon: '💡',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
        badge: 'Optiques & Finition',
        count: '55+ références'
    },
    {
        id: 'Cooling',
        name: 'Refroidissement & Clim',
        nameAr: 'التبريد ومكيف الهواء',
        items: 'Radiateurs, Thermostats, Pompes, Compresseurs clim',
        icon: '❄️',
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=600&q=80',
        badge: 'Thermique',
        count: '40+ références'
    }
];

// Quick Ford models list to filter spare parts
const FORD_MODELS_PARTS = [
    { id: 'Focus', name: 'Pièces pour Ford Focus', generations: 'Focus Mk2 • Mk3 • Mk4 (TDCi & EcoBoost)', icon: '🔧' },
    { id: 'Fiesta', name: 'Pièces pour Ford Fiesta', generations: 'Fiesta Mk6 • Mk7 • Mk8 (1.4 TDCi / 1.25)', icon: '🔧' },
    { id: 'Ranger', name: 'Pièces pour Ford Ranger', generations: 'Ranger T6 • 4x4 (2.2 & 3.2 TDCi Duratorq)', icon: '🔧' },
    { id: 'Transit', name: 'Pièces pour Ford Transit', generations: 'Transit Custom • V347 • V362 (EcoBlue Pro)', icon: '🔧' },
    { id: 'Kuga', name: 'Pièces pour Ford Kuga / EcoSport', generations: 'SUV Kuga 2 & 3 • EcoSport AWD', icon: '🔧' },
    { id: 'Mondeo', name: 'Pièces pour Ford Mondeo / Fusion', generations: 'Mondeo 4 • Fusion (2.0 TDCi & Hybride)', icon: '🔧' }
];

const TESTIMONIALS = [
    {
        name: 'Mourad Garage Auto Performance',
        location: 'Bab Ezzouar, Alger',
        role: 'Mécanicien Professionnel',
        comment: 'Krimo à la Soummam est notre fournisseur n°1 pour toutes les pièces d\'origine Ford : injecteurs TDCi, plaquettes Motorcraft, courroies. Les pièces sont toujours neuves, conformes et livrées le jour même.',
        rating: 5
    },
    {
        name: 'Sofiane H.',
        location: 'Sétif (19)',
        role: 'Propriétaire Ford Focus Mk3',
        comment: 'J\'ai acheté mon kit complet de distribution et pompe à eau chez Krimo. Prix imbattable par rapport aux revendeurs locaux et pièce originale sous blister reçue en 24h par Yalidine.',
        rating: 5
    },
    {
        name: 'Abdelkader Logistique',
        location: 'Oran (31)',
        role: 'Flotte Véhicules Utilitaires',
        comment: 'Nous commandons tous les packs de filtration et freins pour nos Ford Transit chez Krimo. La possibilité d\'envoyer la photo de la carte grise sur WhatsApp fait gagner un temps précieux.',
        rating: 5
    }
];

const HomePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchMode, setSearchMode] = useState('ymm'); // 'ymm' | 'oem'
    const [oemInput, setOemInput] = useState('');

    const handleOemSearch = (e) => {
        e.preventDefault();
        if (oemInput.trim()) {
            navigate(`/catalog?keyword=${encodeURIComponent(oemInput.trim())}`);
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div>
            {/* 1. Hero Section - Focused on SPARE PARTS */}
            <section style={{
                backgroundImage: 'linear-gradient(rgba(0, 20, 50, 0.85), rgba(0, 10, 30, 0.95)), url("https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1920&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#0a192f',
                padding: '5rem 1rem 4rem 1rem',
                borderBottom: '4px solid var(--ford-blue)',
                color: 'white'
            }}>
                <div className="container" style={{ maxWidth: '1050px', margin: '0 auto', textAlign: 'center' }}>
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 1.25rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        marginBottom: '1.25rem',
                        backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <span>⚙️</span>
                        <span>Magasin Spécialiste Pièces Détachées Ford — Boulevard de la Soummam, Alger</span>
                    </div>

                    {/* Main Title - Explicitly "Pièces Détachées" */}
                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        style={{
                            fontSize: 'clamp(1.75rem, 5.5vw, 3.4rem)',
                            marginBottom: '1rem',
                            color: 'white',
                            fontFamily: 'var(--font-logo)',
                            textShadow: '0 3px 6px rgba(0,0,0,0.6)',
                            lineHeight: 1.15
                        }}
                    >
                        Pièces Détachées d'Origine & Motorcraft Ford
                    </motion.h1>

                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        style={{
                            fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)',
                            maxWidth: '780px',
                            margin: '0 auto 2.5rem auto',
                            fontWeight: '300',
                            opacity: 0.9,
                            lineHeight: '1.6'
                        }}
                    >
                        Plaquettes, disques, filtres, kits distribution, embrayages, amortisseurs, bougies et capteurs. Vente de <strong>pièces de rechange neuves</strong> pour tous véhicules Ford avec expédition 58 Wilayas et retrait direct à la Soummam.
                    </motion.p>

                    {/* Search Mode Selector (YMM vs OEM vs Carte Grise) */}
                    <div style={{
                        maxWidth: '920px',
                        margin: '0 auto',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(10px)',
                        padding: '0.5rem',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.15)'
                    }}>
                        {/* Selector Tabs */}
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem', padding: '0.5rem', flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                onClick={() => setSearchMode('ymm')}
                                style={{
                                    padding: '0.65rem 1.4rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    backgroundColor: searchMode === 'ymm' ? 'var(--ford-blue)' : 'rgba(255,255,255,0.1)',
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem'
                                }}
                            >
                                <span>🔍</span>
                                <span>Pièces par Modèle & Année</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSearchMode('oem')}
                                style={{
                                    padding: '0.65rem 1.4rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    backgroundColor: searchMode === 'oem' ? 'var(--ford-blue)' : 'rgba(255,255,255,0.1)',
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem'
                                }}
                            >
                                <span>🔢</span>
                                <span>Recherche par Référence OEM / Finis</span>
                            </button>

                            <Link
                                to="/vin-request"
                                style={{
                                    padding: '0.65rem 1.4rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    backgroundColor: '#16a34a',
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    boxShadow: '0 2px 8px rgba(22, 163, 74, 0.4)'
                                }}
                            >
                                <span>📋</span>
                                <span>Devis Pièce par Carte Grise</span>
                            </Link>
                        </div>

                        {/* Search Content */}
                        {searchMode === 'ymm' ? (
                            <YMMLookup />
                        ) : (
                            <form onSubmit={handleOemSearch} style={{
                                padding: 'clamp(1rem, 3.5vw, 2rem)',
                                backgroundColor: 'rgba(0, 30, 80, 0.85)',
                                borderRadius: '16px',
                                display: 'flex',
                                gap: '1rem',
                                alignItems: 'center',
                                flexWrap: 'wrap'
                            }}>
                                <input
                                    type="text"
                                    placeholder="Tapez le numéro OEM gravé sur votre pièce (ex: 1807044, 1717510, BK2Q-6744-AA)..."
                                    value={oemInput}
                                    onChange={(e) => setOemInput(e.target.value)}
                                    style={{
                                        flex: 1,
                                        minWidth: 0,
                                        width: '100%',
                                        padding: '1rem 1.25rem',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        backgroundColor: 'white',
                                        color: '#111827',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                />
                                <button
                                    type="submit"
                                    style={{
                                        padding: '1rem clamp(1rem, 3vw, 2rem)',
                                        backgroundColor: 'var(--ford-blue)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontWeight: '800',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(0, 52, 120, 0.4)'
                                    }}
                                >
                                    Chercher la pièce
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Quick Metrics & Guarantees Ticker */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
                        gap: '1rem',
                        marginTop: '2.5rem',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '14px',
                            padding: '1rem',
                            border: '1px solid rgba(255, 255, 255, 0.15)'
                        }}>
                            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#60a5fa' }}>+12 000</div>
                            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: '600' }}>Pièces Ford Référencées</div>
                        </div>
                        <div style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '14px',
                            padding: '1rem',
                            border: '1px solid rgba(255, 255, 255, 0.15)'
                        }}>
                            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#4ade80' }}>58 Wilayas</div>
                            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: '600' }}>Expédition en 24h - 48h</div>
                        </div>
                        <div style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '14px',
                            padding: '1rem',
                            border: '1px solid rgba(255, 255, 255, 0.15)'
                        }}>
                            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fbbf24' }}>100% Neuf</div>
                            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: '600' }}>Motorcraft & Certifié OEM</div>
                        </div>
                        <div style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '14px',
                            padding: '1rem',
                            border: '1px solid rgba(255, 255, 255, 0.15)'
                        }}>
                            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#f472b6' }}>Soummam</div>
                            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: '600' }}>Magasin & Stock à Alger</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Reassurance Bar (Soummam Standards) */}
            <section style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '1.5rem 1rem' }}>
                <div className="container" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                    gap: '1.5rem',
                    textAlign: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                        <span style={{ fontSize: '2rem' }}>🛡️</span>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.95rem' }}>Pièces 100% Neuves d'Origine</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Motorcraft & Équipementiers 1er Choix</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                        <span style={{ fontSize: '2rem' }}>🚚</span>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.95rem' }}>Livraison Pièces 58 Wilayas</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Expédition rapide sous 24h à 48h</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                        <span style={{ fontSize: '2rem' }}>💵</span>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.95rem' }}>Paiement Cash au Livreur</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Vérifiez votre colis avant de régler</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                        <span style={{ fontSize: '2rem' }}>💬</span>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.95rem' }}>Comptoir Soummam Alger</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Retrait direct ou conseil WhatsApp</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Core Section: Rayons de Pièces Détachées (Auto Parts Departments) */}
            <section className="container" style={{ padding: 'clamp(2.5rem, 5vw, 4.5rem) 1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ color: 'var(--ford-blue)', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                        Catalogue Général de Rechange
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em' }}>
                        Nos Rayons Pièces Détachées
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
                        Choisissez une catégorie de pièces pour accéder aux références compatibles avec votre Ford.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1.75rem' }}>
                    {SPARE_PARTS_DEPARTMENTS.map((dept) => (
                        <motion.div
                            key={dept.id}
                            whileHover={{ y: -6 }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '18px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'border-color 0.2s ease'
                            }}
                        >
                            <div>
                                <div style={{ position: 'relative', height: '175px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                                    <img
                                        src={dept.image}
                                        alt={dept.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        top: '10px',
                                        left: '10px',
                                        backgroundColor: 'rgba(0, 52, 120, 0.9)',
                                        backdropFilter: 'blur(4px)',
                                        color: 'white',
                                        padding: '0.25rem 0.65rem',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        fontWeight: '700'
                                    }}>
                                        {dept.badge}
                                    </span>

                                    {dept.count && (
                                        <span style={{
                                            position: 'absolute',
                                            bottom: '10px',
                                            right: '10px',
                                            backgroundColor: 'rgba(15, 23, 42, 0.85)',
                                            backdropFilter: 'blur(4px)',
                                            color: '#f8fafc',
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '6px',
                                            fontSize: '0.72rem',
                                            fontWeight: '700'
                                        }}>
                                            {dept.count}
                                        </span>
                                    )}
                                </div>

                                <div style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                                        <span style={{ fontSize: '1.3rem' }}>{dept.icon}</span>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                                            {dept.name}
                                        </h3>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.4rem 0 1rem 0', minHeight: '2.4em' }}>
                                        {dept.items}
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '0 1.25rem 1.25rem 1.25rem' }}>
                                <Link
                                    to={`/catalog?category=${dept.id}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                        width: '100%',
                                        padding: '0.75rem',
                                        textAlign: 'center',
                                        backgroundColor: '#eff6ff',
                                        color: 'var(--ford-blue)',
                                        borderRadius: '10px',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        border: '1px solid #bfdbfe',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--ford-blue)';
                                        e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#eff6ff';
                                        e.currentTarget.style.color = 'var(--ford-blue)';
                                    }}
                                >
                                    <span>Explorer le rayon</span>
                                    <span>→</span>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 4. Filter By Vehicle Model (Clearly framed as Finding Parts for your Model) */}
            <section style={{ backgroundColor: '#f1f5f9', padding: '4.5rem 1rem' }}>
                <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <span style={{ color: 'var(--ford-blue)', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Compatibilité Garantiée
                        </span>
                        <h2 style={{ fontSize: '2.3rem', fontWeight: '900', color: '#0f172a', margin: '0.25rem 0 0.5rem 0' }}>
                            Trouvez les Pièces Dédiées à Votre Modèle Ford
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                            Cliquez sur votre modèle pour accéder directement à l'ensemble des pièces mécaniques et carrosserie compatibles.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
                        {FORD_MODELS_PARTS.map((m) => (
                            <Link
                                key={m.id}
                                to={`/model/${m.id}`}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '14px',
                                    padding: '1.5rem',
                                    border: '1px solid #e2e8f0',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 52, 120, 0.08)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: '800', color: 'var(--ford-blue)', fontSize: '1.15rem', marginBottom: '0.25rem' }}>
                                        {m.name}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                        {m.generations}
                                    </div>
                                </div>
                                <span style={{ color: 'var(--ford-blue)', fontSize: '1.3rem', fontWeight: 'bold' }}>→</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Highlighted Maintenance Packs Preview (Kits Pièces Vidange / Freinage) */}
            <section className="container" style={{ padding: '4.5rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <span style={{ color: '#16a34a', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Packs Révision & Réparation
                        </span>
                        <h2 style={{ fontSize: '2.4rem', fontWeight: '900', color: '#0f172a', margin: '0.25rem 0 0 0' }}>
                            Packs de Pièces Groupées (Économie -15%)
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '1rem', margin: '0.35rem 0 0 0' }}>
                            Commandez l'ensemble des pièces nécessaires à votre entretien en un seul carton scellé.
                        </p>
                    </div>
                    <Link
                        to="/kits"
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'var(--ford-blue)',
                            color: 'white',
                            borderRadius: '10px',
                            fontWeight: '700',
                            textDecoration: 'none',
                            fontSize: '0.95rem'
                        }}
                    >
                        Voir Tous les Packs de Pièces →
                    </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '2rem' }}>
                    {MAINTENANCE_KITS.slice(0, 3).map((kit) => (
                        <div key={kit.id} style={{
                            backgroundColor: 'white',
                            borderRadius: '18px',
                            padding: '1.75rem',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '800', fontSize: '0.8rem' }}>
                                        {kit.discount} ÉCONOMIE PACK
                                    </span>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Ford {kit.model}</span>
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem' }}>
                                    {kit.name}
                                </h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                                    {kit.contents.length} pièces certifiées incluses dans le pack.
                                </p>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--ford-blue)' }}>
                                        {kit.bundlePrice.toLocaleString()} DA
                                    </div>
                                    <div style={{ fontSize: '0.95rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                        {kit.originalPrice.toLocaleString()} DA
                                    </div>
                                </div>
                            </div>

                            <Link
                                to="/kits"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    textAlign: 'center',
                                    backgroundColor: '#f8fafc',
                                    color: 'var(--ford-blue)',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    textDecoration: 'none'
                                }}
                            >
                                Détails & Commander le Pack
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* 6. Carte Grise Hero Banner (Pour les Pièces Rares ou Non Référencées) */}
            <section style={{
                background: 'linear-gradient(135deg, #091a36 0%, #002255 100%)',
                color: 'white',
                padding: '5rem 1rem'
            }}>
                <div className="container" style={{
                    maxWidth: '1000px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                    gap: '2.5rem',
                    alignItems: 'center'
                }}>
                    <div>
                        <div style={{ color: '#60a5fa', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                            Service Recherche de Pièces Rares
                        </div>
                        <h2 style={{ fontSize: '2.4rem', fontWeight: '900', lineHeight: '1.2', marginBottom: '1rem' }}>
                            Vous cherchez une pièce mécanique rare ?
                        </h2>
                        <p style={{ opacity: 0.9, lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '2rem' }}>
                            Capteurs, calculateurs, injecteurs, turbos, durites spécifiques ou pièces de boîte : Krimo vérifie la référence constructeur exacte à partir de votre Carte Grise ou N° de Châssis.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <Link
                                to="/vin-request"
                                style={{
                                    backgroundColor: 'white',
                                    color: 'var(--ford-blue)',
                                    padding: '0.85rem 1.75rem',
                                    borderRadius: '12px',
                                    fontWeight: '800',
                                    textDecoration: 'none',
                                    boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)'
                                }}
                            >
                                Demander un Devis Pièce en Ligne →
                            </Link>
                            <a
                                href={getWhatsAppLink('Salam Krimo, j\'ai une photo de carte grise pour une pièce de rechange Ford. Pouvez-vous vérifier le stock ?')}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    backgroundColor: '#25D366',
                                    color: 'white',
                                    padding: '0.85rem 1.5rem',
                                    borderRadius: '12px',
                                    fontWeight: '800',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <span>WhatsApp Direct Krimo</span>
                                <span>💬</span>
                            </a>
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(10px)',
                        padding: '2rem',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.15)'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', color: '#93c5fd' }}>
                            Comment commander une pièce introuvable ?
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <span style={{ backgroundColor: 'var(--ford-blue)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</span>
                                <div>
                                    <strong>Photo de la Carte Grise ou de l'ancienne pièce</strong>
                                    <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Le numéro VIN permet de retrouver la référence OEM exacte sortie d'usine.</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <span style={{ backgroundColor: 'var(--ford-blue)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</span>
                                <div>
                                    <strong>Disponibilité & Prix sous 15 minutes</strong>
                                    <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Krimo vous confirme le tarif en Dinars au comptoir ou par message.</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <span style={{ backgroundColor: 'var(--ford-blue)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</span>
                                <div>
                                    <strong>Expédition rapide vers votre Wilaya</strong>
                                    <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Colis livré à domicile ou au bureau Yalidine avec paiement à réception.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Diagnostic Troubleshooter Teaser */}
            <section className="container" style={{ padding: '4.5rem 1rem' }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    padding: '3rem 2rem',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '2rem'
                }}>
                    <div style={{ maxWidth: '600px' }}>
                        <span style={{ backgroundColor: 'rgba(0, 52, 120, 0.08)', color: 'var(--ford-blue)', padding: '0.35rem 0.8rem', borderRadius: '6px', fontWeight: '700', fontSize: '0.8rem' }}>
                            AIDE MÉCANIQUE INTERACTIVE
                        </span>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0f172a', margin: '0.75rem 0' }}>
                            Quelle pièce est en panne sur votre Ford ?
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.6' }}>
                            Grincement au freinage ? Claquement sur les dos-d'âne ? Perte de puissance ? Utilisez notre dépanneur interactif pour cibler la pièce exacte à remplacer.
                        </p>
                    </div>

                    <Link
                        to="/diagnostic"
                        style={{
                            padding: '1rem 2rem',
                            backgroundColor: 'var(--ford-blue)',
                            color: 'white',
                            borderRadius: '12px',
                            fontWeight: '800',
                            textDecoration: 'none',
                            fontSize: '1.05rem',
                            boxShadow: '0 4px 15px rgba(0, 52, 120, 0.3)'
                        }}
                    >
                        Diagnostiquer la Pièce Défectueuse ⚡
                    </Link>
                </div>
            </section>

            {/* 8. Testimonials Section (Garages & Auto Parts Customers) */}
            <section style={{ backgroundColor: '#f8fafc', padding: '4.5rem 1rem', borderTop: '1px solid #e2e8f0' }}>
                <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0f172a' }}>
                            La confiance des ateliers mécaniques et clients en Algérie
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '1rem' }}>
                            Avis vérifiés de professionnels de l'automobile commandant leurs pièces chez Krimo.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '2rem' }}>
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                padding: '2rem',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <div>
                                    <div style={{ color: '#f59e0b', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                                        {'★'.repeat(t.rating)}
                                    </div>
                                    <p style={{ fontSize: '0.95rem', color: '#334155', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                        "{t.comment}"
                                    </p>
                                </div>
                                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                                    <div style={{ fontWeight: '800', color: '#0f172a' }}>{t.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.role} • 📍 {t.location}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 9. Built-in Features Component */}
            <FeaturesSection />
        </div>
    );
};

export default HomePage;
