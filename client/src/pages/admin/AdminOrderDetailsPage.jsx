import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const AdminOrderDetailsPage = () => {
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useAuth();
    const invoiceRef = useRef();

    // Helper to get translated content safely
    const getLocalizedContent = (item) => {
        if (!item || !item.name) return 'N/A';
        // If name is just a string (legacy data), return it
        if (typeof item.name === 'string') return item.name;

        return item.name[i18n.language] || item.name['en'] || 'N/A';
    };

    const handleDownloadPDF = async () => {
        const element = invoiceRef.current;
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');

            // A4 dimensions in mm
            const pdfWidth = 210;
            const pdfHeight = 297;

            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);

            // Calculate height regarding aspect ratio to fit width
            const pdfImgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfImgHeight);

            const clientName = order.shippingAddress?.fullName || order.user?.name || 'Guest';
            const sanitizedClientName = clientName.replace(/[^a-z0-9]/gi, '_');
            pdf.save(`Invoice_${sanitizedClientName}_${order._id.substring(20, 24)}.pdf`);

            toast.success('PDF Downloaded successfully');
        } catch (error) {
            console.error('PDF Generation Error:', error);
            toast.error('Failed to generate PDF');
        }
    };

    useEffect(() => {
        const fetchOrder = async () => {
            if (!userInfo) {
                setLoading(false);
                return;
            }
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                const { data } = await axios.get(`/api/orders/${id}`, config);
                setOrder(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, userInfo]);



    const deliverHandler = async () => {
        if (!userInfo) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };
            await axios.put(`/api/orders/${id}/deliver`, {}, config);
            setOrder({ ...order, isDelivered: true, status: 'Delivered' });
            toast.success('Order marked as delivered');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update order');
        }
    };

    const statusHandler = async (status) => {
        if (!userInfo) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };
            await axios.put(`/api/orders/${id}/status`, { status }, config);
            setOrder({ ...order, status });
            toast.success(`Order ${status.toLowerCase()} successfully`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update status');
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="no-print" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                <Link to="/admin/orders" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-arrow-left"></i> {t('orderDetails.back')}
                </Link>
                <span>/</span>
                <span style={{ color: '#0f172a', fontWeight: '500' }}>#{order?._id.substring(20, 24)}</span>
            </div>

            {loading ? <p>{t('common.loading')}</p> : order ? (
                <div className="printable-area">
                    {/* Hidden Invoice Template for PDF Generation */}
                    <div ref={invoiceRef} style={{
                        position: 'absolute',
                        top: '-10000px',
                        left: 0,
                        width: '210mm',
                        minHeight: '297mm',
                        backgroundColor: '#ffffff',
                        color: '#1f2937',
                        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
                    }}>
                        {/* Top Bar Decoration */}
                        <div style={{ height: '8px', backgroundColor: '#1a44c2', width: '100%' }}></div>

                        <div style={{ padding: '40px 50px' }}>
                            {/* Header Section */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                                <div>
                                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a44c2', margin: 0, letterSpacing: '-0.5px' }}>KRIMO STORE</h1>
                                    <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>Ford Auto Parts Specialist</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '42px', fontWeight: '300', color: '#e5e7eb', letterSpacing: '4px', lineHeight: 1 }}>INVOICE</div>
                                    <div style={{ color: '#374151', fontSize: '16px', fontWeight: '600', marginTop: '5px' }}>#{order._id.substring(20, 24)}</div>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div style={{ display: 'flex', gap: '40px', marginBottom: '50px' }}>
                                {/* From */}
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>From</h3>
                                    <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#374151' }}>
                                        <strong>Krimo Store</strong><br />
                                        Algiers<br />
                                        Algeria<br />
                                        contact@krimostore.com
                                    </div>
                                </div>

                                {/* To */}
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Bill To</h3>
                                    <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#374151' }}>
                                        <strong style={{ fontSize: '16px', color: '#111827' }}>{order.shippingAddress?.fullName || (order.user ? order.user.name : 'Guest')}</strong><br />
                                        {order.shippingAddress.address}<br />
                                        {order.shippingAddress.city}, {order.shippingAddress.wilaya}<br />
                                        {order.shippingAddress.phone}
                                    </div>
                                </div>

                                {/* Details */}
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Details</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                        <span style={{ color: '#6b7280' }}>Date:</span>
                                        <span style={{ fontWeight: '600', color: '#111827' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                        <span style={{ color: '#6b7280' }}>Status:</span>
                                        <span style={{
                                            fontWeight: '600',
                                            color: order.status === 'Accepted' ? '#059669' : '#111827',
                                            backgroundColor: order.status === 'Accepted' ? '#ecfdf5' : 'transparent',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            fontSize: '12px'
                                        }}>{order.status}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                        <span style={{ color: '#6b7280' }}>Payment:</span>
                                        <span style={{ fontWeight: '600', color: '#111827' }}>{order.paymentMethod}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div style={{ marginBottom: '40px' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase' }}>Description</th>
                                            <th style={{ padding: '15px', textAlign: 'center', fontSize: '12px', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase' }}>Qty</th>
                                            <th style={{ padding: '15px', textAlign: 'right', fontSize: '12px', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase' }}>Price</th>
                                            <th style={{ padding: '15px', textAlign: 'right', fontSize: '12px', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase' }}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.orderItems.map((item, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '15px', fontSize: '14px', color: '#111827', fontWeight: '500' }}>{getLocalizedContent(item)}</td>
                                                <td style={{ padding: '15px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>{item.qty}</td>
                                                <td style={{ padding: '15px', textAlign: 'right', fontSize: '14px', color: '#6b7280' }}>{item.price.toLocaleString()} DA</td>
                                                <td style={{ padding: '15px', textAlign: 'right', fontSize: '14px', color: '#111827', fontWeight: '600' }}>{(item.qty * item.price).toLocaleString()} DA</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <div style={{ width: '300px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6', fontSize: '14px', color: '#6b7280' }}>
                                        <span>Subtotal</span>
                                        <span style={{ color: '#111827' }}>
                                            {order.orderItems.reduce((acc, item) => acc + item.qty * item.price, 0).toLocaleString()} DA
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6', fontSize: '14px', color: '#6b7280' }}>
                                        <span>Shipping</span>
                                        <span style={{ color: '#111827' }}>
                                            {(order.totalPrice - order.orderItems.reduce((acc, item) => acc + item.qty * item.price, 0)).toLocaleString()} DA
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', fontSize: '20px', fontWeight: '800', color: '#1a44c2' }}>
                                        <span>Total</span>
                                        <span>{order.totalPrice.toLocaleString()} DA</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            backgroundColor: '#f9fafb',
                            padding: '30px 50px',
                            borderTop: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#111827' }}>Thank you for your business!</p>
                                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#6b7280' }}>Please keep this invoice for your records.</p>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '12px', color: '#9ca3af' }}>
                                www.krimostore.com
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2rem' }} className="no-print">
                        <div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--ford-blue)', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>
                                {t('orderDetails.title')} <span style={{ color: '#94a3b8' }}>#{order._id.substring(20, 24)}</span>
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ color: '#64748b' }}><i className="far fa-calendar-alt" style={{ marginRight: '0.5rem' }}></i> {new Date(order.createdAt).toLocaleDateString()}</span>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '999px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    backgroundColor: order.status === 'Accepted' || order.status === 'Delivered' ? '#dcfce7' :
                                        order.status === 'Cancelled' ? '#fee2e2' : '#fef3c7',
                                    color: order.status === 'Accepted' || order.status === 'Delivered' ? '#166534' :
                                        order.status === 'Cancelled' ? '#991b1b' : '#92400e'
                                }}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={handleDownloadPDF}
                                className="btn"
                                style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', color: '#64748b', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
                            >
                                <i className="fas fa-file-pdf" style={{ marginRight: '0.5rem' }}></i> Download PDF
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Left Column: Customer & Status */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {/* Actions Card (Mobile/Desktop) */}
                            <div className="no-print" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #f1f5f9' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1e293b' }}>{t('admin.actions')}</h2>
                                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                                    <button
                                        onClick={() => statusHandler('Accepted')}
                                        className="btn"
                                        disabled={order.status === 'Accepted'}
                                        style={{
                                            backgroundColor: order.status === 'Accepted' ? '#dcfce7' : '#10b981',
                                            color: order.status === 'Accepted' ? '#166534' : 'white',
                                            cursor: order.status === 'Accepted' ? 'default' : 'pointer',
                                            opacity: order.status === 'Accepted' ? 0.7 : 1
                                        }}
                                    >
                                        <i className="fas fa-check" style={{ marginRight: '0.5rem' }}></i> Accept
                                    </button>
                                    <button
                                        onClick={() => statusHandler('Cancelled')}
                                        className="btn"
                                        disabled={order.status === 'Cancelled'}
                                        style={{
                                            backgroundColor: '#ef4444',
                                            color: 'white',
                                            opacity: order.status === 'Cancelled' ? 0.5 : 1
                                        }}
                                    >
                                        <i className="fas fa-times" style={{ marginRight: '0.5rem' }}></i> Decline
                                    </button>
                                </div>
                                {!order.isDelivered && order.status === 'Accepted' && (
                                    <button
                                        onClick={deliverHandler}
                                        className="btn"
                                        style={{ width: '100%', marginTop: '1rem', backgroundColor: '#3b82f6', color: 'white' }}
                                    >
                                        <i className="fas fa-truck" style={{ marginRight: '0.5rem' }}></i> {t('orderDetails.markDelivered')}
                                    </button>
                                )}
                            </div>

                            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #f1f5f9' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1e293b', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                                    <i className="fas fa-user-circle" style={{ marginRight: '0.75rem', color: '#64748b' }}></i>
                                    {t('orderDetails.customer')}
                                </h2>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>{t('checkout.fullName')}</label>
                                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{order.shippingAddress?.fullName || (order.user ? order.user.name : t('admin.guest'))}</div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>{t('checkout.phone')}</label>
                                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{order.shippingAddress.phone}</div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>{t('checkout.wilaya')}</label>
                                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{order.shippingAddress.wilaya}</div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>{t('checkout.address')}</label>
                                        <div style={{ color: '#334155' }}>
                                            {order.shippingAddress.address}<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #f1f5f9' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1e293b', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                                    <i className="fas fa-credit-card" style={{ marginRight: '0.75rem', color: '#64748b' }}></i>
                                    {t('checkout.payment')}
                                </h2>
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>METHOD</label>
                                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{t(`paymentMethods.${order.paymentMethod}`, order.paymentMethod)}</div>
                                </div>
                                <div style={{ marginTop: '1rem' }}>
                                    <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>STATUS</label>
                                    <div style={{ fontWeight: '600', color: order.isPaid ? 'green' : '#f59e0b' }}>
                                        {order.isPaid ? 'PAID' : 'NOT PAID'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Items */}
                        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #f1f5f9', height: 'fit-content' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1e293b', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                                <i className="fas fa-shopping-bag" style={{ marginRight: '0.75rem', color: '#64748b' }}></i>
                                {t('orderDetails.items')} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '500' }}>({order.orderItems.length} items)</span>
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {order.orderItems.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '1rem', paddingBottom: '1.5rem', borderBottom: index !== order.orderItems.length - 1 ? '1px dashed #e2e8f0' : 'none' }}>
                                        {/* Image placeholder or actual image if available */}
                                        <div style={{ width: '64px', height: '64px', backgroundColor: '#f1f5f9', borderRadius: '8px', flexShrink: 0, backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>

                                        <div style={{ flexGrow: 1 }}>
                                            <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>{getLocalizedContent(item)}</div>
                                            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Qty: {item.qty}</div>
                                        </div>
                                        <div style={{ fontWeight: '600', color: '#0f172a' }}>
                                            {(item.qty * item.price).toLocaleString()} DA
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '2px dashed #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#64748b' }}>
                                    <span>{t('cart.item')} Total</span>
                                    <span>{order.itemsPrice?.toLocaleString()} DA</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#64748b' }}>
                                    <span>{t('checkout.shipping')}</span>
                                    <span>{order.shippingPrice?.toLocaleString()} DA</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', fontSize: '1.25rem', fontWeight: '800', color: 'var(--ford-blue)' }}>
                                    <span>{t('cart.total')}</span>
                                    <span>{order.totalPrice.toLocaleString()} DA</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : <p>Order not found</p>}
        </div>
    );
};

export default AdminOrderDetailsPage;
