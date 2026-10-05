import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import { useGarage } from '../../context/GarageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { AnimatePresence, motion } from 'framer-motion';
import { getWhatsAppLink } from '../../utils/whatsapp';

// Catalog dataset for instant live search (works immediately offline or online)
const QUICK_SEARCH_PARTS = [
    {
        id: 'sample-p1',
        name: 'Plaquettes de Frein Avant Motorcraft Ford Focus / C-Max',
        oem: '1807044',
        category: 'Freinage',
        price: 7200,
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=200&q=80',
        models: ['Focus', 'C-Max']
    },
    {
        id: 'sample-p2',
        name: 'Filtre à Carburant (Gazole) TDCi avec Capteur d\'Eau',
        oem: '1781211',
        category: 'Filtration',
        price: 4800,
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=200&q=80',
        models: ['Fiesta', 'Focus']
    },
    {
        id: 'sample-p3',
        name: 'Kit Courroie de Distribution + Galet Tendeur Fiesta TDCi',
        oem: '1753584',
        category: 'Distribution',
        price: 18500,
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=200&q=80',
        models: ['Fiesta', 'Focus']
    },
    {
        id: 'sample-p4',
        name: 'Amortisseur Avant à Gaz Heavy Duty Ford Ranger 4x4',
        oem: 'EB3C-18045-A',
        category: 'Suspension',
        price: 16200,
        image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=200&q=80',
        models: ['Ranger']
    },
    {
        id: 'sample-p5',
        name: 'Vanne EGR Électrique avec Refroidisseur Ford Transit 2.2 TDCi',
        oem: 'BK2Q-9D475-CB',
        category: 'Moteur',
        price: 34500,
        image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=200&q=80',
        models: ['Transit']
    },
    {
        id: 'sample-p6',
        name: 'Jeu de Bougies d\'Allumage Iridium Haute Performance EcoBoost',
        oem: '1787829',
        category: 'Allumage',
        price: 6400,
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=200&q=80',
        models: ['Focus', 'EcoSport']
    }
];

const Header = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n?.language === 'ar';
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems } = useCart();
    const { selectedVehicle, openGarageModal } = useGarage();
    const totalItems = cartItems?.reduce((acc, item) => acc + (item.qty || 1), 0) || 0;
    // Mobile Drawer state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Auto-close mobile drawer on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Prevent background scrolling when mobile drawer is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    // Live search state
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    // Handle instant live search filtering
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const q = searchQuery.toLowerCase().trim();
        const matches = QUICK_SEARCH_PARTS.filter(part => {
            const matchName = part.name.toLowerCase().includes(q);
            const matchOem = part.oem.toLowerCase().includes(q);
            const matchCat = part.category.toLowerCase().includes(q);
            const matchModel = part.models.some(m => m.toLowerCase().includes(q));
            return matchName || matchOem || matchCat || matchModel;
        });

        setSearchResults(matches);
    }, [searchQuery]);

    // Keyboard shortcut (Ctrl + K or /) to focus search
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT')) {
                e.preventDefault();
                inputRef.current?.focus();
                setIsSearchOpen(true);
            } else if (e.key === 'Escape') {
                setIsSearchOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Dismiss search dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearchOpen(false);
            navigate(`/catalog?keyword=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleSelectProduct = (productId) => {
        setIsSearchOpen(false);
        setSearchQuery('');
        navigate(`/product/${productId}`);
    };

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const linkStyle = (path) => ({
        textDecoration: 'none',
        color: isActive(path) ? 'var(--ford-blue)' : '#475569',
        fontWeight: isActive(path) ? '700' : '500',
        padding: '0.45rem 0.85rem',
        borderRadius: '9999px',
        transition: 'all 0.2s ease',
        backgroundColor: isActive(path) ? 'rgba(0, 52, 120, 0.08)' : 'transparent',
        display: 'block',
        fontSize: '0.9rem',
        whiteSpace: 'nowrap'
    });

    const renderSearchBox = (isMobile = false) => (
        <div
            ref={isMobile ? undefined : searchRef}
            className="header-search-box"
            style={{ width: '100%', position: 'relative' }}
        >
            <form onSubmit={handleSearchSubmit}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: isSearchOpen ? '1.5px solid var(--ford-blue)' : '1px solid #cbd5e1',
                    padding: '0.42rem 0.85rem',
                    transition: 'all 0.2s ease',
                    boxShadow: isSearchOpen ? '0 0 0 3px rgba(0, 52, 120, 0.1)' : 'none'
                }}>
                    <span style={{ fontSize: '0.95rem', color: '#94a3b8', marginRight: '0.5rem' }}>🔍</span>
                    <input
                        ref={isMobile ? undefined : inputRef}
                        type="text"
                        placeholder="Recherche par nom ou référence OEM (ex: 1807044)..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsSearchOpen(true);
                        }}
                        onFocus={() => setIsSearchOpen(true)}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            width: '100%',
                            outline: 'none',
                            fontSize: '0.875rem',
                            color: '#0f172a'
                        }}
                    />
                    {searchQuery ? (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#94a3b8',
                                cursor: 'pointer',
                                padding: '0 4px',
                                fontSize: '0.9rem'
                            }}
                        >
                            ✕
                        </button>
                    ) : (
                        !isMobile && (
                            <kbd style={{
                                fontSize: '0.7rem',
                                backgroundColor: '#e2e8f0',
                                color: '#64748b',
                                padding: '2px 5px',
                                borderRadius: '4px',
                                fontWeight: '700',
                                letterSpacing: '0.04em',
                                flexShrink: 0
                            }}>
                                Ctrl K
                            </kbd>
                        )
                    )}
                </div>
            </form>

            {/* Instant Search Results Dropdown */}
            {isSearchOpen && searchQuery.trim() && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    borderRadius: '14px',
                    boxShadow: '0 16px 36px -4px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(15, 23, 42, 0.08)',
                    padding: '0.5rem',
                    zIndex: 1100,
                    maxHeight: '400px',
                    overflowY: 'auto'
                }}>
                    <div style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#94a3b8',
                        padding: '0.5rem 0.75rem 0.25rem 0.75rem'
                    }}>
                        Pièces trouvées ({searchResults.length})
                    </div>

                    {searchResults.length > 0 ? (
                        searchResults.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => handleSelectProduct(product.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.85rem',
                                    padding: '0.65rem 0.75rem',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.15s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '8px',
                                        objectFit: 'cover',
                                        border: '1px solid #e2e8f0',
                                        flexShrink: 0
                                    }}
                                />

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        color: '#0f172a',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {product.name}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2px' }}>
                                        <span className="badge-oem" style={{
                                            fontSize: '0.68rem',
                                            color: 'var(--ford-blue)',
                                            backgroundColor: '#eff6ff',
                                            padding: '1px 6px',
                                            borderRadius: '4px',
                                            border: '1px solid #bfdbfe'
                                        }}>
                                            OEM: {product.oem}
                                        </span>
                                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                            {product.category}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div className="tabular-price" style={{
                                        fontWeight: '800',
                                        fontSize: '0.9rem',
                                        color: 'var(--ford-blue)'
                                    }}>
                                        {product.price.toLocaleString('fr-DZ')} DA
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: '700' }}>
                                        ● En Stock
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '1.25rem', textAlign: 'center', color: '#64748b' }}>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
                                Aucune pièce trouvée pour « <strong>{searchQuery}</strong> »
                            </p>
                            <Link
                                to="/vin-request"
                                onClick={() => setIsSearchOpen(false)}
                                style={{
                                    fontSize: '0.825rem',
                                    fontWeight: '700',
                                    color: 'var(--ford-blue)',
                                    textDecoration: 'underline'
                                }}
                            >
                                Demander par photo de carte grise ➔
                            </Link>
                        </div>
                    )}

                    {/* View Full Catalog Link */}
                    <div style={{
                        borderTop: '1px solid #f1f5f9',
                        marginTop: '0.35rem',
                        padding: '0.5rem',
                        textAlign: 'center'
                    }}>
                        <button
                            type="button"
                            onClick={handleSearchSubmit}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                backgroundColor: '#eff6ff',
                                color: 'var(--ford-blue)',
                                border: '1px solid #bfdbfe',
                                borderRadius: '8px',
                                fontWeight: '700',
                                fontSize: '0.825rem',
                                cursor: 'pointer'
                            }}
                        >
                            Voir tous les résultats dans le Catalogue ➔
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
            boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)'
        }}>
            {/* Top Micro-Bar Soummam Dispatch */}
            <div style={{
                backgroundColor: '#071d49',
                color: 'white',
                fontSize: '0.78rem',
                padding: '0.35rem 1rem',
                fontWeight: '600',
                letterSpacing: '0.02em',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
                <div className="container" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                            display: 'inline-block',
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#22c55e',
                            borderRadius: '50%',
                            boxShadow: '0 0 8px #22c55e'
                        }} />
                        <span>Comptoir Soummam ouvert jusqu'à 17h30 • Pièces d'Origine Motorcraft</span>
                    </div>

                    <div className="header-micro-bar-links" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', fontSize: '0.76rem' }}>
                        <Link to="/shipping" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>📦</span>
                            <span>Expédition 58 Wilayas (24h/48h)</span>
                        </Link>
                        <span style={{ opacity: 0.4 }}>|</span>
                        <a href="tel:+213669014890" style={{ color: '#93c5fd', textDecoration: 'none', fontWeight: '700' }}>
                            📞 Comptoir : +213 (0) 669 01 48 90
                        </a>
                    </div>
                </div>
            </div>

            {/* Tier 1: Main Header Row */}
            <div className="container header-main-tier">
                {/* Brand Logo & Mobile Hamburger */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <button
                        type="button"
                        className="hamburger-btn"
                        onClick={() => setMobileMenuOpen(true)}
                        aria-label="Ouvrir le menu de navigation"
                        title="Menu de navigation"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>

                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '6px', flexShrink: 0 }}>
                        <span className="logo-text" style={{
                            fontSize: 'clamp(1.5rem, 4vw, 2.1rem)',
                            color: 'var(--ford-blue)',
                            lineHeight: 1,
                            textShadow: '0 2px 4px rgba(0, 51, 153, 0.1)'
                        }}>
                            Krimoford
                        </span>
                        <span style={{
                            fontSize: '0.62rem',
                            fontWeight: '800',
                            color: '#64748b',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            padding: '2px 6px',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '4px',
                            border: '1px solid #e2e8f0'
                        }}>
                            Soummam
                        </span>
                    </Link>
                </div>

                {/* Desktop Center: Live Search Box */}
                <div className="desktop-search-container" style={{ flex: 1, maxWidth: '520px', margin: '0 1rem' }}>
                    {renderSearchBox(false)}
                </div>

                {/* Right Desktop Controls */}
                <div className="desktop-only-header" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
                    <button
                        type="button"
                        onClick={openGarageModal}
                        style={{
                            padding: '0.45rem 0.85rem',
                            borderRadius: '9999px',
                            border: selectedVehicle ? '1.5px solid #22c55e' : '1.5px solid var(--ford-blue)',
                            backgroundColor: selectedVehicle ? '#f0fdf4' : 'rgba(0, 52, 120, 0.05)',
                            color: selectedVehicle ? '#15803d' : 'var(--ford-blue)',
                            fontWeight: '700',
                            fontSize: '0.825rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <span>🚗</span>
                        <span>{selectedVehicle ? `Ford ${selectedVehicle.model}` : t('nav.garage', 'Mon Garage')}</span>
                    </button>

                    <Link to="/cart" style={{ display: 'flex', alignItems: 'center', color: '#1f2937', position: 'relative' }} aria-label={t('nav.cart', 'Cart')}>
                        <div style={{
                            padding: '0.5rem',
                            borderRadius: '50%',
                            transition: 'background-color 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f1f5f9'
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="8" cy="21" r="1" />
                                <circle cx="19" cy="21" r="1" />
                                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
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
                                fontSize: '0.68rem',
                                fontWeight: 'bold',
                                border: '2px solid white'
                            }}>
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    <LanguageSwitcher />
                </div>

                {/* Right Mobile Quick Controls */}
                <div className="mobile-only-header">
                    <button
                        type="button"
                        onClick={openGarageModal}
                        style={{
                            padding: '0.35rem 0.6rem',
                            borderRadius: '9999px',
                            border: selectedVehicle ? '1.5px solid #22c55e' : '1px solid #cbd5e1',
                            backgroundColor: selectedVehicle ? '#f0fdf4' : '#f8fafc',
                            color: selectedVehicle ? '#15803d' : 'var(--ford-blue)',
                            fontWeight: '700',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <span>🚗</span>
                        <span>{selectedVehicle ? selectedVehicle.model : 'Garage'}</span>
                    </button>

                    <Link to="/cart" style={{ display: 'flex', alignItems: 'center', color: '#1f2937', position: 'relative' }}>
                        <div style={{
                            padding: '0.45rem',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f1f5f9'
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="8" cy="21" r="1" />
                                <circle cx="19" cy="21" r="1" />
                                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
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
                                width: '16px',
                                height: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.62rem',
                                fontWeight: 'bold',
                                border: '2px solid white'
                            }}>
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    <LanguageSwitcher />
                </div>
            </div>

            {/* Mobile Search Row (Row 2 on Mobile) */}
            <div className="container mobile-search-row">
                {renderSearchBox(true)}
            </div>

            {/* Tier 2: Desktop Navigation Bar Strip (Row 2 on Desktop) */}
            <div className="header-nav-bar">
                <div className="container header-nav-inner">
                    <Link to="/catalog" className={`header-nav-link ${isActive('/catalog') ? 'active' : ''}`}>
                        <span>🔍</span>
                        <span>{t('nav.catalog', 'Catalogue')}</span>
                    </Link>
                    <Link to="/kits" className={`header-nav-link ${isActive('/kits') ? 'active' : ''}`}>
                        <span>🛠️</span>
                        <span>{t('nav.kits', 'Packs Entretien')}</span>
                    </Link>
                    <Link to="/vin-request" className={`header-nav-link ${isActive('/vin-request') ? 'active' : ''}`}>
                        <span>📸</span>
                        <span>{t('nav.vin', 'Carte Grise')}</span>
                    </Link>
                    <Link to="/diagnostic" className={`header-nav-link ${isActive('/diagnostic') ? 'active' : ''}`}>
                        <span>⚡</span>
                        <span>{t('nav.diagnostic', 'Diagnostic')}</span>
                    </Link>
                    <Link to="/track-order" className={`header-nav-link ${isActive('/track-order') ? 'active' : ''}`}>
                        <span>📦</span>
                        <span>{t('nav.track', 'Suivi Colis')}</span>
                    </Link>
                    <Link to="/shipping" className={`header-nav-link ${isActive('/shipping') ? 'active' : ''}`}>
                        <span>🚚</span>
                        <span>{t('nav.shipping', 'Tarifs 58 Wilayas')}</span>
                    </Link>
                    <Link to="/contact" className={`header-nav-link ${isActive('/contact') ? 'active' : ''}`}>
                        <span>📍</span>
                        <span>{t('nav.contact', 'Magasin & Contact')}</span>
                    </Link>
                </div>
            </div>
        </header>

        {/* Full Mobile Navigation Drawer rendered via Portal directly into document.body */}
        {typeof document !== 'undefined' && createPortal(
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            key="drawer-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mobile-drawer-backdrop"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        <motion.div
                            key="drawer-panel"
                            initial={{ x: isRTL ? '100%' : '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: isRTL ? '100%' : '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                            className="mobile-drawer-panel"
                        >
                            {/* Drawer Header */}
                            <div style={{
                                padding: '1.25rem',
                                borderBottom: '1px solid #f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: '#071d49',
                                color: 'white'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                    <span className="logo-text" style={{ fontSize: '1.75rem', color: '#60a5fa' }}>Krimoford</span>
                                    <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Soummam</span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{
                                        background: 'rgba(255,255,255,0.15)',
                                        border: 'none',
                                        color: 'white',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Mon Garage Status Card */}
                            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '1.25rem' }}>🚗</span>
                                        <div>
                                            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Mon Garage</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: selectedVehicle ? '#15803d' : '#0f172a' }}>
                                                {selectedVehicle ? `Ford ${selectedVehicle.model}` : 'Aucun véhicule'}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            openGarageModal();
                                        }}
                                        style={{
                                            padding: '0.35rem 0.75rem',
                                            backgroundColor: 'var(--ford-blue)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {selectedVehicle ? 'Modifier' : 'Choisir'}
                                    </button>
                                </div>
                            </div>

                            {/* Drawer Navigation Links */}
                            <div style={{ padding: '1rem 0.75rem', flex: 1, overflowY: 'auto' }}>
                                <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 0.5rem 0.5rem 0.5rem' }}>
                                    Navigation & Services
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <Link
                                        to="/catalog"
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0.75rem 0.85rem',
                                            borderRadius: '10px',
                                            textDecoration: 'none',
                                            color: isActive('/catalog') ? 'var(--ford-blue)' : '#1e293b',
                                            backgroundColor: isActive('/catalog') ? '#eff6ff' : 'transparent',
                                            fontWeight: '700',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span>🔍</span>
                                            <span>Catalogue Pièces Détachées</span>
                                        </span>
                                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>➔</span>
                                    </Link>

                                    <Link
                                        to="/kits"
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0.75rem 0.85rem',
                                            borderRadius: '10px',
                                            textDecoration: 'none',
                                            color: isActive('/kits') ? 'var(--ford-blue)' : '#1e293b',
                                            backgroundColor: isActive('/kits') ? '#eff6ff' : 'transparent',
                                            fontWeight: '700',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span>🛠️</span>
                                            <span>Packs Entretien & Vidange</span>
                                        </span>
                                        <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#dcfce7', color: '#16a34a', fontWeight: '800' }}>-15%</span>
                                    </Link>

                                    <Link
                                        to="/vin-request"
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0.75rem 0.85rem',
                                            borderRadius: '10px',
                                            textDecoration: 'none',
                                            color: isActive('/vin-request') ? 'var(--ford-blue)' : '#1e293b',
                                            backgroundColor: isActive('/vin-request') ? '#eff6ff' : 'transparent',
                                            fontWeight: '700',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span>📸</span>
                                            <span>Devis Photo Carte Grise</span>
                                        </span>
                                        <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#eff6ff', color: 'var(--ford-blue)', fontWeight: '800' }}>Gratuit</span>
                                    </Link>

                                    <Link
                                        to="/diagnostic"
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0.75rem 0.85rem',
                                            borderRadius: '10px',
                                            textDecoration: 'none',
                                            color: isActive('/diagnostic') ? 'var(--ford-blue)' : '#1e293b',
                                            backgroundColor: isActive('/diagnostic') ? '#eff6ff' : 'transparent',
                                            fontWeight: '700',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span>⚡</span>
                                            <span>Diagnostic Pannes & Bruits</span>
                                        </span>
                                        <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#fef3c7', color: '#92400e', fontWeight: '800' }}>Expert</span>
                                    </Link>

                                    <Link
                                        to="/track-order"
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0.75rem 0.85rem',
                                            borderRadius: '10px',
                                            textDecoration: 'none',
                                            color: isActive('/track-order') ? 'var(--ford-blue)' : '#1e293b',
                                            backgroundColor: isActive('/track-order') ? '#eff6ff' : 'transparent',
                                            fontWeight: '700',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span>📦</span>
                                            <span>Suivi de Commande en direct</span>
                                        </span>
                                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>➔</span>
                                    </Link>

                                    <Link
                                        to="/shipping"
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0.75rem 0.85rem',
                                            borderRadius: '10px',
                                            textDecoration: 'none',
                                            color: isActive('/shipping') ? 'var(--ford-blue)' : '#1e293b',
                                            backgroundColor: isActive('/shipping') ? '#eff6ff' : 'transparent',
                                            fontWeight: '700',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span>🚚</span>
                                            <span>Tarifs Livraison (58 Wilayas)</span>
                                        </span>
                                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>➔</span>
                                    </Link>

                                    <Link
                                        to="/contact"
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0.75rem 0.85rem',
                                            borderRadius: '10px',
                                            textDecoration: 'none',
                                            color: isActive('/contact') ? 'var(--ford-blue)' : '#1e293b',
                                            backgroundColor: isActive('/contact') ? '#eff6ff' : 'transparent',
                                            fontWeight: '700',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span>📍</span>
                                            <span>Magasin & Contact Comptoir</span>
                                        </span>
                                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>➔</span>
                                    </Link>
                                </div>

                                {/* Quick Ford Models */}
                                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                    <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 0.5rem 0.5rem 0.5rem' }}>
                                        Modèles Ford Fréquents
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', padding: '0 0.5rem' }}>
                                        {['Focus', 'Fiesta', 'Ranger', 'Transit', 'Kuga', 'Mondeo'].map((m) => (
                                            <Link
                                                key={m}
                                                to={`/model/${m}`}
                                                onClick={() => setMobileMenuOpen(false)}
                                                style={{
                                                    padding: '0.35rem 0.65rem',
                                                    borderRadius: '8px',
                                                    backgroundColor: '#f1f5f9',
                                                    color: '#334155',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '700',
                                                    textDecoration: 'none',
                                                    border: '1px solid #e2e8f0'
                                                }}
                                            >
                                                Ford {m}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Direct Contact Soummam Actions */}
                            <div style={{ padding: '1rem', borderTop: '1px solid #f1f5f9', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <a
                                    href="tel:+213669014890"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        padding: '0.65rem',
                                        backgroundColor: 'var(--ford-blue)',
                                        color: 'white',
                                        borderRadius: '10px',
                                        textDecoration: 'none',
                                        fontWeight: '700',
                                        fontSize: '0.88rem'
                                    }}
                                >
                                    <span>📞</span>
                                    <span>Appeler : +213 669 01 48 90</span>
                                </a>

                                <a
                                    href={getWhatsAppLink('Salam Krimo, j\'ai besoin d\'une pièce détachée Ford.')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        padding: '0.65rem',
                                        backgroundColor: '#25D366',
                                        color: 'white',
                                        borderRadius: '10px',
                                        textDecoration: 'none',
                                        fontWeight: '700',
                                        fontSize: '0.88rem'
                                    }}
                                >
                                    <span>💬</span>
                                    <span>WhatsApp Direct Atelier</span>
                                </a>

                                <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                                    Boulevard de la Soummam, Alger Centre (08h30 – 17h30)
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>,
            document.body
        )}
    </>
);
};

export default Header;
