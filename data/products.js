// =====================================================================
//  CATALOGUE ONYX
//  C'est le SEUL fichier à modifier pour ajouter/retirer un produit.
//
//  Pour AJOUTER un produit :
//   1. Mets ses photos dans  public/products/<slug>/  (une par couleur)
//      ex : public/products/ma-montre/bleu.jpg , noir.jpg , blanc.jpg
//   2. Copie un bloc ci-dessous, change les valeurs, et c'est en ligne.
//
//  Champs :
//   - slug      : identifiant unique dans l'URL (sans espace ni accent)
//   - category  : "montres" ou "bijoux"
//   - name      : nom du produit dans les 3 langues
//   - price     : prix (nombre) ; currency : "MAD" (DH), "EUR", "USD"...
//   - featured  : true = mis en avant sur l'accueil ("Pièce du moment")
//   - rating / reviews : note et nombre d'avis (facultatif)
//   - colors    : liste des finitions. Chaque couleur a SA photo.
//       - id / label / swatch (pastille) / image (chemin de la photo)
//   - sizes     : liste des tailles (laisse [] s'il n'y a pas de taille)
// =====================================================================

export const PRODUCTS = [
  {
    slug: "montre-onyx-eclipse",
    category: "montres",
    name: {
      fr: "Montre ONYX Éclipse",
      en: "ONYX Eclipse Watch",
      ar: "ساعة ONYX إكليبس",
    },
    description: {
      fr: "La signature ONYX. Boîtier octogonal noir et cadran nacré noir & blanc à chiffres arabes. Mouvement à quartz, bracelet en acier noir. L'élégance dans le contraste.",
      en: "The ONYX signature. Black octagonal case with a black-and-white mother-of-pearl dial and Eastern-Arabic numerals. Quartz movement, black steel bracelet. Elegance in contrast.",
      ar: "توقيع ONYX. علبة مثمّنة سوداء ومينا صدفي أبيض وأسود بأرقام عربية. حركة كوارتز وسوار فولاذي أسود. الأناقة في التباين.",
    },
    price: 399,
    currency: "MAD",
    featured: true,
    rating: 5.0,
    reviews: 41,
    colors: [
      { id: "noir", label: { fr: "Noir", en: "Black", ar: "أسود" }, swatch: "#141416", image: "/products/montre-onyx-eclipse/noir.svg" },
    ],
    sizes: [],
  },
  {
    slug: "montre-onyx-arabesque",
    category: "montres",
    name: {
      fr: "Montre ONYX Arabesque",
      en: "ONYX Arabesque Watch",
      ar: "ساعة ONYX أرابيسك",
    },
    description: {
      fr: "Montre homme au boîtier octogonal et cadran à chiffres arabes, posé sur un motif marbré unique. Mouvement à quartz, bracelet assorti à la finition. Une pièce affirmée, portée avec caractère.",
      en: "Men's watch with an octagonal case and an Eastern-Arabic numeral dial over a unique marbled pattern. Quartz movement, bracelet matched to the finish. A bold piece, worn with character.",
      ar: "ساعة رجالية بعلبة مثمّنة ومينا بأرقام عربية على نقشٍ رخامي مميّز. حركة كوارتز وسوار متناسق مع اللون. قطعة جريئة تُلبس بشخصية.",
    },
    price: 399,
    currency: "MAD",
    featured: false,
    rating: 4.9,
    reviews: 58,
    colors: [
      { id: "bleu", label: { fr: "Bleu", en: "Blue", ar: "أزرق" }, swatch: "#2E4A8B", image: "/products/montre-onyx-arabesque/bleu.svg" },
      { id: "noir", label: { fr: "Noir", en: "Black", ar: "أسود" }, swatch: "#1A1A1D", image: "/products/montre-onyx-arabesque/noir.svg" },
      { id: "turquoise", label: { fr: "Turquoise", en: "Turquoise", ar: "فيروزي" }, swatch: "#45C7B8", image: "/products/montre-onyx-arabesque/turquoise.svg" },
      { id: "blanc", label: { fr: "Blanc", en: "White", ar: "أبيض" }, swatch: "#EDEDEA", image: "/products/montre-onyx-arabesque/blanc.svg" },
      { id: "rose", label: { fr: "Rose", en: "Pink", ar: "وردي" }, swatch: "#F0348B", image: "/products/montre-onyx-arabesque/rose.svg" },
    ],
    sizes: [],
  },
];

export const CATEGORIES = ["montres", "bijoux"];

export function getProduct(slug) {
  return PRODUCTS.find((p) => p.slug === slug) || null;
}

export function getByCategory(category) {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getFeatured() {
  return PRODUCTS.find((p) => p.featured) || PRODUCTS[0] || null;
}
