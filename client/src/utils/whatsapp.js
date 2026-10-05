// WhatsApp Assistant Helper for Krimo-Ford (Boulevard de la Soummam)

export const KRIMO_PHONE = "+213669014890"; // Algerian mobile format

/**
 * Generate a direct WhatsApp link with a formatted message
 * @param {string} text 
 * @returns {string} WhatsApp URL
 */
export const getWhatsAppLink = (text) => {
    const cleanPhone = KRIMO_PHONE.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(text.trim());
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
};

/**
 * Format message for requesting a quote via VIN / Carte Grise
 */
export const createVinQuoteWhatsAppMessage = ({ vin, model, year, partDescription, wilaya, name }) => {
    return `Salam Krimo ! 
Je vous contacte depuis la plateforme Krimo-Ford pour une demande de pièce :
- Modèle : Ford ${model || 'Non spécifié'} ${year ? `(${year})` : ''}
- N° Châssis (VIN) : ${vin || 'Voir photo carte grise'}
- Pièce recherchée : ${partDescription || 'Demande générale'}
- Wilaya : ${wilaya || 'Alger'}
- Nom du client : ${name || 'Client'}

Avez-vous cette pièce en stock ou sur commande ? Merci !`;
};

/**
 * Format message for 1-click product purchase or inquiry
 */
export const createProductInquiryWhatsAppMessage = ({ product, vehicle, language = 'fr' }) => {
    const productName = typeof product?.name === 'object'
        ? (product.name[language] || product.name.fr || product.name.en || 'Pièce Ford')
        : (product?.name || 'Pièce Ford');

    const oem = product?.oemNumber ? ` (Réf OEM: ${product.oemNumber})` : '';
    const price = product?.price ? `${product.price.toLocaleString()} DA` : 'Prix à confirmer';
    const vehicleInfo = vehicle ? `pour ma Ford ${vehicle.model} ${vehicle.year || ''}` : '';

    return `Salam Krimo !
Je souhaite commander ou vérifier la disponibilité de cette pièce :
- Pièce : ${productName}${oem}
- Prix affiché : ${price}
${vehicleInfo ? `- Véhicule : ${vehicleInfo}` : ''}

Est-elle disponible pour expédition immédiate ? Merci !`;
};
