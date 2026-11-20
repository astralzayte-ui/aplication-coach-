/* AMBRE NOIRE PARIS — tout ce qui change se change ICI, et nulle part ailleurs.
   Un prix, un délai, un numéro : une seule ligne à modifier. */

window.CONFIG = {
  whatsapp: '212728861105',
  whatsappAffiche: '+212 728 861 105',
  email: 'ambrenoirparis@gmail.com',
  instagram: 'ambrenoirparisfr',
  instagramMaroc: 'ambrenoirparis',
  tiktok: 'ambrenoirparis',
  tiktokMaroc: 'ambrenoirparis2',

  // 🔴 PAS ENCORE ARRÊTÉS — laisser null tant que l'agent n'a pas répondu.
  // null = la ligne n'apparaît nulle part sur le site.
  livraison: null,        // ex. 4.99
  delaiJours: null,       // ex. [2, 3]  → « Arrivée estimée le … »

  // le code du popup -10 %
  codeBienvenue: 'BIENVENUE10',
  remiseBienvenue: 10
};

window.PRODUITS = [
  {
    id: 'ensemble-gris', rayon: 'ensembles', vedette: true,
    nom: 'Ensemble côtelé gris', court: "L'ensemble gris",
    grammage: null, note: 'Sweat + pantalon large',
    prix: 54.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Le haut et le pantalon large en maille côtelée grise. Assortis, faciles à porter du matin au soir. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'ensemble-hoodie', rayon: 'ensembles', vedette: true,
    nom: 'Ensemble hoodie + jogging large', court: "L'ensemble hoodie",
    grammage: null, note: 'Plusieurs couleurs',
    prix: 54.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: "Le sweat à capuche et le jogging large, même couleur. Le confort du jogging, l'allure d'une tenue. Composition exacte : à confirmer avec le fournisseur."
  },
  {
    id: 'hoodie-ailes', rayon: 'pulls', vedette: true,
    nom: 'Hoodie ailes brodées', court: 'Le hoodie ailes',
    grammage: null, note: 'Gris clair, ailes dans le dos',
    prix: 39.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Sweat à capuche gris clair, avec des ailes brodées dans le dos. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'pull-cotele', rayon: 'pulls',
    nom: 'Pull côtelé à boutons', court: 'Le pull côtelé',
    grammage: null, note: 'Coupe ajustée',
    prix: 39.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Pull en maille côtelée, ajusté, fermé par des boutons. Se porte seul ou ouvert sur un top. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'hoodie-oversize', rayon: 'pulls',
    nom: 'Hoodie oversize anthracite', court: 'Le hoodie oversize',
    grammage: null, note: 'Coupe large',
    prix: 39.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Sweat à capuche ample, gris foncé. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'pull-rayures', rayon: 'pulls',
    nom: 'Pull à rayures oversize', court: 'Le pull rayé',
    grammage: null, note: 'Col rond',
    prix: 39.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Pull col rond, coupe large, rayures. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'gilet-oversize', rayon: 'pulls',
    nom: 'Gilet oversize à boutons', court: 'Le gilet',
    grammage: null, note: 'Maille épaisse',
    prix: 39.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Gilet en maille, ample, à gros boutons. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'robe-froncee', rayon: 'robes',
    nom: 'Robe courte froncée', court: 'La robe froncée',
    grammage: null, note: 'Manches longues',
    prix: 34.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Robe courte moulante, froncée à la taille, col croisé, manches longues. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'robe-rayee', rayon: 'robes',
    nom: 'Robe tailleur rayée', court: 'La robe rayée',
    grammage: null, note: 'Coupe tailleur',
    prix: 34.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Robe courte à rayures, coupe tailleur. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'robe-dos-nu', rayon: 'robes', vedette: true,
    nom: 'Robe dos nu', court: 'La robe dos nu',
    grammage: null, note: 'Polyester, légèrement extensible',
    prix: 34.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Robe moulante à manches longues, dos nu. Matière : polyester, légèrement extensible (pourcentage exact à confirmer avec le fournisseur).'
  },
  {
    id: 'sac-boucle', rayon: 'sacs',
    nom: 'Sac à boucle', court: 'Le sac à boucle',
    grammage: null, note: 'Grande contenance',
    prix: 39.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Grand sac porté épaule, fermé par une large boucle. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'sac-rivets', rayon: 'sacs',
    nom: 'Sac cuir vieilli à rivets', court: 'Le sac à rivets',
    grammage: null, note: 'Aspect cuir vieilli',
    prix: 39.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Sac porté épaule, aspect cuir vieilli, détails rivets. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'echarpe', rayon: 'accessoires',
    nom: 'Écharpe douce à franges', court: "L'écharpe",
    grammage: null, note: 'Grise, longue et large',
    prix: 19.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Grosse écharpe toute douce à franges, longue et large. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'bonnet', rayon: 'accessoires',
    nom: 'Bonnet camouflage', court: 'Le bonnet',
    grammage: null, note: '5 € dès 2 articles',
    prix: 14.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Bonnet en maille, motif camouflage. 5 € au lieu de 14,90 € dès que tu as un autre article dans ton panier. Composition exacte : à confirmer avec le fournisseur.'
  }
];

/* Les packs — un prix, un colis. Le détail (taille, couleur) est confirmé avec la cliente.
   🔴 « Le plus choisi » seulement quand c'est VRAI. Avant les ventes : « Recommandé ». */
window.LOTS = [
  { titre: 'Pull + écharpe', detail: 'Séparément 59,80 €', prix: 49.90, ajouter: 'Pack pull + écharpe', gain: '−9,90 €' },
  { titre: 'Ensemble + écharpe', detail: 'Séparément 74,80 €', prix: 64.90, ajouter: 'Pack ensemble + écharpe', mis: 'Recommandé', gain: '−9,90 €' },
  { titre: "Tenue d'hiver", detail: 'Ensemble + écharpe + bonnet', prix: 74.90, ajouter: "Pack tenue d'hiver", gain: '−14,80 €' }
];

window.RAYONS = [
  { id: 'ensembles',   nom: 'Ensembles',          texte: "Le haut et le bas assortis. La tenue complète, sans réfléchir le matin." },
  { id: 'pulls',       nom: 'Pulls & sweats',     texte: "Hoodies, pulls et gilets, en coupe ample ou ajustée." },
  { id: 'robes',       nom: 'Robes',              texte: "Courtes ou longues, pour la journée comme pour sortir." },
  { id: 'sacs',        nom: 'Sacs',               texte: "Des grands sacs qui portent tout, portés épaule." },
  { id: 'accessoires', nom: 'Écharpes & bonnets', texte: "Le bonnet passe à 5 € dès que tu as un autre article dans ton panier." }
];

/* Les avis — VIDE tant qu'il n'y a pas de vrais clients.
   Section masquée automatiquement si la liste est vide.
   🔴 Jamais un faux avis. Ils arrivent par le message WhatsApp à J+10. */
window.AVIS = [];

window.FAQ = [
  { q: 'Vos vêtements taillent comment ?',
    r: "Coupe normale à légèrement ample. Entre deux tailles, prends la plus grande pour un rendu oversize. Un doute ? Écris-nous sur WhatsApp, on te guide." },
  { q: 'Quels sont les délais de livraison ?',
    r: "Les colis partent de l'entrepôt de notre fournisseur, en Chine. Compte 4 à 10 jours ouvrés après l'expédition. Le délai t'est confirmé avant que tu paies." },
  { q: 'Et si la taille ne me va pas ?',
    r: "Tu peux changer d'avis : toutes les conditions sont dans nos conditions générales de vente. Un défaut ? On rembourse ou on remplace, sans frais pour toi." },
  { q: 'Le paiement est-il sécurisé ?',
    r: "Paiement par carte uniquement, jamais à la livraison. Tes données bancaires ne passent jamais par nous." },
  { q: 'Où sont fabriquées vos pièces ?',
    r: "On ne fabrique pas nous-mêmes, et on le dit : nos pièces viennent d'un fournisseur partenaire, qui les stocke et les expédie depuis la Chine. C'est ce qui nous permet de garder des prix justes. Et ton contrat est avec nous, avec nous seuls." },
  { q: 'Une question, un souci ?',
    r: "Écris-nous sur WhatsApp ou par e-mail, avant comme après ta commande. Une vraie personne te répond." }
];
