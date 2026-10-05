import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const INITIAL_KITS = [
    {
        id: 'kit-1',
        title: 'Pack Vidange Intégrale Motorcraft 10 000 km',
        model: 'Ford Focus 1.6 TDCi (2011-2018)',
        category: 'Entretien Périodique',
        originalPrice: 22500,
        promoPrice: 19100,
        discountPercent: 15,
        stock: 14,
        isFeatured: true,
        items: [
            'Huile Castrol Magnatec Professional 5W-30 (5L)',
            'Filtre à Huile Motorcraft d\'Origine',
            'Filtre à Air Haute Filtration',
            'Filtre à Carburant (Gazole) avec Joint',
            'Filtre d\'Habitacle Anti-Allergène'
        ],
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'kit-2',
        title: 'Pack Freinage Avant Haute Sécurité',
        model: 'Ford Fiesta 1.4 & 1.6 TDCi (2008-2017)',
        category: 'Freinage',
        originalPrice: 26000,
        promoPrice: 22100,
        discountPercent: 15,
        stock: 9,
        isFeatured: true,
        items: [
            'Jeu de 2 Disques de Frein Avant Ventilés Motorcraft',
            'Jeu de 4 Plaquettes de Frein Avant avec Témoins',
            'Nettoyant Freins Professionnel 500ml Offert'
        ],
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'kit-3',
        title: 'Pack Distribution Renforcée + Pompe à Eau',
        model: 'Ford Ranger 2.2 / 3.2 TDCi (2012-2022)',
        category: 'Distribution & Courroies',
        originalPrice: 48000,
        promoPrice: 40800,
        discountPercent: 15,
        stock: 6,
        isFeatured: false,
        items: [
            'Courroie de Distribution Haute Résistance',
            'Galet Tendeur Automatique OEM',
            'Galet Enrouleur de Précision',
            'Pompe à Eau avec Joint Métallique'
        ],
        image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'kit-4',
        title: 'Pack Révision Grand Froid & Transit Pro',
        model: 'Ford Transit 2.2 TDCi (V347 / V363)',
        category: 'Utilitaire Pro',
        originalPrice: 31000,
        promoPrice: 26350,
        discountPercent: 15,
        stock: 12,
        isFeatured: true,
        items: [
            'Huile Synthétique Ultra-Endurance 5W-30 (7L)',
            'Filtre à Gazole avec Détecteur d\'Eau',
            'Filtre à Huile Haute Capacité',
            'Filtre à Air Heavy Duty'
        ],
        image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80'
    }
];

const AdminKitsManager = () => {
    const [kits, setKits] = useState(() => {
        const stored = localStorage.getItem('krimo_admin_kits');
        return stored ? JSON.parse(stored) : INITIAL_KITS;
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingKit, setEditingKit] = useState(null);

    // Form state
    const [title, setTitle] = useState('');
    const [model, setModel] = useState('');
    const [category, setCategory] = useState('Entretien Périodique');
    const [originalPrice, setOriginalPrice] = useState('');
    const [promoPrice, setPromoPrice] = useState('');
    const [stock, setStock] = useState('10');
    const [itemsText, setItemsText] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
        localStorage.setItem('krimo_admin_kits', JSON.stringify(kits));
    }, [kits]);

    const handleOpenCreate = () => {
        setEditingKit(null);
        setTitle('');
        setModel('Ford Focus');
        setCategory('Entretien Périodique');
        setOriginalPrice('');
        setPromoPrice('');
        setStock('10');
        setItemsText('');
        setImage('https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80');
        setIsModalOpen(true);
    };

    const handleOpenEdit = (kit) => {
        setEditingKit(kit);
        setTitle(kit.title);
        setModel(kit.model);
        setCategory(kit.category);
        setOriginalPrice(kit.originalPrice.toString());
        setPromoPrice(kit.promoPrice.toString());
        setStock(kit.stock.toString());
        setItemsText(kit.items.join('\n'));
        setImage(kit.image);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Supprimer ce pack d\'entretien ?')) {
            setKits(prev => prev.filter(k => k.id !== id));
            toast.success('Pack supprimé');
        }
    };

    const handleToggleFeatured = (id) => {
        setKits(prev => prev.map(k => k.id === id ? { ...k, isFeatured: !k.isFeatured } : k));
        toast.success('Mise en avant mise à jour');
    };

    const handleSaveKit = (e) => {
        e.preventDefault();
        const orig = Number(originalPrice);
        const promo = Number(promoPrice);
        const discount = orig > 0 && promo > 0 ? Math.round(((orig - promo) / orig) * 100) : 15;
        const itemsArray = itemsText.split('\n').map(s => s.trim()).filter(Boolean);

        if (editingKit) {
            setKits(prev => prev.map(k => {
                if (k.id === editingKit.id) {
                    return {
                        ...k,
                        title,
                        model,
                        category,
                        originalPrice: orig,
                        promoPrice: promo,
                        discountPercent: discount,
                        stock: Number(stock),
                        items: itemsArray.length ? itemsArray : k.items,
                        image: image || k.image
                    };
                }
                return k;
            }));
            toast.success('Pack modifié avec succès');
        } else {
            const newKit = {
                id: 'kit-' + Date.now(),
                title,
                model,
                category,
                originalPrice: orig,
                promoPrice: promo,
                discountPercent: discount,
                stock: Number(stock),
                isFeatured: true,
                items: itemsArray.length ? itemsArray : ['Pièces détachées certifiées Motorcraft'],
                image: image || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80'
            };
            setKits([newKit, ...kits]);
            toast.success('Nouveau pack créé !');
        }

        setIsModalOpen(false);
    };

    return (
        <div style={{ paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                    <h1 className="logo-text admin-header-title" style={{ fontSize: '2.4rem', color: 'var(--ford-blue)', margin: 0 }}>
                        🛠️ Gestion des Packs Entretien & Vidange
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0.4rem 0 0 0' }}>
                        Bundles clés en main avec remise affichés sur la page client <code>/kits</code>.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <span>➕</span>
                    <span>Créer un Pack Entretien</span>
                </button>
            </div>

            {/* Kits Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
                {kits.map(kit => (
                    <div
                        key={kit.id}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{ position: 'relative', height: '160px', backgroundColor: '#0f172a' }}>
                            <img
                                src={kit.image}
                                alt={kit.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: '999px',
                                fontWeight: '800',
                                fontSize: '0.8rem',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}>
                                -{kit.discountPercent}% PROMO
                            </div>
                            <div style={{
                                position: 'absolute',
                                bottom: '12px',
                                left: '12px',
                                backgroundColor: 'rgba(0, 52, 120, 0.9)',
                                color: 'white',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: '700'
                            }}>
                                🚗 {kit.model}
                            </div>
                        </div>

                        <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                                {kit.title}
                            </h3>

                            {/* Price Line */}
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--ford-blue)' }}>
                                    {kit.promoPrice.toLocaleString('fr-DZ')} DA
                                </span>
                                <span style={{ fontSize: '0.95rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                    {kit.originalPrice.toLocaleString('fr-DZ')} DA
                                </span>
                            </div>

                            {/* Items Included list */}
                            <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', flex: 1 }}>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>
                                    Contenu du pack ({kit.items.length} pièces) :
                                </div>
                                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.825rem', color: '#334155', lineHeight: 1.4 }}>
                                    {kit.items.map((it, idx) => (
                                        <li key={idx} style={{ marginBottom: '2px' }}>{it}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Footer stats & Actions */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: kit.stock > 3 ? '#16a34a' : '#ea580c' }}>
                                    ● {kit.stock} en stock comptoir
                                </span>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleFeatured(kit.id)}
                                        style={{
                                            padding: '0.35rem 0.65rem',
                                            borderRadius: '6px',
                                            border: '1px solid #cbd5e1',
                                            backgroundColor: kit.isFeatured ? '#fef3c7' : 'white',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem',
                                            fontWeight: '700'
                                        }}
                                        title="Mettre en avant sur la page d'accueil"
                                    >
                                        ⭐ {kit.isFeatured ? 'Vedette' : 'Standard'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleOpenEdit(kit)}
                                        style={{
                                            padding: '0.35rem 0.65rem',
                                            borderRadius: '6px',
                                            border: '1px solid #bfdbfe',
                                            backgroundColor: '#eff6ff',
                                            color: 'var(--ford-blue)',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem',
                                            fontWeight: '700'
                                        }}
                                    >
                                        ✏️ Modifier
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(kit.id)}
                                        style={{
                                            padding: '0.35rem 0.5rem',
                                            borderRadius: '6px',
                                            border: '1px solid #fecaca',
                                            backgroundColor: '#fef2f2',
                                            color: '#ef4444',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal: Create/Edit Kit */}
            {isModalOpen && (
                <div
                    onClick={() => setIsModalOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 99999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: '100%',
                            maxWidth: '560px',
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                            maxHeight: '90vh',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{ padding: '1.25rem 1.5rem', backgroundColor: 'var(--ford-blue)', color: 'white' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                                {editingKit ? 'Modifier le Pack Entretien' : 'Créer un Nouveau Pack Entretien'}
                            </h3>
                        </div>

                        <form onSubmit={handleSaveKit} style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>Titre du Pack :</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ex: Pack Vidange Intégrale Focus 1.6 TDCi"
                                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                />
                            </div>

                            <div className="admin-form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>Modèle Compatible :</label>
                                    <input
                                        type="text"
                                        required
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        placeholder="Ex: Ford Fiesta 1.4 TDCi"
                                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>Stock Magasin :</label>
                                    <input
                                        type="number"
                                        required
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                    />
                                </div>
                            </div>

                            <div className="admin-form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>Prix Initial Détail (DA) :</label>
                                    <input
                                        type="number"
                                        required
                                        value={originalPrice}
                                        onChange={(e) => setOriginalPrice(e.target.value)}
                                        placeholder="22000"
                                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>Prix Promo Pack (DA) :</label>
                                    <input
                                        type="number"
                                        required
                                        value={promoPrice}
                                        onChange={(e) => setPromoPrice(e.target.value)}
                                        placeholder="18700"
                                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>
                                    Pièces Incluses (1 ligne par pièce) :
                                </label>
                                <textarea
                                    rows="4"
                                    required
                                    value={itemsText}
                                    onChange={(e) => setItemsText(e.target.value)}
                                    placeholder="Huile Castrol 5W30 (5L)&#10;Filtre à Huile Motorcraft&#10;Filtre à Air OEM&#10;Filtre à Carburant TDCi"
                                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ flex: 1, padding: '0.75rem' }}
                                >
                                    Enregistrer le Pack
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    style={{ padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminKitsManager;
