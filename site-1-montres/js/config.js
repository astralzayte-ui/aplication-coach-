/* =========================================================
   config.js — Réglages de la boutique
   ---------------------------------------------------------
   Tout ce qu'on peut vouloir changer rapidement est ici,
   au même endroit : nom de la boutique, numéro WhatsApp,
   devise, frais de livraison.
   ========================================================= */

const CONFIG = {
  nomBoutique: 'Aurel',
  slogan: 'Horlogerie de caractère — Marrakech',

  // Numéro WhatsApp au format international, SANS le "+" ni les espaces.
  // Exemple : +212 6 00 00 00 00  →  '212600000000'
  whatsapp: '212693511445',

  devise: 'DH',

  // Livraison offerte à partir de ce montant, sinon on applique les frais.
  livraisonOfferteDes: 2000,
  fraisLivraison: 50,

  // Clé utilisée pour enregistrer le panier dans le navigateur (localStorage).
  clePanier: 'aurel_panier'
};
