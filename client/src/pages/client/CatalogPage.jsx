import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../../components/shared/ProductCard';
import { useGarage } from '../../context/GarageContext';

// Rich fallback products for immediate demo if backend database has not yet seeded products
const SAMPLE_PRODUCTS = [
    {
        _id: 'sample-p1',
        name: { fr: 'Plaquettes de Frein Avant Motorcraft Ford Focus / C-Max', ar: 'صفائح فرامل أمامية أصلية فورد فوكس', en: 'Front Brake Pads Motorcraft Ford Focus' },
        price: 7200,
        oemNumber: '1807044',
        sku: 'BRK-FC3-FR',
        category: 'Brakes',
        fuelType: 'All',
        stock: 12,
        images: ['https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=600&q=80'],
        compatibility: [{ make: 'Ford', model: 'Focus', year: 2016 }, { make: 'Ford', model: 'C-Max', year: 2015 }]
    },
    {
        _id: 'sample-p2',
        name: { fr: 'Filtre à Carburant (Gazole) TDCi avec Capteur d\'Eau', ar: 'فلتر مازوت أصلي فورد فييستا و فوكس', en: 'Fuel Filter TDCi with Water Sensor' },
        price: 4800,
        oemNumber: '1781211',
        sku: 'FLT-TDC-DS',
        category: 'Filters',
        fuelType: 'Diesel',
        stock: 18,
        images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80'],
        compatibility: [{ make: 'Ford', model: 'Fiesta', year: 2014 }, { make: 'Ford', model: 'Focus', year: 2017 }]
    },
    {
        _id: 'sample-p3',
        name: { fr: 'Kit Courroie de Distribution + Galet Tendeur Ford Fiesta TDCi', ar: 'طقم سير الكاتينة مع البلية فورد فييستا', en: 'Timing Belt Kit + Tensioner Fiesta TDCi' },
        price: 18500,
        oemNumber: '1753584',
        sku: 'TIM-FST-68',
        category: 'Engine',
        fuelType: 'Diesel',
        stock: 5,
        images: ['https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80'],
        compatibility: [{ make: 'Ford', model: 'Fiesta', year: 2012 }, { make: 'Ford', model: 'Focus', year: 2013 }]
    },
    {
        _id: 'sample-p4',
        name: { fr: 'Amortisseur Avant à Gaz Heavy Duty Ford Ranger 4x4', ar: 'ممتص صدمات أمامي غاز فورد رينجر 4x4', en: 'Front Gas Shock Absorber Heavy Duty Ford Ranger' },
        price: 16200,
        oemNumber: 'EB3C-18045-A',
        sku: 'SHK-RNG-HD',
        category: 'Suspension',
        fuelType: 'Diesel',
        stock: 8,
        images: ['https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&q=80'],
        compatibility: [{ make: 'Ford', model: 'Ranger', year: 2018 }]
    },
    {
        _id: 'sample-p5',
        name: { fr: 'Vanne EGR Électrique avec Refroidisseur Ford Transit 2.2 TDCi', ar: 'صمام إي جي آر كهربائي فورد ترانزيت', en: 'Electric EGR Valve with Cooler Ford Transit' },
        price: 34500,
        oemNumber: 'BK2Q-9D475-CB',
        sku: 'EGR-TRN-22',
        category: 'Engine',
        fuelType: 'Diesel',
        stock: 4,
        images: ['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80'],
        compatibility: [{ make: 'Ford', model: 'Transit', year: 2016 }]
    },
    {
        _id: 'sample-p6',
        name: { fr: 'Jeu de Bougies d\'Allumage Iridium Haute Performance EcoBoost', ar: 'شمعات احتراق إيريديوم فورد إيكوبوست', en: 'Iridium Spark Plugs Set Ford EcoBoost' },
        price: 6400,
        oemNumber: '1787829',
        sku: 'SPK-ECO-IR',
        category: 'Electrical',
        fuelType: 'Essence',
        stock: 22,
        images: ['https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80'],
        compatibility: [{ make: 'Ford', model: 'Focus', year: 2018 }, { make: 'Ford', model: 'EcoSport', year: 2019 }]
    }
];

const CATEGORIES = [
    { id: 'All', label: 'Toutes les catégories' },
    { id: 'Brakes', label: 'Freinage' },
    { id: 'Filters', label: 'Filtration' },
    { id: 'Suspension', label: 'Suspension & Direction' },
    { id: 'Engine', label: 'Moteur & Distribution' },
    { id: 'Electrical', label: 'Électricité & Allumage' },
    { id: 'Body', label: 'Carrosserie & Éclairage' },
    { id: 'Accessories', label: 'Accessoires & Huiles' }
];

const CatalogPage = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { selectedVehicle, openGarageModal } = useGarage();

    const categoryParam = searchParams.get('category') || 'All';
    const yearParam = searchParams.get('year');
    const modelParam = searchParams.get('model');
    const fuelTypeParam = searchParams.get('fuelType');
    const keywordParam = searchParams.get('keyword') || '';

    const [keyword, setKeyword] = useState(keywordParam);
    const [selectedFuel, setSelectedFuel] = useState(fuelTypeParam || 'All');
    const [filterOnlyGarage, setFilterOnlyGarage] = useState(false);
    const [inStockOnly, setInStockOnly] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let query = `/api/products?keyword=${encodeURIComponent(keyword)}`;
            if (categoryParam && categoryParam !== 'All') query += `&category=${categoryParam}`;
            if (yearParam) query += `&year=${yearParam}`;
            if (modelParam) query += `&model=${modelParam}`;
            if (selectedFuel && selectedFuel !== 'All') query += `&fuelType=${selectedFuel}`;

            const res = await axios.get(query);
            if (res.data && res.data.products && res.data.products.length > 0) {
                setProducts(res.data.products);
            } else {
                // Fallback to sample products if DB has none so client can inspect immediately
                setProducts(SAMPLE_PRODUCTS);
            }
            setLoading(false);
        } catch (err) {
            // If server offline or empty, gracefully serve samples
            setProducts(SAMPLE_PRODUCTS);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [categoryParam, yearParam, modelParam, selectedFuel, keywordParam]);

    const handleCategorySelect = (catId) => {
        const nextParams = new URLSearchParams(searchParams);
        if (catId === 'All') {
            nextParams.delete('category');
        } else {
            nextParams.set('category', catId);
        }
        setSearchParams(nextParams);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const nextParams = new URLSearchParams(searchParams);
        if (keyword.trim()) {
            nextParams.set('keyword', keyword.trim());
        } else {
            nextParams.delete('keyword');
        }
        setSearchParams(nextParams);
    };

    // Filter displayed products by local toggles (garage match, inStock)
    const displayedProducts = products.filter(p => {
        if (inStockOnly && p.stock !== undefined && p.stock <= 0) return false;
        if (filterOnlyGarage && selectedVehicle) {
            const hasMatch = p.compatibility && p.compatibility.some(c =>
                c.model?.toLowerCase() === selectedVehicle.model?.toLowerCase()
            );
            if (!hasMatch) return false;
        }
        return true;
    });

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '90vh', padding: '2.5rem 1rem 5rem 1rem' }}>
            <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>

                {/* Top Garage Notification Bar if Active */}
                {selectedVehicle && (
                    <div style={{
                        backgroundColor: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '16px',
                        padding: '1rem 1.5rem',
                        marginBottom: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>🚗</span>
                            <div>
                                <strong style={{ color: 'var(--ford-blue)', fontSize: '0.95rem' }}>
                                    Mon Garage Actif : Ford {selectedVehicle.model} {selectedVehicle.year ? `(${selectedVehicle.year})` : ''}
                                </strong>
                                <div style={{ fontSize: '0.85rem', color: '#1e40af' }}>
                                    Les pièces compatibles portent le badge vert de garantie.
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: '#1e3a8a', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={filterOnlyGarage}
                                    onChange={(e) => setFilterOnlyGarage(e.target.checked)}
                                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                />
                                Afficher uniquement pour ma {selectedVehicle.model}
                            </label>

                            <button
                                type="button"
                                onClick={openGarageModal}
                                style={{
                                    backgroundColor: 'white',
                                    border: '1px solid #93c5fd',
                                    borderRadius: '8px',
                                    padding: '0.35rem 0.8rem',
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                    color: 'var(--ford-blue)',
                                    cursor: 'pointer'
                                }}
                            >
                                Changer
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Heading & Search Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                            Catalogue Pièces Ford
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0.35rem 0 0 0' }}>
                            {displayedProducts.length} pièces disponibles à la Soummam et en expédition nationale.
                        </p>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', minWidth: 0, width: '100%', flex: '1', maxWidth: '480px' }}>
                        <input
                            type="text"
                            placeholder="Recherche par nom ou référence OEM (ex: 1807044)..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '0.75rem 1rem',
                                borderRadius: '12px',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.95rem',
                                outline: 'none',
                                backgroundColor: 'white'
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '0.75rem 1.25rem',
                                backgroundColor: 'var(--ford-blue)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}
                        >
                            Rechercher
                        </button>
                    </form>
                </div>

                {/* Layout with Sidebar & Products Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }} className="catalog-layout">

                    {/* Sidebar Filters */}
                    <aside style={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        padding: '1.5rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
                    }}>
                        <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '1rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                            Filtres & Catégories
                        </div>

                        {/* Category List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.75rem' }}>
                            {CATEGORIES.map(cat => {
                                const isCurrent = categoryParam === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => handleCategorySelect(cat.id)}
                                        style={{
                                            textAlign: 'left',
                                            padding: '0.55rem 0.85rem',
                                            borderRadius: '8px',
                                            border: 'none',
                                            backgroundColor: isCurrent ? 'var(--ford-blue)' : 'transparent',
                                            color: isCurrent ? 'white' : '#475569',
                                            fontWeight: isCurrent ? '700' : '500',
                                            fontSize: '0.875rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s'
                                        }}
                                    >
                                        {cat.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Fuel Type Filter */}
                        <div style={{ marginBottom: '1.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                            <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#334155', marginBottom: '0.5rem' }}>
                                Motorisation :
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                                {['All', 'Diesel', 'Essence'].map(fuel => (
                                    <label key={fuel} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#475569' }}>
                                        <input
                                            type="radio"
                                            name="fuelFilter"
                                            checked={selectedFuel === fuel}
                                            onChange={() => setSelectedFuel(fuel)}
                                        />
                                        {fuel === 'All' ? 'Toutes' : fuel}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* In Stock toggle */}
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                                <input
                                    type="checkbox"
                                    checked={inStockOnly}
                                    onChange={(e) => setInStockOnly(e.target.checked)}
                                />
                                En Stock Immédiat uniquement
                            </label>
                        </div>

                        {/* Quick Quote CTA Box in Sidebar */}
                        <div style={{
                            backgroundColor: '#f8fafc',
                            borderRadius: '12px',
                            padding: '1.25rem',
                            border: '1px solid #e2e8f0',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>📋</div>
                            <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                                Pièce Introuvable ?
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.75rem 0' }}>
                                Envoyez votre carte grise à Krimo pour devis en 15 min.
                            </p>
                            <Link
                                to="/vin-request"
                                style={{
                                    display: 'block',
                                    padding: '0.5rem',
                                    backgroundColor: 'var(--ford-blue)',
                                    color: 'white',
                                    borderRadius: '8px',
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                    textDecoration: 'none'
                                }}
                            >
                                Devis Carte Grise →
                            </Link>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div>
                        {displayedProducts.length > 0 ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
                                gap: '1.75rem'
                            }}>
                                {displayedProducts.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            /* Empty state with helpful actions */
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                padding: '3.5rem 2rem',
                                textAlign: 'center',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                                    Aucune pièce trouvée pour ces critères
                                </h3>
                                <p style={{ color: '#64748b', maxWidth: '450px', margin: '0 auto 1.75rem auto', fontSize: '0.95rem' }}>
                                    La pièce que vous cherchez n'est peut-être pas encore indexée en ligne, mais disponible dans notre stock au Boulevard de la Soummam.
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <Link
                                        to="/vin-request"
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
                                        Demander par Carte Grise / VIN
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setKeyword('');
                                            setSelectedFuel('All');
                                            setFilterOnlyGarage(false);
                                            setInStockOnly(false);
                                            handleCategorySelect('All');
                                        }}
                                        style={{
                                            padding: '0.75rem 1.25rem',
                                            backgroundColor: '#f1f5f9',
                                            color: '#334155',
                                            border: '1px solid #cbd5e1',
                                            borderRadius: '10px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        Réinitialiser les filtres
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CatalogPage;
