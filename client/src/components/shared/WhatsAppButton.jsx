import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getWhatsAppLink } from '../../utils/whatsapp';

const WhatsAppButton = () => {
    const { t, i18n } = useTranslation();
    const [hover, setHover] = useState(false);
    const isRtl = i18n.dir() === 'rtl';

    const defaultMsg = t(
        'whatsapp.defaultMessage',
        'Salam Krimo ! J\'aimerais avoir des informations sur la disponibilité d\'une pièce Ford.'
    );

    const waLink = getWhatsAppLink(defaultMsg);

    return (
        <aside aria-label="Support WhatsApp" className="floating-whatsapp" style={{
            position: 'fixed',
            bottom: '24px',
            right: isRtl ? 'auto' : '24px',
            left: isRtl ? '24px' : 'auto',
            zIndex: 9990,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexDirection: isRtl ? 'row-reverse' : 'row'
        }}>
            {/* Tooltip on hover */}
            <div style={{
                backgroundColor: '#1f2937',
                color: 'white',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                whiteSpace: 'nowrap',
                opacity: hover ? 1 : 0,
                transform: hover ? 'translateX(0)' : isRtl ? 'translateX(-10px)' : 'translateX(10px)',
                pointerEvents: 'none',
                transition: 'all 0.25s ease'
            }}>
                {t('whatsapp.tooltip', 'Contact direct Krimo (Soummam)')}
            </div>

            <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-pulse"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#25D366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    transform: hover ? 'scale(1.1)' : 'scale(1)',
                    textDecoration: 'none'
                }}
            >
                <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.97.529 1.942.81 2.8.81h.005c3.18 0 5.767-2.587 5.768-5.766 0-3.181-2.587-5.767-5.777-5.767zm7.394 5.767c0 4.075-3.317 7.391-7.391 7.391-.002 0-.005 0-.007 0-1.21 0-2.399-.312-3.447-.905l-4.58 1.2 1.222-4.462c-.672-1.12-1.026-2.404-1.026-3.724 0-4.075 3.318-7.391 7.393-7.391s7.391 3.316 7.391 7.391zm-4.708 2.062c-.179-.09-1.061-.523-1.225-.583-.164-.06-.283-.09-.402.09-.119.18-.462.583-.566.703-.104.119-.209.134-.388.045-.179-.09-.757-.279-1.442-.89-.533-.475-.893-1.062-.998-1.242-.104-.179-.011-.276.079-.365.08-.08.179-.209.269-.313.089-.104.119-.179.179-.298.06-.119.03-.224-.015-.313-.045-.09-.402-.97-.552-1.328-.145-.349-.293-.301-.402-.307-.104-.005-.224-.007-.343-.007-.119 0-.313.045-.477.224-.164.179-.627.613-.627 1.494 0 .881.642 1.733.731 1.852.09.119 1.264 1.93 3.062 2.706.428.185.762.296 1.023.379.43.137.822.117 1.131.071.345-.052 1.061-.433 1.21-.852.149-.418.149-.776.104-.852-.044-.075-.164-.119-.343-.209z" />
                </svg>
            </a>
        </aside>
    );
};

export default WhatsAppButton;
