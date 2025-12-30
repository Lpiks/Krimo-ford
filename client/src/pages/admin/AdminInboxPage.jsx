import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

const AdminInboxPage = () => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useAuth();

    useEffect(() => {
        fetchMessages();
    }, [userInfo]);

    const fetchMessages = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };
            const { data } = await axios.get('/api/messages', config);
            setMessages(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
            toast.error('Failed to load messages');
        }
    };

    const confirmDelete = (id) => {
        toast((t) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>Delete this message?</span>
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
        // if (!window.confirm('Are you sure you want to delete this message?')) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };
            await axios.delete(`/api/messages/${id}`, config);
            toast.success('Message deleted');
            fetchMessages();
        } catch (error) {
            toast.error('Failed to delete message');
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };
            await axios.put(`/api/messages/${id}/read`, {}, config);
            // Optimistic update
            setMessages(messages.map(msg => msg._id === id ? { ...msg, read: true } : msg));
        } catch (error) {
            console.error(error);
        }
    };


    const [selectedMessage, setSelectedMessage] = useState(null);

    const openMessage = async (msg) => {
        setSelectedMessage(msg);
        if (!msg.read) {
            handleMarkAsRead(msg._id);
        }
    };

    const closeModal = () => {
        setSelectedMessage(null);
    };

    return (
        <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--ford-blue)', fontWeight: 'bold' }}>
                Inbox
            </h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {messages.length === 0 ? (
                        <p style={{ color: '#6b7280' }}>No messages found.</p>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg._id}
                                onClick={() => openMessage(msg)}
                                style={{
                                    backgroundColor: msg.read ? 'white' : '#f0f9ff',
                                    padding: '1rem 1.5rem',
                                    borderRadius: '12px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                    borderLeft: msg.read ? '4px solid transparent' : '4px solid var(--ford-blue)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = msg.read ? 'white' : '#f0f9ff'}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                                    <h3 style={{
                                        fontSize: '1rem',
                                        fontWeight: msg.read ? '600' : '700',
                                        color: msg.read ? '#374151' : '#111827',
                                        marginBottom: 0
                                    }}>
                                        {msg.name}
                                    </h3>
                                    <p style={{
                                        fontSize: '0.9rem',
                                        color: '#6b7280',
                                        margin: 0,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '600px'
                                    }}>
                                        {msg.message.substring(0, 100)}{msg.message.length > 100 && '...'}
                                    </p>
                                </div>

                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); confirmDelete(msg._id); }}
                                        style={{
                                            background: 'none', border: 'none', color: '#ef4444',
                                            fontSize: '0.8rem', cursor: 'pointer', padding: '4px',
                                            borderRadius: '4px'
                                        }}
                                        onMouseEnter={e => e.target.style.backgroundColor = '#fee2e2'}
                                        onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '2rem'
                }} onClick={closeModal}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '2rem',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                        position: 'relative'
                    }} onClick={e => e.stopPropagation()}>
                        <button onClick={closeModal} style={{
                            position: 'absolute', top: '1.5rem', right: '1.5rem',
                            background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280'
                        }}>×</button>

                        <div style={{ marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>{selectedMessage.name}</h2>
                            <div style={{ color: '#6b7280', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                <a href={`mailto:${selectedMessage.email}`} style={{ color: 'var(--ford-blue)', textDecoration: 'none' }}>{selectedMessage.email}</a>
                                {selectedMessage.phone && <span>{selectedMessage.phone}</span>}
                                <span style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                            </div>
                        </div>

                        <div style={{ fontSize: '1rem', lineHeight: '1.7', color: '#374151', whiteSpace: 'pre-wrap' }}>
                            {selectedMessage.message}
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => { confirmDelete(selectedMessage._id); closeModal(); }} style={{
                                backgroundColor: '#fee2e2', color: '#ef4444',
                                border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px',
                                fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer'
                            }}>
                                Delete Message
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminInboxPage;
