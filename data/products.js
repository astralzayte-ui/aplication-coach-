// =====================================================================
//  CATALOGUE ONYX
//  C'est le SEUL fichier à modifier pour ajouter/retirer un produit.
//
//  Pour AJOUTER un produit :
//   1. Mets ses photos dans  public/products/<slug>/  (une par couleur)
//      ex : public/products/ma-montre/or.jpg , argent.jpg , noir.jpg
//   2. Copie un bloc ci-dessous, change les valeurs, et c'est en ligne.
//
//  Champs :
//   - slug      : identifiant unique dans l'URL (sans espace ni accent)
//   - category  : "montres" ou "bijoux"
//   - name      : nom du produit dans les 3 langues
//   - price     : prix (nombre)
//   - currency  : "EUR" (ou "MAD", "USD"...)
//   - featured  : true = mis en avant sur la page d'accueil
//   - colors    : liste des finitions. Chaque couleur a SA photo.
//       - id     : identifiant court (sans espace)
//       - label  : nom de la couleur dans les 3 langues
//       - swatch : couleur de la pastille (code hex) — juste pour le rond cliquable
//       - image  : chemin de la photo pour CETTE couleur
//   - sizes     : liste des tailles (laisse [] s'il n'y a pas de taille)
// =====================================================================

export const PRODUCTS = [
  {
    slug: "bague-onyx",
    category: "bijoux",
    name: { fr: "Bague ONYX", en: "ONYX Ring", ar: "خاتم ONYX" },
    description: {
      fr: "Bague homme au design épuré, portée par une pierre taillée. Acier inoxydable, finition premium.",
      en: "Men's ring with a clean design, set with a cut stone. Stainless steel, premium finish.",
      ar: "خاتم رجالي بتصميم أنيق مرصّع بحجر مصقول. فولاذ مقاوم للصدأ بلمسة فاخرة.",
    },
    price: 89,
    currency: "EUR",
    featured: true,
    rating: 4.8,
    reviews: 127,
    colors: [
      { id: "or", label: { fr: "Or", en: "Gold", ar: "ذهبي" }, swatch: "#C6A15B", image: "/products/bague-onyx/or.svg" },
      { id: "or-rose", label: { fr: "Or rose", en: "Rose gold", ar: "ذهبي وردي" }, swatch: "#C98E77", image: "/products/bague-onyx/or-rose.svg" },
      { id: "argent", label: { fr: "Argent", en: "Silver", ar: "فضي" }, swatch: "#B9BEC6", image: "/products/bague-onyx/argent.svg" },
      { id: "noir", label: { fr: "Noir", en: "Black", ar: "أسود" }, swatch: "#26262A", image: "/products/bague-onyx/noir.svg" },
    ],
    sizes: ["56", "58", "60", "62"],
  },
  {
    slug: "montre-onyx-classic",
    category: "montres",
    name: { fr: "Montre ONYX Classic", en: "ONYX Classic Watch", ar: "ساعة ONYX كلاسيك" },
    description: {
      fr: "Montre habillée aux lignes intemporelles. Mouvement à quartz, bracelet assorti à la finition.",
      en: "A dress watch with timeless lines. Quartz movement, strap matched to the finish.",
      ar: "ساعة أنيقة بخطوط خالدة. حركة كوارتز وسوار متناسق مع اللون.",
    },
    price: 129,
    currency: "EUR",
    featured: false,
    rating: 4.9,
    reviews: 83,
    colors: [
      { id: "or", label: { fr: "Or", en: "Gold", ar: "ذهبي" }, swatch: "#C6A15B", image: "/products/montre-onyx-classic/or.svg" },
      { id: "argent", label: { fr: "Argent", en: "Silver", ar: "فضي" }, swatch: "#B9BEC6", image: "/products/montre-onyx-classic/argent.svg" },
      { id: "noir", label: { fr: "Noir", en: "Black", ar: "أسود" }, swatch: "#26262A", image: "/products/montre-onyx-classic/noir.svg" },
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
