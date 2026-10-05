import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { wilayas } from '../../data/wilayas';
import { createVinQuoteWhatsAppMessage, getWhatsAppLink } from '../../utils/whatsapp';

const FORD_MODELS = [
    "Fiesta", "Focus", "Mondeo", "Kuga", "Ranger", "Transit", "Transit Custom",
    "EcoSport", "Ka", "C-Max", "B-Max", "S-Max", "Galaxy", "Fusion", "Taurus", "Autre Ford"
];

const VinRequestPage = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        wilaya: '16 - Alger',
        model: 'Focus',
        year: '2016',
        fuelType: 'Diesel (TDCi)',
        vin: '',
        partDescription: '',
        urgency: 'Normal'
    });

    const [uploadedImages, setUploadedImages] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [ticketNumber, setTicketNumber] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + uploadedImages.length > 3) {
            toast.error(t('vin.maxPhotos', 'Maximum 3 photos autorisées'));
            return;
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImages(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
        toast.success(t('vin.photoAdded', 'Photo(s) chargée(s) avec succès'));
    };

    const removeImage = (idx) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.partDescription) {
            toast.error(t('common.requiredFields', 'Veuillez remplir tous les champs obligatoires'));
            return;
        }

        const generatedTicket = 'VIN-' + Math.floor(100000 + Math.random() * 900000);
        setTicketNumber(generatedTicket);
        setSubmitted(true);
        toast.success(t('vin.submittedSuccess', 'Votre demande a été transmise à Krimo !'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const waMessage = createVinQuoteWhatsAppMessage({
        vin: formData.vin,
        model: formData.model,
        year: formData.year,
        partDescription: formData.partDescription,
        wilaya: formData.wilaya,
        name: formData.name
    });

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '90vh', padding: '3.5rem 1rem' }}>
            <div className="container" style={{ maxWidth: '850px', margin: '0 auto' }}>

                {/* Header section */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 1.2rem',
                        backgroundColor: 'rgba(0, 52, 120, 0.08)',
                        color: 'var(--ford-blue)',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        marginBottom: '1rem'
                    }}>
                        <span>🔍</span>
                        <span>{t('vin.badge', 'Service Recherche Pièce Spécifique — Soummam')}</span>
                    </div>
                    <h1 style={{
                        fontSize: '2.5rem',
                        color: 'var(--ford-blue)',
                        fontFamily: 'var(--font-logo)',
                        marginBottom: '0.75rem'
                    }}>
                        {t('vin.title', 'Devis Rapide par Carte Grise / VIN')}
                    </h1>
                    <p style={{ color: '#4b5563', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
                        {t('vin.subtitle', 'Vous ne trouvez pas votre pièce dans le catalogue ? Envoyez le N° de châssis ou la photo de votre carte grise. Krimo vérifie la compatibilité et le stock sous 15 minutes.')}
                    </p>
                </div>

                {/* Submitted confirmation view */}
                {submitted ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '20px',
                            padding: '3rem 2rem',
                            textAlign: 'center',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                            border: '1px solid #bbf7d0'
                        }}
                    >
                        <div style={{
                            width: '70px',
                            height: '70px',
                            backgroundColor: '#dcfce7',
                            color: '#16a34a',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            margin: '0 auto 1.5rem auto'
                        }}>
                            ✓
                        </div>
                        <h2 style={{ fontSize: '1.8rem', color: '#166534', fontWeight: '800', marginBottom: '0.5rem' }}>
                            Demande Enregistrée avec Succès !
                        </h2>
                        <p style={{ color: '#4b5563', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
                            Ticket Réf : <strong style={{ color: 'var(--ford-blue)' }}>#{ticketNumber}</strong>
                        </p>
                        <p style={{ color: '#6b7280', maxWidth: '500px', margin: '0 auto 2rem auto', fontSize: '0.95rem' }}>
                            Krimo examine les références OEM de votre <strong>Ford {formData.model} ({formData.year})</strong>. Vous serez contacté par téléphone ou WhatsApp dans les plus brefs délais.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <a
                                href={getWhatsAppLink(waMessage)}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    backgroundColor: '#25D366',
                                    color: 'white',
                                    padding: '0.85rem 1.75rem',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.6rem',
                                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                                }}
                            >
                                <span>Envoyer aussi sur WhatsApp</span>
                                <span>💬</span>
                            </a>
                            <button
                                type="button"
                                onClick={() => {
                                    setSubmitted(false);
                                    setUploadedImages([]);
                                }}
                                style={{
                                    padding: '0.85rem 1.5rem',
                                    backgroundColor: '#f3f4f6',
                                    color: '#374151',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Faire une autre demande
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    /* Main Form */
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden'
                    }}>
                        {/* Information Banner */}
                        <div style={{
                            backgroundColor: '#eff6ff',
                            borderBottom: '1px solid #dbeafe',
                            padding: '1.25rem 2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <span style={{ fontSize: '1.6rem' }}>ℹ️</span>
                            <div style={{ fontSize: '0.9rem', color: '#1e40af', lineHeight: '1.5' }}>
                                <strong>Où trouver le numéro de châssis (VIN) ?</strong> Sur votre Carte Grise algérienne à la ligne <strong>(E)</strong> ou <strong>N° dans la série du type</strong> (17 caractères).
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: 'clamp(1rem, 4vw, 2.5rem)' }}>
                            {/* Section 1: Véhicule */}
                            <h3 style={{ fontSize: '1.2rem', color: '#1e293b', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>🚗</span>
                                <span>1. Caractéristiques de votre Ford</span>
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>
                                        Modèle <span style={{ color: '#dc2626' }}>*</span>
                                    </label>
                                    <select
                                        name="model"
                                        value={formData.model}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                                    >
                                        {FORD_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>
                                        Année
                                    </label>
                                    <input
                                        type="number"
                                        name="year"
                                        placeholder="ex: 2017"
                                        value={formData.year}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>
                                        Motorisation
                                    </label>
                                    <select
                                        name="fuelType"
                                        value={formData.fuelType}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                                    >
                                        <option value="Diesel (TDCi / EcoBlue)">Diesel (TDCi / EcoBlue)</option>
                                        <option value="Essence (EcoBoost / Duratec)">Essence (EcoBoost / Duratec)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Section 2: VIN & Pièce */}
                            <h3 style={{ fontSize: '1.2rem', color: '#1e293b', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>⚙️</span>
                                <span>2. Détails de la Pièce & Numéro de Châssis (VIN)</span>
                            </h3>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>
                                    Numéro de Châssis (VIN) — 17 caractères
                                </label>
                                <input
                                    type="text"
                                    name="vin"
                                    placeholder="WF0XXXGCDX..."
                                    maxLength="17"
                                    value={formData.vin}
                                    onChange={(e) => setFormData({ ...formData, vin: e.target.value.toUpperCase() })}
                                    style={{
                                        width: '100%',
                                        padding: '0.85rem 1rem',
                                        borderRadius: '10px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '1rem',
                                        letterSpacing: '0.05em',
                                        fontFamily: 'monospace'
                                    }}
                                />
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                    {formData.vin.length}/17 caractères saisis (Optionnel si vous joignez une photo de la carte grise).
                                </span>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>
                                    Description précise de la pièce recherchée <span style={{ color: '#dc2626' }}>*</span>
                                </label>
                                <textarea
                                    required
                                    rows="3"
                                    name="partDescription"
                                    placeholder="Exemple: Radiateur de refroidissement moteur, ou kit injecteurs Delphi, ou soufflet de cardan côté boîte..."
                                    value={formData.partDescription}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.85rem 1rem',
                                        borderRadius: '10px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.95rem',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            {/* Section 3: Photo upload */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                    Photos : Carte Grise ou Ancienne Pièce (Recommandé)
                                </label>

                                <div style={{
                                    border: '2px dashed #cbd5e1',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    textAlign: 'center',
                                    backgroundColor: '#f8fafc',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            opacity: 0,
                                            cursor: 'pointer'
                                        }}
                                    />
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                                    <div style={{ fontWeight: '600', color: 'var(--ford-blue)', fontSize: '0.95rem' }}>
                                        Cliquez ou glissez une photo ici
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                        Format JPG ou PNG (Max 3 photos)
                                    </div>
                                </div>

                                {uploadedImages.length > 0 && (
                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                                        {uploadedImages.map((img, i) => (
                                            <div key={i} style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                                <img src={img} alt="Aperçu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(i)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '3px',
                                                        right: '3px',
                                                        background: 'rgba(220, 38, 38, 0.85)',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        width: '20px',
                                                        height: '20px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.75rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Section 4: Vos coordonnées */}
                            <h3 style={{ fontSize: '1.2rem', color: '#1e293b', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>👤</span>
                                <span>3. Vos Coordonnées pour la Réponse</span>
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>
                                        Nom complet <span style={{ color: '#dc2626' }}>*</span>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        name="name"
                                        placeholder="Votre nom"
                                        value={formData.name}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>
                                        N° Téléphone / WhatsApp <span style={{ color: '#dc2626' }}>*</span>
                                    </label>
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        placeholder="0550 12 34 56"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>
                                        Wilaya <span style={{ color: '#dc2626' }}>*</span>
                                    </label>
                                    <select
                                        name="wilaya"
                                        value={formData.wilaya}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                                    >
                                        {wilayas.map(w => (
                                            <option key={w.id} value={`${w.code} - ${w.name}`}>
                                                {w.code} - {w.name} ({w.nameAr})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button
                                    type="submit"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        backgroundColor: 'var(--ford-blue)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '1.1rem',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(0, 52, 120, 0.3)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Envoyer ma demande de devis à Krimo
                                </button>

                                <div style={{ textAlign: 'center', margin: '0.25rem 0', color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600' }}>
                                    — OU ENVOI INSTANTANÉ —
                                </div>

                                <a
                                    href={getWhatsAppLink(waMessage)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        width: '100%',
                                        padding: '0.95rem',
                                        backgroundColor: '#25D366',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '1.05rem',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.6rem',
                                        boxShadow: '0 4px 15px rgba(37, 211, 102, 0.25)'
                                    }}
                                >
                                    <span>Transmettre directement sur WhatsApp</span>
                                    <span>💬</span>
                                </a>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VinRequestPage;
