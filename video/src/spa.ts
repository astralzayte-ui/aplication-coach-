// Pubs motion design pour des spas / hammams : une entrée par pub, rendue par src/Spa.tsx.
// Pour en faire une nouvelle : nouvelle voix + minutage dans spa.py (python3 spa.py), puis une entrée ici.
// Les médias (photos, logo, voix, musique) sont dans public/spa, hors git.
import minutage from './spa.json';

export type Phrase = [number, number]; // début, fin (frames locales à la scène)
export type Scene = { de: number; duree: number; phrases: Phrase[] };
export type Minutage = { voix: string; duree: number; scenes: Scene[] };

export type IconePoint = 'calendrier' | 'porte' | 'diplome';

export type Spa = {
  nom: string;
  sousNom: string;              // sous le nom, ex. « Spa & Hammam · Marrakech »
  logo: string;                 // logo clair (fond sombre)
  couleurs: { or: string; creme: string; fond: string };
  rtl: boolean;
  police: string;               // titres et phrases
  musique: string;
  illustration?: string;        // mention en bas des photos si elles ne sont pas celles du lieu
  signature: string;
  filigrane?: string;           // texte répété en transparence sur toute la vidéo
  titres: (string | null)[];    // titre en haut de chaque scène ('' = nom du spa, null = rien)
  phrases: string[][];          // texte dit, par scène et par phrase
  accroche: { image: string };
  rituel: { etapes: { nom: string; image: string; focus?: [number, number]; clair?: boolean }[] };
  resultat: { image: string };
  confiance: { image: string; points: { icone: IconePoint; texte: string }[] };
  avis: { image: string; note: number; nombre: number; texteNombre: string };
  infos: { image: string; jours: string; horaires: string; lieu: string; adresse: string };
  fin: { appel: string; telephone: string; site: string };
  m: Minutage;
};

export const andalousAr: Spa = {
  nom: "LES BAINS D'ANDALOUS",
  sousNom: 'SPA & HAMMAM · MARRAKECH',
  logo: 'spa/logo-clair.png',
  couleurs: { or: '#d4a956', creme: '#f3e9d8', fond: '#120b06' },
  rtl: true,
  police: 'Amiri',
  musique: 'spa/musique.mp3',
  signature: 'Réalisé par Pulse Digital — @pulsedigit',
  filigrane: 'Julien Colly',
  titres: ['', 'الطقس البلدي، خطوة بخطوة', 'النتيجة', 'لماذا نحن؟', 'آراء الزبائن', 'زورونا', null],
  phrases: [
    ['هل جرّبتم يوماً الحمّام البلدي الحقيقي؟', 'انتظروا حتى تروا ما يُزيله الكيس من بشرتكم!'],
    ['أولاً، الصابون البلدي بالأوكالبتوس', 'ثم الكيس', 'ثم ماء الزهر', 'وفي الختام، الغاسول بسبع أعشاب مغربية'],
    ['تخرجون ببشرة ناعمة كالحرير…', 'وكأنكم وُلدتم من جديد'],
    ['منذ 2011', 'في غرف خاصة', 'مع معالجين معتمدين'],
    ['4.7 على Google', 'من أكثر من 1700 تقييم'],
    ['مفتوح كل يوم', 'من 9:30 صباحاً', 'إلى 10 ليلاً', 'في قلب مراكش'],
    ['', 'اتصلوا بنا على هذا الرقم', 'لمعرفة مواعيدنا المتاحة'],
  ],
  accroche: { image: 'spa/google/g6.jpg' },
  rituel: {
    etapes: [
      { nom: 'الصابون البلدي', image: 'spa/google/g3.jpg', focus: [30, 74] },
      { nom: 'الكيس', image: 'spa/google/g6.jpg', focus: [45, 72] },
      { nom: 'ماء الزهر', image: 'spa/google/g1.jpg', clair: true },
      { nom: 'الغاسول', image: 'spa/google/g10.jpg' },
    ],
  },
  resultat: { image: 'spa/google/g3.jpg' },
  confiance: {
    image: 'spa/google/g2.jpg',
    points: [
      { icone: 'calendrier', texte: 'منذ 2011' },
      { icone: 'porte', texte: 'غرف خاصة' },
      { icone: 'diplome', texte: 'معالجون معتمدون' },
    ],
  },
  avis: { image: 'spa/google/g7.jpg', note: 4.7, nombre: 1700, texteNombre: 'تقييم' },
  infos: { image: 'spa/google/g11.jpg', jours: 'كل يوم', horaires: '9:30 — 22:00', lieu: 'في قلب مراكش', adresse: 'Résidence Oasis · N7' },
  fin: { appel: 'اتصلوا بنا لمعرفة مواعيدنا المتاحة', telephone: '05 24 43 32 34', site: 'lesbainsdandalous.com' },
  m: minutage.andalous_ar as Minutage,
};

export const spas: Record<string, Spa> = { AndalousAr: andalousAr };
