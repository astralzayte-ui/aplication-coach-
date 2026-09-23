/* =========================================================
   produits.js — Le catalogue (données fictives)
   ---------------------------------------------------------
   Dans un vrai site, ces données viendraient d'une API ou
   d'une base de données. Ici, c'est un simple tableau
   d'objets JavaScript : chaque objet = une montre.

   Les "couleurs" servent à dessiner chaque montre en SVG
   (voir montre-svg.js) : pas besoin de photos.
   ========================================================= */

// Libellés lisibles pour les valeurs techniques des filtres.
const LIBELLES = {
  genre: { homme: 'Homme', femme: 'Femme', mixte: 'Mixte' },
  mouvement: { automatique: 'Automatique', quartz: 'Quartz', manuel: 'Remontage manuel' },
  collection: { heritage: 'Héritage', sport: 'Sport', elegance: 'Élégance' }
};

const PRODUITS = [
  {
    id: 'atlas-automatique', ref: 'AUR-001', nom: 'Atlas Automatique',
    collection: 'heritage', genre: 'homme', mouvement: 'automatique',
    prix: 4890, ancienPrix: null, nouveaute: true, stock: 8,
    diametre: 40, boitier: 'Acier plaqué or 18 carats', bracelet: 'Cuir de veau cognac', etancheite: 50,
    description: "Inspirée des sommets de l'Atlas, cette automatique au cadran noir profond affiche l'heure avec des index dorés appliqués à la main. Une montre de caractère, pensée pour durer toute une vie.",
    couleurs: { boitier: '#c9a45c', cadran: '#111114', bracelet: '#7a4a26', aiguilles: '#e6c98a', trotteuse: '#e6c98a' },
    forme: 'ronde', chrono: false, braceletType: 'cuir'
  },
  {
    id: 'koutoubia-chrono', ref: 'AUR-002', nom: 'Koutoubia Chrono',
    collection: 'sport', genre: 'homme', mouvement: 'quartz',
    prix: 3290, ancienPrix: null, nouveaute: false, stock: 12,
    diametre: 42, boitier: 'Acier inoxydable 316L', bracelet: 'Acier maillons pleins', etancheite: 100,
    description: "Un chronographe au cadran bleu nuit et aux compteurs contrastés. Robuste, précis et lisible : le compagnon idéal des journées bien remplies.",
    couleurs: { boitier: '#bfc3c9', cadran: '#14213d', bracelet: '#a9adb3', aiguilles: '#f3efe6', trotteuse: '#c9a45c' },
    forme: 'ronde', chrono: true, braceletType: 'metal'
  },
  {
    id: 'majorelle', ref: 'AUR-003', nom: 'Majorelle',
    collection: 'elegance', genre: 'femme', mouvement: 'quartz',
    prix: 2490, ancienPrix: null, nouveaute: true, stock: 10,
    diametre: 32, boitier: 'Acier plaqué or rose', bracelet: 'Cuir bleu Majorelle', etancheite: 30,
    description: "Un hommage au célèbre jardin de Marrakech : bracelet bleu Majorelle, cadran nacré et boîtier or rose. Fine et lumineuse, elle se porte au quotidien comme en soirée.",
    couleurs: { boitier: '#d8a48f', cadran: '#f4efe8', bracelet: '#2e4fa3', aiguilles: '#3a2a20', trotteuse: '#b8735c' },
    forme: 'ronde', chrono: false, braceletType: 'cuir'
  },
  {
    id: 'menara-classique', ref: 'AUR-004', nom: 'Menara Classique',
    collection: 'heritage', genre: 'mixte', mouvement: 'manuel',
    prix: 5990, ancienPrix: null, nouveaute: false, stock: 4,
    diametre: 38, boitier: 'Acier plaqué or jaune', bracelet: 'Cuir noir alligator (imitation)', etancheite: 30,
    description: "Mouvement à remontage manuel, cadran crème et chiffres fins : la Menara reprend les codes des montres de nos grands-parents, avec une finition d'aujourd'hui.",
    couleurs: { boitier: '#d4af37', cadran: '#efe6d2', bracelet: '#141414', aiguilles: '#2b2118', trotteuse: '#8b1e1e' },
    forme: 'ronde', chrono: false, braceletType: 'cuir'
  },
  {
    id: 'sahara-field', ref: 'AUR-005', nom: 'Sahara Field',
    collection: 'sport', genre: 'homme', mouvement: 'automatique',
    prix: 3690, ancienPrix: null, nouveaute: false, stock: 9,
    diametre: 39, boitier: 'Bronze patiné', bracelet: 'Toile kaki', etancheite: 100,
    description: "Une montre de terrain au cadran couleur sable, avec un boîtier en bronze qui se patine avec le temps. Chaque exemplaire devient unique.",
    couleurs: { boitier: '#a8743f', cadran: '#d9c49b', bracelet: '#5b5a3a', aiguilles: '#2b2118', trotteuse: '#a8743f' },
    forme: 'ronde', chrono: false, braceletType: 'toile'
  },
  {
    id: 'palmeraie-carree', ref: 'AUR-006', nom: 'Palmeraie Carrée',
    collection: 'elegance', genre: 'femme', mouvement: 'quartz',
    prix: 2890, ancienPrix: null, nouveaute: false, stock: 7,
    diametre: 28, boitier: 'Acier plaqué or', bracelet: 'Cuir vert palmeraie', etancheite: 30,
    description: "Un boîtier carré aux angles adoucis et un cadran vert profond, comme l'ombre des palmiers. Une pièce graphique et intemporelle.",
    couleurs: { boitier: '#c9a45c', cadran: '#1f3d2b', bracelet: '#23402f', aiguilles: '#e6c98a', trotteuse: '#e6c98a' },
    forme: 'carree', chrono: false, braceletType: 'cuir'
  },
  {
    id: 'nuit-agafay', ref: 'AUR-007', nom: "Nuit d'Agafay",
    collection: 'sport', genre: 'homme', mouvement: 'automatique',
    prix: 7490, ancienPrix: null, nouveaute: true, stock: 3,
    diametre: 43, boitier: 'Acier traité PVD noir', bracelet: 'Caoutchouc noir', etancheite: 200,
    description: "Tout en noir, rehaussée de touches dorées, la Nuit d'Agafay évoque le ciel étoilé du désert. Chronographe automatique en série limitée.",
    couleurs: { boitier: '#2a2a2e', cadran: '#0a0a0b', bracelet: '#1a1a1c', aiguilles: '#c9a45c', trotteuse: '#c9a45c' },
    forme: 'ronde', chrono: true, braceletType: 'caoutchouc'
  },
  {
    id: 'medina-slim', ref: 'AUR-008', nom: 'Médina Slim',
    collection: 'elegance', genre: 'mixte', mouvement: 'quartz',
    prix: 1990, ancienPrix: 2390, nouveaute: false, stock: 15,
    diametre: 36, boitier: 'Acier inoxydable ultra-fin (6 mm)', bracelet: 'Maille milanaise acier', etancheite: 30,
    description: "Six millimètres d'épaisseur seulement : la Médina Slim se glisse sous toutes les manches. Minimaliste, elle va à tous les poignets.",
    couleurs: { boitier: '#c7cbd1', cadran: '#151517', bracelet: '#b5b9bf', aiguilles: '#f3efe6', trotteuse: '#c9a45c' },
    forme: 'ronde', chrono: false, braceletType: 'metal'
  },
  {
    id: 'ourika-diver', ref: 'AUR-009', nom: 'Ourika Diver',
    collection: 'sport', genre: 'homme', mouvement: 'automatique',
    prix: 4290, ancienPrix: null, nouveaute: false, stock: 6,
    diametre: 41, boitier: 'Acier inoxydable 316L', bracelet: 'Acier maillons pleins', etancheite: 300,
    description: "Une plongeuse au cadran vert émeraude, étanche à 300 mètres. Aussi à l'aise dans les vallées de l'Ourika qu'au bord de l'océan.",
    couleurs: { boitier: '#bfc3c9', cadran: '#0f4d3a', bracelet: '#a9adb3', aiguilles: '#f3efe6', trotteuse: '#e0b44c' },
    forme: 'ronde', chrono: false, braceletType: 'metal'
  },
  {
    id: 'essaouira-bleue', ref: 'AUR-010', nom: 'Essaouira Bleue',
    collection: 'elegance', genre: 'femme', mouvement: 'automatique',
    prix: 4590, ancienPrix: null, nouveaute: false, stock: 5,
    diametre: 34, boitier: 'Acier inoxydable poli', bracelet: 'Cuir blanc', etancheite: 50,
    description: "Le bleu des portes d'Essaouira sur un cadran soleillé. Une automatique légère et fraîche, pour les poignets fins.",
    couleurs: { boitier: '#d2d5da', cadran: '#4a86c5', bracelet: '#ece7df', aiguilles: '#f3efe6', trotteuse: '#f3efe6' },
    forme: 'ronde', chrono: false, braceletType: 'cuir'
  },
  {
    id: 'bahia-royale', ref: 'AUR-011', nom: 'Bahia Royale',
    collection: 'heritage', genre: 'femme', mouvement: 'manuel',
    prix: 8900, ancienPrix: null, nouveaute: true, stock: 2,
    diametre: 33, boitier: 'Acier plaqué or 18 carats', bracelet: 'Cuir bordeaux', etancheite: 30,
    description: "Notre pièce la plus précieuse. Cadran champagne, boîtier doré et bracelet bordeaux : une montre qui se transmet, inspirée des salons du palais de la Bahia.",
    couleurs: { boitier: '#d4af37', cadran: '#d9bf82', bracelet: '#5a1622', aiguilles: '#2b2118', trotteuse: '#5a1622' },
    forme: 'carree', chrono: false, braceletType: 'cuir'
  },
  {
    id: 'tensift-chrono', ref: 'AUR-012', nom: 'Tensift Chrono',
    collection: 'sport', genre: 'homme', mouvement: 'quartz',
    prix: 2790, ancienPrix: 3190, nouveaute: false, stock: 11,
    diametre: 40, boitier: 'Acier inoxydable brossé', bracelet: 'Cuir noir perforé', etancheite: 100,
    description: "Le fameux cadran « panda » : fond blanc et compteurs noirs. Un chronographe au style course automobile, à prix doux.",
    couleurs: { boitier: '#c7cbd1', cadran: '#f1f1ee', bracelet: '#161616', aiguilles: '#111114', trotteuse: '#c0392b' },
    forme: 'ronde', chrono: true, braceletType: 'cuir'
  }
];

// Retrouve une montre à partir de son identifiant (ou undefined si introuvable).
function trouverProduit(id) {
  return PRODUITS.find(function (produit) { return produit.id === id; });
}
