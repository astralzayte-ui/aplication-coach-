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

  // plus d'offre −10 % (retirée le 21/11)
  codeBienvenue: null,
  remiseBienvenue: 0
};

window.PRODUITS = [
  {
    id: 'ensemble-col-rond', rayon: 'ensembles',
    nom: 'Ensemble sweat à poche + pantalon large', court: 'L\'ensemble sweat noir',
    grammage: null, note: 'Petit col montant, poche poitrine',
    prix: 54.90, marche: null, ecart: null,
    couleur: 'Noir',
    photos: ['ensemble-col-rond-1.jpg', 'ensemble-col-rond-2.jpg', 'ensemble-col-rond-3.jpg', 'ensemble-col-rond-4.jpg'],
    description: 'Le sweat ample avec sa poche sur la poitrine et le pantalon large, assortis. Confortable et propre, du matin au soir.',
    details: ['Sweat ample, petit col montant, poche poitrine', 'Pantalon large assorti', 'Matière : à confirmer avec le fournisseur'],
    tailles: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'ensemble-hoodie', rayon: 'ensembles', vedette: true, badge: 'Nouveau',
    nom: 'Ensemble hoodie + jogging large', court: "L'ensemble hoodie",
    grammage: null, note: 'Hoodie + jogging large',
    prix: 54.90, marche: null, ecart: null,
    couleur: 'Blanc chiné',
    photos: ['ensemble-hoodie-1.jpg', 'ensemble-hoodie-2.jpg', 'ensemble-hoodie-3.jpg', 'ensemble-hoodie-4.jpg'],
    description: 'Le sweat à capuche et le jogging large, même couleur.',
    details: ['Sweat à capuche + jogging large assorti', 'Matière : à confirmer avec le fournisseur']
  },
  {
    id: 'ensemble-sable', rayon: 'ensembles',
    nom: 'Ensemble hoodie sable', court: "L'ensemble sable",
    grammage: null, note: 'Couleur sable',
    prix: 54.90, marche: null, ecart: null,
    couleur: 'Sable',
    photos: ['ensemble-sable-1.jpg', 'ensemble-sable-2.jpg', 'ensemble-sable-3.jpg', 'ensemble-sable-4.jpg'],
    description: 'Sweat à capuche court et jogging resserré aux chevilles, couleur sable.',
    details: ['Sweat à capuche court + jogging resserré aux chevilles', 'Matière : à confirmer avec le fournisseur'],
    tailles: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'hoodie-ailes', rayon: 'pulls', vedette: true,
    nom: 'Hoodie ailes argentées', court: 'Le hoodie ailes',
    grammage: null, note: 'Ailes argentées dans le dos', badge: 'Nouveau', couleur: 'Gris chiné',
    prix: 39.90, marche: null, ecart: null,
    photos: ['hoodie-ailes-1.jpg', 'hoodie-ailes-2.jpg', 'hoodie-ailes-3.jpg'],
    details: ['Sweat à capuche', 'Coupe ample, épaules tombantes', 'Deux grandes ailes argentées dans le dos', 'Matière : polyester (pourcentage exact à confirmer)', 'Entretien : à confirmer avec le fournisseur'],
    description: 'Le sweat à capuche gris chiné, coupe ample, avec deux grandes ailes argentées dans le dos.',
    tailles: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
  },
  {
    id: 'gilet-court', rayon: 'pulls',
    nom: 'Gilet court ajusté à boutons', court: 'Le gilet court',
    grammage: null, note: 'Maille torsadée',
    prix: 39.90, marche: null, ecart: null,
    couleur: 'Rose',
    photos: ['gilet-court-1.jpg', 'gilet-court-2.jpg', 'gilet-court-3.jpg', 'gilet-court-4.jpg'],
    description: 'Gilet court et ajusté en maille torsadée, col rond orné de perles, fermé par des boutons.',
    details: ['Gilet court ajusté, maille torsadée', 'Col rond orné de perles, boutons', 'Matière : à confirmer avec le fournisseur'],
    tailles: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'pull-uni', rayon: 'pulls',
    nom: 'Pull uni oversize', court: 'Le pull uni',
    grammage: null, note: 'Col rond, coupe ample',
    prix: 39.90, marche: null, ecart: null,
    couleur: 'Jaune pastel',
    photos: ['pull-uni-1.jpg', 'pull-uni-2.jpg', 'pull-uni-3.jpg', 'pull-uni-4.jpg'],
    description: 'Pull col rond, coupe ample, maille douce.',
    details: ['Pull col rond, coupe ample', 'Matière : acrylique (pourcentage exact à confirmer)']
  },
  {
    id: 'pull-raye', rayon: 'pulls',
    nom: 'Pull rayé oversize', court: 'Le pull rayé',
    grammage: null, note: 'Col rond',
    prix: 39.90, marche: null, ecart: null,
    couleur: 'Rayé bleu, lilas et blanc',
    photos: ['pull-raye-1.jpg', 'pull-raye-2.jpg', 'pull-raye-3.jpg', 'pull-raye-4.jpg'],
    description: 'Pull col rond, coupe ample, à rayures.',
    details: ['Pull col rond, coupe ample, à rayures', 'Matière : acrylique et nylon (pourcentages exacts à confirmer)', 'Mesures S / M / L : poitrine 104 / 108 / 112 cm · longueur 56 / 58 / 60 cm · manches 53 / 54 / 55 cm'],
    tailles: ['S', 'M', 'L']
  },
  {
    id: 'gilet-doux', rayon: 'pulls',
    nom: 'Gilet tout doux à boutons', court: 'Le gilet doux',
    grammage: null, note: 'Maille duveteuse',
    prix: 39.90, marche: null, ecart: null,
    couleur: 'Vert olive',
    photos: ['gilet-doux-1.jpg', 'gilet-doux-2.jpg', 'gilet-doux-3.jpg', 'gilet-doux-4.jpg'],
    description: 'Gilet en maille duveteuse, col V, boutons effet perle.',
    details: ['Gilet col V, maille duveteuse', 'Boutons effet perle', 'Matière : à confirmer avec le fournisseur'],
    tailles: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
  },
  {
    id: 'robe-cache-coeur', rayon: 'robes',
    nom: 'Robe courte cache-cœur effet velours', court: 'La robe cache-cœur',
    grammage: null, note: 'Manches longues',
    prix: 34.90, marche: null, ecart: null,
    couleur: 'Noir',
    photos: ['robe-cache-coeur-1.jpg', 'robe-cache-coeur-2.jpg', 'robe-cache-coeur-3.jpg', 'robe-cache-coeur-4.jpg'],
    description: 'Robe courte moulante effet velours, col cache-cœur, manches longues.',
    details: ['Robe courte moulante, col cache-cœur', 'Manches longues, aspect velours', 'Matière : à confirmer avec le fournisseur'],
    tailles: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'robe-maille', rayon: 'robes',
    nom: 'Robe longue col V effet velours', court: 'La robe velours',
    grammage: null, note: 'Épaulettes, boutons, fente',
    prix: 34.90, marche: null, ecart: null,
    couleur: 'Vert olive foncé',
    photos: ['robe-maille-1.jpg', 'robe-maille-2.jpg', 'robe-maille-3.jpg', 'robe-maille-4.jpg'],
    description: 'Robe longue effet velours, col V, épaulettes, boutonnée sur le devant, avec une fente.',
    details: ['Robe longue, col V, épaulettes', 'Boutons sur le devant, fente', 'Matière : polyester (pourcentage exact à confirmer)'],
    tailles: ['S', 'M', 'L', 'XL', 'XXL', '3XL']
  },
  {
    id: 'robe-dos-nu', rayon: 'robes', vedette: true, badge: 'Nouveau',
    nom: 'Robe longue dos nu', court: 'La robe dos nu',
    grammage: null, note: 'Décolleté V, manches longues',
    prix: 34.90, marche: null, ecart: null,
    couleur: 'Noir',
    photos: ['robe-dos-nu-1.jpg', 'robe-dos-nu-2.jpg', 'robe-dos-nu-3.jpg'],
    description: 'Robe longue moulante effet brillant, décolleté V, dos nu, drapée et fendue, manches longues.',
    details: ['Robe longue moulante, effet brillant', 'Décolleté V, dos nu, drapé, fente', 'Matière : polyester (pourcentage exact à confirmer)'],
    tailles: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: 'doudoune-courte', rayon: 'vestes', vedette: true, badge: 'Nouveau',
    nom: 'Doudoune courte', court: 'La doudoune courte',
    grammage: null, note: 'Col montant, bas resserré',
    prix: 59.90, marche: null, ecart: null,
    couleur: 'Chocolat',
    photos: ['doudoune-courte-1.jpg', 'doudoune-courte-2.jpg', 'doudoune-courte-3.jpg', 'doudoune-courte-4.jpg'],
    description: 'Doudoune courte et épaisse, col montant, bas resserré.',
    details: ['Doudoune courte, col montant, bas resserré', 'Matière : polyester, garnissage ouate synthétique (pourcentages à confirmer)'],
    tailles: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'doudoune-col', rayon: 'vestes',
    nom: 'Doudoune à col montant', court: 'La doudoune col montant',
    grammage: null, note: 'Coupe droite',
    prix: 59.90, marche: null, ecart: null,
    couleur: 'Rose pâle',
    photos: ['doudoune-col-1.jpg', 'doudoune-col-2.jpg', 'doudoune-col-3.jpg', 'doudoune-col-4.jpg'],
    description: 'Doudoune matelassée, col montant, fermeture éclair.',
    details: ['Doudoune matelassée, col montant, fermeture éclair', 'Matière : polyester, garnissage coton (pourcentages à confirmer)']
  },
  {
    id: 'sac-boucle', rayon: 'sacs',
    nom: 'Sac à boucle', court: 'Le sac à boucle',
    grammage: null, note: 'Porté épaule',
    prix: 39.90, marche: null, ecart: null,
    couleur: 'Marron foncé',
    photos: ['sac-boucle-1.jpg', 'sac-boucle-2.jpg', 'sac-boucle-3.jpg'],
    description: 'Sac porté épaule avec une ceinture à boucle, aspect cuir.',
    details: ['Porté épaule, ceinture à boucle', 'Dimensions : 30 × 15 × 10 cm, anse ≈ 29 cm', 'Matière : simili cuir (PU), doublure polyester']
  },
  {
    id: 'sac-hobo', rayon: 'sacs',
    nom: 'Sac hobo', court: 'Le sac hobo',
    grammage: null, note: 'Grand, forme arrondie',
    prix: 39.90, marche: null, ecart: null,
    couleur: 'Bordeaux',
    photos: ['sac-hobo-1.jpg', 'sac-hobo-2.jpg', 'sac-hobo-3.jpg'],
    description: 'Grand sac rond porté épaule, aspect cuir souple.',
    details: ['Grand sac porté épaule, forme arrondie', 'Dimensions : 32,5 × 30,5 × 11 cm', 'Matière : simili cuir (PU)']
  },
  {
    id: 'echarpe-grise', rayon: 'accessoires',
    nom: 'Écharpe douce à franges', court: "L'écharpe grise",
    grammage: null, note: 'Longue et large',
    prix: 19.90, marche: null, ecart: null,
    couleur: 'Gris clair',
    photos: ['echarpe-grise-1.jpg', 'echarpe-grise-2.jpg', 'echarpe-grise-3.jpg'],
    description: 'Grosse écharpe toute douce à franges.',
    details: ['Écharpe épaisse à franges', 'Dimensions : 240 × 40 cm', 'Matière : polyester (pourcentage exact à confirmer)']
  },
  {
    id: 'echarpe-leopard', rayon: 'accessoires',
    nom: 'Écharpe léopard', court: "L'écharpe léopard",
    grammage: null, note: 'Douce et chaude',
    prix: 19.90, marche: null, ecart: null,
    couleur: 'Léopard noir et beige',
    photos: ['echarpe-leopard-1.jpg', 'echarpe-leopard-2.jpg', 'echarpe-leopard-3.jpg'],
    description: 'Écharpe imprimé léopard, douce et chaude.',
    details: ['Imprimé léopard', 'Dimensions : environ 190 × 60 cm', 'Matière : polyester (pourcentage exact à confirmer)']
  },
  {
    id: 'bonnet-camouflage', rayon: 'accessoires',
    nom: 'Bonnet camouflage', court: 'Le bonnet camouflage',
    grammage: null, note: 'Taille unique',
    prix: 14.90, marche: null, ecart: null,
    couleur: 'Camouflage rose',
    photos: ['bonnet-camouflage-1.jpg', 'bonnet-camouflage-2.jpg', 'bonnet-camouflage-3.jpg'],
    description: 'Bonnet en maille, motif camouflage.',
    details: ['Bonnet en maille, motif camouflage', 'Taille unique : 55 à 61 cm de tour de tête', 'Matière : acrylique (pourcentage exact à confirmer)']
  },
  {
    id: 'bonnet-pompon', rayon: 'accessoires',
    nom: 'Bonnet grosse maille à pompon', court: 'Le bonnet à pompon',
    grammage: null, note: 'Taille unique',
    prix: 14.90, marche: null, ecart: null,
    couleur: 'Noir',
    photos: ['bonnet-pompon-1.jpg', 'bonnet-pompon-2.jpg', 'bonnet-pompon-3.jpg'],
    description: 'Bonnet en grosse maille avec pompon.',
    details: ['Bonnet grosse maille, pompon', 'Taille unique : 56 à 60 cm de tour de tête', 'Matière : acrylique (pourcentage exact à confirmer)']
  }
];

/* Les packs — un prix, un colis. Le détail (taille, couleur) est confirmé avec la cliente.
   🔴 « Le plus choisi » seulement quand c'est VRAI. Avant les ventes : « Recommandé ». */
window.LOTS = [];   // packs retirés le 21/11 : on vend au prix affiché

window.RAYONS = [
  { id: 'ensembles',   nom: 'Ensembles',          texte: "Le haut et le bas assortis. La tenue complète, sans réfléchir le matin." },
  { id: 'pulls',       nom: 'Pulls & gilets',     texte: "Hoodies, pulls et gilets, en coupe ample ou ajustée." },
  { id: 'robes',       nom: 'Robes',              texte: "Courtes ou longues, pour la journée comme pour sortir." },
  { id: 'vestes',      nom: 'Doudounes',          texte: "Courtes et chaudes, pour tout l'hiver." },
  { id: 'sacs',        nom: 'Sacs',               texte: "Des grands sacs qui portent tout, portés épaule." },
  { id: 'accessoires', nom: 'Écharpes & bonnets', texte: "Pour finir la tenue et avoir chaud tout l'hiver." }
];

/* Les avis — VIDE tant qu'il n'y a pas de vrais clients.
   Section masquée automatiquement si la liste est vide.
   🔴 Jamais un faux avis. Ils arrivent par le message WhatsApp à J+10. */
window.AVIS = [];

window.FAQ = [
  { q: 'Vos vêtements taillent comment ?',
    r: "Coupe normale à légèrement ample. Entre deux tailles, prends la plus grande pour un rendu oversize. Un doute ? Écris-nous sur WhatsApp, on te guide." },
  { q: 'Quels sont les délais de livraison ?',
    r: "Les colis partent de l'entrepôt de notre fournisseur, en Chine. Ta commande est expédiée sous 2 à 5 jours, puis compte 4 à 10 jours ouvrés de transport. Le délai t'est confirmé avant que tu paies." },
  { q: 'Et si la taille ne me va pas ?',
    r: "Tu peux changer d'avis : toutes les conditions sont dans nos conditions générales de vente. Un défaut ? On rembourse ou on remplace, sans frais pour toi." },
  { q: 'Le paiement est-il sécurisé ?',
    r: "Paiement par carte uniquement, jamais à la livraison. Tes données bancaires ne passent jamais par nous." },
  { q: 'Où sont fabriquées vos pièces ?',
    r: "On ne fabrique pas nous-mêmes, et on le dit : nos pièces viennent d'un fournisseur partenaire, qui les stocke et les expédie depuis la Chine. C'est ce qui nous permet de garder des prix justes. Et ton contrat est avec nous, avec nous seuls." },
  { q: 'Une question, un souci ?',
    r: "Écris-nous sur WhatsApp ou par e-mail, avant comme après ta commande. Une vraie personne te répond." }
];
