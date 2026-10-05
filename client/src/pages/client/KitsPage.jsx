import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useGarage } from '../../context/GarageContext';
import { getWhatsAppLink } from '../../utils/whatsapp';

export const MAINTENANCE_KITS = [
    {
        id: 'kit-vidange-focus',
        name: 'Pack Vidange & Filtration Complète Ford Focus TDCi',
        category: 'Filtration & Huile',
        model: 'Focus',
        years: '2011 - 2020',
        engine: '1.5 / 1.6 TDCi',
        originalPrice: 19500,
        bundlePrice: 16800,
        discount: '-14%',
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
        contents: [
            'Bidon 5L Huile Ford Castrol Magnatec Professional 5W30',
            'Filtre à Huile Motorcraft Origine',
            'Filtre à Air Moteur Haute Filtration',
            'Filtre à Carburant (Gazole) avec purgeur',
            'Filtre Habitacle / Anti-Pollen Charbon Actif'
        ],
        oemRef: 'KIT-MOT-FOCUS-TDCi',
        stock: 'En Stock à la Soummam'
    },
    {
        id: 'kit-vidange-fiesta',
        name: 'Pack Révision Périodique Ford Fiesta (1.4 TDCi / 1.25)',
        category: 'Filtration & Huile',
        model: 'Fiesta',
        years: '2008 - 2018',
        engine: '1.4 TDCi / 1.25 Essence',
        originalPrice: 15200,
        bundlePrice: 13200,
        discount: '-13%',
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
        contents: [
            'Bidon 4L Huile Ford Formula F 5W30',
            'Filtre à Huile Origine Purflux/Motorcraft',
            'Filtre à Air Moteur',
            'Filtre à Carburant',
            'Joint de bouchon de vidange offert'
        ],
        oemRef: 'KIT-MOT-FIESTA-01',
        stock: 'En Stock'
    },
    {
        id: 'kit-freinage-focus',
        name: 'Pack Freinage Intégral Avant (Disques Ventilés + Plaquettes)',
        category: 'Freinage',
        model: 'Focus',
        years: '2012 - 2022',
        engine: 'Tous moteurs',
        originalPrice: 24000,
        bundlePrice: 20500,
        discount: '-15%',
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=600&q=80',
        contents: [
            'Jeu de 2 Disques de Frein Avant Ventilés (Diamètre 278mm ou 300mm)',
            'Jeu de 4 Plaquettes de Frein Avant Origine Motorcraft',
            'Témoins d\'usure et ressorts antibruit inclus'
        ],
        oemRef: 'KIT-BRK-FOCUS-FR',
        stock: 'En Stock'
    },
    {
        id: 'kit-distrib-ranger',
        name: 'Pack Distribution & Pompe à Eau Renforcé Ford Ranger 2.2 / 3.2 TDCi',
        category: 'Distribution & Moteur',
        model: 'Ranger',
        years: '2012 - 2023',
        engine: '2.2 / 3.2 TDCi Duratorq',
        originalPrice: 42000,
        bundlePrice: 36500,
        discount: '-13%',
        image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&q=80',
        contents: [
            'Kit Chaîne / Courroie de Distribution Haute Résistance',
            'Galet Tendeur Dynamique & Galets Enrouleurs',
            'Pompe à Eau Débit Renforcé avec Joint Métallique',
            'Kit Visserie Ford d\'Origine'
        ],
        oemRef: 'KIT-TIM-RANGER-HD',
        stock: 'En Stock (Dépôt Soummam)'
    },
    {
        id: 'kit-transit-pro',
        name: 'Pack Révision Grand Roulage Ford Transit Custom / V362',
        category: 'Filtration & Huile',
        model: 'Transit',
        years: '2014 - 2024',
        engine: '2.0 / 2.2 EcoBlue / TDCi',
        originalPrice: 28000,
        bundlePrice: 23900,
        discount: '-15%',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
        contents: [
            'Bidon 7L Huile Ford Castrol 0W30 EcoBlue Professional',
            'Filtre à Huile Heavy Duty',
            'Filtre à Carburant Séparateur d\'Eau Renforcé',
            'Filtre à Air Moteur Grand Volume',
            'Filtre Habitacle Anti-Allergène'
        ],
        oemRef: 'KIT-TRN-PRO-ECOBLUE',
        stock: 'En Stock'
    },
    {
        id: 'kit-allumage-ecoboost',
        name: 'Pack Allumage Iridium & Bobines Ford EcoBoost (Fiesta / Focus / EcoSport)',
        category: 'Allumage',
        model: 'EcoSport',
        years: '2013 - 2022',
        engine: '1.0 EcoBoost 100/125 ch',
        originalPrice: 18500,
        bundlePrice: 15900,
        discount: '-14%',
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
        contents: [
            'Jeu de 3 ou 4 Bougies Haute Performance Iridium Ford / Bosch',
            'Bobines d\'allumage renforcées haute tension',
            'Optimisation consommation et élimination des ratés moteur'
        ],
        oemRef: 'KIT-IGN-ECOBOOST',
        stock: 'En Stock'
    }
];

const KitsPage = () => {
    const { t } = useTranslation();
    const { addToCart } = useCart();
    const { selectedVehicle } = useGarage();
    const [selectedModel, setSelectedModel] = useState('All');

    const filteredKits = MAINTENANCE_KITS.filter(kit => {
        if (selectedModel === 'All') return true;
        return kit.model.toLowerCase() === selectedModel.toLowerCase();
    });

    const handleAddKitToCart = (kit) => {
        addToCart({
            _id: kit.id,
            name: { en: kit.name, fr: kit.name, ar: kit.name },
            price: kit.bundlePrice,
            images: [kit.image],
            oemNumber: kit.oemRef,
            category: kit.category,
            stock: 10
        }, 1);
        toast.success(t('kits.addedSuccess', 'Pack ajouté au panier avec la remise appliquée !'));
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '90vh', padding: 'clamp(1.5rem, 4vw, 3.5rem) 1rem' }}>
            <div className="container">
                {/* Header Banner */}
                <div style={{
                    background: 'linear-gradient(135deg, var(--ford-blue) 0%, #001e47 100%)',
                    borderRadius: '24px',
                    padding: 'clamp(1.75rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2rem)',
                    color: 'white',
                    marginBottom: '3rem',
                    textAlign: 'center',
                    boxShadow: '0 20px 40px -10px rgba(0, 52, 120, 0.35)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.4rem 1.25rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '9999px',
                        fontSize: 'clamp(0.75rem, 2.2vw, 0.875rem)',
                        fontWeight: '700',
                        marginBottom: '1rem',
                        backdropFilter: 'blur(4px)'
                    }}>
                        🛠️ ÉCONOMISEZ JUSQU'À 15% SUR LES PACKS COMPLETS
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(1.75rem, 5vw, 2.8rem)',
                        fontFamily: 'var(--font-logo)',
                        marginBottom: '0.75rem',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                        Kits d'Entretien & Révision Ford
                    </h1>
                    <p style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.15rem)', maxWidth: '700px', margin: '0 auto', opacity: 0.9, lineHeight: '1.6' }}>
                        Regroupez vos pièces d'entretien périodique en un seul clic : filtration, vidange, freinage et distribution. 100% compatibles et garanties par Krimo (Soummam).
                    </p>
                </div>

                {/* Model filter tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem' }}>
                    {['All', 'Focus', 'Fiesta', 'Ranger', 'Transit', 'EcoSport'].map((mod) => (
                        <button
                            key={mod}
                            type="button"
                            onClick={() => setSelectedModel(mod)}
                            style={{
                                padding: '0.6rem 1.4rem',
                                borderRadius: '9999px',
                                border: selectedModel === mod ? '2px solid var(--ford-blue)' : '1px solid #cbd5e1',
                                backgroundColor: selectedModel === mod ? 'var(--ford-blue)' : 'white',
                                color: selectedModel === mod ? 'white' : '#475569',
                                fontWeight: '700',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: selectedModel === mod ? '0 4px 12px rgba(0, 52, 120, 0.25)' : 'none'
                            }}
                        >
                            {mod === 'All' ? 'Tous les Packs' : `Ford ${mod}`}
                        </button>
                    ))}
                </div>

                {/* Kits Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '2rem' }}>
                    {filteredKits.map((kit) => {
                        const isCarCompatible = selectedVehicle
                            ? kit.model.toLowerCase() === selectedVehicle.model?.toLowerCase()
                            : null;

                        return (
                            <motion.div
                                key={kit.id}
                                whileHover={{ y: -6 }}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    position: 'relative'
                                }}
                            >
                                <div>
                                    {/* Image & Discount Badge */}
                                    <div style={{ position: 'relative', height: '220px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                                        <img
                                            src={kit.image}
                                            alt={kit.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: '12px',
                                            left: '12px',
                                            backgroundColor: '#dc2626',
                                            color: 'white',
                                            padding: '0.35rem 0.8rem',
                                            borderRadius: '8px',
                                            fontWeight: '800',
                                            fontSize: '0.85rem',
                                            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)'
                                        }}>
                                            {kit.discount}
                                        </div>

                                        <div style={{
                                            position: 'absolute',
                                            bottom: '12px',
                                            right: '12px',
                                            backgroundColor: 'rgba(0, 0, 0, 0.75)',
                                            color: 'white',
                                            padding: '0.3rem 0.75rem',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600'
                                        }}>
                                            Ford {kit.model} ({kit.years})
                                        </div>
                                    </div>

                                    {/* Content Body */}
                                    <div style={{ padding: '1.75rem' }}>
                                        {/* Garage Compatibility Pill */}
                                        {selectedVehicle && (
                                            <div style={{
                                                padding: '0.35rem 0.75rem',
                                                borderRadius: '6px',
                                                fontSize: '0.8rem',
                                                fontWeight: '700',
                                                marginBottom: '0.75rem',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                backgroundColor: isCarCompatible ? '#dcfce7' : '#fee2e2',
                                                color: isCarCompatible ? '#166534' : '#991b1b'
                                            }}>
                                                <span>{isCarCompatible ? '✓' : '⚠'}</span>
                                                <span>
                                                    {isCarCompatible
                                                        ? `Compatible avec votre ${selectedVehicle.model}`
                                                        : `Conçu pour ${kit.model} (Votre véhicule : ${selectedVehicle.model})`}
                                                </span>
                                            </div>
                                        )}

                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                                            {kit.name}
                                        </h3>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                                            Motorisation recommandée : <strong>{kit.engine}</strong>
                                        </p>

                                        {/* Included Items List */}
                                        <div style={{
                                            backgroundColor: '#f8fafc',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '700', color: '#475569', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                                                Contenu du Pack :
                                            </div>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                {kit.contents.map((item, idx) => (
                                                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                                                        <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Pricing */}
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                            <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--ford-blue)' }}>
                                                {kit.bundlePrice.toLocaleString()} DA
                                            </div>
                                            <div style={{ fontSize: '1.05rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                                {kit.originalPrice.toLocaleString()} DA
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Footer */}
                                <div style={{ padding: '0 1.75rem 1.75rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => handleAddKitToCart(kit)}
                                        style={{
                                            width: '100%',
                                            padding: '0.85rem',
                                            backgroundColor: 'var(--ford-blue)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '10px',
                                            fontSize: '1rem',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 12px rgba(0, 52, 120, 0.25)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        🛒 Ajouter le Pack au Panier
                                    </button>

                                    <a
                                        href={getWhatsAppLink(`Salam Krimo ! Je souhaite réserver le ${kit.name} (Réf: ${kit.oemRef}) au prix pack de ${kit.bundlePrice} DA. Est-il disponible ?`)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            width: '100%',
                                            padding: '0.7rem',
                                            backgroundColor: '#f0fdf4',
                                            color: '#16a34a',
                                            border: '1px solid #bbf7d0',
                                            borderRadius: '10px',
                                            fontSize: '0.9rem',
                                            fontWeight: '700',
                                            textDecoration: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <span>Commander par WhatsApp</span>
                                        <span>💬</span>
                                    </a>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default KitsPage;
