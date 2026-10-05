import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import { useGarage } from '../../context/GarageContext';
import { getWhatsAppLink } from '../../utils/whatsapp';

const MobileBottomNav = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const { cartItems } = useCart();
    const { selectedVehicle, openGarageModal } = useGarage();
    const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const waLink = getWhatsAppLink(
        "Salam Krimo ! Je consulte votre boutique de pièces détachées et j'ai une question sur une disponibilité."
    );

    return (
        <aside
            aria-label="Navigation mobile rapide"
            className="mobile-bottom-nav"
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 9998,
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderTop: '1px solid rgba(15, 23, 42, 0.08)',
                boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
                padding: '0.45rem 0.5rem calc(0.45rem + env(safe-area-inset-bottom, 0px)) 0.5rem',
                display: 'none', // Shown on mobile via CSS media query
                justifyContent: 'space-around',
                alignItems: 'center'
            }}
        >
            {/* 1. Appeler Comptoir Soummam */}
            <a
                href="tel:+213669014890"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    color: '#0f172a',
                    textDecoration: 'none',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    flex: 1,
                    textAlign: 'center'
                }}
            >
                <div className="bottom-nav-icon" style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    backgroundColor: '#eff6ff',
                    color: 'var(--ford-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    border: '1px solid #dbeafe'
                }}>
                    📞
                </div>
                <span>Appeler</span>
            </a>

            {/* 2. WhatsApp Direct */}
            <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    color: '#0f172a',
                    textDecoration: 'none',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    flex: 1,
                    textAlign: 'center'
                }}
            >
                <div className="bottom-nav-icon" style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    border: '1px solid #bbf7d0'
                }}>
                    💬
                </div>
                <span>WhatsApp</span>
            </a>

            {/* 3. Devis Carte Grise (Center Highlight) */}
            <Link
                to="/vin-request"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    color: isActive('/vin-request') ? 'var(--ford-blue)' : '#0f172a',
                    textDecoration: 'none',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    flex: 1.2,
                    textAlign: 'center',
                    transform: 'translateY(-6px)'
                }}
            >
                <div className="bottom-nav-center-icon" style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--ford-blue)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.15rem',
                    boxShadow: '0 4px 12px rgba(0, 52, 120, 0.35)',
                    border: '2px solid white'
                }}>
                    📸
                </div>
                <span style={{ color: 'var(--ford-blue)' }}>Carte Grise</span>
            </Link>

            {/* 4. Mon Garage */}
            <button
                type="button"
                onClick={openGarageModal}
                style={{
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    color: selectedVehicle ? '#15803d' : '#0f172a',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    flex: 1,
                    cursor: 'pointer',
                    padding: 0
                }}
            >
                <div className="bottom-nav-icon" style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    backgroundColor: selectedVehicle ? '#f0fdf4' : '#f1f5f9',
                    color: selectedVehicle ? '#16a34a' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    border: selectedVehicle ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                    position: 'relative'
                }}>
                    🚗
                    {selectedVehicle && (
                        <span style={{
                            position: 'absolute',
                            top: '-2px',
                            right: '-2px',
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#22c55e',
                            borderRadius: '50%',
                            boxShadow: '0 0 0 2px white'
                        }} />
                    )}
                </div>
                <span>{selectedVehicle ? selectedVehicle.model : 'Garage'}</span>
            </button>

            {/* 5. Panier */}
            <Link
                to="/cart"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    color: isActive('/cart') ? 'var(--ford-blue)' : '#0f172a',
                    textDecoration: 'none',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    flex: 1,
                    textAlign: 'center',
                    position: 'relative'
                }}
            >
                <div className="bottom-nav-icon" style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    backgroundColor: isActive('/cart') ? 'rgba(0, 52, 120, 0.08)' : '#f1f5f9',
                    color: isActive('/cart') ? 'var(--ford-blue)' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    border: '1px solid #e2e8f0',
                    position: 'relative'
                }}>
                    🛒
                    {totalItems > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            borderRadius: '50%',
                            width: '16px',
                            height: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.65rem',
                            fontWeight: 'bold',
                            border: '1.5px solid white'
                        }}>
                            {totalItems}
                        </span>
                    )}
                </div>
                <span>Panier</span>
            </Link>
        </aside>
    );
};

export default MobileBottomNav;
