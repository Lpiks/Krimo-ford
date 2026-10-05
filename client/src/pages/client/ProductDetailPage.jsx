import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useGarage } from '../../context/GarageContext';
import { toast } from 'react-hot-toast';
import { getWhatsAppLink, createProductInquiryWhatsAppMessage } from '../../utils/whatsapp';

const ProductDetailPage = () => {
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { selectedVehicle, checkFitment, openGarageModal } = useGarage();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [qty, setQty] = useState(1);

    // Interactive fitment test local state if no garage set
    const [testModel, setTestModel] = useState('');
    const [testYear, setTestYear] = useState('');
    const [testResult, setTestResult] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
                if (data.images && data.images.length > 0) {
                    setMainImage(data.images[0]);
                }
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
                toast.error(t('common.errorLoadingProduct', 'Erreur chargement produit'));
            }
        };

        fetchProduct();
        window.scrollTo(0, 0);
    }, [id, t]);

    const handleQuantityChange = (delta) => {
        setQty(prev => Math.max(1, prev + delta));
    };

    const getLocalizedContent = (field) => {
        if (!product) return '';
        return product[field] && product[field][i18n.language]
            ? product[field][i18n.language]
            : product[field] && product[field]['en']
                ? product[field]['en']
                : 'N/A';
    };

    const fitment = checkFitment(product);

    const handleManualFitmentCheck = (e) => {
        e.preventDefault();
        if (!testModel) return;

        const isMatch = product.compatibility && product.compatibility.some(c => {
            const mMatch = c.model?.toLowerCase() === testModel.toLowerCase();
            const yMatch = !testYear || Number(c.year) === Number(testYear);
            return mMatch && yMatch;
        });

        setTestResult(isMatch);
    };

    const waMessage = createProductInquiryWhatsAppMessage({
        product,
        vehicle: selectedVehicle,
        language: i18n.language
    });

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div style={{ color: 'var(--ford-blue)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Chargement de la pièce...
            </div>
        </div>
    );

    if (error) return (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <h2 style={{ color: '#dc2626' }}>Erreur de chargement</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/catalog')} style={{ marginTop: '1rem' }}>
                Retour au catalogue
            </button>
        </div>
    );

    if (!product) return null;

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '90vh', padding: '2.5rem 1rem 5rem 1rem' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Breadcrumbs & Navigation */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                        <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>Accueil</Link>
                        <span>/</span>
                        <Link to="/catalog" style={{ color: '#64748b', textDecoration: 'none' }}>Catalogue</Link>
                        <span>/</span>
                        <span style={{ color: 'var(--ford-blue)', fontWeight: '600' }}>{product.category}</span>
                    </div>

                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'white',
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#334155',
                            cursor: 'pointer',
                            padding: '0.4rem 0.85rem',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                        }}
                    >
                        ← Retour
                    </button>
                </div>

                {/* Main Product Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 'clamp(1.5rem, 4vw, 3rem)', marginBottom: '3.5rem' }}>

                    {/* Column 1: Images */}
                    <div>
                        <div style={{
                            width: '100%',
                            height: 'clamp(260px, 50vw, 420px)',
                            backgroundColor: '#ffffff',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
                            border: '1px solid #e2e8f0',
                            position: 'relative',
                            marginBottom: '1rem'
                        }}>
                            {mainImage ? (
                                <img
                                    src={mainImage}
                                    alt={getLocalizedContent('name')}
                                    style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                                />
                            ) : (
                                <span style={{ color: '#94a3b8', fontWeight: 'bold' }}>Pièce Ford d'Origine</span>
                            )}

                            <div style={{
                                position: 'absolute',
                                top: '15px',
                                left: '15px',
                                backgroundColor: 'var(--ford-blue)',
                                color: 'white',
                                padding: '0.35rem 0.8rem',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                fontWeight: '700'
                            }}>
                                100% Origine Certifiée
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                {product.images.map((img, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setMainImage(img)}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '12px',
                                            border: mainImage === img ? '2px solid var(--ford-blue)' : '1px solid #cbd5e1',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            flexShrink: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#ffffff',
                                            transition: 'border-color 0.2s'
                                        }}
                                    >
                                        <img src={img} alt={`Thumb ${index}`} style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Column 2: Product Data & Buying Box */}
                    <div>
                        {/* OEM & Category Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                            <span style={{
                                backgroundColor: '#f1f5f9',
                                color: '#475569',
                                padding: '0.3rem 0.75rem',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                fontFamily: 'monospace'
                            }}>
                                OEM: {product.oemNumber}
                            </span>
                            <span style={{
                                backgroundColor: 'rgba(0, 52, 120, 0.08)',
                                color: 'var(--ford-blue)',
                                padding: '0.3rem 0.75rem',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                fontWeight: '700'
                            }}>
                                {product.category}
                            </span>
                            <span style={{
                                backgroundColor: product.fuelType === 'Diesel' ? '#fef3c7' : '#dbeafe',
                                color: product.fuelType === 'Diesel' ? '#92400e' : '#1e40af',
                                padding: '0.3rem 0.75rem',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                fontWeight: '700'
                            }}>
                                {product.fuelType}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 style={{
                            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                            color: '#0f172a',
                            marginBottom: '1rem',
                            fontWeight: '800',
                            lineHeight: 1.25
                        }}>
                            {getLocalizedContent('name')}
                        </h1>

                        {/* 1. Guaranteed Fitment Box (Industry UX) */}
                        <div style={{
                            backgroundColor: fitment.checked && fitment.compatible ? '#f0fdf4' : fitment.checked && !fitment.compatible ? '#fef2f2' : '#f8fafc',
                            border: `1.5px solid ${fitment.checked && fitment.compatible ? '#86efac' : fitment.checked && !fitment.compatible ? '#fca5a5' : '#e2e8f0'}`,
                            borderRadius: '16px',
                            padding: '1.25rem',
                            marginBottom: '1.75rem'
                        }}>
                            {fitment.checked ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '1.6rem' }}>{fitment.compatible ? '✅' : '⚠️'}</span>
                                        <div>
                                            <div style={{
                                                fontWeight: '800',
                                                fontSize: '0.95rem',
                                                color: fitment.compatible ? '#166534' : '#991b1b'
                                            }}>
                                                {fitment.compatible
                                                    ? `Garantie Compatibilité : Monte sur votre Ford ${selectedVehicle.model} ${selectedVehicle.year || ''}`
                                                    : `Non compatible avec votre Ford ${selectedVehicle.model}`}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: fitment.compatible ? '#15803d' : '#b91c1c' }}>
                                                {fitment.compatible ? 'Vérifié par la base technique de Krimo.' : 'Contactez Krimo pour la référence adaptée à votre moteur.'}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={openGarageModal}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid #cbd5e1',
                                            borderRadius: '6px',
                                            padding: '0.25rem 0.6rem',
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Changer de voiture
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                        <span>🚗</span>
                                        <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>
                                            Vérifiez si cette pièce va sur votre Ford :
                                        </span>
                                    </div>

                                    <form onSubmit={handleManualFitmentCheck} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <select
                                            value={testModel}
                                            onChange={(e) => setTestModel(e.target.value)}
                                            style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                                        >
                                            <option value="">Sélectionnez votre Modèle</option>
                                            <option value="Focus">Ford Focus</option>
                                            <option value="Fiesta">Ford Fiesta</option>
                                            <option value="Ranger">Ford Ranger</option>
                                            <option value="Transit">Ford Transit</option>
                                            <option value="Kuga">Ford Kuga</option>
                                            <option value="Mondeo">Ford Mondeo</option>
                                            <option value="EcoSport">Ford EcoSport</option>
                                        </select>

                                        <input
                                            type="number"
                                            placeholder="Année (ex: 2017)"
                                            value={testYear}
                                            onChange={(e) => setTestYear(e.target.value)}
                                            style={{ width: '120px', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                                        />

                                        <button
                                            type="submit"
                                            style={{
                                                padding: '0.5rem 1rem',
                                                backgroundColor: 'var(--ford-blue)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontWeight: '700',
                                                fontSize: '0.85rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Vérifier
                                        </button>
                                    </form>

                                    {testResult !== null && (
                                        <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', fontWeight: '700', color: testResult ? '#16a34a' : '#dc2626' }}>
                                            {testResult ? '✓ Compatible avec ce modèle Ford !' : '✕ Cette référence n\'est pas listée pour ce modèle.'}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Price Display */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
                            <div style={{
                                fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
                                fontWeight: '900',
                                color: 'var(--ford-blue)'
                            }}>
                                {product.price ? product.price.toLocaleString() : 0} DA
                            </div>
                            <div style={{ color: '#16a34a', fontWeight: '700', fontSize: '0.9rem' }}>
                                ● En Stock au Dépôt Soummam
                            </div>
                        </div>

                        {/* Quantity and Actions Bar */}
                        <div style={{
                            backgroundColor: 'white',
                            padding: 'clamp(1rem, 3.5vw, 1.75rem)',
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            border: '1px solid #e2e8f0',
                            marginBottom: '2rem'
                        }}>
                            {/* Quantity Selector */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                <label style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>Quantité :</label>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    backgroundColor: '#f1f5f9',
                                    borderRadius: '10px',
                                    padding: '3px'
                                }}>
                                    <button
                                        type="button"
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={qty <= 1}
                                        style={{
                                            width: '34px', height: '34px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: qty <= 1 ? 'transparent' : 'white',
                                            color: qty <= 1 ? '#94a3b8' : 'var(--ford-blue)',
                                            cursor: qty <= 1 ? 'default' : 'pointer',
                                            fontWeight: 'bold',
                                            fontSize: '1.1rem',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        -
                                    </button>
                                    <span style={{ width: '45px', textAlign: 'center', fontWeight: '800', fontSize: '1rem', color: '#0f172a' }}>
                                        {qty}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleQuantityChange(1)}
                                        style={{
                                            width: '34px', height: '34px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: 'white',
                                            color: 'var(--ford-blue)',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            fontSize: '1.1rem',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Dual Buy Buttons */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        addToCart(product, qty);
                                        toast.success(t('cart.added', 'Ajouté au panier !'));
                                    }}
                                    style={{
                                        padding: '1rem',
                                        backgroundColor: 'var(--ford-blue)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '1.05rem',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.6rem',
                                        boxShadow: '0 4px 15px rgba(0, 52, 120, 0.3)'
                                    }}
                                >
                                    <span>🛒</span>
                                    <span>Ajouter au Panier</span>
                                </button>

                                <a
                                    href={getWhatsAppLink(waMessage)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        padding: '1rem',
                                        backgroundColor: '#25D366',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '1.05rem',
                                        fontWeight: '800',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.6rem',
                                        boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                                    }}
                                >
                                    <span>Commander par WhatsApp</span>
                                    <span>💬</span>
                                </a>
                            </div>
                        </div>

                        {/* Reassurance Checklist */}
                        <div style={{
                            backgroundColor: '#f8fafc',
                            padding: '1.25rem',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            fontSize: '0.85rem',
                            color: '#475569'
                        }}>
                            <div>✓ <strong>Livraison 58 Wilayas :</strong> 24h Express à Alger / 24-48h pour les autres wilayas.</div>
                            <div>✓ <strong>Paiement à Réception :</strong> Vous ne payez qu'après réception et inspection de la pièce.</div>
                            <div>✓ <strong>Retrait au Magasin :</strong> Disponible immédiatement au Boulevard de la Soummam (Alger).</div>
                        </div>
                    </div>
                </div>

                {/* Technical Specifications & Description */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    padding: 'clamp(1.25rem, 4vw, 2.5rem)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    border: '1px solid #e2e8f0',
                    marginBottom: '3rem'
                }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                        Description & Spécifications Techniques
                    </h2>
                    <p style={{ lineHeight: '1.8', color: '#334155', fontSize: '1.05rem', marginBottom: '2rem' }}>
                        {getLocalizedContent('description')}
                    </p>

                    {/* Cross-reference codes table */}
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem' }}>
                        Références Croisées & Équivalences Fabricants
                    </h3>
                    <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '0.75rem', fontWeight: '700', color: '#64748b', width: '200px' }}>Numéro OEM Ford :</td>
                                    <td style={{ padding: '0.75rem', fontWeight: '700', color: 'var(--ford-blue)' }}>{product.oemNumber}</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '0.75rem', fontWeight: '700', color: '#64748b' }}>Référence SKU Interne :</td>
                                    <td style={{ padding: '0.75rem', color: '#334155' }}>{product.sku || 'SKU-FORD-' + product.oemNumber}</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '0.75rem', fontWeight: '700', color: '#64748b' }}>Marques Équivalentes :</td>
                                    <td style={{ padding: '0.75rem', color: '#334155' }}>Motorcraft, Bosch, Valeo, Purflux, Febi Bilstein</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Full Compatibility List */}
                    {product.compatibility && product.compatibility.length > 0 && (
                        <div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem' }}>
                                Véhicules Compatibles Certifiés :
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                {product.compatibility.map((item, idx) => (
                                    <span key={idx} style={{
                                        backgroundColor: '#eff6ff',
                                        color: 'var(--ford-blue)',
                                        padding: '0.45rem 0.9rem',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem',
                                        fontWeight: '700',
                                        border: '1px solid #bfdbfe'
                                    }}>
                                        🚗 {item.make} {item.model} {item.year ? `(${item.year})` : ''}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
