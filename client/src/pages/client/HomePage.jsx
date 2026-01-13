import React from 'react';
import { useTranslation } from 'react-i18next';
import YMMLookup from '../../components/shared/YMMLookup';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import FeaturesSection from '../../components/home/FeaturesSection';

const HomePage = () => {
    const { t } = useTranslation();

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

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
                    <motion.h1
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        style={{
                            fontSize: '3.5rem',
                            marginBottom: '1rem',
                            color: 'white',
                            fontFamily: 'var(--font-logo)',
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}
                    >
                        {t('home.heroTitle', 'Genuine Ford Parts')}
                    </motion.h1>
                    <motion.p
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        style={{
                            fontSize: '1.5rem',
                            marginBottom: '3rem',
                            maxWidth: '700px',
                            margin: '0 auto 3rem auto',
                            fontWeight: '300',
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                        }}
                    >
                        {t('home.heroSubtitle', 'The highest quality parts for your vehicle, delivered directly to you in Algiers.')}
                    </motion.p>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        style={{ maxWidth: '900px', margin: '0 auto' }}
                    >
                        <YMMLookup />
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <FeaturesSection />

            {/* Featured Parts / Categories */}
            <section className="container" style={{ padding: '4rem 1rem' }}>
                <motion.h2
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--ford-blue)' }}
                >
                    {t('home.featured', 'Popular Categories')}
                </motion.h2>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}
                >
                    {['Brakes', 'Filters', 'Suspension', 'Engine'].map((cat) => (
                        <motion.div key={cat} variants={fadeInUp}>
                            <Link to={`/catalog?category=${cat}`} style={{
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
                        </motion.div>
                    ))}
                </motion.div>
            </section>
        </div>
    );
};

export default HomePage;
