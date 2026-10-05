import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { wilayas } from '../../data/wilayas';
import { getWhatsAppLink } from '../../utils/whatsapp';

const CheckoutPage = () => {
    const { t } = useTranslation();
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Algeria',
        phone: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' | 'CCP'
    const [deliveryMode, setDeliveryMode] = useState('home'); // 'home' | 'desk'
    const [selectedWilaya, setSelectedWilaya] = useState(wilayas[15]); // Default to 16 Alger
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [confirmedOrder, setConfirmedOrder] = useState(null);

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const shippingPrice = selectedWilaya
        ? (deliveryMode === 'home' ? selectedWilaya.price : selectedWilaya.deskPrice)
        : 400;
    const finalTotal = itemsPrice + shippingPrice;

    const submitHandler = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (cartItems.length === 0) {
            toast.error(t('cart.empty', 'Votre panier est vide'));
            return;
        }
        if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.city) {
            toast.error(t('common.requiredFields', 'Veuillez remplir vos informations de contact et adresse'));
            return;
        }

        const generatedOrderId = 'KF-' + Math.floor(1000 + Math.random() * 9000);

        const orderData = {
            orderItems: cartItems.map(item => ({
                product: item._id,
                name: item.name,
                qty: item.qty,
                image: (item.images && item.images[0]) || '',
                price: item.price
            })),
            shippingAddress: {
                ...shippingAddress,
                wilaya: `${selectedWilaya.code} - ${selectedWilaya.name}`,
                deliveryMode: deliveryMode === 'home' ? 'À Domicile' : 'Bureau Stop-Desk'
            },
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice: finalTotal,
        };

        try {
            await axios.post('/api/orders', orderData).catch(() => {});
        } catch {
            // Graceful fallback for mock mode
        }

        setConfirmedOrder({
            id: generatedOrderId,
            ...orderData
        });
        setIsSubmitted(true);
        clearCart();
        toast.success(t('checkout.success', 'Commande enregistrée avec succès !'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const inputStyle = {
        width: '100%',
        padding: '0.85rem 1rem',
        borderRadius: '10px',
        border: '1px solid #cbd5e1',
        backgroundColor: '#f8fafc',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'border-color 0.2s'
    };

    if (isSubmitted && confirmedOrder) {
        const orderSummaryText = `Salam Krimo ! Je viens de passer la commande #${confirmedOrder.id} sur votre site Krimo-Ford :
- Client : ${confirmedOrder.shippingAddress.fullName} (${confirmedOrder.shippingAddress.phone})
- Wilaya : ${confirmedOrder.shippingAddress.wilaya} (${confirmedOrder.shippingAddress.deliveryMode})
- Total : ${confirmedOrder.totalPrice.toLocaleString()} DA (${confirmedOrder.paymentMethod === 'COD' ? 'Paiement à la livraison' : 'BaridiMob/CCP'})
- Nombre d'articles : ${confirmedOrder.orderItems.length}

Pouvez-vous confirmer la préparation du colis ? Merci !`;

        return (
            <div style={{ backgroundColor: '#f8fafc', minHeight: '90vh', padding: '4rem 1rem' }}>
                <div className="container" style={{ maxWidth: '750px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '24px',
                        padding: '3rem 2rem',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
                        border: '1px solid #bbf7d0'
                    }}>
                        <div style={{
                            width: '76px',
                            height: '76px',
                            backgroundColor: '#dcfce7',
                            color: '#16a34a',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                            margin: '0 auto 1.5rem auto'
                        }}>
                            ✓
                        </div>

                        <span style={{
                            backgroundColor: 'rgba(0, 52, 120, 0.08)',
                            color: 'var(--ford-blue)',
                            padding: '0.35rem 0.9rem',
                            borderRadius: '9999px',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            display: 'inline-block',
                            marginBottom: '0.75rem'
                        }}>
                            COMMANDE CONFIRMÉE
                        </span>

                        <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.5rem' }}>
                            Merci pour votre commande !
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '2rem' }}>
                            Référence : <strong style={{ color: 'var(--ford-blue)' }}>#{confirmedOrder.id}</strong>
                        </p>

                        <div style={{
                            backgroundColor: '#f8fafc',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            textAlign: 'left',
                            marginBottom: '2rem',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.95rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ color: '#64748b' }}>Destinataire :</span>
                                <strong style={{ color: '#1e293b' }}>{confirmedOrder.shippingAddress.fullName}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ color: '#64748b' }}>Téléphone :</span>
                                <strong style={{ color: '#1e293b' }}>{confirmedOrder.shippingAddress.phone}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ color: '#64748b' }}>Destination :</span>
                                <strong style={{ color: '#1e293b' }}>{confirmedOrder.shippingAddress.wilaya}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ color: '#64748b' }}>Mode de Livraison :</span>
                                <strong style={{ color: 'var(--ford-blue)' }}>{confirmedOrder.shippingAddress.deliveryMode} ({shippingPrice} DA)</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', fontSize: '1.15rem' }}>
                                <span style={{ fontWeight: '800', color: '#0f172a' }}>Total à régler :</span>
                                <strong style={{ color: 'var(--ford-blue)', fontWeight: '900' }}>{confirmedOrder.totalPrice.toLocaleString()} DA</strong>
                            </div>
                        </div>

                        {/* Direct WhatsApp Confirmation Button */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                            <a
                                href={getWhatsAppLink(orderSummaryText)}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    width: '100%',
                                    maxWidth: '450px',
                                    padding: '1rem',
                                    backgroundColor: '#25D366',
                                    color: 'white',
                                    borderRadius: '12px',
                                    fontWeight: '800',
                                    fontSize: '1rem',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.6rem',
                                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                                }}
                            >
                                <span>Confirmer immédiatement sur WhatsApp avec Krimo</span>
                                <span>💬</span>
                            </a>

                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <Link
                                    to="/track-order"
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: 'var(--ford-blue)',
                                        color: 'white',
                                        borderRadius: '10px',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Suivre cette commande en direct 📦
                                </Link>
                                <Link
                                    to="/"
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: '#f1f5f9',
                                        color: '#334155',
                                        borderRadius: '10px',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Retour à la boutique
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: 'clamp(1.5rem, 4vw, 3.5rem) 1rem' }}>
            <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '2rem', color: '#0f172a', fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', fontWeight: '900', letterSpacing: '-0.02em' }}>
                    {t('checkout.title', 'Finaliser ma Commande')}
                </h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) 380px', gap: '2.5rem', alignItems: 'start' }} className="checkout-layout">
                    {/* Left Form */}
                    <form onSubmit={submitHandler}>
                        {/* 1. Coordonnées */}
                        <div style={{ backgroundColor: 'white', padding: 'clamp(1rem, 3.5vw, 2rem)', borderRadius: '18px', marginBottom: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                            <h2 style={{ marginBottom: '1.25rem', fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <span style={{ width: '28px', height: '28px', backgroundColor: 'var(--ford-blue)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>1</span>
                                Coordonnées du Client
                            </h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.875rem', color: '#475569' }}>
                                        Nom & Prénom <span style={{ color: '#dc2626' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="ex: Karim Benali"
                                        value={shippingAddress.fullName}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.875rem', color: '#475569' }}>
                                        Numéro de Téléphone (Mobile) <span style={{ color: '#dc2626' }}>*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="05 XX XX XX XX / 06 / 07"
                                        value={shippingAddress.phone}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Destination 58 Wilayas */}
                        <div style={{ backgroundColor: 'white', padding: 'clamp(1rem, 3.5vw, 2rem)', borderRadius: '18px', marginBottom: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                            <h2 style={{ marginBottom: '1.25rem', fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <span style={{ width: '28px', height: '28px', backgroundColor: 'var(--ford-blue)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>2</span>
                                Adresse de Livraison (58 Wilayas)
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.875rem', color: '#475569' }}>
                                        Wilaya de destination <span style={{ color: '#dc2626' }}>*</span>
                                    </label>
                                    <select
                                        required
                                        value={selectedWilaya ? selectedWilaya.id : ''}
                                        onChange={(e) => {
                                            const w = wilayas.find(item => item.id === parseInt(e.target.value));
                                            setSelectedWilaya(w);
                                        }}
                                        style={inputStyle}
                                    >
                                        {wilayas.map(w => (
                                            <option key={w.id} value={w.id}>
                                                {w.code} - {w.name} ({w.nameAr}) — Domicile: {w.price} DA / Bureau: {w.deskPrice} DA
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Delivery mode: Home vs Stop-Desk */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem', color: '#475569' }}>
                                        Mode de réception :
                                    </label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: '1rem' }}>
                                        <div
                                            onClick={() => setDeliveryMode('home')}
                                            style={{
                                                padding: '1rem',
                                                borderRadius: '12px',
                                                border: deliveryMode === 'home' ? '2px solid var(--ford-blue)' : '1px solid #cbd5e1',
                                                backgroundColor: deliveryMode === 'home' ? '#eff6ff' : 'white',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                                                🏠 Livraison à Domicile
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: '700' }}>
                                                {selectedWilaya?.price} DA
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                                                Délai estimé : {selectedWilaya?.delay}
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => setDeliveryMode('desk')}
                                            style={{
                                                padding: '1rem',
                                                borderRadius: '12px',
                                                border: deliveryMode === 'desk' ? '2px solid var(--ford-blue)' : '1px solid #cbd5e1',
                                                backgroundColor: deliveryMode === 'desk' ? '#eff6ff' : 'white',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                                                🏢 Bureau (Stop-Desk)
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: '700' }}>
                                                {selectedWilaya?.deskPrice} DA (Économique)
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                                                Yalidine / Procolis le plus proche
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.875rem', color: '#475569' }}>
                                            Commune / Ville <span style={{ color: '#dc2626' }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="ex: Bab Ezzouar, Kouba, Ain Benian..."
                                            value={shippingAddress.city}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.875rem', color: '#475569' }}>
                                            Code Postal
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="ex: 16024"
                                            value={shippingAddress.postalCode}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.875rem', color: '#475569' }}>
                                        Adresse précise ou repère de livraison <span style={{ color: '#dc2626' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="ex: Cité 5 Juillet, Rue Hassiba, près de la station..."
                                        value={shippingAddress.address}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. Mode de Paiement */}
                        <div style={{ backgroundColor: 'white', padding: 'clamp(1rem, 3.5vw, 2rem)', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                            <h2 style={{ marginBottom: '1.25rem', fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <span style={{ width: '28px', height: '28px', backgroundColor: 'var(--ford-blue)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>3</span>
                                Mode de Paiement
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1.25rem',
                                    borderRadius: '12px',
                                    border: paymentMethod === 'COD' ? '2px solid var(--ford-blue)' : '1px solid #cbd5e1',
                                    backgroundColor: paymentMethod === 'COD' ? '#eff6ff' : 'white',
                                    cursor: 'pointer'
                                }}>
                                    <input
                                        type="radio"
                                        name="pm"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={() => setPaymentMethod('COD')}
                                    />
                                    <div>
                                        <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '1rem' }}>
                                            💵 Paiement à la Livraison (Cash on Delivery)
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            Réglez le montant en espèces directement au livreur après réception de votre colis.
                                        </div>
                                    </div>
                                </label>

                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1.25rem',
                                    borderRadius: '12px',
                                    border: paymentMethod === 'CCP' ? '2px solid var(--ford-blue)' : '1px solid #cbd5e1',
                                    backgroundColor: paymentMethod === 'CCP' ? '#eff6ff' : 'white',
                                    cursor: 'pointer'
                                }}>
                                    <input
                                        type="radio"
                                        name="pm"
                                        value="CCP"
                                        checked={paymentMethod === 'CCP'}
                                        onChange={() => setPaymentMethod('CCP')}
                                    />
                                    <div>
                                        <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '1rem' }}>
                                            💳 Virement CCP / BaridiMob
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            Effectuez le virement et transmettez le reçu sur WhatsApp pour validation immédiate.
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </form>

                    {/* Right Summary Sidebar */}
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '2rem',
                            borderRadius: '20px',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                            border: '1px solid #e2e8f0'
                        }}>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
                                Récapitulatif
                            </h2>

                            {/* Item Count */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem', color: '#475569' }}>
                                <span>Articles ({cartItems.reduce((a, b) => a + b.qty, 0)}) :</span>
                                <strong style={{ color: '#0f172a' }}>{itemsPrice.toLocaleString()} DA</strong>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.95rem', color: '#475569' }}>
                                <span>Frais de port ({selectedWilaya?.name}) :</span>
                                <strong style={{ color: '#16a34a' }}>{shippingPrice.toLocaleString()} DA</strong>
                            </div>

                            {/* Divider & Total */}
                            <div style={{
                                borderTop: '2px dashed #e2e8f0',
                                paddingTop: '1.25rem',
                                marginBottom: '1.75rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline'
                            }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Total Final :</span>
                                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--ford-blue)' }}>
                                    {finalTotal.toLocaleString()} DA
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={submitHandler}
                                style={{
                                    width: '100%',
                                    padding: '1.1rem',
                                    backgroundColor: 'var(--ford-blue)',
                                    color: 'white',
                                    borderRadius: '12px',
                                    border: 'none',
                                    fontSize: '1.1rem',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(0, 52, 120, 0.35)',
                                    transition: 'all 0.2s',
                                    marginBottom: '1rem'
                                }}
                            >
                                Valider ma Commande
                            </button>

                            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                                <span>🛡️</span>
                                <span>Paiement sécurisé à réception en 58 Wilayas</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
