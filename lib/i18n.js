// Langues supportées. Le français est la langue principale.
export const LOCALES = ["fr", "en", "ar"];
export const DEFAULT_LOCALE = "fr";

// L'arabe s'affiche de droite à gauche.
export const DIR = { fr: "ltr", en: "ltr", ar: "rtl" };

// Libellé du bouton de langue dans l'en-tête.
export const LANG_LABEL = { fr: "FR", en: "EN", ar: "ع" };

// Dictionnaire de l'interface (textes du site, hors produits).
export const UI = {
  fr: {
    nav_watches: "Montres",
    nav_jewelry: "Bijoux",
    nav_new: "Nouveautés",
    cart: "Panier",
    hero_eyebrow: "Montres & Bijoux pour Homme",
    hero_lead:
      "L'élégance masculine, façonnée dans le détail. Des pièces d'exception, choisies pour ceux qui savent.",
    cta_discover: "Découvrir la collection",
    cta_configure: "Configurer une pièce",
    uni_eyebrow: "Deux univers",
    uni_title: "Choisissez votre monde",
    uni_explore: "Explorer",
    featured_eyebrow: "La pièce signature",
    finish: "Finition",
    size: "Taille",
    add_to_cart: "Ajouter au panier",
    added: "Ajouté au panier",
    choose_size: "Choisissez une taille",
    a1_t: "Livraison mondiale",
    a1_d: "Dropshipping — expédié depuis nos partenaires.",
    a2_t: "Paiement sécurisé",
    a2_d: "Carte bancaire via YouCan Pay.",
    a3_t: "Qualité garantie",
    a3_d: "Pièces sélectionnées avec soin.",
    collection: "Collection",
    empty_category: "Nouveaux produits bientôt disponibles.",
    // Panier
    your_cart: "Votre panier",
    cart_empty: "Votre panier est vide.",
    continue_shopping: "Continuer mes achats",
    remove: "Retirer",
    subtotal: "Sous-total",
    total: "Total",
    checkout: "Passer commande",
    qty: "Qté",
    // Commande
    order_title: "Finaliser la commande",
    contact: "Coordonnées",
    full_name: "Nom complet",
    email: "Email",
    phone: "Téléphone",
    address: "Adresse",
    city: "Ville",
    country: "Pays",
    zip: "Code postal",
    pay_now: "Payer maintenant",
    order_summary: "Récapitulatif",
    // États paiement
    pay_pending_title: "Commande enregistrée",
    pay_pending_msg:
      "Merci ! Le paiement en ligne sera bientôt activé. Nous vous contacterons pour finaliser la commande.",
    pay_error: "Une erreur est survenue. Réessayez ou contactez-nous.",
    back_home: "Retour à l'accueil",
    footer_tagline: "Montres & Bijoux pour Homme",
  },
  en: {
    nav_watches: "Watches",
    nav_jewelry: "Jewelry",
    nav_new: "New in",
    cart: "Cart",
    hero_eyebrow: "Men's Watches & Jewelry",
    hero_lead:
      "Masculine elegance, shaped in the details. Exceptional pieces, chosen for those who know.",
    cta_discover: "Discover the collection",
    cta_configure: "Configure a piece",
    uni_eyebrow: "Two worlds",
    uni_title: "Choose your world",
    uni_explore: "Explore",
    featured_eyebrow: "The signature piece",
    finish: "Finish",
    size: "Size",
    add_to_cart: "Add to cart",
    added: "Added to cart",
    choose_size: "Choose a size",
    a1_t: "Worldwide shipping",
    a1_d: "Dropshipping — shipped from our partners.",
    a2_t: "Secure payment",
    a2_d: "Card payment via YouCan Pay.",
    a3_t: "Guaranteed quality",
    a3_d: "Pieces selected with care.",
    collection: "Collection",
    empty_category: "New products coming soon.",
    your_cart: "Your cart",
    cart_empty: "Your cart is empty.",
    continue_shopping: "Continue shopping",
    remove: "Remove",
    subtotal: "Subtotal",
    total: "Total",
    checkout: "Checkout",
    qty: "Qty",
    order_title: "Complete your order",
    contact: "Contact details",
    full_name: "Full name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    city: "City",
    country: "Country",
    zip: "Postal code",
    pay_now: "Pay now",
    order_summary: "Summary",
    pay_pending_title: "Order received",
    pay_pending_msg:
      "Thank you! Online payment will be enabled soon. We will contact you to complete the order.",
    pay_error: "Something went wrong. Please try again or contact us.",
    back_home: "Back to home",
    footer_tagline: "Men's Watches & Jewelry",
  },
  ar: {
    nav_watches: "ساعات",
    nav_jewelry: "مجوهرات",
    nav_new: "الجديد",
    cart: "السلة",
    hero_eyebrow: "ساعات ومجوهرات رجالية",
    hero_lead:
      "أناقة رجولية في أدق التفاصيل. قطع استثنائية لمن يعرفون قيمتها.",
    cta_discover: "اكتشف المجموعة",
    cta_configure: "صمّم قطعتك",
    uni_eyebrow: "عالمان",
    uni_title: "اختر عالمك",
    uni_explore: "استكشف",
    featured_eyebrow: "القطعة المميزة",
    finish: "اللون",
    size: "المقاس",
    add_to_cart: "أضف إلى السلة",
    added: "أُضيف إلى السلة",
    choose_size: "اختر المقاس",
    a1_t: "شحن عالمي",
    a1_d: "دروبشيبينغ — يُشحن من شركائنا.",
    a2_t: "دفع آمن",
    a2_d: "بطاقة بنكية عبر YouCan Pay.",
    a3_t: "جودة مضمونة",
    a3_d: "قطع مختارة بعناية.",
    collection: "المجموعة",
    empty_category: "منتجات جديدة قريباً.",
    your_cart: "سلتك",
    cart_empty: "سلتك فارغة.",
    continue_shopping: "متابعة التسوق",
    remove: "إزالة",
    subtotal: "المجموع الفرعي",
    total: "الإجمالي",
    checkout: "إتمام الطلب",
    qty: "الكمية",
    order_title: "إتمام الطلب",
    contact: "بيانات التواصل",
    full_name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    address: "العنوان",
    city: "المدينة",
    country: "البلد",
    zip: "الرمز البريدي",
    pay_now: "ادفع الآن",
    order_summary: "الملخص",
    pay_pending_title: "تم استلام الطلب",
    pay_pending_msg:
      "شكراً لك! سيتم تفعيل الدفع عبر الإنترنت قريباً. سنتواصل معك لإتمام الطلب.",
    pay_error: "حدث خطأ ما. يرجى المحاولة مرة أخرى أو التواصل معنا.",
    back_home: "العودة إلى الرئيسية",
    footer_tagline: "ساعات ومجوهرات رجالية",
  },
};

// Récupère un texte traduit, avec repli sur le français.
export function tr(locale, key) {
  const dict = UI[locale] || UI[DEFAULT_LOCALE];
  return dict[key] ?? UI[DEFAULT_LOCALE][key] ?? key;
}

// Récupère un champ multilingue d'un produit ({fr, en, ar}), avec repli.
export function field(obj, locale) {
  if (obj == null) return "";
  if (typeof obj === "string") return obj;
  return obj[locale] ?? obj[DEFAULT_LOCALE] ?? "";
}

// Formate un prix selon la langue et la devise.
export function formatPrice(amount, currency = "EUR", locale = "fr") {
  const loc = locale === "ar" ? "ar-MA" : locale === "en" ? "en-US" : "fr-FR";
  try {
    return new Intl.NumberFormat(loc, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}
