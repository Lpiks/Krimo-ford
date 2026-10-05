import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

const INITIAL_ORDERS = [
    {
        _id: 'ord-665e89a2410f91b000000901',
        createdAt: '2026-10-04T16:20:00Z',
        shippingAddress: { fullName: 'Rachid Belkacem', city: 'Alger (Bab Ezzouar)', wilaya: '16 - Alger', phone: '0555 12 34 56' },
        totalPrice: 28500,
        paymentMethod: 'cash_on_delivery',
        status: 'Accepted',
        isDelivered: false,
        trackingCode: 'YAL-77412',
        orderItems: [{ name: 'Kit Distribution Ford Focus 1.6 TDCi', qty: 1, price: 18500 }, { name: 'Plaquettes Avant Motorcraft', qty: 1, price: 7200 }]
    },
    {
        _id: 'ord-665e89a2410f91b000000902',
        createdAt: '2026-10-04T12:05:00Z',
        shippingAddress: { fullName: 'Yassine Mansouri', city: 'Oran (Es Senia)', wilaya: '31 - Oran', phone: '0661 78 90 12' },
        totalPrice: 19100,
        paymentMethod: 'cash_on_delivery',
        status: 'Pending',
        isDelivered: false,
        trackingCode: 'YAL-77413',
        orderItems: [{ name: 'Pack Vidange Intégrale Focus 1.6 TDCi', qty: 1, price: 19100 }]
    },
    {
        _id: 'ord-665e89a2410f91b000000903',
        createdAt: '2026-10-03T18:40:00Z',
        shippingAddress: { fullName: 'Hamid Djelloul', city: 'Constantine (Ali Mendjeli)', wilaya: '25 - Constantine', phone: '0770 45 67 89' },
        totalPrice: 42000,
        paymentMethod: 'cash_on_delivery',
        status: 'Delivered',
        isDelivered: true,
        trackingCode: 'YAL-77390',
        orderItems: [{ name: 'Pack Distribution Renforcée Ranger 2.2', qty: 1, price: 40800 }]
    },
    {
        _id: 'ord-665e89a2410f91b000000904',
        createdAt: '2026-10-03T11:15:00Z',
        shippingAddress: { fullName: 'Farid Ould Ali', city: 'Tizi Ouzou (Centre)', wilaya: '15 - Tizi Ouzou', phone: '0550 99 88 77' },
        totalPrice: 14400,
        paymentMethod: 'store_pickup',
        status: 'Accepted',
        isDelivered: false,
        trackingCode: 'COMPTOIR-SOUMMAM',
        orderItems: [{ name: 'Plaquettes de Frein Motorcraft Fiesta', qty: 2, price: 7200 }]
    }
];

const OrderManager = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState(() => {
        try {
            const stored = localStorage.getItem('krimo_admin_orders');
            return stored ? JSON.parse(stored) : INITIAL_ORDERS;
        } catch {
            return INITIAL_ORDERS;
        }
    });
    const [loading, setLoading] = useState(false);
    const { userInfo } = useAuth();
    const [filterStatus, setFilterStatus] = useState('Tous');

    useEffect(() => {
        try {
            localStorage.setItem('krimo_admin_orders', JSON.stringify(orders));
        } catch (e) {
            console.error(e);
        }
    }, [orders]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userInfo?.token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get('/api/orders', config);
                if (Array.isArray(data) && data.length > 0) {
                    setOrders(data);
                }
            } catch (error) {
                // Backend offline - keep stored demo orders gracefully
            }
        };

        fetchOrders();
    }, [userInfo]);

    const handleUpdateStatus = (id, newStatus) => {
        setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus, isDelivered: newStatus === 'Delivered' } : o));
        toast.success(`Statut mis à jour : ${newStatus}`);
    };

    const filtered = orders.filter(o => {
        if (filterStatus === 'Tous') return true;
        return o.status === filterStatus;
    });

    return (
        <div style={{ paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="logo-text admin-header-title" style={{ fontSize: '2.4rem', color: 'var(--ford-blue)', margin: 0 }}>
                        📦 Commandes Clients & Expéditions 58W
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0.4rem 0 0 0' }}>
                        Suivi des commandes en direct, expéditions Yalidine et retraits comptoir Soummam.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['Tous', 'Pending', 'Accepted', 'Delivered'].map(st => (
                        <button
                            key={st}
                            type="button"
                            onClick={() => setFilterStatus(st)}
                            style={{
                                padding: '0.45rem 0.85rem',
                                borderRadius: '8px',
                                border: filterStatus === st ? '1.5px solid var(--ford-blue)' : '1px solid #cbd5e1',
                                backgroundColor: filterStatus === st ? 'rgba(0, 52, 120, 0.08)' : 'white',
                                color: filterStatus === st ? 'var(--ford-blue)' : '#475569',
                                fontWeight: filterStatus === st ? '700' : '500',
                                fontSize: '0.825rem',
                                cursor: 'pointer'
                            }}
                        >
                            {st === 'Pending' ? 'En attente' : st === 'Accepted' ? 'Validée' : st === 'Delivered' ? 'Livrée' : 'Toutes'}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', overflowX: 'auto', WebkitOverflowScrolling: 'touch', boxShadow: 'var(--shadow-sm)' }}>
                <table style={{ width: '100%', minWidth: '780px', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#071d49', color: 'white', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                        <tr>
                            <th style={{ padding: '0.9rem 1rem' }}>Réf</th>
                            <th style={{ padding: '0.9rem 1rem' }}>Date</th>
                            <th style={{ padding: '0.9rem 1rem' }}>Client</th>
                            <th style={{ padding: '0.9rem 1rem' }}>Wilaya & Ville</th>
                            <th style={{ padding: '0.9rem 1rem' }}>Montant</th>
                            <th style={{ padding: '0.9rem 1rem' }}>Paiement</th>
                            <th style={{ padding: '0.9rem 1rem' }}>Bordereau</th>
                            <th style={{ padding: '0.9rem 1rem' }}>Statut</th>
                            <th style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{ fontSize: '0.88rem' }}>
                        {filtered.map((order) => (
                            <tr key={order._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: 'var(--ford-blue)', fontFamily: 'monospace' }}>
                                    #{order._id.substring(order._id.length - 4)}
                                </td>
                                <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>
                                    {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                                </td>
                                <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#0f172a' }}>
                                    {order.shippingAddress?.fullName || 'Client'}
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '400' }}>{order.shippingAddress?.phone}</div>
                                </td>
                                <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>
                                    {order.shippingAddress?.city || 'Alger'}
                                </td>
                                <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: 'var(--ford-blue)' }}>
                                    {order.totalPrice.toLocaleString('fr-DZ')} DA
                                </td>
                                <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#475569' }}>
                                    {order.paymentMethod === 'cash_on_delivery' ? '💵 Cash livraison' : '🏢 Retrait magasin'}
                                </td>
                                <td style={{ padding: '0.85rem 1rem' }}>
                                    <code style={{ fontSize: '0.75rem', padding: '2px 6px', backgroundColor: '#eff6ff', color: 'var(--ford-blue)', borderRadius: '4px', fontWeight: '700' }}>
                                        {order.trackingCode || 'YAL-84920'}
                                    </code>
                                </td>
                                <td style={{ padding: '0.85rem 1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.6rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: '800',
                                        backgroundColor:
                                            order.status === 'Accepted' ? '#dcfce7' :
                                            order.status === 'Delivered' ? '#eff6ff' : '#fef3c7',
                                        color:
                                            order.status === 'Accepted' ? '#15803d' :
                                            order.status === 'Delivered' ? 'var(--ford-blue)' : '#b45309'
                                    }}>
                                        ● {order.status === 'Pending' ? 'En attente' : order.status === 'Accepted' ? 'Validée' : order.status === 'Delivered' ? 'Livrée' : order.status}
                                    </span>
                                </td>
                                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                                    <div style={{ display: 'inline-flex', gap: '4px' }}>
                                        <button
                                            type="button"
                                            onClick={() => handleUpdateStatus(order._id, 'Accepted')}
                                            style={{ padding: '0.3rem 0.5rem', borderRadius: '4px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4', color: '#15803d', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                                            title="Valider commande"
                                        >
                                            ✓
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                                            style={{ padding: '0.3rem 0.5rem', borderRadius: '4px', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', color: 'var(--ford-blue)', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                                            title="Marquer livrée"
                                        >
                                            🚚
                                        </button>
                                        <Link
                                            to={`/admin/orders/${order._id}`}
                                            style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', backgroundColor: 'var(--ford-blue)', color: 'white', textDecoration: 'none', fontSize: '0.75rem', fontWeight: '700' }}
                                        >
                                            Détail ➔
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManager;
