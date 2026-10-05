import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useGarage } from '../../context/GarageContext';
import { MAINTENANCE_KITS } from './KitsPage';

const MODEL_DATA = {
    Focus: {
        name: 'Ford Focus',
        generations: 'Focus Mk2 (2004-2011) • Focus Mk3 (2011-2018) • Focus Mk4 (2018+)',
        engines: ['1.6 TDCi 95/115 ch', '1.5 TDCi EcoBlue 120 ch', '1.0 EcoBoost 125 ch', '2.0 TDCi 150 ch'],
        banner: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=80',
        summary: 'La berline compacte la plus populaire de Ford en Algérie. Retrouvez toutes les pièces de rechange d\'origine pour suspensions, injecteurs, filtres et freinage.',
        knownIssues: [
            { issue: 'Vibrations au freinage', cause: 'Disques de frein voilés ou plaquettes usées', fix: 'Plaquettes & Disques Motorcraft' },
            { issue: 'Perte de puissance / Fumée noire', cause: 'Filtre à gazole colmaté ou durite turbo fissurée', fix: 'Kit Filtration TDCi' },
            { issue: 'Bruit de claquement avant', cause: 'Biellettes de barre stabilisatrice ou silentblocs de triangle', fix: 'Biellettes & Rotules de suspension' }
        ]
    },
    Fiesta: {
        name: 'Ford Fiesta',
        generations: 'Fiesta Mk6 (2008-2013) • Fiesta Mk7 (2013-2017) • Fiesta Mk8 (2017+)',
        engines: ['1.4 TDCi 68 ch', '1.25 Duratec 82 ch', '1.5 TDCi 75/85 ch', '1.0 EcoBoost 100 ch'],
        banner: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=80',
        summary: 'La citadine agile par excellence. Stock permanent de kits de distribution, amortisseurs, bougies et kits de vidange.',
        knownIssues: [
            { issue: 'Pédale d\'embrayage dure', cause: 'Usure de la butée hydraulique ou disque usé', fix: 'Kit Embrayage + Butée LUK/Ford' },
            { issue: 'Démarrage difficile à froid', cause: 'Bougies de préchauffage fatiguées', fix: 'Bougies de préchauffage Bosch/Beru' }
        ]
    },
    Ranger: {
        name: 'Ford Ranger (Pick-Up 4x4)',
        generations: 'Ranger T6 (2011-2015) • Ranger Restylé (2015-2022) • Next-Gen (2022+)',
        engines: ['2.2 TDCi 150/160 ch', '3.2 TDCi 200 ch Duratorq', '2.0 EcoBlue Bi-Turbo 213 ch'],
        banner: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1600&q=80',
        summary: 'Le pick-up robuste pour les chantiers et le tout-terrain. Pièces de transmission 4x4, suspension Heavy-Duty et filtres renforcés.',
        knownIssues: [
            { issue: 'Surchauffe ou bruit moteur', cause: 'Pompe à eau ou galet tendeur de chaîne', fix: 'Kit Distribution Heavy Duty' },
            { issue: 'Jeu dans la direction tout-terrain', cause: 'Rotules de suspension et bras supérieurs', fix: 'Train avant renforcé' }
        ]
    },
    Transit: {
        name: 'Ford Transit & Custom',
        generations: 'Transit V347/V348 (2006-2014) • Custom V362 • Transit 2T V363',
        engines: ['2.2 TDCi 100/125/155 ch', '2.0 EcoBlue 130/170 ch', '2.4 TDCi Propulsion'],
        banner: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80',
        summary: 'L\'utilitaire n°1 des professionnels et transporteurs en Algérie. Disponibilité immédiate des pièces d\'usure rapide à la Soummam.',
        knownIssues: [
            { issue: 'Voyant moteur & régime instable', cause: 'Vanne EGR encrassée ou capteur de rampe', fix: 'Vanne EGR Origine Ford' },
            { issue: 'Usure rapide des freins en charge', cause: 'Plaquettes sous-dimensionnées', fix: 'Plaquettes Heavy-Duty Pro' }
        ]
    },
    Kuga: {
        name: 'Ford Kuga & EcoSport',
        generations: 'Kuga 2 (2012-2019) • Kuga 3 (2020+) • EcoSport (2013+)',
        engines: ['2.0 TDCi AWD', '1.5 TDCi 120 ch', '1.5 EcoBoost 150 ch'],
        banner: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=1600&q=80',
        summary: 'Gamme SUV Ford. Tous les composants de roulement, pont arrière, transmission intégrale et filtration.',
        knownIssues: [
            { issue: 'Bruit de roulement sourd', cause: 'Moyeu ou roulement de roue arrière', fix: 'Moyeu avec capteur ABS' }
        ]
    }
};

const ModelHubPage = () => {
    const { modelName } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { selectVehicle, openGarageModal } = useGarage();

    // Default to Focus if parameter does not match
    const currentKey = Object.keys(MODEL_DATA).find(
        k => k.toLowerCase() === (modelName || '').toLowerCase()
    ) || 'Focus';

    const modelInfo = MODEL_DATA[currentKey];

    const modelKits = MAINTENANCE_KITS.filter(
        k => k.model.toLowerCase() === currentKey.toLowerCase()
    );

    const handleSetAsMyCar = () => {
        selectVehicle({
            make: 'Ford',
            model: currentKey,
            year: 2017,
            fuelType: 'Diesel'
        });
        openGarageModal();
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '90vh', paddingBottom: '4rem' }}>
            {/* Hero Banner */}
            <div style={{
                backgroundImage: `linear-gradient(rgba(0, 20, 50, 0.75), rgba(0, 15, 40, 0.9)), url("${modelInfo.banner}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
                padding: 'clamp(2.5rem, 6vw, 5rem) 1rem',
                borderBottom: '4px solid var(--ford-blue)'
            }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 1.25rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '9999px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        marginBottom: '1rem',
                        backdropFilter: 'blur(4px)'
                    }}>
                        <span>🚗</span>
                        <span>Catalogue Spécialisé Véhicule</span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
                        fontFamily: 'var(--font-logo)',
                        marginBottom: '0.5rem',
                        textShadow: '0 2px 8px rgba(0,0,0,0.4)'
                    }}>
                        Pièces Détachées {modelInfo.name}
                    </h1>

                    <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '750px', margin: '0 auto 1.5rem auto' }}>
                        {modelInfo.generations}
                    </p>

                    {/* Fast Action CTA */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link
                            to={`/catalog?model=${currentKey}`}
                            style={{
                                backgroundColor: 'var(--ford-blue)',
                                color: 'white',
                                padding: '0.85rem 1.75rem',
                                borderRadius: '12px',
                                fontWeight: '700',
                                textDecoration: 'none',
                                boxShadow: '0 4px 15px rgba(0, 52, 120, 0.4)',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}
                        >
                            Explorer Toutes les Pièces {modelInfo.name}
                        </Link>

                        <button
                            type="button"
                            onClick={handleSetAsMyCar}
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                padding: '0.85rem 1.5rem',
                                borderRadius: '12px',
                                fontWeight: '700',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                cursor: 'pointer',
                                backdropFilter: 'blur(4px)'
                            }}
                        >
                            ➕ Ajouter à Mon Garage
                        </button>
                    </div>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '1100px', margin: '3rem auto 0 auto', padding: '0 1rem' }}>
                {/* Motorisations Disponibles */}
                <div style={{
                    backgroundColor: 'white',
                    padding: 'clamp(1rem, 3.5vw, 2rem)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                    border: '1px solid #e2e8f0',
                    marginBottom: '2.5rem'
                }}>
                    <h2 style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>
                        Motorisations Ford {currentKey} prises en charge :
                    </h2>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {modelInfo.engines.map((eng, idx) => (
                            <span
                                key={idx}
                                style={{
                                    backgroundColor: '#f1f5f9',
                                    color: '#334155',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    border: '1px solid #cbd5e1'
                                }}
                            >
                                ⚙️ {eng}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Popular Maintenance Packs for this model */}
                {modelKits.length > 0 && (
                    <div style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <h2 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.6rem)', fontWeight: '800', color: '#0f172a' }}>
                                Packs & Révisions Recommandés pour {modelInfo.name}
                            </h2>
                            <Link to="/kits" style={{ color: 'var(--ford-blue)', fontWeight: '700', textDecoration: 'none' }}>
                                Voir tous les packs →
                            </Link>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
                            {modelKits.map(kit => (
                                <div key={kit.id} style={{
                                    backgroundColor: 'white',
                                    borderRadius: '16px',
                                    padding: '1.5rem',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#16a34a' }}>{kit.discount} REMISE</span>
                                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{kit.engine}</span>
                                        </div>
                                        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.75rem' }}>
                                            {kit.name}
                                        </h3>
                                        <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--ford-blue)', marginBottom: '1rem' }}>
                                            {kit.bundlePrice.toLocaleString()} DA
                                        </div>
                                    </div>
                                    <Link
                                        to="/kits"
                                        style={{
                                            padding: '0.65rem',
                                            textAlign: 'center',
                                            backgroundColor: '#f1f5f9',
                                            color: 'var(--ford-blue)',
                                            fontWeight: '700',
                                            borderRadius: '8px',
                                            textDecoration: 'none',
                                            border: '1px solid #cbd5e1'
                                        }}
                                    >
                                        Consulter le Pack
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Common Diagnostic Issues / Pannes fréquentes */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    padding: 'clamp(1rem, 3.5vw, 2rem)',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    marginBottom: '3rem'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                                Guide Pannes & Diagnostics Rapides ({modelInfo.name})
                            </h2>
                            <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                                Les problèmes récurrents constatés par les mécaniciens de la Soummam et leurs solutions.
                            </p>
                        </div>
                        <Link
                            to="/diagnostic"
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: 'rgba(0, 52, 120, 0.08)',
                                color: 'var(--ford-blue)',
                                borderRadius: '8px',
                                fontWeight: '700',
                                textDecoration: 'none',
                                fontSize: '0.9rem'
                            }}
                        >
                            Ouvrir le Diagnostic Complet ⚡
                        </Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.25rem' }}>
                        {modelInfo.knownIssues.map((item, idx) => (
                            <div key={idx} style={{
                                padding: '1.25rem',
                                backgroundColor: '#f8fafc',
                                borderRadius: '12px',
                                borderLeft: '4px solid var(--ford-blue)'
                            }}>
                                <div style={{ fontWeight: '700', color: '#dc2626', fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                                    ⚠️ {item.issue}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>
                                    <strong>Cause :</strong> {item.cause}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#166534', fontWeight: '600' }}>
                                    ✓ <strong>Solution :</strong> {item.fix}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Custom VIN Request banner */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    borderRadius: '20px',
                    padding: '2.5rem',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.5rem'
                }}>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                            Besoin d'une pièce spécifique pour votre {modelInfo.name} ?
                        </h3>
                        <p style={{ margin: 0, opacity: 0.85, fontSize: '0.95rem' }}>
                            Transmettez votre numéro de châssis ou photo de carte grise pour un chiffrage immédiat par Krimo.
                        </p>
                    </div>

                    <Link
                        to="/vin-request"
                        style={{
                            backgroundColor: 'var(--ford-blue)',
                            color: 'white',
                            padding: '0.85rem 1.75rem',
                            borderRadius: '10px',
                            fontWeight: '700',
                            textDecoration: 'none',
                            boxShadow: '0 4px 15px rgba(0, 52, 120, 0.4)'
                        }}
                    >
                        Demander un Devis VIN →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ModelHubPage;
