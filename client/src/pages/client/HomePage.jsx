import React from 'react';
import { useTranslation } from 'react-i18next';
import YMMLookup from '../../components/shared/YMMLookup';
import { Link } from 'react-router-dom';

import FeaturesSection from '../../components/home/FeaturesSection';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const HomePage = () => {
    const { t } = useTranslation();
    useScrollAnimation();

    return (
        <div>
            {/* Hero Section */}
            <section style={{
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#111', // Fallback color
                padding: '6rem 1rem',
                textAlign: 'center',
                borderBottom: '4px solid var(--ford-blue)',
                color: 'white',
                minHeight: '600px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <div className="container">
                    <h1 className="animate-on-scroll" style={{
                        fontSize: '3.5rem',
                        marginBottom: '1rem',
                        color: 'white',
                        fontFamily: 'var(--font-logo)',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        {t('home.heroTitle', 'Genuine Ford Parts')}
                    </h1>
                    <p className="animate-on-scroll delay-100" style={{
                        fontSize: '1.5rem',
                        marginBottom: '3rem',
                        maxWidth: '700px',
                        margin: '0 auto 3rem auto',
                        fontWeight: '300',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}>
                        {t('home.heroSubtitle', 'The highest quality parts for your vehicle, delivered directly to you in Algiers.')}
                    </p>

                    <div className="animate-on-scroll delay-200" style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <YMMLookup />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <FeaturesSection />

            {/* Featured Parts / Categories */}
            <section className="container" style={{ padding: '4rem 1rem' }}>
                <h2 className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--ford-blue)' }}>{t('home.featured', 'Popular Categories')}</h2>
                <div className="animate-on-scroll delay-100" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                    {['Brakes', 'Filters', 'Suspension', 'Engine'].map((cat) => (
                        <Link to={`/catalog?category=${cat}`} key={cat} style={{
                            display: 'block',
                            padding: '2rem',
                            backgroundColor: 'white',
                            textAlign: 'center',
                            borderRadius: '8px',
                            boxShadow: 'var(--shadow-sm)',
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'transform 0.2s',
                            border: '1px solid var(--gray-200)'
                        }}>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--ford-blue)' }}>{cat}</h3>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
