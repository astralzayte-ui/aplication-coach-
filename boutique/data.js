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
  livraison: 4.99,        // France métropolitaine (CGV)
  delaiJours: null,       // ex. [2, 3]  → « Arrivée estimée le … »

  // le code du popup -10 %
  codeBienvenue: 'BIENVENUE10',
  remiseBienvenue: 10
};

window.PRODUITS = [
  {
    id: 'ensemble-col-rond', rayon: 'ensembles',
    nom: 'Ensemble sweat + pantalon large', court: "L'ensemble col rond",
    grammage: null, note: 'Col rond, pantalon large',
    prix: 54.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Le sweat col rond et le pantalon large, assortis. Confortable et propre, du matin au soir. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'ensemble-hoodie', rayon: 'ensembles', vedette: true, badge: 'Tendance',
    nom: 'Ensemble hoodie + jogging large', court: "L'ensemble hoodie",
    grammage: null, note: 'Plusieurs couleurs',
    prix: 54.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Le sweat à capuche et le jogging large, même couleur. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'ensemble-sable', rayon: 'ensembles',
    nom: 'Ensemble hoodie sable', court: "L'ensemble sable",
    grammage: null, note: 'Couleur sable',
    prix: 54.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Sweat à capuche et jogging resserré aux chevilles, couleur sable. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'hoodie-ailes', rayon: 'pulls', vedette: true,
    nom: 'Hoodie ailes en strass', court: 'Le hoodie ailes',
    grammage: null, note: 'Ailes en strass dans le dos', badge: 'Tendance', couleur: 'Gris chiné',
    prix: 39.90, marche: null, ecart: null,
    photos: ['hoodie-ailes-1.jpg', 'hoodie-ailes-2.jpg', 'hoodie-ailes-3.jpg'],
    details: ['Sweat à capuche', 'Coupe ample, épaules tombantes', 'Deux ailes en strass argentés dans le dos', 'Matière : polyester', 'Entretien : à confirmer avec le fournisseur'],
    description: 'Le sweat à capuche gris chiné, coupe ample, avec deux grandes ailes en strass argentés dans le dos. Elles brillent à la lumière.'
  },
  {
    id: 'gilet-court', rayon: 'pulls',
    nom: 'Gilet court ajusté à boutons', court: 'Le gilet court',
    grammage: null, note: 'Maille torsadée',
    prix: 39.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Gilet court, ajusté, en maille torsadée, fermé par des boutons. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'pull-uni', rayon: 'pulls',
    nom: 'Pull uni oversize', court: 'Le pull uni',
    grammage: null, note: 'Col rond, plusieurs couleurs',
    prix: 39.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Pull col rond, coupe large, maille douce. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'pull-raye', rayon: 'pulls',
    nom: 'Pull rayé oversize', court: 'Le pull rayé',
    grammage: null, note: 'Col rond',
    prix: 39.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Pull col rond, coupe large, à rayures. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'gilet-doux', rayon: 'pulls',
    nom: 'Gilet tout doux à boutons', court: 'Le gilet doux',
    grammage: null, note: 'Maille duveteuse',
    prix: 39.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Gilet en maille duveteuse, col V, boutons nacrés. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'robe-cache-coeur', rayon: 'robes',
    nom: 'Robe courte cache-cœur', court: 'La robe cache-cœur',
    grammage: null, note: 'Manches longues',
    prix: 34.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Robe courte moulante, col cache-cœur, manches longues. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'robe-maille', rayon: 'robes',
    nom: 'Robe longue col V en maille', court: 'La robe en maille',
    grammage: null, note: 'Épaulettes, boutons',
    prix: 34.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Robe longue en maille, col V, épaulettes, fermée par des boutons. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'robe-dos-nu', rayon: 'robes', vedette: true, badge: 'Nouveau',
    nom: 'Robe longue dos nu', court: 'La robe dos nu',
    grammage: null, note: 'Décolleté V, manches longues',
    prix: 34.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Robe longue moulante, décolleté V, dos nu, manches longues. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'doudoune-courte', rayon: 'vestes', vedette: true, badge: 'Nouveau',
    nom: 'Doudoune courte', court: 'La doudoune courte',
    grammage: null, note: 'Col montant, bas resserré',
    prix: 59.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Doudoune courte et épaisse, col montant, bas resserré. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'doudoune-col', rayon: 'vestes',
    nom: 'Doudoune à col montant', court: 'La doudoune col montant',
    grammage: null, note: 'Coupe droite',
    prix: 59.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Doudoune matelassée, col montant, fermeture éclair. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'sac-boucle', rayon: 'sacs',
    nom: 'Sac à boucle', court: 'Le sac à boucle',
    grammage: null, note: 'Porté épaule',
    prix: 39.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Sac porté épaule avec une ceinture à boucle. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'sac-hobo', rayon: 'sacs',
    nom: 'Sac hobo', court: 'Le sac hobo',
    grammage: null, note: 'Grand, forme arrondie',
    prix: 39.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Grand sac rond porté épaule, aspect cuir souple. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'echarpe-grise', rayon: 'accessoires',
    nom: 'Écharpe douce à franges', court: "L'écharpe grise",
    grammage: null, note: 'Longue et large',
    prix: 19.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Grosse écharpe toute douce à franges. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'echarpe-leopard', rayon: 'accessoires',
    nom: 'Écharpe léopard', court: "L'écharpe léopard",
    grammage: null, note: 'Douce et chaude',
    prix: 19.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Écharpe imprimé léopard, douce et chaude. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'bonnet-camouflage', rayon: 'accessoires', badge: '5 € dès 2 articles',
    nom: 'Bonnet camouflage', court: 'Le bonnet camouflage',
    grammage: null, note: '5 € dès 2 articles',
    prix: 14.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Bonnet en maille, motif camouflage. 5 € au lieu de 14,90 € dès que tu as un autre article dans ton panier. Composition exacte : à confirmer avec le fournisseur.'
  },
  {
    id: 'bonnet-pompon', rayon: 'accessoires', badge: '5 € dès 2 articles',
    nom: 'Bonnet grosse maille à pompon', court: 'Le bonnet à pompon',
    grammage: null, note: '5 € dès 2 articles',
    prix: 14.90, marche: null, ecart: null,
    photos: ['vide.svg'],
    description: 'Bonnet en grosse maille avec pompon. 5 € au lieu de 14,90 € dès que tu as un autre article dans ton panier. Composition exacte : à confirmer avec le fournisseur.'
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
  { id: 'pulls',       nom: 'Pulls & gilets',     texte: "Hoodies, pulls et gilets, en coupe ample ou ajustée." },
  { id: 'robes',       nom: 'Robes',              texte: "Courtes ou longues, pour la journée comme pour sortir." },
  { id: 'vestes',      nom: 'Doudounes',          texte: "Courtes et chaudes, pour tout l'hiver." },
  { id: 'sacs',        nom: 'Sacs',               texte: "Des grands sacs qui portent tout, portés épaule." },
  { id: 'accessoires', nom: 'Écharpes & bonnets', texte: "Les bonnets passent à 5 € dès que tu as un autre article dans ton panier." }
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
