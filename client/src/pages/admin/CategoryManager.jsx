import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const CategoryManager = () => {
    const { userInfo } = useAuth();
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(true);

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
                <a href="/admin/products" style={{
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
                </a>
            </div>

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
                {categories.map(cat => (
                    <div key={cat._id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        padding: '1rem',
                        borderRadius: '8px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                        <span style={{ fontWeight: '500' }}>{cat.name}</span>
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
