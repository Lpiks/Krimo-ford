import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const INITIAL_CAR_MODELS = [
    { _id: 'mod-1', name: 'Ford Focus (1.6 TDCi / 1.0 EcoBoost)' },
    { _id: 'mod-2', name: 'Ford Fiesta (1.4 TDCi / 1.25 Essence)' },
    { _id: 'mod-3', name: 'Ford Ranger (2.2 & 3.2 TDCi 4x4)' },
    { _id: 'mod-4', name: 'Ford Transit (2.2 TDCi V347 & V363)' },
    { _id: 'mod-5', name: 'Ford Kuga (2.0 TDCi AWD)' },
    { _id: 'mod-6', name: 'Ford EcoSport (1.5 TDCi / 1.0 EcoBoost)' },
    { _id: 'mod-7', name: 'Ford Mondeo (2.0 TDCi Titanium)' },
    { _id: 'mod-8', name: 'Ford C-Max / Grand C-Max' }
];

const CarModelManager = () => {
    const { userInfo } = useAuth();
    const [carModels, setCarModels] = useState(() => {
        try {
            const stored = localStorage.getItem('krimo_admin_carmodels');
            return stored ? JSON.parse(stored) : INITIAL_CAR_MODELS;
        } catch {
            return INITIAL_CAR_MODELS;
        }
    });
    const [newCarModel, setNewCarModel] = useState('');
    const [selectedModels, setSelectedModels] = useState([]);

    useEffect(() => {
        try {
            localStorage.setItem('krimo_admin_carmodels', JSON.stringify(carModels));
        } catch (e) {
            console.error(e);
        }
    }, [carModels]);

    const fetchCarModels = async () => {
        try {
            const { data } = await axios.get('/api/carmodels');
            if (Array.isArray(data) && data.length > 0) {
                setCarModels(data);
            }
        } catch (error) {
            // Backend offline - keep stored demo car models gracefully
        }
    };

    useEffect(() => {
        fetchCarModels();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newCarModel.trim()) return;

        const newObj = { _id: 'mod-' + Date.now(), name: newCarModel.trim() };
        setCarModels(prev => [...prev, newObj]);
        setNewCarModel('');
        toast.success('Modèle Ford ajouté avec succès');

        if (userInfo?.token) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.post('/api/carmodels', { name: newObj.name }, config);
            } catch (err) {
                // Ignore API failure in demo mode
            }
        }
    };

    const handleDelete = async (id) => {
        setCarModels(prev => prev.filter(m => m._id !== id));
        setSelectedModels(prev => prev.filter(mid => mid !== id));
        toast.success('Modèle supprimé');

        if (userInfo?.token) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`/api/carmodels/${id}`, config);
            } catch (err) {
                // Ignore
            }
        }
    };

    const [editingModel, setEditingModel] = useState(null);
    const [editName, setEditName] = useState('');

    const handleEditClick = (model) => {
        setEditingModel(model);
        setEditName(model.name);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editName.trim()) return;

        setCarModels(prev => prev.map(m => m._id === editingModel._id ? { ...m, name: editName.trim() } : m));
        setEditingModel(null);
        toast.success('Modèle mis à jour');

        if (userInfo?.token) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.put(`/api/carmodels/${editingModel._id}`, { name: editName.trim() }, config);
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
                        🚗 Gestion des Modèles Ford Supportés
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0.4rem 0 0 0' }}>
                        Modèles affichés dans le sélecteur Mon Garage et les hubs par véhicule.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Link to="/admin/categories" className="btn" style={{ backgroundColor: '#e2e8f0', color: '#1e293b' }}>
                        📂 Voir Catégories
                    </Link>
                    <Link to="/admin/kits" className="btn btn-primary">
                        🛠️ Voir Packs Entretien
                    </Link>
                </div>
            </div>

            {/* Add Model Form */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#0f172a' }}>Ajouter un modèle Ford</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        value={newCarModel}
                        onChange={(e) => setNewCarModel(e.target.value)}
                        placeholder="Ex: Ford Mustang 2.3 EcoBoost, Ford Tourneo Connect..."
                        style={{ flex: 1, minWidth: '240px', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                        required
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
                        ➕ Ajouter Modèle
                    </button>
                </form>
            </div>

            {/* Models Table */}
            <div style={{ backgroundColor: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', overflowX: 'auto', WebkitOverflowScrolling: 'touch', boxShadow: 'var(--shadow-sm)' }}>
                <table style={{ width: '100%', minWidth: '450px', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#071d49', color: 'white', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                        <tr>
                            <th style={{ padding: '0.9rem 1.25rem' }}>Nom du Modèle Ford</th>
                            <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carModels.map((model) => (
                            <tr key={model._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '0.85rem 1.25rem', fontWeight: '700', color: '#0f172a' }}>
                                    🚗 {model.name}
                                </td>
                                <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                                    <button
                                        type="button"
                                        onClick={() => handleEditClick(model)}
                                        style={{ marginRight: '0.5rem', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}
                                    >
                                        ✏️ Modifier
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(model._id)}
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

            {/* Edit Model Modal */}
            {editingModel && (
                <div
                    onClick={() => setEditingModel(null)}
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
                        <h3 style={{ margin: '0 0 1rem 0' }}>Modifier le modèle Ford</h3>
                        <form onSubmit={handleUpdate}>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1rem' }}
                                required
                            />
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setEditingModel(null)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer' }}>
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

export default CarModelManager;
