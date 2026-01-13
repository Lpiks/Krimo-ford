import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const DiagnosticPage = () => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1); // 1: Category, 2: Symptom, 3: Result
    const [category, setCategory] = useState(null);
    const [result, setResult] = useState(null);

    // SVG Icons
    // SVG Icons
    const Icons = {
        Brakes: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /><path d="M12 2a2 2 0 0 0-2 2v2" /><path d="M12 22a2 2 0 0 0 2-2v-2" /><path d="M22 12a2 2 0 0 0-2-2h-2" /><path d="M2 12a2 2 0 0 0 2 2h2" /></svg>,
        Engine: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17v4" /><path d="M17 17v4" /><path d="M4 17h16" /><path d="M4 18l.75-2.25A2 2 0 0 1 6.64 14h10.72a2 2 0 0 1 1.9 1.75L20 18" /><path d="M5 8h14" /><path d="M6 14V8a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" /><path d="M10 7V5c0-1.1.9-2 2-2h0a2 2 0 0 1 2 2v2" /><path d="M12 11v3" /></svg>,
        Suspension: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4" /><path d="M16 2v4" /><rect x="4" y="6" width="16" height="4" rx="1" /><path d="M12 10v10" /><path d="M9 20h6" /><path d="M5 20h2" /><path d="M17 20h2" /></svg>,
        Electrical: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
        Transmission: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" /><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /><path d="M12 2v2" /><path d="M12 22v-2" /><path d="M2 12h2" /><path d="M22 12h-2" /></svg>,
        HVAC: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" /><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /><path d="M12 4v16" /><path d="M4 12h16" /></svg>,
        Exhaust: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h12l3 9" /><path d="M4 12l3-9" /><path d="M20 18h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-3" /><path d="M12 12v6" /><path d="M8 12v6" /></svg>,
        Maintenance: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg>
    };

    // Hardcoded Diagnostic Logic
    const diagnosticData = {
        'Brakes': {
            icon: Icons.Brakes,
            symptoms: [
                { id: 'sqeak', label: 'Squealing noise when braking', causedBy: 'Worn Brake Pads', part: 'Brake Pads', link: '/catalog?category=Brakes&keyword=Pads' },
                { id: 'grinding', label: 'Grinding noise (metal on metal)', causedBy: 'Worn Brake Rotors', part: 'Brake Rotors', link: '/catalog?category=Brakes&keyword=Rotors' },
                { id: 'soft', label: 'Brake pedal feels soft/spongy', causedBy: 'Air in lines or Master Cylinder', part: 'Master Cylinder', link: '/catalog?category=Brakes&keyword=Master%20Cylinder' },
                { id: 'vibrate', label: 'Steering wheel vibrates when braking', causedBy: 'Warped Rotors', part: 'Brake Rotors', link: '/catalog?category=Brakes&keyword=Rotors' }
            ]
        },
        'Engine': {
            icon: Icons.Engine,
            symptoms: [
                { id: 'start', label: 'Engine wont start (clicking sound)', causedBy: 'Dead Battery or Starter', part: 'Starter Motor', link: '/catalog?category=Engine&keyword=Starter' },
                { id: 'overheat', label: 'Engine overheating', causedBy: 'Faulty Thermostat or Radiator', part: 'Thermostat', link: '/catalog?category=Engine&keyword=Thermostat' },
                { id: 'power', label: 'Loss of power / acceleration', causedBy: 'Clogged Air Filter', part: 'Air Filter', link: '/catalog?category=Filters&keyword=Air' },
                { id: 'smoke', label: 'Blue smoke from exhaust', causedBy: 'Burning Oil (Piston Rings/Seals)', part: 'Engine Gasket Kit', link: '/catalog?category=Engine&keyword=Gasket' }
            ]
        },
        'Suspension': {
            icon: Icons.Suspension,
            symptoms: [
                { id: 'bumpy', label: 'Ride feels extra bumpy', causedBy: 'Worn Shock Absorbers', part: 'Shock Absorbers', link: '/catalog?category=Suspension&keyword=Shock' },
                { id: 'pull', label: 'Car pulls to one side', causedBy: 'Alignment or Control Arms', part: 'Control Arm', link: '/catalog?category=Suspension&keyword=Control%20Arm' },
                { id: 'clunk', label: 'Clunking noise over bumps', causedBy: 'Sway Bar Links', part: 'Stabilizer Link', link: '/catalog?category=Suspension&keyword=Link' }
            ]
        },
        'Electrical': {
            icon: Icons.Electrical,
            symptoms: [
                { id: 'dim', label: 'Headlights are dim', causedBy: 'Old Bulbs or Alternator', part: 'Headlight Bulb', link: '/catalog?category=Electrical&keyword=Bulb' },
                { id: 'battery', label: 'Battery keeps dying', causedBy: 'Faulty Alternator', part: 'Alternator', link: '/catalog?category=Electrical&keyword=Alternator' }
            ]
        },
        'Transmission': {
            icon: Icons.Transmission,
            symptoms: [
                { id: 'slip', label: 'Gears are slipping or hesitating', causedBy: 'Low Fluid or Worn Clutch', part: 'Clutch Kit', link: '/catalog?category=Transmission&keyword=Clutch' },
                { id: 'grind_gear', label: 'Grinding when shifting', causedBy: 'Worn Synchronizers or Clutch', part: 'Transmission Kit', link: '/catalog?category=Transmission&keyword=Transmission' }
            ]
        },
        'Cooling / HVAC': {
            icon: Icons.HVAC,
            symptoms: [
                { id: 'ac_warm', label: 'A/C blowing warm air', causedBy: 'Low Refrigerant or Compressor', part: 'A/C Compressor', link: '/catalog?category=AC&keyword=Compressor' },
                { id: 'no_heat', label: 'Heater not blowing hot', causedBy: 'Clogged Heater Core', part: 'Heater Core', link: '/catalog?category=AC&keyword=Heater' }
            ]
        },
        'Exhaust': {
            icon: Icons.Exhaust,
            symptoms: [
                { id: 'loud', label: 'Loud roaring noise from bottom', causedBy: 'Hole in Muffler', part: 'Muffler', link: '/catalog?category=Exhaust&keyword=Muffler' },
                { id: 'fumes', label: 'Smell of exhaust inside cabin', causedBy: 'Exhaust Leak', part: 'Exhaust Manifold', link: '/catalog?category=Exhaust&keyword=Manifold' }
            ]
        },
        'Maintenance': {
            icon: Icons.Maintenance,
            symptoms: [
                { id: 'oil_leak', label: 'Oil spots under car', causedBy: 'Worn Oil Filter / Gasket', part: 'Oil Filter', link: '/catalog?category=Filters&keyword=Oil' },
                { id: 'wipers', label: 'Streaky windshield', causedBy: 'Worn Wiper Blades', part: 'Wiper Blades', link: '/catalog?category=Body&keyword=Wiper' },
                { id: 'spark', label: 'Rough idle / Misfire', causedBy: 'Old Spark Plugs', part: 'Spark Plugs', link: '/catalog?category=Engine&keyword=Plug' }
            ]
        }
    };

    const handleCategorySelect = (cat) => {
        setCategory(cat);
        setStep(2);
    };

    const handleSymptomSelect = (symptom) => {
        setResult(symptom);
        setStep(3);
    };

    const reset = () => {
        setStep(1);
        setCategory(null);
        setResult(null);
    };

    const containerVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
        exit: { opacity: 0, x: 20, transition: { duration: 0.3 } }
    };

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ color: 'var(--ford-blue)', marginBottom: '0.5rem' }}>{t('diagnostic.title', 'Car Troubleshooter')}</h1>
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>{t('diagnostic.subtitle', 'Select a system to diagnose the issue')}</p>
            </div>

            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                padding: '2rem',
                minHeight: '400px'
            }}>
                <AnimatePresence mode="wait">
                    {/* STEP 1: Categories */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1f2937' }}>Select System</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
                                {Object.keys(diagnosticData).map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategorySelect(cat)}
                                        style={{
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '12px',
                                            padding: '2rem',
                                            backgroundColor: 'white',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '1rem'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--ford-blue)';
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = '#e5e7eb';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <div style={{ width: '3.5rem', height: '3.5rem', color: 'var(--ford-blue)' }}>
                                            {diagnosticData[cat].icon}
                                        </div>
                                        <span style={{ fontWeight: '600', color: '#374151' }}>{cat}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: Symptoms */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                                <button onClick={reset} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '1.5rem', padding: '0.5rem' }}>
                                    ←
                                </button>
                                <h2 style={{ flex: 1, textAlign: 'center', margin: 0, color: '#1f2937' }}>
                                    {t('diagnostic.symptomTitle', 'What problem are you experiencing?')}
                                </h2>
                                <div style={{ width: '40px' }}></div> {/* Spacer for centering */}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {diagnosticData[category].symptoms.map((symptom) => (
                                    <button
                                        key={symptom.id}
                                        onClick={() => handleSymptomSelect(symptom)}
                                        style={{
                                            padding: '1.2rem',
                                            borderRadius: '8px',
                                            border: '1px solid #e5e7eb',
                                            backgroundColor: 'white',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            fontSize: '1.1rem',
                                            color: '#374151',
                                            transition: 'all 0.2s',
                                            fontWeight: '500'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#f9fafb';
                                            e.currentTarget.style.borderColor = 'var(--ford-blue)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'white';
                                            e.currentTarget.style.borderColor = '#e5e7eb';
                                        }}
                                    >
                                        {symptom.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: Result */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            style={{ textAlign: 'center' }}
                        >
                            <h2 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>{t('diagnostic.resultTitle', 'Recommended Solution')}</h2>

                            <div style={{
                                margin: '2rem auto',
                                padding: '2rem',
                                backgroundColor: '#ecfdf5',
                                border: '1px solid #10b981',
                                borderRadius: '12px',
                                maxWidth: '500px'
                            }}>
                                <p style={{ color: '#065f46', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Possible Cause</p>
                                <h3 style={{ color: '#064e3b', fontSize: '1.5rem', marginBottom: '1.5rem' }}>{result.causedBy}</h3>

                                <p style={{ color: '#065f46', marginBottom: '1.5rem' }}>
                                    We recommend replacing the: <strong>{result.part}</strong>.
                                </p>

                                <Link to={result.link} className="btn btn-primary" style={{ display: 'inline-block', padding: '0.8rem 2rem', textDecoration: 'none' }}>
                                    {t('diagnostic.findParts', 'Find Parts')}
                                </Link>
                            </div>

                            <button onClick={reset} style={{
                                background: 'transparent',
                                border: '1px solid #d1d5db',
                                padding: '0.6rem 1.2rem',
                                borderRadius: '6px',
                                color: '#4b5563',
                                cursor: 'pointer',
                                marginTop: '1rem',
                                fontWeight: '500'
                            }}>
                                {t('diagnostic.restart', 'Start Over')}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DiagnosticPage;
