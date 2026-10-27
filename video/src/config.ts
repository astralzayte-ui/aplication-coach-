// Tout ce qui change d'un secteur ou d'une langue à l'autre est ici.
// Pour passer aux restaurants : copier `salonFr` ou `salonAr`, changer les textes, les vidéos (public/ads) et le site (public/site).
// Le minutage (durée des scènes, début des sous-titres) vient de minutage.json, calculé par voix.py à partir des voix off.
import minutage from './minutage.json';

export type Sub = { de: number; a: number; texte: string };
export type Pub3 = { fichier: string; vues: string; debut: number };

export type Config = {
  rtl: boolean;
  police: string;
  voix: string[]; // une voix par scène
  musique: string;
  durees: number[]; // durée de chaque scène (frames)
  sousTitres: Sub[][]; // une liste par scène (frames locales à la scène)
  heure: string;
  chat: {
    contact: string;
    enLigne: string;
    question: string;
    reponse: string;
    choix: string;
    confirmation: string;
    ecrit: string;
  };
  scene1: { perdue: string; sansReponse: string };
  scene2: { chrono: string; temps: string; tempsLegende: string; canaux: string };
  scene3: { titre: string; vues: string; videos: Pub3[] };
  scene4: { titre: string; site: string; boutonY: number; confirme: string; detail: string };
  scene5: { slogan: string; aPartir: string; prix: string; prixLegende: string; engagement: string; cta: string };
};

type Minutage = { durees: number[]; debuts: number[][]; fins: number[] };

// Associe les textes des sous-titres au minutage calculé
const sous = (m: Minutage, textes: string[][]): Sub[][] =>
  textes.map((ligne, i) =>
    ligne.map((texte, j) => ({ de: m.debuts[i][j], a: j + 1 < ligne.length ? m.debuts[i][j + 1] - 1 : m.fins[i], texte })));

const videos: Pub3[] = [
  { fichier: 'ads/complex.mp4', vues: '3.9M', debut: 0 },
  { fichier: 'ads/golden.mp4', vues: '6.3M', debut: 0 },
  { fichier: 'ads/djeph.mp4', vues: '774K', debut: 60 },
];

export const salonAr: Config = {
  rtl: true,
  police: 'Cairo',
  voix: ['voice/ar0.wav', 'voice/ar1.wav', 'voice/ar2.wav', 'voice/ar3.wav', 'voice/ar4.wav'],
  musique: 'music/m872.mp3',
  durees: minutage.ar.durees,
  sousTitres: sous(minutage.ar, [
    ['الساعة الحادية عشرة ليلاً.', 'زبونة تكتب لصالونكم...', 'ولا أحد يرد.', 'فتحجز عند غيركم.'],
    ['مع ساهر ديجيتال،', 'يرد ذكاء اصطناعي مكانكم في خمس ثوانٍ،', 'على واتساب وإنستغرام، ليلاً ونهاراً.', 'وتربحون حتى ساعتين كل يوم.'],
    ['ونصنع لكم فيديوهات مثل هذه،', 'تحصد ملايين المشاهدات،', 'وننشرها لكم كل أسبوع.'],
    ['وموقعاً احترافياً،', 'ترى فيه زبوناتكم أسعاركم،', 'وتحجز بنقرة واحدة.'],
    ['ابتداءً من مئة درهم في الأسبوع،', 'وبدون التزام.', 'ردّوا بكلمة «نعم» على هذه الرسالة.'],
  ]),
  heure: '23:14',
  chat: {
    contact: 'زبونة جديدة',
    enLigne: 'متصلة الآن',
    question: 'السلام عليكم، واش عندكم بلاصة غدا للبروشينغ؟',
    reponse: 'وعليكم السلام! نعم، غدا عندنا 10:00 أو 15:00. البروشينغ بـ 80 درهم. نحجز لك؟',
    choix: '15:00 عافاك',
    confirmation: 'تم الحجز: غدا على 15:00. مرحبا بك!',
    ecrit: 'الذكاء الاصطناعي يكتب...',
  },
  scene1: { perdue: 'حجزت عند صالون آخر', sansReponse: 'بدون رد' },
  scene2: { chrono: 'الرد في', temps: 'ساعتين', tempsLegende: 'تربحونها كل يوم', canaux: '24/24' },
  scene3: { titre: 'فيديوهات بملايين المشاهدات', vues: 'مشاهدة', videos },
  scene4: {
    titre: 'موقع يحوّل الزوار إلى زبونات',
    site: 'site/site.png',
    boutonY: 710, // position du bouton « Réserver » dans la capture (pixels de l'image, largeur 780)
    confirme: 'تم تأكيد الحجز',
    detail: 'غدا - 15:00',
  },
  scene5: {
    slogan: 'أنتم نائمون، وساهر يسهر على عملكم',
    aPartir: 'ابتداءً من',
    prix: '100',
    prixLegende: 'درهم / الأسبوع',
    engagement: 'بدون التزام',
    cta: 'ردّوا بكلمة «نعم»',
  },
};

export const salonFr: Config = {
  ...salonAr,
  rtl: false,
  voix: ['voice/fr0.wav', 'voice/fr1.wav', 'voice/fr2.wav', 'voice/fr3.wav', 'voice/fr4.wav'],
  durees: minutage.fr.durees,
  sousTitres: sous(minutage.fr, [
    ['Il est 23 heures.', 'Une cliente écrit à votre salon...', 'Personne ne répond.', 'Alors, elle réserve ailleurs.'],
    ['Avec Sahir Digital,', 'une IA répond à votre place en 5 secondes,', 'sur WhatsApp et Instagram, jour et nuit.', "Et vous gagnez jusqu'à 2 heures par jour."],
    ['On crée pour vous des vidéos comme celles-ci,', 'qui font des millions de vues.', 'Et on les publie chaque semaine.'],
    ['Et un site professionnel,', 'où vos clientes voient vos prix,', 'et réservent en un clic.'],
    ['À partir de 100 DH par semaine,', 'sans engagement.', 'Répondez OUI à ce message.'],
  ]),
  chat: {
    contact: 'Nouvelle cliente',
    enLigne: 'en ligne',
    question: 'Bonsoir, vous avez une place demain pour un brushing ?',
    reponse: 'Bonsoir ! Oui, demain nous avons 10h00 ou 15h00. Le brushing est à 80 DH. Je vous réserve ?',
    choix: '15h00 svp',
    confirmation: "C'est réservé : demain à 15h00. À demain !",
    ecrit: "L'IA écrit...",
  },
  scene1: { perdue: 'Elle a réservé ailleurs', sansReponse: 'Sans réponse' },
  scene2: { chrono: 'Réponse en', temps: '2 heures', tempsLegende: 'gagnées chaque jour', canaux: '24/24' },
  scene3: { titre: 'Des vidéos à des millions de vues', vues: 'vues', videos },
  scene4: {
    titre: 'Un site qui fait réserver',
    site: 'site/site.png',
    boutonY: 710,
    confirme: 'Réservation confirmée',
    detail: 'Demain - 15h00',
  },
  scene5: {
    slogan: 'Vous dormez, Sahir veille sur votre salon',
    aPartir: 'À partir de',
    prix: '100',
    prixLegende: 'DH / semaine',
    engagement: 'Sans engagement',
    cta: 'Répondez « OUI »',
  },
};
