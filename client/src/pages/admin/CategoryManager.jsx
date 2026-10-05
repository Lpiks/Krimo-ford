import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const INITIAL_CATEGORIES = [
    { _id: 'cat-1', name: 'Freinage (Plaquettes, Disques)' },
    { _id: 'cat-2', name: 'Filtration (Huile, Air, Gasoil)' },
    { _id: 'cat-3', name: 'Distribution & Courroies' },
    { _id: 'cat-4', name: 'Suspension & Direction' },
    { _id: 'cat-5', name: 'Moteur & Échappement' },
    { _id: 'cat-6', name: 'Embrayage & Boîte de Vitesse' },
    { _id: 'cat-7', name: 'Refroidissement & Climatisation' },
    { _id: 'cat-8', name: 'Éclairage & Composants Électriques' }
];

const CategoryManager = () => {
    const { userInfo } = useAuth();
    const [categories, setCategories] = useState(() => {
        try {
            const stored = localStorage.getItem('krimo_admin_categories');
            return stored ? JSON.parse(stored) : INITIAL_CATEGORIES;
        } catch {
            return INITIAL_CATEGORIES;
        }
    });
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        try {
            localStorage.setItem('krimo_admin_categories', JSON.stringify(categories));
        } catch (e) {
            console.error(e);
        }
    }, [categories]);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('/api/categories');
            if (Array.isArray(data) && data.length > 0) {
                setCategories(data);
            }
        } catch (error) {
            // Backend offline - keep stored demo categories gracefully
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        const newCatObj = { _id: 'cat-' + Date.now(), name: newCategory.trim() };
        setCategories(prev => [...prev, newCatObj]);
        setNewCategory('');
        toast.success('Catégorie ajoutée avec succès');

        if (userInfo?.token) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.post('/api/categories', { name: newCatObj.name }, config);
            } catch (err) {
                // Ignore API failure in demo mode
            }
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedCategories(categories.map(c => c._id));
        } else {
            setSelectedCategories([]);
        }
    };

    const handleSelectOne = (e, id) => {
        if (e.target.checked) {
            setSelectedCategories(prev => [...prev, id]);
        } else {
            setSelectedCategories(prev => prev.filter(cid => cid !== id));
        }
    };

    const handleDelete = async (id) => {
        setCategories(prev => prev.filter(c => c._id !== id));
        setSelectedCategories(prev => prev.filter(cid => cid !== id));
        toast.success('Catégorie supprimée');

        if (userInfo?.token) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`/api/categories/${id}`, config);
            } catch (err) {
                // Ignore
            }
        }
    };

    const [editingCategory, setEditingCategory] = useState(null);
    const [editName, setEditName] = useState('');

    const handleEditClick = (category) => {
        setEditingCategory(category);
        setEditName(category.name);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editName.trim()) return;

        setCategories(prev => prev.map(c => c._id === editingCategory._id ? { ...c, name: editName.trim() } : c));
        setEditingCategory(null);
        toast.success('Catégorie mise à jour');

        if (userInfo?.token) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.put(`/api/categories/${editingCategory._id}`, { name: editName.trim() }, config);
            } catch (err) {
                // Ignore
            }
        }
    };

    return (
        <div style={{ paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="logo-text admin-header-title" style={{ fontSize: '2.4rem', color: 'var(--ford-blue)', margin: 0 }}>
                        📂 Gestion des Catégories de Pièces
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0.4rem 0 0 0' }}>
                        Catégories utilisées pour le filtrage du catalogue en ligne.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Link to="/admin/carmodels" className="btn" style={{ backgroundColor: '#e2e8f0', color: '#1e293b' }}>
                        🚗 Voir Modèles Ford
                    </Link>
                    <Link to="/admin/products" className="btn btn-primary">
                        🏷️ Voir Stock Pièces
                    </Link>
                </div>
            </div>

            {/* Add Category Form */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#0f172a' }}>Ajouter une nouvelle catégorie</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Ex: Échappement & Catalyseur, Climatisation..."
                        style={{ flex: 1, minWidth: '240px', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                        required
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
                        ➕ Ajouter
                    </button>
                </form>
            </div>

            {/* Categories Table */}
            <div style={{ backgroundColor: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', overflowX: 'auto', WebkitOverflowScrolling: 'touch', boxShadow: 'var(--shadow-sm)' }}>
                <table style={{ width: '100%', minWidth: '450px', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#071d49', color: 'white', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                        <tr>
                            <th style={{ padding: '0.9rem 1.25rem', width: '40px' }}>
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={categories.length > 0 && selectedCategories.length === categories.length}
                                />
                            </th>
                            <th style={{ padding: '0.9rem 1.25rem' }}>Nom de la Catégorie</th>
                            <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '0.85rem 1.25rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category._id)}
                                        onChange={(e) => handleSelectOne(e, category._id)}
                                    />
                                </td>
                                <td style={{ padding: '0.85rem 1.25rem', fontWeight: '700', color: '#0f172a' }}>
                                    {category.name}
                                </td>
                                <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                                    <button
                                        type="button"
                                        onClick={() => handleEditClick(category)}
                                        style={{ marginRight: '0.5rem', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}
                                    >
                                        ✏️ Modifier
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(category._id)}
                                        style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}
                                    >
                                        🗑️ Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Category Modal */}
            {editingCategory && (
                <div
                    onClick={() => setEditingCategory(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(3px)',
                        zIndex: 99999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: '100%', maxWidth: '420px', backgroundColor: 'white', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                    >
                        <h3 style={{ margin: '0 0 1rem 0' }}>Modifier la catégorie</h3>
                        <form onSubmit={handleUpdate}>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1rem' }}
                                required
                            />
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setEditingCategory(null)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer' }}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManager;
