import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGarage } from '../../context/GarageContext';

const GarageBar = () => {
    const { t } = useTranslation();
    const { selectedVehicle, openGarageModal, clearVehicle } = useGarage();

    return (
        <div style={{
            backgroundColor: selectedVehicle ? '#0f2744' : '#1e293b',
            color: 'white',
            fontSize: 'clamp(0.75rem, 2.2vw, 0.85rem)',
            padding: '0.4rem 0.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'background-color 0.3s'
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>🚗</span>
                    {selectedVehicle ? (
                        <span>
                            <strong style={{ color: '#60a5fa' }}>{t('garage.activeVehicle', 'Véhicule actif :')}</strong>{' '}
                            Ford {selectedVehicle.model} {selectedVehicle.year ? `(${selectedVehicle.year})` : ''} —{' '}
                            <span style={{ opacity: 0.85 }}>{selectedVehicle.fuelType}</span>
                        </span>
                    ) : (
                        <span style={{ opacity: 0.9 }}>
                            {t('garage.noVehicleHint', "Trouvez les pièces exactes : enregistrez votre modèle Ford dans Mon Garage.")}
                        </span>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                        type="button"
                        onClick={openGarageModal}
                        style={{
                            backgroundColor: selectedVehicle ? 'rgba(255, 255, 255, 0.15)' : 'var(--ford-blue)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '6px',
                            padding: '0.25rem 0.75rem',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}
                    >
                        <span>⚙️</span>
                        <span>{selectedVehicle ? t('garage.change', 'Changer') : t('garage.choose', 'Choisir ma Ford')}</span>
                    </button>

                    {selectedVehicle && (
                        <button
                            type="button"
                            onClick={clearVehicle}
                            title={t('garage.clear', 'Effacer')}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#ef4444',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                padding: '0.2rem 0.4rem',
                                borderRadius: '4px'
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GarageBar;
