import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const YMMLookup = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [year, setYear] = useState('');
    const [model, setModel] = useState('');
    const [fuelType, setFuelType] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (year) params.append('year', year);
        if (model) params.append('model', model);
        if (fuelType) params.append('fuelType', fuelType);

        if (params.toString()) {
            navigate(`/catalog?${params.toString()}`);
        }
    };

    const [years] = useState(Array.from({ length: 26 }, (_, i) => 2025 - i));
    const [carModels, setCarModels] = useState([]);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                // We use dynamic import for axios or fetch here since it might not be imported
                // But axios is standard here. Assuming global or need to import?
                // YMMLookup imports: React, translation, useNavigate. Need to add axios/useEffect.
                const res = await fetch('/api/carmodels');
                const data = await res.json();
                setCarModels(data.map(m => m.name));
            } catch (err) {
                console.error("Failed to load models", err);
            }
        };
        fetchModels();
    }, []);

    return (
        <div className="ymm-lookup" style={{
            background: 'linear-gradient(135deg, var(--ford-blue) 0%, #002a60 100%)',
            padding: '2.5rem',
            borderRadius: '16px',
            color: 'white',
            marginTop: '2rem',
            boxShadow: '0 10px 25px -5px rgba(0, 52, 120, 0.4)'
        }}>
            <h2 style={{
                marginBottom: '1.5rem',
                fontFamily: 'var(--font-logo)',
                fontSize: '2.5rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
                {t('ymm.title', 'Find Parts for your Ford')}
            </h2>
            <form onSubmit={handleSubmit} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                alignItems: 'end'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '500', opacity: 0.9, marginLeft: '4px' }}>
                        {t('ymm.year', 'Year')}
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={year}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || /^\d+$/.test(val)) {
                                setYear(val);
                            }
                        }}
                        placeholder="e.g. 2015"
                        min="1990"
                        max="2026"
                        style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            flex: 1,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            flex: 1,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.2s'
                        }}
                        onFocus={(e) => {
                            e.target.style.backgroundColor = 'white';
                            e.target.style.color = '#1f2937';
                        }}
                        onBlur={(e) => {
                            if (!e.target.value) {
                                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.color = 'white';
                            }
                        }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '500', opacity: 0.9, marginLeft: '4px' }}>
                        {t('ymm.model', 'Model')}
                    </label>
                    <div style={{ position: 'relative' }}>
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                appearance: 'none', // Hide default arrow
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <option value="" style={{ backgroundColor: '#002a60', color: 'white' }}>{t('ymm.selectModel', 'Select Model')}</option>
                            {carModels.map(m => (
                                <option key={m} value={m} style={{ backgroundColor: '#002a60', color: 'white' }}>{m}</option>
                            ))}
                        </select>
                        <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.8 }}>
                            ▼
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '500', opacity: 0.9, marginLeft: '4px' }}>
                        {t('ymm.fuelType', 'Fuel Type')}
                    </label>
                    <div style={{ position: 'relative' }}>
                        <select
                            value={fuelType}
                            onChange={(e) => setFuelType(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                appearance: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <option value="" style={{ backgroundColor: '#002a60', color: 'white' }}>{t('ymm.selectFuelType', 'Select Fuel Type')}</option>
                            <option value="Essence" style={{ backgroundColor: '#002a60', color: 'white' }}>Essence</option>
                            <option value="Diesel" style={{ backgroundColor: '#002a60', color: 'white' }}>Diesel</option>
                        </select>
                        <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.8 }}>
                            ▼
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn"
                    style={{
                        backgroundColor: 'white',
                        color: 'var(--ford-blue)',
                        padding: '1rem',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        border: '1px solid transparent', // Match input border width
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        marginTop: 'auto'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 8px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                    }}
                >
                    {t('ymm.search', 'Search')}
                </button>
            </form>
        </div>
    );
};

export default YMMLookup;
