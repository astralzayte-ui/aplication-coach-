import { SHOP } from "./shop";

// ---------------- Avis clients (page d'accueil) ----------------
export const TESTIMONIALS = [
  {
    name: "Karim B.",
    rating: 5,
    text: {
      fr: "Bague reçue en 10 jours, encore plus belle que sur les photos. La finition noire est superbe.",
      en: "Ring arrived in 10 days, even nicer than the photos. The black finish is stunning.",
      ar: "وصل الخاتم خلال 10 أيام، أجمل مما في الصور. اللون الأسود رائع.",
    },
  },
  {
    name: "Yanis M.",
    rating: 5,
    text: {
      fr: "Ma montre a beaucoup de classe pour le prix. Service client au top, ils répondent vite.",
      en: "My watch looks very classy for the price. Great customer service, quick replies.",
      ar: "ساعتي أنيقة جداً مقابل السعر. خدمة عملاء ممتازة وردود سريعة.",
    },
  },
  {
    name: "Sofiane R.",
    rating: 4,
    text: {
      fr: "Bon rapport qualité-prix, emballage soigné. Je recommande ONYX pour un cadeau.",
      en: "Good value, careful packaging. I recommend ONYX for a gift.",
      ar: "جودة جيدة مقابل السعر وتغليف أنيق. أنصح بـ ONYX كهدية.",
    },
  },
];

// ---------------- FAQ ----------------
export const FAQ = [
  {
    q: {
      fr: "Combien de temps prend la livraison ?",
      en: "How long does delivery take?",
      ar: "كم يستغرق التوصيل؟",
    },
    a: {
      fr: "Nos pièces sont expédiées depuis nos partenaires sous 1 à 3 jours. La livraison prend ensuite entre 7 et 15 jours ouvrés selon votre pays.",
      en: "Our pieces ship from our partners within 1–3 days. Delivery then takes 7 to 15 business days depending on your country.",
      ar: "تُشحن قطعنا من شركائنا خلال 1–3 أيام. ثم يستغرق التوصيل من 7 إلى 15 يوم عمل حسب بلدك.",
    },
  },
  {
    q: {
      fr: "Le paiement est-il sécurisé ?",
      en: "Is payment secure?",
      ar: "هل الدفع آمن؟",
    },
    a: {
      fr: "Oui. Les paiements par carte sont traités par YouCan Pay via une connexion chiffrée. Nous ne stockons jamais vos données bancaires.",
      en: "Yes. Card payments are processed by YouCan Pay over an encrypted connection. We never store your card details.",
      ar: "نعم. تتم معالجة المدفوعات بالبطاقة عبر YouCan Pay من خلال اتصال مشفّر. لا نخزّن بيانات بطاقتك أبداً.",
    },
  },
  {
    q: {
      fr: "Puis-je retourner un article ?",
      en: "Can I return an item?",
      ar: "هل يمكنني إرجاع منتج؟",
    },
    a: {
      fr: "Vous disposez de 14 jours après réception pour nous contacter et retourner un article non porté, dans son emballage d'origine.",
      en: "You have 14 days after delivery to contact us and return an unworn item in its original packaging.",
      ar: "لديك 14 يوماً بعد الاستلام للتواصل معنا وإرجاع منتج غير مستعمل في عبوته الأصلية.",
    },
  },
  {
    q: {
      fr: "Comment choisir ma taille de bague ?",
      en: "How do I choose my ring size?",
      ar: "كيف أختار مقاس الخاتم؟",
    },
    a: {
      fr: "Les tailles indiquées correspondent au diamètre intérieur (norme européenne). En cas de doute, mesurez une bague que vous portez déjà ou contactez-nous.",
      en: "Sizes shown follow the inner-diameter European standard. If unsure, measure a ring you already wear or contact us.",
      ar: "المقاسات المعروضة وفق المعيار الأوروبي للقطر الداخلي. عند الشك، قِس خاتماً ترتديه بالفعل أو تواصل معنا.",
    },
  },
  {
    q: {
      fr: "Comment vous contacter ?",
      en: "How can I contact you?",
      ar: "كيف أتواصل معكم؟",
    },
    a: {
      fr: `Par email à ${SHOP.email}. Nous répondons généralement sous 24 h.`,
      en: `By email at ${SHOP.email}. We usually reply within 24 hours.`,
      ar: `عبر البريد الإلكتروني ${SHOP.email}. نردّ عادةً خلال 24 ساعة.`,
    },
  },
];

// ---------------- Livraison & Retours (blocs multilingues) ----------------
export const SHIPPING = {
  title: { fr: "Livraison & Retours", en: "Shipping & Returns", ar: "الشحن والإرجاع" },
  blocks: [
    {
      h: { fr: "Expédition", en: "Shipping", ar: "الشحن" },
      p: {
        fr: "Nos articles sont expédiés depuis nos partenaires sous 1 à 3 jours ouvrés. Un numéro de suivi vous est communiqué dès l'envoi.",
        en: "Items ship from our partners within 1–3 business days. A tracking number is sent as soon as your order is dispatched.",
        ar: "تُشحن المنتجات من شركائنا خلال 1–3 أيام عمل. يُرسل لك رقم التتبّع فور الشحن.",
      },
    },
    {
      h: { fr: "Délais de livraison", en: "Delivery times", ar: "مدة التوصيل" },
      p: {
        fr: "Comptez 7 à 15 jours ouvrés selon votre pays. Les délais peuvent varier en période de forte affluence.",
        en: "Allow 7 to 15 business days depending on your country. Times may vary during peak periods.",
        ar: "احتسب من 7 إلى 15 يوم عمل حسب بلدك. قد تختلف المدة في فترات الذروة.",
      },
    },
    {
      h: { fr: "Retours & remboursements", en: "Returns & refunds", ar: "الإرجاع والاسترداد" },
      p: {
        fr: `Vous disposez de 14 jours après réception pour demander un retour. L'article doit être non porté et dans son emballage d'origine. Écrivez-nous à ${SHOP.email} pour lancer la procédure.`,
        en: `You have 14 days after delivery to request a return. The item must be unworn and in its original packaging. Email us at ${SHOP.email} to start the process.`,
        ar: `لديك 14 يوماً بعد الاستلام لطلب الإرجاع. يجب أن يكون المنتج غير مستعمل وفي عبوته الأصلية. راسلنا على ${SHOP.email} لبدء الإجراء.`,
      },
    },
  ],
};

// ---------------- Pages légales (FR — version de référence) ----------------
// La version française fait foi. À faire relire avant l'ouverture.
export const LEGAL = {
  "mentions-legales": {
    title: { fr: "Mentions légales", en: "Legal notice", ar: "إشعار قانوني" },
    html: `
      <p><strong>Éditeur du site :</strong> ${SHOP.legalName} — ${SHOP.legalStatus}.</p>
      <p><strong>Adresse :</strong> ${SHOP.legalAddress}.</p>
      <p><strong>Identification :</strong> ${SHOP.legalId}.</p>
      <p><strong>Contact :</strong> ${SHOP.email}.</p>
      <p><strong>Hébergement :</strong> Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>
      <p>L'ensemble du contenu de ce site (textes, visuels, logo ONYX) est protégé. Toute reproduction sans autorisation est interdite.</p>
    `,
  },
  cgv: {
    title: { fr: "Conditions Générales de Vente", en: "Terms of Sale", ar: "شروط البيع" },
    html: `
      <p>Les présentes conditions régissent les ventes réalisées sur la boutique ONYX.</p>
      <h3>Produits & prix</h3>
      <p>Les prix sont indiqués en euros, toutes taxes comprises. ONYX se réserve le droit de modifier ses prix à tout moment ; le prix appliqué est celui en vigueur au moment de la commande.</p>
      <h3>Commande & paiement</h3>
      <p>Le paiement s'effectue par carte bancaire via YouCan Pay au moment de la commande. La commande est validée après confirmation du paiement.</p>
      <h3>Livraison</h3>
      <p>Les articles sont expédiés depuis nos partenaires. Les délais indiqués (7 à 15 jours ouvrés) sont donnés à titre indicatif et ne sauraient engager la responsabilité d'ONYX en cas de retard du transporteur.</p>
      <h3>Rétractation & retours</h3>
      <p>Conformément à la réglementation, vous disposez d'un délai de 14 jours pour vous rétracter. Les articles doivent être retournés non portés, dans leur emballage d'origine. Les frais de retour restent à la charge du client sauf article défectueux.</p>
      <h3>Service client</h3>
      <p>Pour toute question ou réclamation : ${SHOP.email}.</p>
    `,
  },
  confidentialite: {
    title: { fr: "Politique de confidentialité", en: "Privacy policy", ar: "سياسة الخصوصية" },
    html: `
      <p>ONYX attache une grande importance à la protection de vos données personnelles.</p>
      <h3>Données collectées</h3>
      <p>Lors d'une commande, nous collectons votre nom, email, téléphone et adresse de livraison, uniquement pour traiter et expédier votre commande.</p>
      <h3>Paiement</h3>
      <p>Vos informations de paiement sont traitées directement par YouCan Pay. ONYX n'a jamais accès à vos données bancaires et ne les stocke pas.</p>
      <h3>Vos droits</h3>
      <p>Vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant à ${SHOP.email}.</p>
      <h3>Cookies</h3>
      <p>Le site utilise uniquement les cookies nécessaires à son bon fonctionnement (panier, langue).</p>
    `,
  },
};
