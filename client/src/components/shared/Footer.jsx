import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer style={{
            backgroundColor: '#0a192f',
            color: '#cbd5e1',
            padding: 'clamp(2.5rem, 5vw, 4rem) 0 2rem 0',
            marginTop: 'auto',
            borderTop: '4px solid var(--ford-blue)'
        }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(0.75rem, 3vw, 1.5rem)' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                    gap: '2.5rem',
                    marginBottom: '3rem'
                }}>
                    {/* Col 1: About */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '1rem' }}>
                            <span className="logo-text" style={{ fontSize: '2.2rem', color: '#60a5fa' }}>Krimoford</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Soummam</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#94a3b8', marginBottom: '1.25rem' }}>
                            Votre référence spécialisée en pièces détachées d'origine Ford et Motorcraft à Alger (Boulevard de la Soummam). Expédition rapide et sécurisée vers les 58 wilayas d'Algérie.
                        </p>
                        <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: '600' }}>
                            ✓ 100% Pièces Certifiées Origine & Adaptable 1er Choix
                        </div>
                    </div>

                    {/* Col 2: Navigation Rapide */}
                    <div>
                        <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                            Navigation Rapide
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                            <li><Link to="/catalog" style={{ color: '#94a3b8', textDecoration: 'none' }}>→ Catalogue Pièces Détachées</Link></li>
                            <li><Link to="/kits" style={{ color: '#94a3b8', textDecoration: 'none' }}>→ Packs Révision & Vidange</Link></li>
                            <li><Link to="/vin-request" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '600' }}>→ Devis par Carte Grise / VIN</Link></li>
                            <li><Link to="/diagnostic" style={{ color: '#94a3b8', textDecoration: 'none' }}>→ Diagnostic Pannes & Symptômes</Link></li>
                            <li><Link to="/track-order" style={{ color: '#94a3b8', textDecoration: 'none' }}>→ Suivre ma Commande</Link></li>
                            <li><Link to="/shipping" style={{ color: '#94a3b8', textDecoration: 'none' }}>→ Tarifs Livraison 58 Wilayas</Link></li>
                        </ul>
                    </div>

                    {/* Col 3: Modèles Ford */}
                    <div>
                        <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                            Modèles Phares
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                            <li><Link to="/model/Focus" style={{ color: '#94a3b8', textDecoration: 'none' }}>• Ford Focus (Mk2, Mk3, Mk4)</Link></li>
                            <li><Link to="/model/Fiesta" style={{ color: '#94a3b8', textDecoration: 'none' }}>• Ford Fiesta (TDCi & Duratec)</Link></li>
                            <li><Link to="/model/Ranger" style={{ color: '#94a3b8', textDecoration: 'none' }}>• Ford Ranger (Pick-Up 4x4)</Link></li>
                            <li><Link to="/model/Transit" style={{ color: '#94a3b8', textDecoration: 'none' }}>• Ford Transit & Custom (Utilitaires)</Link></li>
                            <li><Link to="/model/Kuga" style={{ color: '#94a3b8', textDecoration: 'none' }}>• Ford Kuga & EcoSport</Link></li>
                            <li><Link to="/model/Mondeo" style={{ color: '#94a3b8', textDecoration: 'none' }}>• Ford Mondeo & Fusion</Link></li>
                        </ul>
                    </div>

                    {/* Col 4: Contact & Magasin */}
                    <div>
                        <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                            Magasin & Contact
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                            <div>
                                <strong style={{ color: 'white' }}>📍 Adresse :</strong><br />
                                Boulevard de la Soummam, Alger Centre (Algérie)
                            </div>
                            <div>
                                <strong style={{ color: 'white' }}>📞 Téléphone Krimo :</strong><br />
                                <a href="tel:+213669014890" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: '600' }}>
                                    +213 (0) 669 01 48 90
                                </a>
                            </div>
                            <div>
                                <strong style={{ color: 'white' }}>💬 WhatsApp Direct :</strong><br />
                                <span style={{ color: '#4ade80' }}>Disponible 7j/7 pour devis photos</span>
                            </div>
                            <div>
                                <strong style={{ color: 'white' }}>🕒 Horaires Magasin :</strong><br />
                                Samedi à Jeudi : 08h30 – 17h30 (Fermé le Vendredi)
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingTop: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    fontSize: '0.85rem',
                    color: '#64748b'
                }}>
                    <div>
                        &copy; {new Date().getFullYear()} Krimoford Auto Parts. Tous droits réservés. Développé par Stepping Stones Agency.
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span>Paiement Cash à la Livraison (COD)</span>
                        <span>•</span>
                        <span>Virement CCP / BaridiMob</span>
                        <span>•</span>
                        <span>Livraison Express 58 Wilayas</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
