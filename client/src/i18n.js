import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from './locales/en/translation.json';
import translationFR from './locales/fr/translation.json';
import translationAR from './locales/ar/translation.json';

const resources = {
    en: {
        translation: translationEN,
    },
    fr: {
        translation: translationFR,
    },
    ar: {
        translation: translationAR,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        supportedLngs: ['en', 'fr', 'ar'],
        fallbackLng: 'en',
        debug: true, // Enable debug to see what's happening
        // Options for language detector
        detection: {
            order: ['path', 'cookie', 'htmlTag', 'localStorage', 'subdomain'],
            caches: ['localStorage'],
        },
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
    });

export default i18n;
