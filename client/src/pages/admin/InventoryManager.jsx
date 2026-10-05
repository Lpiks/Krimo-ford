import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const INITIAL_PARTS = [
    {
        _id: 'prod-001',
        sku: 'BRK-1807044',
        oemNumber: '1807044',
        name: { fr: 'Plaquettes de Frein Avant Motorcraft Ford Focus 3 / C-Max', en: 'Front Brake Pads Motorcraft Focus 3' },
        price: 7200,
        stock: 8,
        category: 'Freinage',
        carModel: 'Ford Focus',
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=200&q=80'
    },
    {
        _id: 'prod-002',
        sku: 'FLT-1781211',
        oemNumber: '1781211',
        name: { fr: 'Filtre à Carburant (Gazole) TDCi avec Capteur d\'Eau Fiesta/Focus', en: 'Fuel Filter TDCi with Sensor Fiesta' },
        price: 4800,
        stock: 14,
        category: 'Filtration',
        carModel: 'Ford Fiesta',
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=200&q=80'
    },
    {
        _id: 'prod-003',
        sku: 'DST-1753584',
        oemNumber: '1753584',
        name: { fr: 'Kit Courroie de Distribution + Galet Tendeur Fiesta TDCi', en: 'Timing Belt Kit Fiesta TDCi' },
        price: 18500,
        stock: 6,
        category: 'Distribution',
        carModel: 'Ford Fiesta',
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=200&q=80'
    },
    {
        _id: 'prod-004',
        sku: 'SUS-18045',
        oemNumber: 'EB3C-18045-A',
        name: { fr: 'Amortisseur Avant à Gaz Heavy Duty Ford Ranger 4x4', en: 'Front Gas Shock Absorber Ranger' },
        price: 16200,
        stock: 3,
        category: 'Suspension',
        carModel: 'Ford Ranger',
        image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=200&q=80'
    },
    {
        _id: 'prod-005',
        sku: 'MTR-9D475',
        oemNumber: 'BK2Q-9D475-CB',
        name: { fr: 'Vanne EGR Électrique avec Refroidisseur Ford Transit 2.2 TDCi', en: 'EGR Valve Electric Transit' },
        price: 34500,
        stock: 2,
        category: 'Moteur',
        carModel: 'Ford Transit',
        image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=200&q=80'
    },
    {
        _id: 'prod-006',
        sku: 'ALL-1787829',
        oemNumber: '1787829',
        name: { fr: 'Jeu de Bougies d\'Allumage Iridium Haute Performance EcoBoost', en: 'Iridium Spark Plugs Set EcoBoost' },
        price: 6400,
        stock: 11,
        category: 'Allumage',
        carModel: 'Ford Focus',
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=200&q=80'
    }
];

const InventoryManager = () => {
    const { t, i18n } = useTranslation();
    const { userInfo } = useAuth();
    const [products, setProducts] = useState(() => {
        try {
            const stored = localStorage.getItem('krimo_admin_products');
            return stored ? JSON.parse(stored) : INITIAL_PARTS;
        } catch {
            return INITIAL_PARTS;
        }
    });
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        try {
            localStorage.setItem('krimo_admin_products', JSON.stringify(products));
        } catch (e) {
            console.error(e);
        }
    }, [products]);

    const deleteHandler = async (id) => {
        setProducts(prev => prev.filter(p => p._id !== id));
        toast.success('Pièce détachée supprimée du stock');

        if (userInfo?.token) {
            try {
                await axios.delete(`/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
            } catch (error) {
                // Ignore API failure in demo mode
            }
        }
    };

    const confirmDelete = (id) => {
        toast((tObj) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Supprimer cette pièce ?</span>
                <button
                    onClick={() => {
                        deleteHandler(id);
                        toast.dismiss(tObj.id);
                    }}
                    style={{
                        padding: '4px 10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '700'
                    }}
                >
                    Oui
                </button>
                <button
                    onClick={() => toast.dismiss(tObj.id)}
                    style={{
                        padding: '4px 8px',
                        backgroundColor: '#eee',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Non
                </button>
            </div>
        ), {
            duration: 5000,
            position: 'top-center',
        });
    };

    useEffect(() => {
        const fetchLive = async () => {
            if (!userInfo?.token) return;
            try {
                const { data } = await axios.get('/api/products?pageSize=50');
                if (data?.products && Array.isArray(data.products) && data.products.length > 0) {
                    setProducts(data.products);
                }
            } catch (err) {
                // Keep stored demo parts gracefully
            }
        };
        fetchLive();
    }, [userInfo]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Client-side instant filter is handled via filteredProducts
    };

    const getProductName = (prod) => {
        if (!prod?.name) return 'Pièce Ford';
        if (typeof prod.name === 'string') return prod.name;
        return prod.name[i18n.language] || prod.name['fr'] || prod.name['en'] || 'Pièce Ford';
    };

    const filteredProducts = products.filter(p => {
        if (!keyword.trim()) return true;
        const q = keyword.toLowerCase();
        const nameStr = getProductName(p).toLowerCase();
        const oemStr = (p.oemNumber || '').toLowerCase();
        const skuStr = (p.sku || '').toLowerCase();
        const modelStr = (p.carModel?.name || p.carModel || '').toLowerCase();
        return nameStr.includes(q) || oemStr.includes(q) || skuStr.includes(q) || modelStr.includes(q);
    });

    return (
        <div style={{ paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="logo-text admin-header-title" style={{ fontSize: '2.4rem', color: 'var(--ford-blue)', margin: 0 }}>
                        🏷️ Stock des Pièces Détachées Ford
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0.4rem 0 0 0' }}>
                        Gestion des références OEM, tarifs en Dinars (DA) et quantités en magasin.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Link to="/admin/categories" className="btn" style={{ backgroundColor: '#e2e8f0', color: '#1e293b' }}>
                        📂 Catégories
                    </Link>
                    <Link to="/admin/carmodels" className="btn" style={{ backgroundColor: '#e2e8f0', color: '#1e293b' }}>
                        🚗 Modèles Ford
                    </Link>
                    <Link to="/admin/product/new" className="btn btn-primary">
                        ➕ Ajouter Pièce
                    </Link>
                </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <input
                    type="text"
                    placeholder="Recherche par nom, référence OEM (ex: 1807044), modèle (Focus, Fiesta, Ranger)..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        flex: 1,
                        fontSize: '0.95rem'
                    }}
                />
            </form>

            <div style={{ backgroundColor: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', overflowX: 'auto', WebkitOverflowScrolling: 'touch', boxShadow: 'var(--shadow-sm)' }}>
                <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#071d49', color: 'white', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                        <tr>
                            <th style={{ padding: '0.9rem 1rem' }}>SKU</th>
                            <th style={{ padding: '0.9rem 1rem' }}>Réf OEM</th>
                            <th style={{ padding: '0.9rem 1rem' }}>Désignation Pièce</th>
                            <th style={{ padding: '0.9rem 1rem' }}>Prix (DA)</th>
                            <th style={{ padding: '0.9rem 1rem' }}>Stock Comptoir</th>
                            <th style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{ fontSize: '0.88rem' }}>
                        {filteredProducts.map((product) => (
                            <tr key={product._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontFamily: 'monospace' }}>
                                    {product.sku || '-'}
                                </td>
                                <td style={{ padding: '0.85rem 1rem' }}>
                                    <code style={{ backgroundColor: '#eff6ff', color: 'var(--ford-blue)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                                        {product.oemNumber || '-'}
                                    </code>
                                </td>
                                <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#0f172a' }}>
                                    {getProductName(product)}
                                </td>
                                <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: 'var(--ford-blue)' }}>
                                    {product.price.toLocaleString('fr-DZ')} DA
                                </td>
                                <td style={{ padding: '0.85rem 1rem' }}>
                                    <span style={{
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: '800',
                                        backgroundColor: (product.stock || product.countInStock) > 3 ? '#dcfce7' : '#fee2e2',
                                        color: (product.stock || product.countInStock) > 3 ? '#15803d' : '#991b1b'
                                    }}>
                                        ● {product.stock || product.countInStock || 0} en stock
                                    </span>
                                </td>
                                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                                        <Link
                                            to={`/admin/product/${product._id}/edit`}
                                            style={{
                                                textDecoration: 'none',
                                                backgroundColor: '#eff6ff',
                                                color: 'var(--ford-blue)',
                                                border: '1px solid #bfdbfe',
                                                padding: '0.35rem 0.75rem',
                                                borderRadius: '6px',
                                                fontSize: '0.8rem',
                                                fontWeight: '700'
                                            }}
                                        >
                                            ✏️ Modifier
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => confirmDelete(product._id)}
                                            style={{
                                                backgroundColor: '#fef2f2',
                                                color: '#ef4444',
                                                border: '1px solid #fecaca',
                                                padding: '0.35rem 0.6rem',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                fontWeight: '700'
                                            }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredProducts.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                        Aucune pièce trouvée pour « {keyword} »
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryManager;
