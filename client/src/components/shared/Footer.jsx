import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer style={{ backgroundColor: 'var(--ford-blue)', color: 'var(--white)', padding: '2rem 0', marginTop: 'auto' }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <p>&copy; {new Date().getFullYear()} Krimoford Auto Parts. {t('footer.rights', 'All rights reserved.')}</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--gray-200)' }}>
                    Soummam, Bab Ezzouar, Algiers
                </p>
            </div>
        </footer>
    );
};

export default Footer;
