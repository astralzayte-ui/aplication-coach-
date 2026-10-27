import React from 'react';
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import minutage from './remakes.json';
import { OR, Pouls, Telephone, lisse, pop } from './ui';

// Vidéos refaites d'après 3 vidéos concurrentes (plans générés sur Higgsfield, dans public/remakes).
// Même format, même rythme ; nos textes, notre offre, notre nom.

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const R = (f: string) => staticFile('remakes/' + f);
const POLICE = 'Cairo';
const VOIX = 6; // décalage de la voix dans les plans face caméra (silence ajouté avant l'envoi à Higgsfield)

// Plan vidéo plein écran
const Plan: React.FC<{ src: string; debut?: number; vitesse?: number; flou?: number }> = ({ src, debut = 0, vitesse = 1, flou = 0 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ filter: flou ? `blur(${flou}px) brightness(0.7)` : undefined }}>
      <OffthreadVideo src={R(src)} muted startFrom={debut} playbackRate={vitesse}
        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.02 + 0.0006 * f})` }} />
    </AbsoluteFill>
  );
};

// Sous-titres : un morceau de phrase à la fois, les mots apparaissent au fil de la voix
const Legendes: React.FC<{ textes: string[]; debuts: number[]; fin: number; style: 'gras' | 'doux'; y: number }> = ({ textes, debuts, fin, style, y }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const i = debuts.findIndex((d, k) => f >= d && f < (debuts[k + 1] ?? fin));
  if (i < 0) return null;
  const texte = textes[i];
  const a = debuts[i];
  const b = debuts[i + 1] ?? fin;
  const mots = texte.split(' ');
  const parle = Math.max(8, b - a - 6);
  const instant = (k: number) => a + (mots.slice(0, k).join(' ').length / texte.length) * parle;
  const gras = style === 'gras';
  return (
    <div style={{ position: 'absolute', left: 50, right: 50, top: y, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', direction: 'rtl', rowGap: 8 }}>
      {mots.map((m, k) => {
        const t = instant(k);
        const q = spring({ frame: f - t, fps, config: { damping: 12, stiffness: 240, mass: 0.5 } });
        const dit = f >= t && (k === mots.length - 1 || f < instant(k + 1));
        return (
          <span key={k} style={{
            display: 'inline-block', marginInline: 7, fontFamily: POLICE, fontWeight: gras ? 900 : 700, fontSize: gras ? 74 : 50, lineHeight: 1.25,
            color: '#fff', opacity: f < t ? 0 : 1, transform: `scale(${0.7 + 0.3 * q})`,
            padding: gras ? '0 12px' : 0, borderRadius: 10, background: gras && dit ? '#ff2d55' : 'transparent',
            textShadow: gras ? '0 0 6px #000, 3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, -3px -3px 0 #000' : '0 2px 10px rgba(0,0,0,0.85)',
          }}>{m}</span>
        );
      })}
    </div>
  );
};

// Texte posé à l'écran (titres, étapes)
const Texte: React.FC<{ texte: string; y: number; taille: number; de?: number; couleur?: string }> = ({ texte, y, taille, de = 0, couleur = '#fff' }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(f, de, fps, 13);
  if (f < de) return null;
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, top: y, textAlign: 'center', direction: 'rtl', fontFamily: POLICE, fontWeight: 900, fontSize: taille,
      lineHeight: 1.2, whiteSpace: 'pre-line', color: couleur, textShadow: '0 3px 16px rgba(0,0,0,0.9)', opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 30}px)` }}>{texte}</div>
  );
};

// Notre nom, discret, sur toute la vidéo
const Mention: React.FC = () => (
  <div style={{ position: 'absolute', top: 42, left: 44, fontFamily: 'Inter', fontWeight: 800, fontSize: 34, color: '#fff', opacity: 0.8, textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
    @pulsedigit
  </div>
);

// Carte de fin Pulse Digital
const CarteFin: React.FC<{ ligne1: string; ligne2: string }> = ({ ligne1, ligne2 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(f, 0, fps, 12);
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 40%, #241a3d 0%, #07060f 70%)', opacity: lisse(f, 0, 6, 0, 1), alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ transform: `scale(${0.8 + 0.2 * p})`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Pouls largeur={300} trace={lisse(f, 0, 20, 0, 1)} />
        <div style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 92, color: '#fff', letterSpacing: 10, marginTop: 12 }}>PULSE DIGITAL</div>
        <div style={{ fontFamily: POLICE, fontWeight: 900, fontSize: 60, color: OR, direction: 'rtl', marginTop: 50, opacity: lisse(f, 8, 18, 0, 1) }}>{ligne1}</div>
        <div style={{ fontFamily: POLICE, fontWeight: 900, fontSize: 60, color: '#fff', direction: 'rtl', marginTop: 10, opacity: lisse(f, 14, 24, 0, 1) }}>{ligne2}</div>
        <div style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 40, color: '#cfc6e0', marginTop: 40, opacity: lisse(f, 18, 28, 0, 1) }}>@pulsedigit</div>
      </div>
    </AbsoluteFill>
  );
};

const Musique: React.FC<{ src: string; volume: number; duree: number }> = ({ src, volume, duree }) => (
  <Audio src={staticFile(src)} volume={(x) => interpolate(x, [0, 8, duree - 20, duree], [0, volume, volume, 0], clamp)} />
);

// ---------- A : « Salons de beauté, essayez ça » — la boîte cadeau ----------
const A = minutage.a_corps;
const A_ACCROCHE = 80; // plan face caméra (la phrase dure 2,4 s)
const A_FIN = A_ACCROCHE + A.debuts[8]; // la carte de fin arrive sur « si vous voulez remplir votre agenda »
export const DUREE_A = A_ACCROCHE + A.duree + 36;
const TEXTES_A = ['انظروا إلى هذا.', 'الزبونة تنشر تجربتها،', 'وتضع إشارة لحساب الصالون،', 'فتربح هدية.', 'هي تحصل على شيء مميز،',
  'والصالون يكتشفه أشخاص جدد بشكل طبيعي.', 'هذا هو التفكير الذكي:', 'أن تصنعوا تجارب تجعل الناس يتحدثون عنكم.', 'إذا أردتم ملء مواعيدكم،', 'أرسلوا «نعم» في الخاص.'];

export const RemakeBoite: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <Sequence durationInFrames={A_ACCROCHE}><Plan src="a_hook.mp4" /></Sequence>
    <Sequence from={A_ACCROCHE} durationInFrames={151}><Plan src="a2.mp4" /></Sequence>
    <Sequence from={A_ACCROCHE + 151} durationInFrames={151}><Plan src="a3.mp4" /></Sequence>
    <Sequence from={A_ACCROCHE + 302} durationInFrames={A_FIN - A_ACCROCHE - 302}><Plan src="a4.mp4" /></Sequence>
    <Sequence from={A_FIN}><CarteFin ligne1="إذا أردتم ملء مواعيدكم" ligne2="أرسلوا «نعم» في الخاص" /></Sequence>
    <Sequence durationInFrames={A_ACCROCHE}><Texte texte={'صالونات التجميل\nجربوا هذه الفكرة'} y={1230} taille={64} /></Sequence>
    <Sequence from={A_ACCROCHE} durationInFrames={A_FIN - A_ACCROCHE}>
      <Legendes textes={TEXTES_A} debuts={A.debuts} fin={A.duree} style="gras" y={500} />
    </Sequence>
    <Sequence from={4}><Audio src={R('a_hook.wav')} /></Sequence>
    <Sequence from={A_ACCROCHE}><Audio src={R('a_corps.wav')} /></Sequence>
    <Musique src="music/m872.mp3" volume={0.1} duree={DUREE_A} />
    <Mention />
  </AbsoluteFill>
);

// ---------- B : « 4 idées de vidéos d'équipe… pas gênantes » ----------
const B_PLANS = [
  { src: 'b0.mp4', duree: 90, texte: '' },
  { src: 'b1.mp4', duree: 90, texte: '1. الانزلاق على الكراسي' },
  { src: 'b2.mp4', duree: 90, texte: '2. الدخول من الباب' },
  { src: 'b3.mp4', duree: 150, texte: '3. الدوران على الكرسي' },
  { src: 'b4.mp4', duree: 120, texte: '4. الجلوس على الكنبة على طريقة «Friends»' },
];
const B_FIN = B_PLANS.reduce((a, p) => a + p.duree, 0);
export const DUREE_B = B_FIN + 75;

export const RemakeEquipe: React.FC = () => {
  let t = 0;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {B_PLANS.map((p, i) => {
        const de = t;
        t += p.duree;
        return (
          <Sequence key={i} from={de} durationInFrames={p.duree}>
            <Plan src={p.src} />
            {p.texte && <Texte texte={p.texte} y={820} taille={60} de={3} />}
          </Sequence>
        );
      })}
      <Sequence durationInFrames={90}>
        <Texte texte="أفكار فيديو لفريقكم" y={700} taille={92} />
        <Texte texte="...بدون إحراج!" y={830} taille={48} de={25} couleur={OR} />
      </Sequence>
      <Sequence from={B_FIN}><CarteFin ligne1="تابعوا PULSE DIGITAL" ligne2="لأفكار أكثر لصالونكم" /></Sequence>
      <Musique src="music/m623.mp3" volume={0.55} duree={DUREE_B} />
      <Mention />
    </AbsoluteFill>
  );
};

// ---------- C : « Ce qu'on posterait pour un salon » — l'agence face caméra ----------
const CI = minutage.c_intro;
const CM = minutage.c_missions;
const CF = minutage.c_fin;
const C_INTRO = VOIX + CI.duree + 6;
const C_MISSIONS = CM.duree + 4;
const C_FINALE = VOIX + CF.duree + 30;
export const DUREE_C = C_INTRO + C_MISSIONS + C_FINALE;
const TEXTES_CI = ['لو كنا نسيّر حسابات صالون تجميل،', 'لن ننشر صور الشعر فقط.', 'نعم،', 'الشعر مهم...', 'لكنه وحده لا يجعل الناس يحجزون.', 'إليكم بالضبط ما سننشره.'];
const TEXTES_CM = ['المهمة الأولى:', 'إظهار الكواليس.', 'نُري مراحل العمل أثناء المواعيد،', 'لتعرف الزبونات الجديدات ما ينتظرهن.', 'المهمة الثانية:',
  'إبراز شخصية مصففات الشعر.', 'لأن الناس لا يحجزون شعراً...', 'بل يحجزون أشخاصاً.', 'المهمة الثالثة:', 'صنع الرغبة.', 'نُظهر أجواء الصالون، والأزياء، وحتى بعض الفكاهة.'];
const TEXTES_CF = ['لأن حسابكم على إنستغرام', 'يجب أن يجعل الزبونة تقول:', '«أريد أن أذهب إلى هناك».', 'وهنا يبدأ التسويق يعمل لصالحكم.', 'أرسلوا «نعم» في الخاص.'];

// Le téléphone posé devant la présentatrice, qui montre un exemple de vidéo
const Exemples: React.FC<{ plans: { src: string; de: number; duree: number; debut?: number; vitesse?: number }[] }> = ({ plans }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(f, 0, fps, 13);
  return (
    <Telephone y={(1 - p) * 900 + 60} s={0.86}>
      {plans.map((x, i) => (
        <Sequence key={i} from={x.de} durationInFrames={x.duree} layout="none">
          <OffthreadVideo src={R(x.src)} muted startFrom={x.debut ?? 0} playbackRate={x.vitesse ?? 1} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        </Sequence>
      ))}
    </Telephone>
  );
};

const Mission: React.FC<{ numero: string; titre: string }> = ({ numero, titre }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(f, 0, fps, 12);
  return (
    <div style={{ position: 'absolute', top: 120, width: '100%', textAlign: 'center', direction: 'rtl', opacity: Math.min(1, p * 1.5), transform: `scale(${0.8 + 0.2 * p})` }}>
      <div style={{ fontFamily: POLICE, fontWeight: 700, fontSize: 46, color: OR, textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}>{numero}</div>
      <div style={{ fontFamily: POLICE, fontWeight: 900, fontSize: 70, color: '#fff', textShadow: '0 3px 16px rgba(0,0,0,0.9)' }}>{titre}</div>
    </div>
  );
};

export const RemakeAgence: React.FC = () => {
  const m = CM.debuts;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* Intro face caméra */}
      <Sequence durationInFrames={C_INTRO}>
        <Plan src="c_talk1.mp4" />
        <Sequence durationInFrames={VOIX + CI.debuts[1]}><Texte texte="ماذا سننشر لصالون تجميل؟" y={170} taille={72} /></Sequence>
        <Sequence from={VOIX + CI.debuts[2]} durationInFrames={CI.debuts[3] - CI.debuts[2] + 4}>
          <Texte texte="نعم" y={760} taille={200} />
        </Sequence>
        <Sequence from={VOIX}><Legendes textes={TEXTES_CI} debuts={CI.debuts} fin={CI.duree} style="doux" y={1450} /></Sequence>
        <Sequence from={VOIX}><Audio src={R('c_intro.wav')} /></Sequence>
      </Sequence>
      {/* Les 3 missions : le téléphone montre des exemples devant la présentatrice */}
      <Sequence from={C_INTRO} durationInFrames={C_MISSIONS}>
        <Plan src="c_talk2.mp4" flou={8} />
        <Exemples plans={[
          { src: 'c_m1.mp4', de: 0, duree: m[4], vitesse: 0.75 },
          { src: 'c_m2a.mp4', de: m[4], duree: m[6] - m[4] + 20 },
          { src: 'c_m2b.mp4', de: m[6] + 20, duree: m[8] - m[6] - 20 },
          { src: 'b3.mp4', de: m[8], duree: m[10] - m[8], debut: 20 },
          { src: 'b4.mp4', de: m[10], duree: C_MISSIONS - m[10] },
        ]} />
        <Sequence durationInFrames={m[2]}><Mission numero="المهمة 1" titre="إظهار الكواليس" /></Sequence>
        <Sequence from={m[4]} durationInFrames={m[6] - m[4]}><Mission numero="المهمة 2" titre="إبراز مصففات الشعر" /></Sequence>
        <Sequence from={m[8]} durationInFrames={m[10] - m[8] + 20}><Mission numero="المهمة 3" titre="صنع الرغبة" /></Sequence>
        <Legendes textes={TEXTES_CM} debuts={m} fin={CM.duree} style="doux" y={1520} />
        <Audio src={R('c_missions.wav')} />
      </Sequence>
      {/* Fin face caméra, puis carte Pulse Digital */}
      <Sequence from={C_INTRO + C_MISSIONS} durationInFrames={C_FINALE}>
        <Plan src="c_talk2.mp4" />
        <Sequence from={VOIX}><Legendes textes={TEXTES_CF} debuts={CF.debuts} fin={CF.debuts[4]} style="doux" y={1450} /></Sequence>
        <Sequence from={VOIX}><Audio src={R('c_fin.wav')} /></Sequence>
        <Sequence from={VOIX + CF.debuts[4]}><CarteFin ligne1="نسيّر حسابات صالونكم" ligne2="أرسلوا «نعم» في الخاص" /></Sequence>
      </Sequence>
      <Musique src="music/m872.mp3" volume={0.08} duree={DUREE_C} />
      <Mention />
    </AbsoluteFill>
  );
};
