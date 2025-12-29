import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const YMMLookup = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [year, setYear] = useState('');
    const [model, setModel] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (year && model) {
            navigate(`/catalog?year=${year}&model=${model}`);
        }
    };

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
                    style={{ padding: '0.8rem', borderRadius: '4px', border: 'none', flex: 1 }}
                >
                    <option value="">{t('ymm.selectYear', 'Select Year')}</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                </select>
                <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    style={{ padding: '0.8rem', borderRadius: '4px', border: 'none', flex: 1 }}
                >
                    <option value="">{t('ymm.selectModel', 'Select Model')}</option>
                    <option value="Fiesta">Fiesta</option>
                    <option value="Focus">Focus</option>
                    <option value="Ranger">Ranger</option>
                </select>
                <button type="submit" className="btn" style={{ backgroundColor: 'white', color: 'var(--ford-blue)' }}>
                    {t('ymm.search', 'Search')}
                </button>
            </form>
        </div>
    );
};

export default YMMLookup;
