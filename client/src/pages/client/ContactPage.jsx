import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const ContactPage = () => {
    const { t } = useTranslation();
    useScrollAnimation();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/messages', formData);
            toast.success(t('contact.success', 'Message sent successfully!'));
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            console.error(error);
            toast.error(t('contact.error', 'Failed to send message'));
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.8rem',
        marginBottom: '1rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1rem',
        fontFamily: 'inherit'
    };

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Header */}
            <div style={{
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1920&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#111',
                padding: '6rem 1rem',
                textAlign: 'center',
                marginBottom: '4rem',
                borderBottom: '4px solid var(--ford-blue)'
            }}>
                <div className="container">
                    <h1 className="animate-on-scroll" style={{
                        fontSize: '3.5rem',
                        marginBottom: '1rem',
                        fontFamily: 'var(--font-logo)',
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                    }}>
                        {t('contact.title', 'Contact Us')}
                    </h1>
                    <p className="animate-on-scroll delay-100" style={{
                        maxWidth: '700px',
                        margin: '0 auto',
                        fontSize: '1.5rem',
                        fontWeight: '300',
                        opacity: 1,
                        color: 'white',
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                        fontWeight: 'bold'
                    }}>
                        {t('contact.subtitle', 'We are here to help you find the right parts for your vehicle.')}
                    </p>
                </div>
            </div>

            <div className="container">
                {/* Middle Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '3rem',
                    marginBottom: '5rem',
                    alignItems: 'stretch'
                }}>
                    {/* Information Card */}
                    <div className="animate-on-scroll delay-200" style={{
                        backgroundColor: 'white',
                        padding: '3rem',
                        borderRadius: '24px',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#111', fontWeight: '800', lineHeight: 1.2 }}>
                                {t('contact.getInTouch', 'Let\'s talk about your car.')}
                            </h2>
                            <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: 1.6 }}>We're here to help you find the exact part you need. Drop by our store or send us a message.</p>
                        </div>

                        <div style={{ display: 'grid', gap: '2rem' }}>
                            {/* Address Item */}
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                <div style={{
                                    minWidth: '50px', height: '50px',
                                    borderRadius: '12px',
                                    backgroundColor: '#eff6ff',
                                    color: 'var(--ford-blue)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem', color: '#111' }}>{t('contact.address', 'Our Location')}</h3>
                                    <p style={{ color: '#555', lineHeight: '1.6' }}>Cité Sidi M'hammed, Rue Dite Bribo<br />Algiers, Algeria</p>
                                </div>
                            </div>

                            {/* Phone Item */}
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                <div style={{
                                    minWidth: '50px', height: '50px',
                                    borderRadius: '12px',
                                    backgroundColor: '#eff6ff',
                                    color: 'var(--ford-blue)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.12 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem', color: '#111' }}>{t('contact.phone', 'Call Us')}</h3>
                                    <p style={{ color: '#555', lineHeight: '1.6' }}>+213 555 123 456<br />+213 21 987 654</p>
                                </div>
                            </div>

                            {/* Email Item */}
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                <div style={{
                                    minWidth: '50px', height: '50px',
                                    borderRadius: '12px',
                                    backgroundColor: '#eff6ff',
                                    color: 'var(--ford-blue)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem', color: '#111' }}>{t('contact.email', 'Email Us')}</h3>
                                    <p style={{ color: '#555', lineHeight: '1.6' }}>support@krimostore.dz<br />sales@krimostore.dz</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Card */}
                    <div className="animate-on-scroll delay-300" style={{
                        backgroundColor: '#1f2937',
                        padding: '3rem',
                        borderRadius: '24px',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)',
                        color: 'white'
                    }}>
                        <h2 style={{
                            color: 'white',
                            marginBottom: '0.5rem',
                            fontSize: '2rem',
                            fontWeight: '700'
                        }}>
                            {t('contact.sendMessage', 'Send a Message')}
                        </h2>
                        <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>Usually replies within 24 hours.</p>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#d1d5db' }}>{t('contact.name', 'Name')}</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        style={{ ...inputStyle, backgroundColor: '#374151', border: '1px solid #4b5563', color: 'white' }}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#d1d5db' }}>{t('contact.phone', 'Phone')}</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        style={{ ...inputStyle, backgroundColor: '#374151', border: '1px solid #4b5563', color: 'white' }}
                                        placeholder="+213..."
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#d1d5db' }}>{t('contact.email', 'Email')}</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={{ ...inputStyle, backgroundColor: '#374151', border: '1px solid #4b5563', color: 'white' }}
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#d1d5db' }}>{t('contact.message', 'Message')}</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    style={{ ...inputStyle, backgroundColor: '#374151', border: '1px solid #4b5563', color: 'white', resize: 'vertical' }}
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    backgroundColor: 'var(--ford-blue)',
                                    color: 'white',
                                    padding: '1rem 2rem',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    width: '100%',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                                }}
                            >
                                {t('contact.send', 'Send Message')}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Map */}
                <div className="animate-on-scroll delay-400" style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    height: '450px'
                }}>
                    <iframe
                        src="https://maps.google.com/maps?q=Karim+auto+parts+Ford+Algiers&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Krimo Store Location"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
