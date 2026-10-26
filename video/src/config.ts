// Tout ce qui change d'un secteur ou d'une langue à l'autre est ici.
// Pour passer aux restaurants : copier `salonAr`, changer les textes, les vidéos (public/ads) et le site (public/site).

export type Sub = { de: number; a: number; texte: string };
export type Pub3 = { fichier: string; vues: string; debut: number };

export type Config = {
  rtl: boolean;
  police: string;
  voix: string[]; // public/voice/a0.wav ... une ligne par scène
  musique: string;
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
  scene5: { slogan: string; prix: string; prixLegende: string; engagement: string; cta: string };
};

export const salonAr: Config = {
  rtl: true,
  police: 'Cairo',
  voix: ['voice/a0.wav', 'voice/a1.wav', 'voice/a2.wav', 'voice/a3.wav', 'voice/a4.wav'],
  musique: 'music/m872.mp3',
  sousTitres: [
    [
      { de: 6, a: 80, texte: 'الساعة الحادية عشرة ليلاً.' },
      { de: 85, a: 155, texte: 'زبونة تكتب لصالونكم...' },
      { de: 160, a: 200, texte: 'ولا أحد يرد.' },
      { de: 206, a: 262, texte: 'فتحجز عند غيركم.' },
    ],
    [
      { de: 6, a: 48, texte: 'مع ساهر ديجيتال،' },
      { de: 51, a: 150, texte: 'يرد ذكاء اصطناعي مكانكم في خمس ثوانٍ،' },
      { de: 154, a: 248, texte: 'على واتساب وإنستغرام، ليلاً ونهاراً.' },
      { de: 252, a: 342, texte: 'وتربحون حتى ساعتين كل يوم.' },
    ],
    [
      { de: 6, a: 84, texte: 'ونصنع لكم فيديوهات مثل هذه،' },
      { de: 86, a: 146, texte: 'تحصد ملايين المشاهدات،' },
      { de: 146, a: 236, texte: 'وننشرها لكم كل أسبوع.' },
    ],
    [
      { de: 6, a: 60, texte: 'وموقعاً احترافياً،' },
      { de: 64, a: 104, texte: 'ترى فيه زبوناتكم أسعاركم،' },
      { de: 106, a: 200, texte: 'وتحجز بنقرة واحدة.' },
    ],
    [
      { de: 6, a: 82, texte: 'ابتداءً من مئة درهم في الأسبوع،' },
      { de: 86, a: 130, texte: 'وبدون التزام.' },
      { de: 135, a: 250, texte: 'ردّوا بكلمة «نعم» على هذه الرسالة.' },
    ],
  ],
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
  scene3: {
    titre: 'فيديوهات بملايين المشاهدات',
    vues: 'مشاهدة',
    videos: [
      { fichier: 'ads/complex.mp4', vues: '3.9M', debut: 0 },
      { fichier: 'ads/golden.mp4', vues: '6.3M', debut: 0 },
      { fichier: 'ads/djeph.mp4', vues: '774K', debut: 60 },
    ],
  },
  scene4: {
    titre: 'موقع يحوّل الزوار إلى زبونات',
    site: 'site/site.png',
    boutonY: 710, // position du bouton « Réserver » dans la capture (pixels de l'image, largeur 780)
    confirme: 'تم تأكيد الحجز',
    detail: 'غدا - 15:00',
  },
  scene5: {
    slogan: 'أنتم نائمون، وساهر يسهر على عملكم',
    prix: '100',
    prixLegende: 'درهم / الأسبوع',
    engagement: 'بدون التزام',
    cta: 'ردّوا بكلمة «نعم»',
  },
};
