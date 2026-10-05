import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGarage } from '../../context/GarageContext';
import { useCart } from '../../context/CartContext';
import { getWhatsAppLink } from '../../utils/whatsapp';
import { toast } from 'react-hot-toast';

// Model presets for instant filtering
const FORD_MODELS = [
    { id: 'Focus', name: 'Ford Focus', engine: '1.6 TDCi / 1.5 EcoBoost' },
    { id: 'Fiesta', name: 'Ford Fiesta', engine: '1.4 TDCi / 1.25 Essence' },
    { id: 'Ranger', name: 'Ford Ranger', engine: '2.2 & 3.2 TDCi Duratorq 4x4' },
    { id: 'Transit', name: 'Ford Transit', engine: '2.2 TDCi & 2.0 EcoBlue Pro' },
    { id: 'Kuga', name: 'Ford Kuga', engine: '2.0 TDCi AWD' },
    { id: 'Mondeo', name: 'Ford Mondeo', engine: '2.0 TDCi Titanium' }
];

// Rich Diagnostic Database tailored for Ford vehicles in Algeria
const DIAGNOSTIC_SYSTEMS = {
    Engine: {
        id: 'Engine',
        name: 'Moteur & Injection TDCi',
        nameAr: 'المحرك وحقن الوقود',
        icon: '⚙️',
        desc: 'Claquement injecteurs, perte de puissance, fumée noire, voyant moteur, calage',
        symptoms: [
            {
                id: 'tdci_injector_knock',
                label: 'Bruit de claquement sec à l’accélération + fumée noire à l’échappement',
                severity: 'high',
                severityLabel: 'Urgence Élevée — Risque perforation piston',
                diagnostic: 'Défaillance ou grippage d’un injecteur diesel common-rail TDCi.',
                obdCode: 'DTC P0201 / P0263 (Cylindre 1/3 Contribution)',
                soummamTip: 'Sur les moteurs 1.6 et 2.0 TDCi, le carburant local peut encrasser l’aiguille. Ne roulez pas avec un injecteur qui pisse, cela risque de trouer un piston.',
                recommendedPart: {
                    name: 'Injecteur Diesel Common Rail TDCi Origine Continental / Delphi',
                    oem: '1749842 / 9674973080',
                    price: 36000,
                    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80',
                    catalogLink: '/catalog?category=Engine&keyword=Injecteur'
                }
            },
            {
                id: 'turbo_loss_power',
                label: 'Perte soudaine de puissance (mode dégradé) + sifflement d’air en charge',
                severity: 'medium',
                severityLabel: 'Urgence Moyenne — Perte de reprise immédiate',
                diagnostic: 'Fissure sur la durite d’échangeur d’air (intercooler) ou fuite pression turbo.',
                obdCode: 'DTC P0299 (Pression suralimentation turbo insuffisante)',
                soummamTip: 'Panne très fréquente sur Focus Mk3 et Ranger. Vérifiez la durite coudée en sortie d’intercooler, elle se fend généralement sur la partie inférieure invisible.',
                recommendedPart: {
                    name: 'Durite d’Intercooler Renforcée 4 Plis Haute Pression Ford',
                    oem: '1827475 / AV61-6K683-CB',
                    price: 8500,
                    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=400&q=80',
                    catalogLink: '/catalog?category=Engine&keyword=Durite'
                }
            },
            {
                id: 'egr_clogged',
                label: 'À-coups moteur entre 1500 et 2000 tr/min + voyant moteur orange allumé',
                severity: 'medium',
                severityLabel: 'Urgence Moyenne — Encrassement progressif',
                diagnostic: 'Vanne EGR bloquée en position ouverte par la suie et la calamine.',
                obdCode: 'DTC P0400 / P0404 (Recirculation gaz échappement)',
                soummamTip: 'Le nettoyage seul ne dure que quelques semaines lorsque le moteur électrique interne a forcé. Le remplacement par une vanne avec refroidisseur neuf est garanti à 100%.',
                recommendedPart: {
                    name: 'Vanne EGR Électrique avec Boîtier Refroidisseur Motorcraft',
                    oem: 'BK2Q-9D475-CB / 1731754',
                    price: 34500,
                    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=400&q=80',
                    catalogLink: '/catalog?category=Engine&keyword=EGR'
                }
            },
            {
                id: 'timing_belt_squeal',
                label: 'Bruit de frottement continu ou sifflement du côté carter de distribution',
                severity: 'high',
                severityLabel: 'Arrêt Immédiat Conseillé — Risque casse moteur',
                diagnostic: 'Usure critique du galet tendeur de distribution ou pompe à eau grippée.',
                obdCode: 'Contrôle visuel / Kilométrage dépassé (> 80 000 km)',
                soummamTip: 'Si le galet bloque, la courroie casse et les soupapes heurtent les pistons. Changez toujours la pompe à eau en même temps que la courroie.',
                recommendedPart: {
                    name: 'Kit Distribution Complet (Courroie + 2 Galets + Pompe à Eau)',
                    oem: '1753584 / 1855735',
                    price: 21500,
                    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80',
                    catalogLink: '/catalog?category=Engine&keyword=Distribution'
                }
            }
        ]
    },
    Brakes: {
        id: 'Brakes',
        name: 'Système de Freinage & ABS',
        nameAr: 'الفرامل ونظام الأمان',
        icon: '🛑',
        desc: 'Grincement métallique, vibrations au volant au freinage, pédale spongieuse',
        symptoms: [
            {
                id: 'grinding_metal',
                label: 'Bruit de grincement aigu (fer contre fer) au moindre coup de frein',
                severity: 'high',
                severityLabel: 'Urgence Élevée — Perte d’efficacité de freinage',
                diagnostic: 'Plaquettes de frein complètement usées, le support métallique frotte sur le disque.',
                obdCode: 'Usure mécanique extrême des garnitures',
                soummamTip: 'À ce stade, le disque de frein est creusé et doit être remplacé simultanément avec les plaquettes pour éviter les vibrations.',
                recommendedPart: {
                    name: 'Jeu de Plaquettes de Frein Avant Haute Friction Motorcraft',
                    oem: '1807044 / AV61-2K021-BA',
                    price: 7200,
                    image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=400&q=80',
                    catalogLink: '/catalog?category=Brakes&keyword=Plaquettes'
                }
            },
            {
                id: 'warped_rotors_vibration',
                label: 'Forte vibration dans le volant uniquement lors des freinages à plus de 80 km/h',
                severity: 'medium',
                severityLabel: 'Urgence Moyenne — Confort & sécurité dégradés',
                diagnostic: 'Voile thermique des disques de frein avant (déformation suite à surchauffe).',
                obdCode: 'Contrôle au comparateur d’épaisseur',
                soummamTip: 'Les disques ventilés modernes perdent leur trempe s’ils sont passés dans une flaque d’eau après un freinage appuyé. Remplacement par paire obligatoire.',
                recommendedPart: {
                    name: 'Paire de Disques de Frein Ventilés Traités Anti-Corrosion',
                    oem: '1797226 / BV61-1125-BA',
                    price: 15400,
                    image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=400&q=80',
                    catalogLink: '/catalog?category=Brakes&keyword=Disques'
                }
            },
            {
                id: 'spongy_pedal',
                label: 'Pédale de frein molle qui s’enfonce profondément avant de mordre',
                severity: 'high',
                severityLabel: 'Arrêt Impératif — Risque perte totale de freinage',
                diagnostic: 'Présence d’air dans le circuit hydraulique ou coupelle de maître-cylindre détériorée.',
                obdCode: 'Contrôle niveau bocal liquide DOT4',
                soummamTip: 'Vérifiez immédiatement s’il y a une trace de fuite au niveau des flexibles arrière ou de la purge d’étrier.',
                recommendedPart: {
                    name: 'Maître-Cylindre Double Circuit Tandem Ford + Liquide DOT4',
                    oem: '1789452',
                    price: 18200,
                    image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=400&q=80',
                    catalogLink: '/catalog?category=Brakes&keyword=Cylindre'
                }
            }
        ]
    },
    Transmission: {
        id: 'Transmission',
        name: 'Embrayage & Boîte de Vitesses',
        nameAr: 'الدبرياج وعلبة السرعات',
        icon: '🔄',
        desc: 'Patinage en montée, claquement au point mort, pédale dure ou bloquée au plancher',
        symptoms: [
            {
                id: 'dmf_flywheel_rattle',
                label: 'Bruit de claquement métallique / vibration sourde au ralenti qui disparaît quand on appuie sur l’embrayage',
                severity: 'high',
                severityLabel: 'Urgence Élevée — Risque destruction carter boîte',
                diagnostic: 'Jeu axial et affaissement des ressorts du Volant Moteur Bi-Masse (DMF).',
                obdCode: 'Vibration harmonique TDCi',
                soummamTip: 'Panne typique des Ford Focus et Transit. Si le bimasse explose, les masselottes perforent le carter en aluminium de la boîte. Remplacez le kit complet avec butée.',
                recommendedPart: {
                    name: 'Kit Complet Volant Moteur Bi-Masse + Embrayage + Butée LuK / Sachs',
                    oem: '1731745 / 600014900',
                    price: 78000,
                    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=400&q=80',
                    catalogLink: '/catalog?category=Transmission&keyword=Volant'
                }
            },
            {
                id: 'clutch_slipping',
                label: 'Le compte-tours s’emballe en côte ou en 4ème vitesse sans que la voiture n’accélère (patinage)',
                severity: 'high',
                severityLabel: 'Urgence Élevée — Panne immobilisante proche',
                diagnostic: 'Garniture du disque d’embrayage usée jusqu’aux rivets ou polluée par de l’huile.',
                obdCode: 'Patinage mécanique de transmission',
                soummamTip: 'Ne tardez pas : rouler en patinant fait surchauffer le volant moteur jusqu’à le bleuir, ce qui vous obligera à le changer également.',
                recommendedPart: {
                    name: 'Kit d’Embrayage Renforcé Motorcraft (Disque + Mécanisme)',
                    oem: '1788732 / 3000951024',
                    price: 24500,
                    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=400&q=80',
                    catalogLink: '/catalog?category=Transmission&keyword=Embrayage'
                }
            },
            {
                id: 'clutch_slave_cylinder',
                label: 'Pédale d’embrayage qui reste plaquée au plancher ou liquide qui coule sous la boîte',
                severity: 'high',
                severityLabel: 'Immobilisation — Impossible d’enclencher les vitesses',
                diagnostic: 'Rupture du joint de la butée hydraulique centrale (débrayage).',
                obdCode: 'Fuite hydraulique circuit débrayage',
                soummamTip: 'Puisque la dépose de boîte est obligatoire pour changer cette pièce à 9000 DA, nous conseillons à nos clients de vérifier l’état du disque en même temps.',
                recommendedPart: {
                    name: 'Butée Hydraulique d’Embrayage Centrale Ford Origine',
                    oem: '1548409 / 3182600150',
                    price: 9200,
                    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=400&q=80',
                    catalogLink: '/catalog?category=Transmission&keyword=Butee'
                }
            }
        ]
    },
    Suspension: {
        id: 'Suspension',
        name: 'Suspension & Train Roulant',
        nameAr: 'نظام التعليق والمساعدين',
        icon: '🔩',
        desc: 'Claquement sur dos-d’âne, flottement sur piste, grincement de direction',
        symptoms: [
            {
                id: 'stabilizer_link_clunk',
                label: 'Claquement sec et répété (cloc-cloc) à faible vitesse sur routes dégradées ou ralentisseurs',
                severity: 'medium',
                severityLabel: 'Urgence Moyenne — Bruit très gênant',
                diagnostic: 'Jeu prononcé dans les rotules des biellettes de barre stabilisatrice.',
                obdCode: 'Jeu mécanique train avant',
                soummamTip: 'La pièce la plus sollicitée sur les routes algériennes. Remplacer les deux côtés en même temps pour garantir l’équilibre de la barre.',
                recommendedPart: {
                    name: 'Paire de Biellettes de Barre Stabilisatrice Avant Heavy Duty',
                    oem: '1762843 / AV61-3B438-AA',
                    price: 5400,
                    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=400&q=80',
                    catalogLink: '/catalog?category=Suspension&keyword=Biellette'
                }
            },
            {
                id: 'leaking_shock_absorbers',
                label: 'Voiture qui rebondit de manière exagérée, trace d’huile grasse sur le corps de l’amortisseur',
                severity: 'medium',
                severityLabel: 'Urgence Moyenne — Distance de freinage rallongée de 20%',
                diagnostic: 'Joint spi de tige d’amortisseur explosé, perte totale du gaz et de l’huile amortissante.',
                obdCode: 'Affaissement dynamique',
                soummamTip: 'Des amortisseurs morts détruisent prématurément vos pneus en facettes. Remplacement par paire recommandé avec butées neuves.',
                recommendedPart: {
                    name: 'Amortisseurs Avant à Gaz Bitube Haute Résistance Ford',
                    oem: '1839201 / EB3C-18045-A',
                    price: 16200,
                    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=400&q=80',
                    catalogLink: '/catalog?category=Suspension&keyword=Amortisseur'
                }
            }
        ]
    },
    Cooling: {
        id: 'Cooling',
        name: 'Refroidissement & Thermique',
        nameAr: 'نظام التبريد ومكيف الهواء',
        icon: '❄️',
        desc: 'Surchauffe moteur en embouteillage, fuite liquide rose, clim tiède',
        symptoms: [
            {
                id: 'thermostat_stuck_shut',
                label: 'Aiguille de température qui monte brutalement dans la zone rouge dans les bouchons',
                severity: 'high',
                severityLabel: 'Arrêt Immédiat Obligatoire — Danger joint de culasse',
                diagnostic: 'Calorstat (thermostat) bloqué en position fermée ou moto-ventilateur coupé.',
                obdCode: 'DTC P0217 (Température liquide surchauffe)',
                soummamTip: 'Coupez immédiatement le moteur. Ne versez surtout pas d’eau froide dans un moteur chaud sous peine de fendre la culasse. Utilisez exclusivement du liquide rose organique G12/Motorcraft.',
                recommendedPart: {
                    name: 'Boîtier Thermostat Calorstat Complet avec Sonde de Température',
                    oem: '1707008 / BK2Q-8A586-AB',
                    price: 6800,
                    image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=400&q=80',
                    catalogLink: '/catalog?category=Cooling&keyword=Thermostat'
                }
            },
            {
                id: 'water_pump_leak',
                label: 'Flaque de liquide de refroidissement rose sous la voiture du côté de la courroie',
                severity: 'high',
                severityLabel: 'Urgence Élevée — Baisse critique du niveau',
                diagnostic: 'Fuite du presse-étoupe de la pompe à eau moteur.',
                obdCode: 'Niveau bas bocal d’expansion',
                soummamTip: 'Sur les moteurs Ford TDCi, la pompe à eau est entraînée par la distribution. Si le roulement de la pompe grippe, la courroie casse.',
                recommendedPart: {
                    name: 'Pompe à Eau Métallique Renforcée avec Joint Haute Température',
                    oem: '1740621 / 1855735',
                    price: 8900,
                    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80',
                    catalogLink: '/catalog?category=Cooling&keyword=Pompe'
                }
            }
        ]
    },
    Electrical: {
        id: 'Electrical',
        name: 'Démarrage & Alternateur',
        nameAr: 'الكهرباء والدينامو وبادئ الحركة',
        icon: '⚡',
        desc: 'Clic-clic sans lancement du moteur, voyant batterie allumé en roulant',
        symptoms: [
            {
                id: 'starter_clicking',
                label: 'La clé tourne mais seul un clic sec se produit, le démarreur ne lance pas le moteur',
                severity: 'high',
                severityLabel: 'Panne Immobilisante — Démarrage impossible',
                diagnostic: 'Solénoïde de démarreur charbonné ou balais usés.',
                obdCode: 'Chute de tension contacteur démarreur',
                soummamTip: 'Vérifiez d’abord que les cosses de batterie ne sont pas sulfatées. Si le démarreur a plus de 150 000 km, son remplacement à neuf est plus fiable qu’une réfection.',
                recommendedPart: {
                    name: 'Démarreur Neuf Haute Puissance 12V Motorcraft Ford',
                    oem: '1709193 / BK2T-11000-AB',
                    price: 26500,
                    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80',
                    catalogLink: '/catalog?category=Electrical&keyword=Demarreur'
                }
            },
            {
                id: 'alternator_red_battery_light',
                label: 'Voyant rouge batterie allumé sur le tableau de bord pendant que le moteur tourne',
                severity: 'high',
                severityLabel: 'Arrêt Imminent — La batterie va se vider en 15 km',
                diagnostic: 'Pont de diodes ou régulateur d’alternateur hors-service (ne recharge plus la batterie).',
                obdCode: 'DTC P0620 / P0622 (Défaut circuit régulation alternateur)',
                soummamTip: 'Sur les Ford équipées de la technologie Smart Charge, n’installez pas un alternateur générique non reconnu par le calculateur sous peine d’allumer le voyant en permanence.',
                recommendedPart: {
                    name: 'Alternateur Smart Charge 150 Ampères d’Origine Ford',
                    oem: '1807494 / 1708322',
                    price: 38000,
                    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80',
                    catalogLink: '/catalog?category=Electrical&keyword=Alternateur'
                }
            }
        ]
    }
};

const DiagnosticPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { selectedVehicle, openGarageModal } = useGarage();

    // Step state: 1 = System selection, 2 = Symptom list, 3 = Result breakdown
    const [step, setStep] = useState(1);
    const [selectedSystem, setSelectedSystem] = useState(null);
    const [activeSymptom, setActiveSymptom] = useState(null);
    const [vehicleModel, setVehicleModel] = useState(selectedVehicle ? selectedVehicle.model : 'Focus');

    const handleSelectSystem = (sysKey) => {
        setSelectedSystem(sysKey);
        setStep(2);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    const handleSelectSymptom = (symptom) => {
        setActiveSymptom(symptom);
        setStep(3);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    const handleReset = () => {
        setStep(1);
        setSelectedSystem(null);
        setActiveSymptom(null);
    };

    const handleBackToSymptoms = () => {
        setStep(2);
        setActiveSymptom(null);
    };

    const handleAddPartToCart = (part) => {
        const itemPayload = {
            _id: 'diag-' + (part.oem ? part.oem.replace(/\s+/g, '') : 'part'),
            name: { fr: part.name, ar: part.name, en: part.name },
            price: part.price,
            oemNumber: part.oem,
            images: [part.image],
            category: selectedSystem || 'Engine',
            stock: 10
        };
        addToCart(itemPayload, 1);
        toast.success('Pièce diagnostiquée ajoutée au panier !');
    };

    const getWhatsAppDiagnosticMessage = () => {
        if (!activeSymptom) return '';
        return `Salam Krimo ! J'ai effectué un diagnostic sur mon véhicule :\n` +
            `🚗 Véhicule : Ford ${vehicleModel}\n` +
            `⚠️ Problème : ${activeSymptom.label}\n` +
            `🔍 Diagnostic : ${activeSymptom.diagnostic}\n` +
            `⚙️ Pièce préconisée : ${activeSymptom.recommendedPart.name} (OEM: ${activeSymptom.recommendedPart.oem})\n` +
            `Pouvez-vous confirmer la disponibilité au magasin de la Soummam et me donner votre meilleur prix ?`;
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
        exit: { opacity: 0, y: -15, transition: { duration: 0.25 } }
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '90vh', padding: 'clamp(1.5rem, 4vw, 3rem) clamp(0.5rem, 2vw, 1rem) 6rem clamp(0.5rem, 2vw, 1rem)' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* Header Banner */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.35rem 1rem',
                        backgroundColor: 'rgba(0, 52, 120, 0.08)',
                        color: 'var(--ford-blue)',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        marginBottom: '0.75rem',
                        border: '1px solid rgba(0, 52, 120, 0.15)'
                    }}>
                        <span>🔧</span>
                        <span>Expertise Pannes & Références Rechange Soummam</span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                        fontWeight: '900',
                        color: '#0f172a',
                        letterSpacing: '-0.02em',
                        margin: '0 0 0.75rem 0',
                        lineHeight: 1.2
                    }}>
                        Diagnostic Pannes Ford & Pièces Recommandées
                    </h1>

                    <p style={{
                        color: '#64748b',
                        fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)',
                        maxWidth: '750px',
                        margin: '0 auto 1.5rem auto',
                        lineHeight: '1.5'
                    }}>
                        Identifiez l'origine mécanique exacte de votre panne, bruit suspect ou voyant moteur et accédez immédiatement à la référence constructeur certifiée.
                    </p>

                    {/* Vehicle Quick Selector Bar */}
                    <div style={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '0.85rem 1.25rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '1rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>
                            <span>🚗</span>
                            <span>Véhicule à diagnostiquer :</span>
                        </div>

                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            {FORD_MODELS.map((m) => (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => setVehicleModel(m.id)}
                                    style={{
                                        padding: '0.35rem 0.75rem',
                                        borderRadius: '8px',
                                        border: vehicleModel === m.id ? '1.5px solid var(--ford-blue)' : '1px solid #cbd5e1',
                                        backgroundColor: vehicleModel === m.id ? 'var(--ford-blue)' : '#f8fafc',
                                        color: vehicleModel === m.id ? 'white' : '#475569',
                                        fontWeight: '700',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    {m.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Progress Stepper */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'clamp(0.4rem, 2vw, 1rem)',
                    marginBottom: '2rem',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: step >= 1 ? 'var(--ford-blue)' : '#94a3b8',
                        fontWeight: '700',
                        fontSize: 'clamp(0.75rem, 2.2vw, 0.88rem)'
                    }}>
                        <span style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            backgroundColor: step >= 1 ? 'var(--ford-blue)' : '#e2e8f0',
                            color: step >= 1 ? 'white' : '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            flexShrink: 0
                        }}>
                            1
                        </span>
                        <span>Organe</span>
                    </div>

                    <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>➔</span>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: step >= 2 ? 'var(--ford-blue)' : '#94a3b8',
                        fontWeight: '700',
                        fontSize: 'clamp(0.75rem, 2.2vw, 0.88rem)'
                    }}>
                        <span style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            backgroundColor: step >= 2 ? 'var(--ford-blue)' : '#e2e8f0',
                            color: step >= 2 ? 'white' : '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            flexShrink: 0
                        }}>
                            2
                        </span>
                        <span>Symptôme</span>
                    </div>

                    <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>➔</span>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: step === 3 ? '#16a34a' : '#94a3b8',
                        fontWeight: '700',
                        fontSize: 'clamp(0.75rem, 2.2vw, 0.88rem)'
                    }}>
                        <span style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            backgroundColor: step === 3 ? '#16a34a' : '#e2e8f0',
                            color: step === 3 ? 'white' : '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            flexShrink: 0
                        }}>
                            3
                        </span>
                        <span>Pièce OEM</span>
                    </div>
                </div>

                {/* Main Interactive Screen */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.06)',
                    border: '1px solid #e2e8f0',
                    padding: 'clamp(1rem, 3.5vw, 2rem)',
                    minHeight: '450px'
                }}>
                    <AnimatePresence mode="wait">

                        {/* STEP 1: Select Mechanical Organ / System */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.6rem)', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                                        Dans quelle zone observez-vous l'anomalie ?
                                    </h2>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                                        Sélectionnez le groupe mécanique concerné sur votre <strong>Ford {vehicleModel}</strong>.
                                    </p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1rem' }}>
                                    {Object.keys(DIAGNOSTIC_SYSTEMS).map((sysKey) => {
                                        const sys = DIAGNOSTIC_SYSTEMS[sysKey];
                                        return (
                                            <div
                                                key={sys.id}
                                                onClick={() => handleSelectSystem(sysKey)}
                                                style={{
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '16px',
                                                    padding: '1.5rem',
                                                    backgroundColor: '#ffffff',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    gap: '1rem'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.borderColor = 'var(--ford-blue)';
                                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                                    e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(0, 52, 120, 0.12)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                <div>
                                                    <div style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '12px',
                                                        backgroundColor: '#eff6ff',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1.6rem',
                                                        marginBottom: '1rem',
                                                        border: '1px solid #bfdbfe'
                                                    }}>
                                                        {sys.icon}
                                                    </div>

                                                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                                                        {sys.name}
                                                    </h3>

                                                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
                                                        {sys.desc}
                                                    </p>
                                                </div>

                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '700',
                                                    color: 'var(--ford-blue)',
                                                    borderTop: '1px solid #f1f5f9',
                                                    paddingTop: '0.75rem'
                                                }}>
                                                    <span>{sys.symptoms.length} pannes fréquentes</span>
                                                    <span>➔</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: Choose Specific Symptom / Noise */}
                        {step === 2 && selectedSystem && (
                            <motion.div
                                key="step2"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        style={{
                                            background: '#f1f5f9',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            color: '#475569',
                                            fontWeight: '700',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <span>←</span>
                                        <span>Changer de système</span>
                                    </button>

                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Système sélectionné :</span>
                                        <strong style={{ color: 'var(--ford-blue)', marginLeft: '6px', fontSize: '0.95rem' }}>
                                            {DIAGNOSTIC_SYSTEMS[selectedSystem].name}
                                        </strong>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                                        Quel symptôme ou comportement anormal constatez-vous ?
                                    </h2>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                                        Cliquez sur la description qui correspond le plus fidèlement au bruit ou comportement de votre Ford {vehicleModel}.
                                    </p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                    {DIAGNOSTIC_SYSTEMS[selectedSystem].symptoms.map((symptom) => (
                                        <div
                                            key={symptom.id}
                                            onClick={() => handleSelectSymptom(symptom)}
                                            style={{
                                                padding: 'clamp(0.85rem, 2.5vw, 1.25rem)',
                                                borderRadius: '14px',
                                                border: '1px solid #e2e8f0',
                                                backgroundColor: '#ffffff',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: '1rem',
                                                flexWrap: 'wrap'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#f8fafc';
                                                e.currentTarget.style.borderColor = 'var(--ford-blue)';
                                                e.currentTarget.style.transform = 'translateX(4px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = '#ffffff';
                                                e.currentTarget.style.borderColor = '#e2e8f0';
                                                e.currentTarget.style.transform = 'translateX(0)';
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: '1', minWidth: 'min(100%, 200px)' }}>
                                                <span style={{
                                                    fontSize: '1.2rem',
                                                    backgroundColor: '#f1f5f9',
                                                    width: '38px',
                                                    height: '38px',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}>
                                                    🔊
                                                </span>
                                                <div>
                                                    <div style={{ fontSize: 'clamp(0.92rem, 2vw, 1.05rem)', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
                                                        {symptom.label}
                                                    </div>
                                                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                                        Diagnostic probable : {symptom.diagnostic}
                                                    </div>
                                                </div>
                                            </div>

                                            <span style={{
                                                padding: '0.45rem 0.85rem',
                                                borderRadius: '8px',
                                                backgroundColor: '#eff6ff',
                                                color: 'var(--ford-blue)',
                                                fontWeight: '700',
                                                fontSize: '0.825rem',
                                                flexShrink: 0
                                            }}>
                                                Voir la solution ➔
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: Complete Technical Diagnostic Report & Recommended Replacement Part */}
                        {step === 3 && activeSymptom && (
                            <motion.div
                                key="step3"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                {/* Top Controls */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    <button
                                        type="button"
                                        onClick={handleBackToSymptoms}
                                        style={{
                                            background: '#f1f5f9',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            color: '#475569',
                                            fontWeight: '700',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <span>←</span>
                                        <span>Choisir un autre symptôme</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--ford-blue)',
                                            fontWeight: '700',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        Nouveau diagnostic complet ↺
                                    </button>
                                </div>

                                {/* Report Card */}
                                <div style={{
                                    border: '1.5px solid #bfdbfe',
                                    borderRadius: '16px',
                                    backgroundColor: '#f8fafc',
                                    overflow: 'hidden',
                                    marginBottom: '2.5rem'
                                }}>
                                    {/* Report Header */}
                                    <div style={{
                                        backgroundColor: '#071d49',
                                        color: 'white',
                                        padding: 'clamp(0.85rem, 3vw, 1.25rem) clamp(1rem, 3.5vw, 1.75rem)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: '1rem'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.8rem', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '800' }}>
                                                Rapport Diagnostic Technique Soummam
                                            </div>
                                            <h2 style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)', fontWeight: '800', margin: '4px 0 0 0' }}>
                                                Ford {vehicleModel} • {DIAGNOSTIC_SYSTEMS[selectedSystem].name}
                                            </h2>
                                        </div>

                                        <div style={{
                                            padding: '0.35rem 0.85rem',
                                            borderRadius: '9999px',
                                            backgroundColor: activeSymptom.severity === 'high' ? '#fee2e2' : '#fef3c7',
                                            color: activeSymptom.severity === 'high' ? '#991b1b' : '#92400e',
                                            fontSize: '0.8rem',
                                            fontWeight: '800',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <span>{activeSymptom.severity === 'high' ? '🔴' : '🟡'}</span>
                                            <span>{activeSymptom.severityLabel}</span>
                                        </div>
                                    </div>

                                    {/* Diagnostic Details */}
                                    <div style={{ padding: 'clamp(1rem, 3.5vw, 1.75rem)' }}>
                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                Symptôme Constaté :
                                            </div>
                                            <div style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', fontWeight: '700', color: '#0f172a', marginTop: '3px' }}>
                                                « {activeSymptom.label} »
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
                                            gap: '1.25rem',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                                <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', marginBottom: '4px' }}>
                                                    🔍 Cause Mécanique Probable :
                                                </div>
                                                <div style={{ fontSize: '0.95rem', color: '#334155', fontWeight: '600' }}>
                                                    {activeSymptom.diagnostic}
                                                </div>
                                            </div>

                                            <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                                <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', marginBottom: '4px' }}>
                                                    💻 Code Défaut OBD Fréquent :
                                                </div>
                                                <div className="badge-oem" style={{ fontSize: '0.95rem', color: 'var(--ford-blue)' }}>
                                                    {activeSymptom.obdCode}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Soummam Mechanic Note */}
                                        <div style={{
                                            backgroundColor: '#eff6ff',
                                            borderLeft: '4px solid var(--ford-blue)',
                                            padding: '1rem 1.25rem',
                                            borderRadius: '0 10px 10px 0',
                                            fontSize: '0.9rem',
                                            color: '#1e3a8a',
                                            lineHeight: '1.5'
                                        }}>
                                            <strong>💡 Conseil Atelier Soummam :</strong> {activeSymptom.soummamTip}
                                        </div>
                                    </div>
                                </div>

                                {/* Recommended Part Box */}
                                <div style={{
                                    backgroundColor: 'white',
                                    border: '2px solid #86efac',
                                    borderRadius: '16px',
                                    padding: 'clamp(1rem, 3.5vw, 1.75rem)',
                                    boxShadow: '0 8px 24px -4px rgba(34, 197, 94, 0.12)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        <span style={{
                                            backgroundColor: '#dcfce7',
                                            color: '#15803d',
                                            padding: '0.3rem 0.75rem',
                                            borderRadius: '6px',
                                            fontSize: '0.78rem',
                                            fontWeight: '800',
                                            textTransform: 'uppercase'
                                        }}>
                                            ✓ Pièce Recommandée en Stock à la Soummam
                                        </span>

                                        <span className="badge-oem" style={{
                                            fontSize: '0.8rem',
                                            color: 'var(--ford-blue)',
                                            backgroundColor: '#eff6ff',
                                            padding: '0.25rem 0.65rem',
                                            borderRadius: '6px',
                                            border: '1px solid #bfdbfe'
                                        }}>
                                            OEM : {activeSymptom.recommendedPart.oem}
                                        </span>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                                        gap: '1.25rem',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                            <img
                                                src={activeSymptom.recommendedPart.image}
                                                alt={activeSymptom.recommendedPart.name}
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    borderRadius: '12px',
                                                    objectFit: 'cover',
                                                    border: '1px solid #e2e8f0',
                                                    flexShrink: 0
                                                }}
                                            />

                                            <div style={{ flex: '1', minWidth: 'min(100%, 180px)' }}>
                                                <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', fontWeight: '800', color: '#0f172a', margin: '0 0 0.35rem 0', lineHeight: '1.3' }}>
                                                    {activeSymptom.recommendedPart.name}
                                                </h3>
                                                <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '700' }}>
                                                    ● Disponible immédiatement au comptoir Soummam
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                                            <div className="tabular-price" style={{ fontSize: 'clamp(1.5rem, 4vw, 1.9rem)', fontWeight: '900', color: 'var(--ford-blue)' }}>
                                                {activeSymptom.recommendedPart.price.toLocaleString('fr-DZ')} <span style={{ fontSize: '0.9rem', color: '#64748b' }}>DA</span>
                                            </div>

                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', width: '100%' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddPartToCart(activeSymptom.recommendedPart)}
                                                    style={{
                                                        flex: 1,
                                                        minWidth: 'min(100%, 140px)',
                                                        padding: '0.75rem 1rem',
                                                        borderRadius: '10px',
                                                        backgroundColor: 'var(--ford-blue)',
                                                        color: 'white',
                                                        border: 'none',
                                                        fontWeight: '700',
                                                        fontSize: '0.875rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '6px',
                                                        boxShadow: '0 4px 12px rgba(0, 52, 120, 0.25)'
                                                    }}
                                                >
                                                    <span>🛒</span>
                                                    <span>Ajouter au Panier</span>
                                                </button>

                                                <a
                                                    href={getWhatsAppLink(getWhatsAppDiagnosticMessage())}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        flex: 1,
                                                        minWidth: 'min(100%, 160px)',
                                                        padding: '0.75rem 1rem',
                                                        borderRadius: '10px',
                                                        backgroundColor: '#25D366',
                                                        color: 'white',
                                                        textDecoration: 'none',
                                                        fontWeight: '700',
                                                        fontSize: '0.875rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '6px',
                                                        boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                                                    }}
                                                >
                                                    <span>💬</span>
                                                    <span>Confirmer WhatsApp</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Reassurance Callout */}
                                <div style={{
                                    marginTop: '2rem',
                                    textAlign: 'center',
                                    color: '#64748b',
                                    fontSize: '0.85rem',
                                    lineHeight: '1.6'
                                }}>
                                    Vous avez un doute ou un bruit différent ? Envoyez un enregistrement vocal ou une photo sur{' '}
                                    <a
                                        href={getWhatsAppLink(`Salam Krimo, j'ai un bruit sur ma Ford ${vehicleModel} et j'aimerais vous envoyer une vidéo pour avis.`)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#16a34a', fontWeight: '700', textDecoration: 'underline' }}
                                    >
                                        notre WhatsApp direct (+213 669 01 48 90)
                                    </a>. Nos techniciens vous répondent en direct de la Soummam.
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default DiagnosticPage;
