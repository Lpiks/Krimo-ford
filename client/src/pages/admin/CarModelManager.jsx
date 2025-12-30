import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const CarModelManager = () => {
    const { userInfo } = useAuth();
    const [carModels, setCarModels] = useState([]);
    const [newCarModel, setNewCarModel] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedModels, setSelectedModels] = useState([]);

    const fetchCarModels = async () => {
        try {
            const { data } = await axios.get('/api/carmodels');
            setCarModels(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load car models');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCarModels();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newCarModel.trim()) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            await axios.post('/api/carmodels', { name: newCarModel }, config);
            toast.success('Car Model Added');
            setNewCarModel('');
            fetchCarModels();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding car model');
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedModels(carModels.map(m => m._id));
        } else {
            setSelectedModels([]);
        }
    };

    const handleSelectOne = (e, id) => {
        if (e.target.checked) {
            setSelectedModels(prev => [...prev, id]);
        } else {
            setSelectedModels(prev => prev.filter(mid => mid !== id));
        }
    };

    const handleBulkDelete = () => {
        if (selectedModels.length === 0) return;
        toast((t) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>Delete {selectedModels.length} models?</span>
                <button
                    onClick={() => {
                        performBulkDelete();
                        toast.dismiss(t.id);
                    }}
                    style={{
                        padding: '4px 8px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Yes
                </button>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    style={{
                        padding: '4px 8px',
                        backgroundColor: '#eee',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    No
                </button>
            </div>
        ), { duration: 4000 });
    };

    const performBulkDelete = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            await axios.post('/api/carmodels/bulk-delete', { ids: selectedModels }, config);
            toast.success('Models Deleted');
            setSelectedModels([]);
            fetchCarModels();
        } catch (error) {
            toast.error('Failed to delete models');
        }
    };

    const confirmDelete = (id) => {
        toast((t) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>Delete this model?</span>
                <button
                    onClick={() => {
                        handleDelete(id);
                        toast.dismiss(t.id);
                    }}
                    style={{
                        padding: '4px 8px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Yes
                </button>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    style={{
                        padding: '4px 8px',
                        backgroundColor: '#eee',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    No
                </button>
            </div>
        ), {
            duration: 4000,
            position: 'top-center',
        });
    };

    const handleDelete = async (id) => {
        // if (!window.confirm('Are you sure?')) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            await axios.delete(`/api/carmodels/${id}`, config);
            toast.success('Car Model Deleted');
            fetchCarModels();
        } catch (error) {
            toast.error('Failed to delete car model');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', color: 'var(--ford-blue)' }}>Manage Car Models</h1>
                <Link to="/admin/products" style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                }}>
                    Back to Inventory
                </Link>
            </div>

            {selectedModels.length > 0 && (
                <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#b91c1c', fontWeight: '500' }}>{selectedModels.length} selected</span>
                    <button
                        onClick={handleBulkDelete}
                        style={{
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Delete Selected
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <input
                    type="text"
                    value={newCarModel}
                    onChange={e => setNewCarModel(e.target.value)}
                    placeholder="New Car Model Name (e.g. Fiesta, Focus)"
                    style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        flex: 1,
                        maxWidth: '400px'
                    }}
                />
                <button type="submit" className="btn btn-primary">Add Car Model</button>
            </form>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                maxWidth: '100%'
            }}>
                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', padding: '0 0.5rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                    <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={carModels.length > 0 && selectedModels.length === carModels.length}
                        style={{ marginRight: '1rem', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: '600', color: '#6b7280' }}>Select All</span>
                </div>

                {carModels.map(model => (
                    <div key={model._id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: selectedModels.includes(model._id) ? '#eff6ff' : 'white',
                        padding: '1rem',
                        borderRadius: '8px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        border: selectedModels.includes(model._id) ? '1px solid var(--ford-blue)' : '1px solid transparent'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                checked={selectedModels.includes(model._id)}
                                onChange={(e) => handleSelectOne(e, model._id)}
                                style={{ marginRight: '1rem', width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <span style={{ fontWeight: '500' }}>{model.name}</span>
                        </div>
                        <button
                            onClick={() => confirmDelete(model._id)}
                            style={{
                                color: '#ef4444',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CarModelManager;
