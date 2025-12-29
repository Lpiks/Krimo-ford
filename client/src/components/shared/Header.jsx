import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
    const { t } = useTranslation();

    return (
        <header style={{ backgroundColor: 'var(--white)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                <Link to="/" className="logo-text">
                    Krimoford
                </Link>

                <nav>
                    <ul style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <li><Link to="/">{t('nav.home', 'Home')}</Link></li>
                        <li><Link to="/catalog">{t('nav.catalog', 'Catalog')}</Link></li>
                        <li><Link to="/cart">{t('nav.cart', 'Cart')}</Link></li>
                        <li><LanguageSwitcher /></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
