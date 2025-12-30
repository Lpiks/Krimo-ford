import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = ({ direction = 'down', variant = 'light' }) => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'fr', label: 'Français' },
        { code: 'ar', label: 'العربية' }
    ];

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lng;
        setIsOpen(false);
    };

    useEffect(() => {
        const currentLng = i18n.language;
        document.documentElement.dir = currentLng === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = currentLng;
    }, [i18n.language]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isDark = variant === 'dark';

    return (
        <div className="language-switcher" ref={dropdownRef} style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    padding: '0.5rem 0.8rem',
                    borderRadius: '8px',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'white',
                    color: isDark ? 'white' : '#374151',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                    width: '100%'
                }}
                onMouseEnter={e => {
                    if (isDark) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    else e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={e => {
                    if (isDark) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    else e.currentTarget.style.backgroundColor = 'white';
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: isDark ? '#374151' : '#e5e7eb',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.6rem', fontWeight: 'bold'
                    }}>
                        {currentLang.code.toUpperCase()}
                    </span>
                    <span style={{ fontWeight: 500 }}>{currentLang.label}</span>
                </div>
                <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{
                        transform: isOpen ? (direction === 'up' ? 'rotate(0deg)' : 'rotate(180deg)') : (direction === 'up' ? 'rotate(180deg)' : 'rotate(0deg)'),
                        transition: 'transform 0.2s',
                        opacity: 0.7
                    }}
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    bottom: direction === 'up' ? '120%' : 'auto',
                    top: direction === 'up' ? 'auto' : '120%',
                    left: 0,
                    right: 0,
                    backgroundColor: isDark ? '#1f2937' : 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
                    padding: '0.4rem',
                    zIndex: 9999,
                    color: isDark ? 'white' : '#374151',
                    marginBottom: direction === 'up' ? '0.5rem' : 0,
                    marginTop: direction === 'up' ? 0 : '0.5rem'
                }}>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                width: '100%',
                                padding: '0.6rem',
                                border: 'none',
                                background: i18n.language === lang.code
                                    ? (isDark ? 'var(--ford-blue)' : '#eff6ff')
                                    : 'transparent',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                color: i18n.language === lang.code
                                    ? (isDark ? 'white' : 'var(--ford-blue)')
                                    : (isDark ? '#e5e7eb' : '#374151'),
                                fontWeight: i18n.language === lang.code ? '600' : '400',
                                transition: 'all 0.1s'
                            }}
                            onMouseEnter={(e) => {
                                if (i18n.language !== lang.code) {
                                    e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (i18n.language !== lang.code) {
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', opacity: 0.7 }}>{lang.code}</span>
                            <span>{lang.label}</span>
                            {i18n.language === lang.code && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
