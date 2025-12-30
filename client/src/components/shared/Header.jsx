import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
    const { t } = useTranslation();
    const { cartItems } = useCart();
    const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const linkStyle = (path) => ({
        textDecoration: 'none',
        color: isActive(path) ? 'var(--ford-blue)' : '#4b5563',
        fontWeight: isActive(path) ? '700' : '500',
        padding: '0.5rem 1rem',
        borderRadius: '9999px',
        transition: 'all 0.2s ease',
        backgroundColor: isActive(path) ? 'rgba(0, 51, 153, 0.08)' : 'transparent',
        display: 'block'
    });

    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.01), 0 2px 4px -1px rgba(0, 0, 0, 0.01)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                <Link to="/" className="logo-text" style={{
                    textDecoration: 'none',
                    fontSize: '1.8rem',
                    color: 'var(--ford-blue)',
                    textShadow: '0 2px 4px rgba(0, 51, 153, 0.1)'
                }}>
                    Krimoford
                </Link>

                <nav>
                    <ul style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', margin: 0, padding: 0, listStyle: 'none' }}>
                        <li>
                            <Link
                                to="/"
                                style={linkStyle('/')}
                                onMouseEnter={(e) => {
                                    if (!isActive('/')) {
                                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                                        e.currentTarget.style.color = '#1f2937';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive('/')) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = '#4b5563';
                                    }
                                }}
                            >
                                {t('nav.home', 'Home')}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/catalog"
                                style={linkStyle('/catalog')}
                                onMouseEnter={(e) => {
                                    if (!isActive('/catalog')) {
                                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                                        e.currentTarget.style.color = '#1f2937';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive('/catalog')) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = '#4b5563';
                                    }
                                }}
                            >
                                {t('nav.catalog', 'Catalog')}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact"
                                style={linkStyle('/contact')}
                                onMouseEnter={(e) => {
                                    if (!isActive('/contact')) {
                                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                                        e.currentTarget.style.color = '#1f2937';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive('/contact')) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = '#4b5563';
                                    }
                                }}
                            >
                                {t('nav.contact', 'Contact')}
                            </Link>
                        </li>
                        <li style={{ marginLeft: '1rem' }}>
                            <Link to="/cart" style={{ display: 'flex', alignItems: 'center', color: '#374151', position: 'relative' }} aria-label={t('nav.cart', 'Cart')}>
                                <div style={{
                                    padding: '0.5rem',
                                    borderRadius: '50%',
                                    transition: 'background-color 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m15 11-1 9"></path>
                                        <path d="m19 11-4-7"></path>
                                        <path d="M2 11h20"></path>
                                        <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8c.9 0 1.8-.7 2-1.6l1.7-7.4"></path>
                                        <path d="m4.5 11 .1 9"></path>
                                        <path d="m5 11 4-7"></path>
                                        <path d="m9 11 1 9"></path>
                                    </svg>
                                </div>
                                {totalItems > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-2px',
                                        right: '-2px',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '18px',
                                        height: '18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.7rem',
                                        fontWeight: 'bold',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        border: '2px solid white'
                                    }}>
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        </li>
                        <li style={{ marginLeft: '0.5rem' }}><LanguageSwitcher /></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
