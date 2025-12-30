import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const CategoryManager = () => {
    const { userInfo } = useAuth();
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('/api/categories');
            setCategories(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load categories');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            await axios.post('/api/categories', { name: newCategory }, config);
            toast.success('Category Added');
            setNewCategory('');
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding category');
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

    const handleBulkDelete = () => {
        if (selectedCategories.length === 0) return;
        toast((t) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>Delete {selectedCategories.length} categories?</span>
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
            await axios.post('/api/categories/bulk-delete', { ids: selectedCategories }, config);
            toast.success('Categories Deleted');
            setSelectedCategories([]);
            fetchCategories();
        } catch (error) {
            toast.error('Failed to delete categories');
        }
    };

    const confirmDelete = (id) => {
        toast((t) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>Delete this category?</span>
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
        // if (!window.confirm('Are you sure?')) return; // Removed
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            await axios.delete(`/api/categories/${id}`, config);
            toast.success('Category Deleted');
            fetchCategories();
        } catch (error) {
            toast.error('Failed to delete category');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', color: 'var(--ford-blue)' }}>Manage Categories</h1>
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

            {selectedCategories.length > 0 && (
                <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#b91c1c', fontWeight: '500' }}>{selectedCategories.length} selected</span>
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
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    placeholder="New Category Name"
                    style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        flex: 1,
                        maxWidth: '400px'
                    }}
                />
                <button type="submit" className="btn btn-primary">Add Category</button>
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
                        checked={categories.length > 0 && selectedCategories.length === categories.length}
                        style={{ marginRight: '1rem', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: '600', color: '#6b7280' }}>Select All</span>
                </div>

                {categories.map(cat => (
                    <div key={cat._id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: selectedCategories.includes(cat._id) ? '#eff6ff' : 'white',
                        padding: '1rem',
                        borderRadius: '8px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        border: selectedCategories.includes(cat._id) ? '1px solid var(--ford-blue)' : '1px solid transparent'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(cat._id)}
                                onChange={(e) => handleSelectOne(e, cat._id)}
                                style={{ marginRight: '1rem', width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <span style={{ fontWeight: '500' }}>{cat.name}</span>
                        </div>
                        <button
                            onClick={() => confirmDelete(cat._id)}
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

export default CategoryManager;
