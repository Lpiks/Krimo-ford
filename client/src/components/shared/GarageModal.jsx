import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useGarage } from '../../context/GarageContext';

const DEFAULT_MODELS = [
    "Fiesta", "Focus", "Mondeo", "Kuga", "Ranger", "Transit", "Transit Custom",
    "EcoSport", "Ka", "C-Max", "B-Max", "S-Max", "Galaxy", "Fusion", "Taurus", "Mustang", "Edge"
];

const YEARS = Array.from({ length: 26 }, (_, i) => 2025 - i);

const GarageModal = () => {
    const { t, i18n } = useTranslation();
    const { selectedVehicle, selectVehicle, clearVehicle, isGarageModalOpen, closeGarageModal } = useGarage();

    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [fuelType, setFuelType] = useState('Diesel');
    const [availableModels, setAvailableModels] = useState(DEFAULT_MODELS);

    useEffect(() => {
        if (selectedVehicle) {
            setModel(selectedVehicle.model || '');
            setYear(selectedVehicle.year || '');
            setFuelType(selectedVehicle.fuelType || 'Diesel');
        } else {
            setModel('');
            setYear('');
            setFuelType('Diesel');
        }
    }, [selectedVehicle, isGarageModalOpen]);

    useEffect(() => {
        // Fetch dynamically from /api/carmodels if server is up, fallback to DEFAULT_MODELS
        fetch('/api/carmodels')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setAvailableModels(data.map(m => m.name));
                }
            })
            .catch(() => {});
    }, []);

    if (!isGarageModalOpen) return null;

    const handleSave = (e) => {
        e.preventDefault();
        if (!model) return;
        selectVehicle({
            make: 'Ford',
            model,
            year: year ? Number(year) : null,
            fuelType
        });
        closeGarageModal();
    };

    const handleClear = () => {
        clearVehicle();
        closeGarageModal();
    };

    return (
        <AnimatePresence>
            <div style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(6px)'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '20px',
                        width: '100%',
                        maxWidth: '520px',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 52, 120, 0.35)',
                        border: '1px solid rgba(0, 52, 120, 0.1)'
                    }}
                >
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, var(--ford-blue) 0%, #001f4d 100%)',
                        color: 'white',
                        padding: 'clamp(1rem, 3.5vw, 1.75rem)',
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.1 2 11.5 2 12v4c0 .6.4 1 1 1h2" />
                                    <circle cx="7" cy="17" r="2" />
                                    <path d="M9 17h6" />
                                    <circle cx="17" cy="17" r="2" />
                                </svg>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', margin: 0, letterSpacing: '-0.02em' }}>
                                    {t('garage.modalTitle', 'Mon Garage Ford')}
                                </h3>
                                <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.85 }}>
                                    {t('garage.modalSubtitle', 'Filtrez automatiquement toutes les pièces compatibles avec votre véhicule')}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={closeGarageModal}
                            style={{
                                position: 'absolute',
                                top: '1.25rem',
                                right: i18n.dir() === 'rtl' ? 'auto' : '1.25rem',
                                left: i18n.dir() === 'rtl' ? '1.25rem' : 'auto',
                                background: 'rgba(255, 255, 255, 0.15)',
                                border: 'none',
                                color: 'white',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                transition: 'background 0.2s'
                            }}
                        >
                            &times;
                        </button>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSave} style={{ padding: 'clamp(1rem, 4vw, 2rem)' }}>
                        {selectedVehicle && (
                            <div style={{
                                padding: '0.85rem 1.25rem',
                                backgroundColor: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                borderRadius: '12px',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '0.5rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontSize: '0.9rem', fontWeight: '600' }}>
                                    <span>✓</span>
                                    <span>
                                        {t('garage.current', 'Véhicule actif :')} Ford {selectedVehicle.model} {selectedVehicle.year || ''} ({selectedVehicle.fuelType})
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#dc2626',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        padding: '0.25rem 0.5rem'
                                    }}
                                >
                                    {t('garage.remove', 'Retirer')}
                                </button>
                            </div>
                        )}

                        {/* Model */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                {t('garage.modelLabel', 'Modèle Ford')} <span style={{ color: '#dc2626' }}>*</span>
                            </label>
                            <select
                                required
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 1rem',
                                    borderRadius: '10px',
                                    border: '1px solid #d1d5db',
                                    backgroundColor: '#f9fafb',
                                    fontSize: '0.95rem',
                                    color: '#111827',
                                    outline: 'none'
                                }}
                            >
                                <option value="">{t('garage.selectModel', '-- Sélectionnez votre modèle --')}</option>
                                {availableModels.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>

                        {/* Year */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                {t('garage.yearLabel', 'Année de fabrication')}
                            </label>
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 1rem',
                                    borderRadius: '10px',
                                    border: '1px solid #d1d5db',
                                    backgroundColor: '#f9fafb',
                                    fontSize: '0.95rem',
                                    color: '#111827',
                                    outline: 'none'
                                }}
                            >
                                <option value="">{t('garage.allYears', 'Toutes les années')}</option>
                                {YEARS.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        {/* Fuel / Engine */}
                        <div style={{ marginBottom: '1.75rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                {t('garage.fuelLabel', 'Motorisation')}
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '0.75rem' }}>
                                {['Diesel', 'Essence'].map((f) => (
                                    <button
                                        key={f}
                                        type="button"
                                        onClick={() => setFuelType(f)}
                                        style={{
                                            padding: '0.75rem',
                                            borderRadius: '10px',
                                            border: fuelType === f ? '2px solid var(--ford-blue)' : '1px solid #e5e7eb',
                                            backgroundColor: fuelType === f ? 'rgba(0, 52, 120, 0.08)' : '#ffffff',
                                            color: fuelType === f ? 'var(--ford-blue)' : '#4b5563',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {f === 'Diesel' ? '⛽ Diesel (TDCi / EcoBlue)' : '⚡ Essence (EcoBoost / Duratec)'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                onClick={closeGarageModal}
                                style={{
                                    padding: '0.75rem 1.25rem',
                                    borderRadius: '10px',
                                    border: '1px solid #d1d5db',
                                    backgroundColor: 'white',
                                    color: '#4b5563',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                {t('common.cancel', 'Annuler')}
                            </button>
                            <button
                                type="submit"
                                disabled={!model}
                                style={{
                                    padding: '0.75rem 1.75rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    backgroundColor: model ? 'var(--ford-blue)' : '#9ca3af',
                                    color: 'white',
                                    fontWeight: '700',
                                    cursor: model ? 'pointer' : 'not-allowed',
                                    boxShadow: model ? '0 4px 12px rgba(0, 52, 120, 0.3)' : 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {t('garage.apply', 'Valider mon véhicule')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default GarageModal;
