import React from 'react';
import { useTranslation } from 'react-i18next';

const FeaturesSection = () => {
    const { t } = useTranslation();

    const features = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ford-blue)' }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="M9 12l2 2 4-4"></path>
                </svg>
            ),
            title: t('features.genuine.title', 'Genuine Parts'),
            description: t('features.genuine.desc', '100% authentic Ford parts guaranteed.')
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ford-blue)' }}>
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
            ),
            title: t('features.delivery.title', 'Fast Delivery'),
            description: t('features.delivery.desc', 'Quick shipping to all 58 wilayas.')
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ford-blue)' }}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
            ),
            title: t('features.support.title', 'Expert Support'),
            description: t('features.support.desc', 'Professional assistance for your car.')
        }
    ];

    return (
        <section style={{ backgroundColor: '#f8f9fa', padding: '4rem 1rem' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '3rem',
                    color: 'var(--text-dark, #333)',
                    fontSize: '2rem'
                }}>
                    {t('features.heading', 'Why Choose Krimo Store?')}
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem',
                    textAlign: 'center'
                }}>
                    {features.map((feature, index) => (
                        <div key={index}
                            className={`animate-on-scroll delay-${(index + 1) * 100}`}
                            style={{
                                padding: '2rem',
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                transition: 'transform 0.3s ease',
                                border: '1px solid transparent'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                            }}
                        >
                            <div style={{ marginBottom: '1.5rem' }}>
                                {feature.icon}
                            </div>
                            <h3 style={{
                                fontSize: '1.25rem',
                                marginBottom: '1rem',
                                color: 'var(--text-dark, #333)',
                                fontWeight: '600'
                            }}>
                                {feature.title}
                            </h3>
                            <p style={{
                                color: '#666',
                                lineHeight: '1.6'
                            }}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
