import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'fr', label: 'Français', flag: '🇫🇷' },
        { code: 'ar', label: 'العربية', flag: '🇩🇿' }
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

    return (
        <div className="language-switcher" ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '20px',
                    border: '1px solid currentColor',
                    backgroundColor: 'transparent',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem',
                    transition: 'opacity 0.2s'
                }}
            >
                <span>{currentLang.flag}</span>
                <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{currentLang.code}</span>
                <span style={{ fontSize: '0.7em', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0, // Align to right (works nicely for both usually, verify RTL)
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    padding: '0.5rem',
                    minWidth: '140px',
                    zIndex: 1000,
                    color: 'var(--text-dark)'
                }}>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                width: '100%',
                                padding: '0.6rem',
                                border: 'none',
                                background: i18n.language === lang.code ? '#f0f0f5' : 'transparent',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                color: 'var(--text-dark)',
                                fontWeight: i18n.language === lang.code ? '600' : '400'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                            onMouseLeave={(e) => e.target.style.background = i18n.language === lang.code ? '#f0f0f5' : 'transparent'}
                        >
                            <span style={{ fontSize: '1.2rem' }}>{lang.flag}</span>
                            <span>{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
