// ⚠️ À PERSONNALISER :
// Numéro WhatsApp du propriétaire (format international, sans "+" ni espaces).
// C'est ce numéro qu'ouvre le bouton "Payer via WhatsApp" à la fin de l'essai,
// pour que le client te contacte et que tu lui envoies ton RIB.
export const SUPPORT_WHATSAPP = '212600000000'

export const BUSINESS_NAME = 'Romi'

// Fourchette du curseur de budget hebdomadaire, en dirham (MAD).
// BUDGET_MIN = étude de marché : plancher réel pour 1 personne / 1 semaine avec
// 3 repas/jour, en optimisant au maximum (staples bon marché : œufs, lentilles,
// pâtes, riz, pain, légumes de saison). Mesuré ≈ 320 DH (dont ~150 DH de
// placards achetés une seule fois — huile, riz, épices), marge incluse.
export const BUDGET_MIN = 350
export const BUDGET_MAX = 30000
export const BUDGET_DEFAULT = 800
export const BUDGET_STEP = 50
