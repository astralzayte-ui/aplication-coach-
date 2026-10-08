/* SILENCE — tout ce qui change se change ICI, et nulle part ailleurs.
   Un prix, un délai, un numéro : une seule ligne à modifier. */

window.CONFIG = {
  whatsapp: '212728861105',
  whatsappAffiche: '+212 728 861 105',
  email: 'silenceworlwide@gmail.com',
  instagram: 'silence.worldwide',
  tiktok: 'silence.worldwide',
  tiktokMaroc: 'silence.worldwide_maroc',

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
    id: 'ensemble', rayon: 'ensembles', vedette: true,
    nom: 'Sweat à capuche + jogging', court: 'La tenue',
    grammage: '320 g/m²', note: 'Velours, strass',
    prix: 34.90, marche: '50 à 75 €', ecart: -36,
    photos: ['sweat.jpg', 'hero.jpg', 'tenue.jpg'],
    description: "Le sweat et le jogging, même bain de teinture, même ton. Molleton lourd de 320 g/m² : il tient sa forme après les lavages au lieu de pocher aux genoux et aux coudes."
  },
  {
    id: 'veste', rayon: 'vestes',
    nom: 'Veste zippée délavée', court: 'La veste',
    grammage: '300 g/m²', note: 'Zip-hoodie noir délavé',
    prix: 19.90, marche: '24 à 35 €', ecart: -25,
    photos: ['veste.jpg', 'hero.jpg'],
    description: "Zip intégral, capuche, délavage noir. 300 g/m² : assez épaisse pour se porter seule à la mi-saison, assez fine pour passer sous une doudoune."
  },
  {
    id: 'tshirt', rayon: 'hauts', test: true,
    nom: 'T-shirt', court: 'Le t-shirt',
    grammage: '200 g/m²', note: 'Le test à 11 €',
    prix: 11.00, marche: null, ecart: null,
    photos: ['tshirt.jpg', 'hero.jpg'],
    description: "Le t-shirt pour juger notre matière sans risquer gros. 200 g/m² : tu le touches, tu le laves, tu juges — avant de mettre plus."
  },
  {
    id: 'survet', rayon: 'ensembles',
    nom: 'Survêtement imperméable', court: 'Le survêtement',
    grammage: null, note: 'Nylon camo marine',
    prix: 39.90, marche: '55 à 60 €', ecart: -28,
    photos: ['survet.jpg', 'hero.jpg'],
    description: "Veste et pantalon en nylon déperlant. La pluie glisse au lieu de traverser."
  },
  {
    id: 'doudoune', rayon: 'vestes',
    nom: 'Doudoune matelassée', court: 'La doudoune',
    grammage: null, note: 'Crème matelassée',
    prix: 39.90, marche: '60 à 190 €', ecart: -31,
    photos: ['doudoune.jpg', 'hero.jpg'],
    description: "Matelassage large, col montant. La pièce de l'hiver, au prix d'une pièce de mi-saison."
  },
  {
    id: 'tenue', rayon: 'ensembles',
    nom: 'Tête aux pieds — 4 pièces', court: 'La tenue complète',
    grammage: null, note: '4 pièces',
    prix: 84.00, marche: '~120 €', ecart: -26,
    photos: ['tenue.jpg', 'sweat.jpg', 'hero.jpg'],
    description: "Le haut, le bas, la veste et le t-shirt. Une tenue entière, assortie, en une commande."
  }
];

/* L'escalier des lots — trois marches, celle du milieu mise en avant.
   🔴 « Le plus choisi » seulement quand c'est VRAI. Avant les ventes : « Recommandé ». */
window.LOTS = [
  { titre: 'La tenue', detail: 'Sweat + jogging', prix: 34.90, ajouter: 'Sweat à capuche + jogging' },
  { titre: 'La tenue + la veste', detail: 'Séparément 54,80 €', prix: 49.90, ajouter: 'Lot tenue + veste', mis: 'Recommandé', gain: '−4,90 €' },
  { titre: 'Tête aux pieds', detail: '4 pièces assorties', prix: 84.00, ajouter: 'Tête aux pieds — 4 pièces' }
];

window.RAYONS = [
  { id: 'ensembles', nom: 'Ensembles', texte: "Le haut et le bas assortis. Le rayon qui vend le mieux dans le streetwear — le bas se vend plus que le haut." },
  { id: 'vestes',    nom: 'Vestes',    texte: "La veste zippée pour la mi-saison, la doudoune pour l'hiver." },
  { id: 'hauts',     nom: 'Hauts',     texte: "Le t-shirt à 11 € : la porte d'entrée pour juger notre matière." }
];

/* Les avis — VIDE tant qu'il n'y a pas de vrais clients.
   Section masquée automatiquement si la liste est vide.
   🔴 Jamais un faux avis. Ils arrivent par le message WhatsApp à J+10. */
window.AVIS = [];

window.FAQ = [
  { q: 'Vos vêtements taillent comment ?',
    r: "Coupe normale à légèrement ample. Entre deux tailles, prends la plus grande pour un rendu oversize. Un doute ? Écris-nous sur WhatsApp, on te guide." },
  { q: 'Quels sont les délais de livraison ?',
    r: "Les colis partent d'un entrepôt en Europe. Le délai exact t'est confirmé au moment de ta commande, avant que tu paies." },
  { q: 'Et si la taille ne me va pas ?',
    r: "Tu peux changer d'avis : toutes les conditions sont dans nos conditions générales de vente. Un défaut ? On rembourse ou on remplace, sans frais pour toi." },
  { q: 'Le paiement est-il sécurisé ?',
    r: "Paiement par carte uniquement, jamais à la livraison. Tes données bancaires ne passent jamais par nous." },
  { q: 'Où sont fabriquées vos pièces ?',
    r: "On ne fabrique pas nous-mêmes, et on le dit : nos pièces viennent d'un atelier partenaire, stockées et expédiées depuis l'Europe. C'est ce qui nous permet d'être 25 à 36 % sous le prix du marché. Et ton contrat est avec nous, avec nous seuls." },
  { q: 'Une question, un souci ?',
    r: "On répond sous 24 h, sur WhatsApp ou par e-mail. Avant comme après ta commande." }
];
