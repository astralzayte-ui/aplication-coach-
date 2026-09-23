/* =========================================================
   produits.js — Le catalogue (données fictives)
   ---------------------------------------------------------
   Dans un vrai site, ces données viendraient d'une API ou
   d'une base de données. Ici, c'est un simple tableau
   d'objets JavaScript : chaque objet = une montre.

   - "photo" : chemin de la photo (format WebP, plus léger que JPG).
   - "cadrage" : quelle partie de la photo garder quand on la
     recadre (propriété CSS object-position, ex. "50% 60%").
   - "couleurs", "forme", "chrono", "braceletType" : servent à
     dessiner la montre en SVG si la photo est absente
     (voir montre-svg.js). Le site ne casse donc jamais.
   ========================================================= */

// Libellés lisibles pour les valeurs techniques des filtres.
const LIBELLES = {
  genre: { homme: 'Homme', femme: 'Femme', mixte: 'Mixte' },
  mouvement: { automatique: 'Automatique', quartz: 'Quartz', manuel: 'Remontage manuel' },
  collection: { heritage: 'Héritage', sport: 'Sport', elegance: 'Élégance' },
  bracelet: { cuir: 'Cuir', acier: 'Acier' }
};

const PRODUITS = [
  {
    id: 'atlas-automatique', ref: 'AUR-001', nom: 'Atlas Automatique',
    collection: 'heritage', genre: 'homme', mouvement: 'automatique', matiereBracelet: 'cuir',
    prix: 4890, ancienPrix: null, nouveaute: true, stock: 8,
    diametre: 40, boitier: 'Acier plaqué or rose', bracelet: 'Cuir de veau brun', etancheite: 50,
    description: "Inspirée des sommets de l'Atlas, cette automatique marie un boîtier or rose à un cadran bleu nuit d'une grande profondeur. Une montre de caractère, qui accompagne aussi bien un costume qu'une chemise ouverte.",
    photo: 'images/produits/atlas-automatique.webp', cadrage: '50% 62%',
    couleurs: { boitier: '#d8a48f', cadran: '#14213d', bracelet: '#6b3f22', aiguilles: '#e6c98a', trotteuse: '#e6c98a' },
    forme: 'ronde', chrono: false, braceletType: 'cuir'
  },
  {
    id: 'tichka-pilote', ref: 'AUR-002', nom: 'Tichka Pilote',
    collection: 'sport', genre: 'homme', mouvement: 'automatique', matiereBracelet: 'acier',
    prix: 3690, ancienPrix: null, nouveaute: false, stock: 9,
    diametre: 42, boitier: 'Acier inoxydable 316L', bracelet: 'Acier maillons pleins', etancheite: 100,
    description: "Nommée d'après le col du Tichka, la route la plus mythique du Maroc. Grands chiffres lisibles, cadran bleu et bracelet acier : une montre de pilote faite pour les longs trajets.",
    photo: 'images/produits/tichka-pilote.webp', cadrage: '50% 50%',
    couleurs: { boitier: '#bfc3c9', cadran: '#1d3557', bracelet: '#a9adb3', aiguilles: '#f3efe6', trotteuse: '#f3efe6' },
    forme: 'ronde', chrono: false, braceletType: 'metal'
  },
  {
    id: 'koutoubia-chrono', ref: 'AUR-003', nom: 'Koutoubia Chrono',
    collection: 'sport', genre: 'homme', mouvement: 'quartz', matiereBracelet: 'acier',
    prix: 3290, ancienPrix: null, nouveaute: false, stock: 12,
    diametre: 44, boitier: 'Acier inoxydable poli', bracelet: 'Acier maillons pleins', etancheite: 100,
    description: "Un chronographe imposant au cadran noir, avec trois compteurs et une lunette tachymétrique. Robuste et précis, il s'impose au poignet comme la Koutoubia sur Marrakech.",
    photo: 'images/produits/koutoubia-chrono.webp', cadrage: '50% 40%',
    couleurs: { boitier: '#c7cbd1', cadran: '#111114', bracelet: '#a9adb3', aiguilles: '#f3efe6', trotteuse: '#e5484d' },
    forme: 'ronde', chrono: true, braceletType: 'metal'
  },
  {
    id: 'medina-classique', ref: 'AUR-004', nom: 'Médina Classique',
    collection: 'elegance', genre: 'mixte', mouvement: 'automatique', matiereBracelet: 'acier',
    prix: 2890, ancienPrix: 3390, nouveaute: false, stock: 15,
    diametre: 39, boitier: 'Acier inoxydable brossé', bracelet: 'Acier maillons pleins', etancheite: 50,
    description: "La montre de tous les jours : un cadran noir sobre, un boîtier de taille parfaite et un bracelet acier confortable. Du café du matin au dîner, elle ne vous quitte plus.",
    photo: 'images/produits/medina-classique.webp', cadrage: '70% 45%',
    couleurs: { boitier: '#c7cbd1', cadran: '#151517', bracelet: '#b5b9bf', aiguilles: '#f3efe6', trotteuse: '#c9a45c' },
    forme: 'ronde', chrono: false, braceletType: 'metal'
  },
  {
    id: 'tensift-chrono', ref: 'AUR-005', nom: 'Tensift Chrono',
    collection: 'heritage', genre: 'homme', mouvement: 'quartz', matiereBracelet: 'cuir',
    prix: 2790, ancienPrix: 3190, nouveaute: false, stock: 11,
    diametre: 40, boitier: 'Acier inoxydable poli', bracelet: 'Cuir brun surpiqué', etancheite: 100,
    description: "Le fameux cadran « panda » : fond blanc et compteurs noirs, inspiré des chronographes de course des années 60. Sur son bracelet en cuir brun, c'est un classique instantané.",
    photo: 'images/produits/tensift-chrono.webp', cadrage: '50% 58%',
    couleurs: { boitier: '#c7cbd1', cadran: '#f1f1ee', bracelet: '#5a3520', aiguilles: '#111114', trotteuse: '#c0392b' },
    forme: 'ronde', chrono: true, braceletType: 'cuir'
  },
  {
    id: 'bahia-chrono', ref: 'AUR-006', nom: 'Bahia Chrono',
    collection: 'elegance', genre: 'homme', mouvement: 'automatique', matiereBracelet: 'acier',
    prix: 5990, ancienPrix: null, nouveaute: false, stock: 4,
    diametre: 42, boitier: 'Acier inoxydable poli-brossé', bracelet: 'Acier maillons pleins', etancheite: 100,
    description: "Un chronographe automatique au cadran noir, fin et raffiné, pensé pour se glisser sous une manchette. L'élégance des salons du palais de la Bahia, avec la précision d'un mouvement mécanique.",
    photo: 'images/produits/bahia-chrono.webp', cadrage: '50% 55%',
    couleurs: { boitier: '#c7cbd1', cadran: '#0f0f11', bracelet: '#a9adb3', aiguilles: '#f3efe6', trotteuse: '#f3efe6' },
    forme: 'ronde', chrono: true, braceletType: 'metal'
  },
  {
    id: 'nuit-agafay', ref: 'AUR-007', nom: "Nuit d'Agafay",
    collection: 'heritage', genre: 'homme', mouvement: 'automatique', matiereBracelet: 'acier',
    prix: 7490, ancienPrix: null, nouveaute: true, stock: 3,
    diametre: 43, boitier: 'Acier et or rose', bracelet: 'Acier bicolore acier / or rose', etancheite: 100,
    description: "Notre pièce d'exception. Un bracelet bicolore acier et or rose, un cadran noir profond comme le ciel du désert d'Agafay, et un chronographe automatique en série limitée.",
    photo: 'images/produits/nuit-agafay.webp', cadrage: '50% 58%',
    couleurs: { boitier: '#d8a48f', cadran: '#0a0a0b', bracelet: '#c7cbd1', aiguilles: '#e6c98a', trotteuse: '#d8a48f' },
    forme: 'ronde', chrono: true, braceletType: 'metal'
  },
  {
    id: 'agdal-automatique', ref: 'AUR-008', nom: 'Agdal Automatique',
    collection: 'elegance', genre: 'mixte', mouvement: 'automatique', matiereBracelet: 'acier',
    prix: 4290, ancienPrix: null, nouveaute: true, stock: 6,
    diametre: 40, boitier: 'Acier inoxydable 316L', bracelet: 'Acier maillons pleins', etancheite: 100,
    description: "Discrète et sûre d'elle, l'Agdal associe un cadran noir soleillé à un bracelet acier parfaitement ajusté. La montre des rendez-vous importants.",
    photo: 'images/produits/agdal-automatique.webp', cadrage: '70% 50%',
    couleurs: { boitier: '#bfc3c9', cadran: '#131315', bracelet: '#a9adb3', aiguilles: '#f3efe6', trotteuse: '#c9a45c' },
    forme: 'ronde', chrono: false, braceletType: 'metal'
  }
];

// Retrouve une montre à partir de son identifiant (ou undefined si introuvable).
function trouverProduit(id) {
  return PRODUITS.find(function (produit) { return produit.id === id; });
}
