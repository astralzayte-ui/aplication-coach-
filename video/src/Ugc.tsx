import React from 'react';
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { OR, Pouls, lisse, pop } from './ui';

// Vidéos UGC d'exemple : ce qu'on publie pour un salon chaque semaine (plans générés sur Higgsfield, dans public/ugc).

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

type Plan = { src: string; duree: number; vitesse?: number };
type Texte = { de: number; a: number; texte: string; y: number; boite?: boolean };
export type Ugc = { plans: Plan[]; textes: Texte[]; musique: string; fin: string };

// Texte façon TikTok : blanc contouré, ou dans une boîte blanche
const TexteUgc: React.FC<Texte> = ({ de, a, texte, y, boite }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < de || f >= a) return null;
  const p = pop(f, de, fps, 12);
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, top: y, display: 'flex', justifyContent: 'center', transform: `scale(${0.75 + 0.25 * p})`, opacity: Math.min(1, p * 1.6) }}>
      <div style={{
        direction: 'rtl', textAlign: 'center', fontFamily: 'Cairo', fontWeight: 900, fontSize: boite ? 58 : 76, lineHeight: 1.3,
        color: boite ? '#111' : '#fff', background: boite ? '#fff' : 'transparent', borderRadius: 18, padding: boite ? '8px 28px' : 0,
        textShadow: boite ? 'none' : '0 0 6px #000, 3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, -3px -3px 0 #000',
      }}>{texte}</div>
    </div>
  );
};

const FinUgc: React.FC<{ texte: string }> = ({ texte }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 40%, #241a3d 0%, #07060f 70%)', opacity: lisse(f, 0, 6, 0, 1), alignItems: 'center', justifyContent: 'center' }}>
      <Pouls largeur={260} trace={lisse(f, 0, 18, 0, 1)} />
      <div style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 84, color: '#fff', letterSpacing: 8, marginTop: 10 }}>PULSE DIGITAL</div>
      <div style={{ fontFamily: 'Cairo', fontWeight: 900, fontSize: 54, color: OR, direction: 'rtl', marginTop: 36, textAlign: 'center', padding: '0 60px', opacity: lisse(f, 8, 18, 0, 1) }}>{texte}</div>
      <div style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 38, color: '#cfc6e0', marginTop: 30, opacity: lisse(f, 14, 24, 0, 1) }}>@pulsedigit</div>
    </AbsoluteFill>
  );
};

export const FIN_UGC = 50;
export const dureeUgc = (u: Ugc) => u.plans.reduce((a, p) => a + p.duree, 0) + FIN_UGC;

export const VideoUgc: React.FC<{ u: Ugc }> = ({ u }) => {
  const total = dureeUgc(u);
  let t = 0;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {u.plans.map((p, i) => {
        const de = t;
        t += p.duree;
        return (
          <Sequence key={i} from={de} durationInFrames={p.duree}>
            <OffthreadVideo src={staticFile('ugc/' + p.src)} muted playbackRate={p.vitesse ?? 1} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Sequence>
        );
      })}
      {u.textes.map((x, i) => <TexteUgc key={i} {...x} />)}
      <Sequence from={t}><FinUgc texte={u.fin} /></Sequence>
      <div style={{ position: 'absolute', top: 42, left: 44, display: 'flex', gap: 14, alignItems: 'center', fontFamily: 'Inter', fontWeight: 800, fontSize: 32, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
        <span style={{ opacity: 0.85 }}>@pulsedigit</span>
        <span style={{ fontFamily: 'Cairo', fontSize: 28, background: 'rgba(0,0,0,0.45)', borderRadius: 12, padding: '0 12px' }}>مثال</span>
      </div>
      <Audio src={staticFile(u.musique)} volume={(x) => interpolate(x, [0, 8, total - 20, total], [0, 0.6, 0.6, 0], clamp)} />
    </AbsoluteFill>
  );
};

const FIN = 'فيديوهات مثل هذه لصالونكم، كل أسبوع';

export const ugcs: Record<string, Ugc> = {
  Ongles: {
    plans: [{ src: 'u12.mp4', duree: 140 }, { src: 'u11.mp4', duree: 150 }],
    textes: [
      { de: 0, a: 140, texte: 'سر الأظافر اللامعة', y: 300 },
      { de: 140, a: 290, texte: 'جل يدوم حتى 3 أسابيع', y: 1450, boite: true },
    ],
    musique: 'music/m623.mp3',
    fin: FIN,
  },
  Transformation: {
    plans: [{ src: 'u21.mp4', duree: 120 }, { src: 'u22.mp4', duree: 150 }],
    textes: [
      { de: 0, a: 120, texte: 'قبل', y: 300 },
      { de: 0, a: 120, texte: 'من هذا...', y: 1450, boite: true },
      { de: 120, a: 270, texte: 'بعد', y: 300 },
      { de: 120, a: 270, texte: '...إلى هذا', y: 1450, boite: true },
    ],
    musique: 'music/m872.mp3',
    fin: FIN,
  },
  Salon: {
    plans: [{ src: 'u32.mp4', duree: 130 }, { src: 'u31.mp4', duree: 150 }],
    textes: [
      { de: 0, a: 130, texte: 'مرحبا بك في صالوننا', y: 300 },
      { de: 130, a: 280, texte: 'مراكش — احجزي موعدك على واتساب', y: 1450, boite: true },
    ],
    musique: 'music/m623.mp3',
    fin: FIN,
  },
  Brushing: {
    plans: [{ src: 'u41.mp4', duree: 200, vitesse: 0.75 }],
    textes: [
      { de: 0, a: 100, texte: 'سر الشعر اللامع', y: 300 },
      { de: 100, a: 200, texte: 'بروشينغ احترافي في صالوننا', y: 1450, boite: true },
    ],
    musique: 'music/m872.mp3',
    fin: FIN,
  },
};
