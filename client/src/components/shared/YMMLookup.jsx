import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const YMMLookup = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [year, setYear] = useState('');
    const [model, setModel] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (year) params.append('year', year);
        if (model) params.append('model', model);

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
            backgroundColor: 'var(--ford-blue)',
            padding: '2rem',
            borderRadius: '8px',
            color: 'white',
            marginTop: '2rem'
        }}>
            <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-logo)', fontSize: '2.5rem' }}>
                {t('ymm.title', 'Find Parts for your Ford')}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    style={{ padding: '0.8rem', borderRadius: '4px', border: 'none', flex: 1, minWidth: '150px' }}
                >
                    <option value="">{t('ymm.selectYear', 'Select Year')}</option>
                    {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
                <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    style={{ padding: '0.8rem', borderRadius: '4px', border: 'none', flex: 1, minWidth: '150px' }}
                >
                    <option value="">{t('ymm.selectModel', 'Select Model')}</option>
                    {carModels.map(m => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
                <button type="submit" className="btn" style={{ backgroundColor: 'white', color: 'var(--ford-blue)' }}>
                    {t('ymm.search', 'Search')}
                </button>
            </form>
        </div>
    );
};

export default YMMLookup;
