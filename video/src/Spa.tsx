import React, { useMemo } from 'react';
import {
  AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import type { IconePoint, Phrase, Scene, Spa } from './spa';
import { IconeHorloge, IconeOeil, Pouls, lisse, pop } from './ui';

// Pub motion design d'un spa : photos dans une arche andalouse, zellige, vapeur, rituel étape par étape,
// note Google, horaires, appel à téléphoner. Tout le contenu vient de la config (src/spa.ts).

const attente = delayRender('polices spa');
Promise.all(
  [
    ['Amiri', 'amiri-arabic-700-normal.woff2', 'normal'],
    ['Playfair', 'playfair-display-latin-700-normal.woff2', 'normal'],
    ['Playfair', 'playfair-display-latin-700-italic.woff2', 'italic'],
  ].map(([nom, fichier, style]) =>
    new FontFace(nom, `url(${staticFile('fonts/' + fichier)})`, { weight: '700', style }).load().then((x) => document.fonts.add(x)))
).then(() => continueRender(attente));

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const T = 10; // chevauchement entre deux scènes (la photo suivante s'ouvre en cercle dans l'arche)
const A = { x: 110, y: 150, w: 860, h: 1180 }; // arche
const LATIN = 'Playfair, serif';

type P = { s: Spa; sc: Scene; i: number; o: number };

const Son: React.FC<{ src: 'pop' | 'ding' | 'whoosh'; de: number; volume?: number }> = ({ src, de, volume = 0.45 }) => (
  <Sequence from={Math.max(0, Math.round(de))} durationInFrames={30} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

// ---------- Décor ----------
const Zellige: React.FC<{ couleur: string; f: number; opacite?: number }> = ({ couleur, f, opacite = 0.09 }) => (
  <svg width={1700} height={2500} style={{ position: 'absolute', left: -310, top: -290, opacity: opacite, transform: `rotate(${f * 0.03}deg)` }}>
    <defs>
      <pattern id="zellige" width="120" height="120" patternUnits="userSpaceOnUse">
        <g fill="none" stroke={couleur} strokeWidth="2">
          <rect x="35" y="35" width="50" height="50" />
          <rect x="35" y="35" width="50" height="50" transform="rotate(45 60 60)" />
          <circle cx="60" cy="60" r="10" />
          <path d="M0 0L25 25M120 0L95 25M0 120L25 95M120 120L95 95" />
        </g>
      </pattern>
    </defs>
    <rect width="1700" height="2500" fill="url(#zellige)" />
  </svg>
);

const Fond: React.FC<{ s: Spa }> = ({ s }) => {
  const f = useCurrentFrame();
  const grains = useMemo(
    () => Array.from({ length: 36 }, (_, i) => ({
      x: random(`gx${i}`) * 1080, y: random(`gy${i}`) * 1920, v: 0.4 + random(`gv${i}`) * 1.1, t: 2 + random(`gt${i}`) * 4, p: random(`gp${i}`) * 6.28,
    })),
    []
  );
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 38%, #3a2412 0%, ${s.couleurs.fond} 68%)`, overflow: 'hidden' }}>
      <Zellige couleur={s.couleurs.or} f={f} />
      {grains.map((g, i) => (
        <div key={i} style={{
          position: 'absolute', left: g.x + Math.sin(f / 40 + g.p) * 20, top: (((g.y - f * g.v) % 1920) + 1920) % 1920, width: g.t, height: g.t,
          borderRadius: '50%', background: s.couleurs.or, boxShadow: `0 0 8px ${s.couleurs.or}`, opacity: 0.2 + 0.5 * Math.abs(Math.sin(f / 18 + g.p)),
        }} />
      ))}
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)' }} />
    </AbsoluteFill>
  );
};

// Arche mauresque : les photos sont découpées dedans, double filet doré qui se trace à l'ouverture
const chemin = (w: number, h: number) =>
  `M0,${h} L0,${h * 0.36} C0,${h * 0.17} ${w / 2 - 70},${h * 0.07} ${w / 2},0 C${w / 2 + 70},${h * 0.07} ${w},${h * 0.17} ${w},${h * 0.36} L${w},${h} Z`;

const Arche: React.FC<{ s: Spa; trace?: number; children: React.ReactNode }> = ({ s, trace = 1, children }) => (
  <div style={{ position: 'absolute', left: A.x, top: A.y, width: A.w, height: A.h }}>
    <div style={{ position: 'absolute', inset: 0, clipPath: `path('${chemin(A.w, A.h)}')`, overflow: 'hidden' }}>{children}</div>
    <svg width={A.w + 40} height={A.h + 40} style={{ position: 'absolute', left: -20, top: -20 }}>
      <g transform="translate(20 20)" fill="none" stroke={s.couleurs.or}>
        <path d={chemin(A.w, A.h)} strokeWidth={7} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - trace}
          style={{ filter: `drop-shadow(0 0 10px ${s.couleurs.or})` }} />
        <path d={chemin(A.w - 36, A.h - 18)} transform="translate(18 18)" strokeOpacity={0.55} strokeWidth={2} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - trace} />
      </g>
    </svg>
  </div>
);

// Photo plein cadre de l'arche : ouverture en cercle à partir de `de`, lent travelling avant
const Photo: React.FC<{ src: string; x: number; de: number; duree: number; focus?: [number, number]; zoom?: number; flou?: number; sombre?: number }> = ({
  src, x, de, duree, focus = [50, 50], zoom = 1.08, flou = 0, sombre = 0,
}) => {
  if (x < de) return null;
  const r = lisse(x, de, de + 13, 0, 80);
  const k = interpolate(x, [de, de + duree], [zoom, zoom + 0.12], clamp);
  return (
    <AbsoluteFill style={{ clipPath: `circle(${r}% at 50% 55%)` }}>
      <Img src={staticFile(src)} style={{
        width: '100%', height: '100%', objectFit: 'cover', transformOrigin: `${focus[0]}% ${focus[1]}%`, transform: `scale(${k})`,
        filter: `blur(${flou}px) brightness(${1 - sombre})`,
      }} />
    </AbsoluteFill>
  );
};

const DegradeBas: React.FC<{ hauteur?: number; force?: number }> = ({ hauteur = 420, force = 0.85 }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: hauteur, background: `linear-gradient(transparent, rgba(12,7,3,${force}))` }} />
);

const Vapeur: React.FC<{ x: number; force?: number }> = ({ x, force = 1 }) => {
  const nuages = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({ x: random(`vx${i}`) * 860, t: 220 + random(`vt${i}`) * 260, v: 1.2 + random(`vv${i}`) * 1.6, p: random(`vp${i}`) * 700 })),
    []
  );
  return (
    <>
      {nuages.map((n, i) => {
        const y = 1240 - ((x * n.v + n.p) % 1080);
        return (
          <div key={i} style={{
            position: 'absolute', left: n.x - n.t / 2 + Math.sin(x / 30 + i) * 40, top: y - n.t / 2, width: n.t, height: n.t, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,250,240,0.55), transparent 65%)', filter: 'blur(18px)',
            opacity: force * interpolate(y, [150, 450, 1040, 1240], [0, 0.5, 0.45, 0], clamp),
          }} />
        );
      })}
    </>
  );
};

// ---------- Texte ----------
const Entete: React.FC<{ s: Spa; texte: string | null; x: number; visible: number }> = ({ s, texte, x, visible }) => {
  if (texte === null) return null;
  const o = visible * lisse(x, texte ? 0 : 12, texte ? 10 : 28, 0, 1);
  if (!texte) {
    return (
      <div style={{ position: 'absolute', top: 26, left: 0, right: 0, textAlign: 'center', opacity: o, color: s.couleurs.creme }}>
        <div style={{ fontFamily: LATIN, fontSize: 38, letterSpacing: 7 }}>{s.nom}</div>
        <div style={{ fontFamily: LATIN, fontSize: 19, letterSpacing: 6, color: s.couleurs.or, marginTop: 2 }}>{s.sousNom}</div>
      </div>
    );
  }
  const l = lisse(x, 2, 16, 0, 120);
  return (
    <div style={{ position: 'absolute', top: 22, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, opacity: o }}>
      <div style={{ width: l, height: 2, background: `linear-gradient(90deg, transparent, ${s.couleurs.or})` }} />
      <div style={{ fontFamily: s.police, fontSize: 54, color: s.couleurs.or, direction: s.rtl ? 'rtl' : 'ltr', transform: `translateY(${(1 - o) * -20}px)` }}>{texte}</div>
      <div style={{ width: l, height: 2, background: `linear-gradient(90deg, ${s.couleurs.or}, transparent)` }} />
    </div>
  );
};

// Phrase dite, mot à mot, le mot en cours en doré
const Phrases: React.FC<{ s: Spa; textes: string[]; phrases: Phrase[]; x: number }> = ({ s, textes, phrases, x }) => {
  const { fps } = useVideoConfig();
  const k = phrases.findIndex(([de, a]) => x >= de && x < a);
  if (k < 0 || !textes[k]) return null;
  const [de, a] = phrases[k];
  const texte = textes[k];
  const mots = texte.split(' ');
  const parle = Math.max(10, a - de - 8);
  const instant = (i: number) => de + (mots.slice(0, i).join(' ').length / texte.length) * parle;
  return (
    <div style={{ position: 'absolute', left: 50, right: 50, top: 1372, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: interpolate(x, [a - 5, a], [1, 0], clamp) }}>
      <div style={{ direction: s.rtl ? 'rtl' : 'ltr', textAlign: 'center', fontFamily: `${s.police}, ${LATIN}`, fontSize: 76, lineHeight: 1.45,
        color: s.couleurs.creme, textShadow: '0 4px 18px rgba(0,0,0,0.85)' }}>
        {mots.map((m, i) => {
          const t = instant(i);
          const q = spring({ frame: x - t, fps, config: { damping: 12, stiffness: 200, mass: 0.6 } });
          const dit = x >= t && (i === mots.length - 1 || x < instant(i + 1));
          return (
            <span key={i} style={{ display: 'inline-block', marginInline: 11, opacity: x < t ? 0 : 1, color: dit ? s.couleurs.or : s.couleurs.creme,
              transform: `translateY(${(1 - q) * 26}px) scale(${0.7 + 0.3 * q})`, filter: `blur(${Math.max(0, 1 - q) * 6}px)` }}>{m}</span>
          );
        })}
      </div>
    </div>
  );
};

// ---------- Icônes ----------
const Icone: React.FC<{ nom: IconePoint | 'telephone' | 'epingle'; taille: number; couleur: string }> = ({ nom, taille, couleur }) => (
  <svg width={taille} height={taille} viewBox="0 0 24 24" fill="none" stroke={couleur} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {nom === 'calendrier' && <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4M8 14h2M14 14h2M8 17h2" /></>}
    {nom === 'porte' && <><path d="M5 21V10a7 7 0 0 1 14 0v11z" /><path d="M3 21h18" /><circle cx="14.5" cy="14.5" r="1" fill={couleur} /></>}
    {nom === 'diplome' && <><circle cx="12" cy="9" r="5.5" /><path d="M8.5 13.5L7 21l5-2.5 5 2.5-1.5-7.5" /><path d="M10 9l1.5 1.5L14.5 7.5" /></>}
    {nom === 'telephone' && <path fill={couleur} stroke="none"
      d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" />}
    {nom === 'epingle' && <><path d="M12 21.5s7-7.3 7-12.5a7 7 0 0 0-14 0c0 5.2 7 12.5 7 12.5z" /><circle cx="12" cy="9" r="2.6" /></>}
  </svg>
);

const ETOILE = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

const Etoile: React.FC<{ taille: number; rempli: number; couleur: string }> = ({ taille, rempli, couleur }) => (
  <div style={{ position: 'relative', width: taille, height: taille }}>
    <svg width={taille} height={taille} viewBox="0 0 24 24" style={{ position: 'absolute' }}><path d={ETOILE} fill="rgba(255,255,255,0.18)" /></svg>
    <div style={{ position: 'absolute', inset: 0, width: `${rempli * 100}%`, overflow: 'hidden' }}>
      <svg width={taille} height={taille} viewBox="0 0 24 24"><path d={ETOILE} fill={couleur} /></svg>
    </div>
  </div>
);

const Etincelles: React.FC<{ x: number; couleur: string }> = ({ x, couleur }) => {
  const liste = useMemo(() => Array.from({ length: 14 }, (_, i) => ({ x: 60 + random(`ex${i}`) * 740, y: 150 + random(`ey${i}`) * 750, p: random(`ep${i}`) * 40, t: 26 + random(`et${i}`) * 34 })), []);
  return (
    <>
      {liste.map((e, i) => {
        const v = Math.max(0, Math.sin(((x + e.p) / 22) * Math.PI));
        return (
          <svg key={i} width={e.t} height={e.t} viewBox="0 0 24 24" style={{ position: 'absolute', left: e.x, top: e.y, opacity: v, transform: `scale(${0.4 + 0.6 * v}) rotate(${x * 2}deg)` }}>
            <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" fill={couleur} style={{ filter: `drop-shadow(0 0 6px ${couleur})` }} />
          </svg>
        );
      })}
    </>
  );
};

// ---------- Scènes ----------
const Illustration: React.FC<{ s: Spa; visible: number }> = ({ s, visible }) =>
  s.illustration ? (
    <div style={{ position: 'absolute', top: A.y + A.h + 8, left: A.x + 10, fontFamily: 'Cairo', fontSize: 22, color: s.couleurs.creme, opacity: 0.45 * visible, direction: 'rtl' }}>
      {s.illustration}
    </div>
  ) : null;

const SceneAccroche: React.FC<P> = ({ s, sc, o }) => {
  const f = useCurrentFrame();
  const x = f - o;
  const { fps } = useVideoConfig();
  const p1 = sc.phrases[1][0];
  const choc = spring({ frame: x - p1, fps, config: { damping: 14, stiffness: 160 } });
  const anneau = pop(x, p1 + 2, fps, 11);
  return (
    <>
      <Arche s={s} trace={lisse(x, 0, 30, 0, 1)}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${1 + 0.1 * choc})`, opacity: lisse(x, 2, 20, 0, 1) }}>
          <Photo src={s.accroche.image} x={x} de={-20} duree={sc.duree + 20} zoom={1.12} />
        </div>
        <Vapeur x={x} force={1.2} />
        <DegradeBas />
      </Arche>
      {x >= p1 && (
        <div style={{ position: 'absolute', left: 540 - 140, top: 610, width: 280, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {[0, 1].map((k) => {
            const r = ((x - p1 + k * 18) % 36) / 36;
            return <div key={k} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `3px solid ${s.couleurs.or}`, transform: `scale(${1 + r * 0.7})`, opacity: (1 - r) * anneau }} />;
          })}
          <div style={{ width: 200, height: 200, borderRadius: '50%', background: 'rgba(18,11,6,0.55)', border: `4px solid ${s.couleurs.or}`, display: 'flex', alignItems: 'center',
            justifyContent: 'center', transform: `scale(${anneau})`, boxShadow: `0 0 40px ${s.couleurs.or}` }}>
            <IconeOeil taille={110} couleur={s.couleurs.or} />
          </div>
        </div>
      )}
      <Son src="whoosh" de={p1} volume={0.4} />
    </>
  );
};

const SceneRituel: React.FC<P> = ({ s, sc, o }) => {
  const f = useCurrentFrame();
  const x = f - o;
  const { fps } = useVideoConfig();
  const etapes = s.rituel.etapes;
  const debut = (k: number) => (k === 0 ? -T : sc.phrases[k][0]);
  const en = sc.phrases.reduce((k, [de], i) => (x >= de ? i : k), 0);
  const cx = (k: number) => A.x + A.w * (s.rtl ? 1 - (2 * k + 1) / (2 * etapes.length) : (2 * k + 1) / (2 * etapes.length));
  const Y = 1140;
  const avance = sc.phrases.reduce((v, [de], k) => v + lisse(x, de, de + 10, 0, k === 0 ? 0 : 1), 0);
  const chiffres = ['١', '٢', '٣', '٤', '٥', '٦'];
  return (
    <>
      <Arche s={s}>
        {etapes.map((e, k) => (
          <Photo key={k} src={e.image} x={x} de={debut(k)} duree={(sc.phrases[k + 1]?.[0] ?? sc.duree) - debut(k) + 20} focus={e.focus} zoom={e.focus ? 1.42 : 1.1} />
        ))}
        <Vapeur x={x} force={0.7} />
        <DegradeBas hauteur={480} force={0.92} />
      </Arche>
      <div style={{ position: 'absolute', top: Y - 2, height: 4, left: cx(etapes.length - 1), width: cx(0) - cx(etapes.length - 1), background: 'rgba(243,233,216,0.22)' }} />
      <div style={{ position: 'absolute', top: Y - 2, height: 4, background: s.couleurs.or, boxShadow: `0 0 10px ${s.couleurs.or}`,
        ...(s.rtl ? { left: cx(0) - (cx(0) - cx(etapes.length - 1)) * (avance / (etapes.length - 1)), width: (cx(0) - cx(etapes.length - 1)) * (avance / (etapes.length - 1)) }
          : { left: cx(0), width: (cx(etapes.length - 1) - cx(0)) * (avance / (etapes.length - 1)) }) }} />
      {etapes.map((e, k) => {
        const p = pop(x, sc.phrases[k][0] - 2, fps, 12);
        const actif = k === en && x >= sc.phrases[k][0];
        const fait = k < en;
        const t = 128 * (actif ? 1 + 0.1 * Math.sin(x / 5) : 1);
        return (
          <React.Fragment key={k}>
            <div style={{ position: 'absolute', left: cx(k) - t / 2, top: Y - t / 2, width: t, height: t, borderRadius: '50%',
              background: actif ? `radial-gradient(circle at 35% 30%, #f6dc98, ${s.couleurs.or})` : 'rgba(18,11,6,0.85)',
              border: `4px solid ${actif || fait ? s.couleurs.or : 'rgba(243,233,216,0.35)'}`, boxShadow: actif ? `0 0 34px ${s.couleurs.or}` : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Amiri', fontSize: 70, lineHeight: 1,
              color: actif ? '#1a0f07' : fait ? s.couleurs.or : 'rgba(243,233,216,0.5)', transform: `scale(${0.6 + 0.4 * Math.max(p, x >= 0 ? 0.55 : 0)})`,
              opacity: lisse(x, 0, 10, 0, 1) }}>
              <span style={{ marginTop: 10 }}>{chiffres[k]}</span>
            </div>
            <div style={{ position: 'absolute', left: cx(k) - 110, width: 220, top: Y + 78, textAlign: 'center', fontFamily: 'Amiri', fontSize: 36, lineHeight: 1.2,
              color: actif ? s.couleurs.or : s.couleurs.creme, opacity: x >= sc.phrases[k][0] ? p : 0, direction: 'rtl' }}>{e.nom}</div>
            {k > 0 && <Son src="pop" de={sc.phrases[k][0] + o} volume={0.4} />}
          </React.Fragment>
        );
      })}
    </>
  );
};

const SceneResultat: React.FC<P> = ({ s, sc, o }) => {
  const f = useCurrentFrame();
  const x = f - o;
  const p1 = sc.phrases[1][0];
  const balayage = (de: number) => interpolate(x, [de, de + 26], [-500, 1300], clamp);
  return (
    <Arche s={s}>
      <Photo src={s.resultat.image} x={x} de={-T} duree={sc.duree + T} focus={[50, 38]} zoom={1.1} />
      {[8, p1].map((de, k) => (
        <div key={k} style={{ position: 'absolute', top: -200, bottom: -200, width: 260, left: balayage(de), transform: 'rotate(18deg)',
          background: 'linear-gradient(90deg, transparent, rgba(255,246,225,0.45), transparent)', mixBlendMode: 'screen' }} />
      ))}
      <Etincelles x={x} couleur="#fff6dc" />
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 45%, rgba(255,240,210,0.5), transparent 60%)', opacity: interpolate(x, [p1, p1 + 8, p1 + 30], [0, 0.8, 0.15], clamp) }} />
      <DegradeBas />
    </Arche>
  );
};

const SceneConfiance: React.FC<P> = ({ s, sc, o }) => {
  const f = useCurrentFrame();
  const x = f - o;
  const { fps } = useVideoConfig();
  return (
    <>
      <Arche s={s}>
        <Photo src={s.confiance.image} x={x} de={-T} duree={sc.duree + T} zoom={1.1} sombre={0.3} />
        <DegradeBas />
      </Arche>
      {s.confiance.points.map((pt, k) => {
        const de = sc.phrases[k][0];
        const p = pop(x, de - 2, fps, 13);
        return (
          <React.Fragment key={k}>
            <div style={{ position: 'absolute', left: 190, right: 190, top: 530 + k * 180, height: 140, borderRadius: 70, background: 'rgba(18,11,6,0.78)',
              border: `3px solid ${s.couleurs.or}`, boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 0 24px rgba(212,169,86,${0.35 * p})`, display: 'flex', alignItems: 'center',
              gap: 30, padding: '0 34px', direction: s.rtl ? 'rtl' : 'ltr', opacity: x >= de - 2 ? Math.min(1, p * 1.4) : 0,
              transform: `translateX(${(1 - p) * (s.rtl ? 260 : -260)}px)` }}>
              <div style={{ width: 92, height: 92, borderRadius: '50%', background: s.couleurs.or, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icone nom={pt.icone} taille={58} couleur="#1a0f07" />
              </div>
              <div style={{ fontFamily: `${s.police}, ${LATIN}`, fontSize: 60, color: s.couleurs.creme, marginTop: 6 }}>{pt.texte}</div>
            </div>
            <Son src="pop" de={de + o} volume={0.4} />
          </React.Fragment>
        );
      })}
    </>
  );
};

const milliers = (n: number) => (n >= 1000 ? `${Math.floor(n / 1000)} ${String(n % 1000).padStart(3, '0')}` : String(n));

const SceneAvis: React.FC<P> = ({ s, sc, o }) => {
  const f = useCurrentFrame();
  const x = f - o;
  const { fps } = useVideoConfig();
  const note = interpolate(x, [4, 34], [0, s.avis.note], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const p1 = sc.phrases[1][0];
  const nombre = Math.round(interpolate(x, [p1, p1 + 26], [0, s.avis.nombre], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) }));
  const carte = pop(x, 0, fps, 14);
  const g = ['#4285F4', '#EA4335', '#FBBC05', '#4285F4', '#34A853', '#EA4335'];
  return (
    <>
      <Arche s={s}>
        <Photo src={s.avis.image} x={x} de={-T} duree={sc.duree + T} zoom={1.15} flou={7} sombre={0.45} />
        <DegradeBas />
      </Arche>
      <div style={{ position: 'absolute', left: 175, right: 175, top: 490, height: 600, borderRadius: 48, background: 'rgba(18,11,6,0.72)', border: `3px solid ${s.couleurs.or}`,
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 44,
        opacity: Math.min(1, carte * 1.5), transform: `scale(${0.8 + 0.2 * carte})` }}>
        <div style={{ fontFamily: 'Cairo', fontWeight: 900, fontSize: 62, letterSpacing: 1, background: '#fff', borderRadius: 18, padding: '0 26px' }}>
          {'Google'.split('').map((c, k) => <span key={k} style={{ color: g[k] }}>{c}</span>)}
        </div>
        <div style={{ fontFamily: LATIN, fontSize: 190, lineHeight: 1.1, color: s.couleurs.or, textShadow: `0 0 40px rgba(212,169,86,0.5)` }}>{note.toFixed(1)}</div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[0, 1, 2, 3, 4].map((k) => <Etoile key={k} taille={78} rempli={Math.max(0, Math.min(1, (note / s.avis.note) * s.avis.note - k))} couleur="#FBBC05" />)}
        </div>
        <div style={{ display: 'flex', direction: 'rtl', alignItems: 'baseline', gap: 16, marginTop: 34, opacity: x >= p1 ? 1 : 0, color: s.couleurs.creme }}>
          <span style={{ fontFamily: LATIN, fontSize: 70, direction: 'ltr', color: s.couleurs.creme }}>+{milliers(nombre)}</span>
          <span style={{ fontFamily: s.police, fontSize: 56 }}>{s.avis.texteNombre}</span>
        </div>
      </div>
      <Son src="ding" de={36 + o} volume={0.45} />
      <Son src="pop" de={p1 + o} volume={0.35} />
    </>
  );
};

const SceneInfos: React.FC<P> = ({ s, sc, o }) => {
  const f = useCurrentFrame();
  const x = f - o;
  const { fps } = useVideoConfig();
  const [p0, p1, p2, p3] = sc.phrases.map((p) => p[0]);
  const [h1, h2] = s.infos.horaires.split(' — ');
  const ligne = (de: number) => ({ opacity: x >= de - 2 ? Math.min(1, pop(x, de - 2, fps, 13) * 1.4) : 0, transform: `translateY(${(1 - pop(x, de - 2, fps, 13)) * 50}px)` });
  return (
    <>
      <Arche s={s}>
        <Photo src={s.infos.image} x={x} de={-T} duree={sc.duree + T} zoom={1.12} sombre={0.5} />
        <DegradeBas />
      </Arche>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 480, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26, direction: 'rtl', ...ligne(p0) }}>
        <IconeHorloge taille={96} couleur={s.couleurs.or} angle={x * 9} />
        <div style={{ fontFamily: s.police, fontSize: 84, color: s.couleurs.creme, marginTop: 8 }}>{s.infos.jours}</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 650, display: 'flex', justifyContent: 'center', gap: 24, fontFamily: LATIN, fontSize: 112,
        color: s.couleurs.or, textShadow: '0 0 30px rgba(212,169,86,0.45)' }}>
        <span style={ligne(p1)}>{h1}</span>
        <span style={ligne(p2)}>— {h2}</span>
      </div>
      <div style={{ position: 'absolute', left: 300, right: 300, top: 850, height: 2, background: s.couleurs.or, opacity: 0.6, transform: `scaleX(${lisse(x, p3 - 6, p3 + 6, 0, 1)})` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 900, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, direction: 'rtl', ...ligne(p3) }}>
        <Icone nom="epingle" taille={84} couleur={s.couleurs.or} />
        <div style={{ fontFamily: s.police, fontSize: 76, color: s.couleurs.creme, marginTop: 8 }}>{s.infos.lieu}</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1020, textAlign: 'center', fontFamily: LATIN, fontSize: 36, letterSpacing: 2, color: s.couleurs.creme, ...ligne(p3 + 6) }}>
        {s.infos.adresse}
      </div>
      <Son src="pop" de={p0 + o} volume={0.35} />
      <Son src="pop" de={p3 + o} volume={0.35} />
    </>
  );
};

const SceneFin: React.FC<P> = ({ s, sc, o }) => {
  const f = useCurrentFrame();
  const x = f - o;
  const { fps } = useVideoConfig();
  const logo = pop(x, 0, fps, 15);
  const p1 = sc.phrases[1][0];
  const carte = pop(x, p1 - 4, fps, 11);
  const finVoix = sc.phrases[sc.phrases.length - 1][1];
  const sonne = x >= p1 && x < p1 + 40 ? Math.sin(x * 1.6) * 14 * (1 - (x - p1) / 40) : 0;
  return (
    <>
      <Arche s={s}>
        <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 40%, #3d2614 0%, #0d0805 75%)', clipPath: `circle(${lisse(x, -T, 4, 0, 80)}% at 50% 55%)` }}>
          <Zellige couleur={s.couleurs.or} f={x} opacite={0.07} />
        </AbsoluteFill>
        <div style={{ position: 'absolute', left: 130, width: 600, top: 130, height: 500, opacity: logo, transform: `scale(${0.85 + 0.15 * logo})` }}>
          <Img src={staticFile(s.logo)} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: `drop-shadow(0 0 30px rgba(212,169,86,${0.35 * logo}))` }} />
          <div style={{ position: 'absolute', inset: 0, WebkitMaskImage: `url(${staticFile(s.logo)})`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center' }}>
            <div style={{ position: 'absolute', top: -100, bottom: -100, width: 160, left: interpolate(x, [10, 40], [-200, 800], clamp), transform: 'rotate(18deg)',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)' }} />
          </div>
        </div>
        <Etincelles x={x} couleur={s.couleurs.or} />
      </Arche>
      <div style={{ position: 'absolute', left: 170, right: 170, top: 905, height: 150, borderRadius: 75, background: 'linear-gradient(135deg, #f3d891, #b8862f)',
        boxShadow: `0 0 ${30 + 20 * Math.sin(x / 6)}px rgba(212,169,86,0.7)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26,
        opacity: x >= p1 - 4 ? Math.min(1, carte * 1.5) : 0, transform: `translateY(${(1 - carte) * 80}px) scale(${1 + (x > p1 + 20 ? 0.025 * Math.sin(x / 6) : 0)})` }}>
        <div style={{ transform: `rotate(${sonne}deg)` }}><Icone nom="telephone" taille={72} couleur="#1a0f07" /></div>
        <div style={{ fontFamily: LATIN, fontSize: 78, color: '#1a0f07', direction: 'ltr', letterSpacing: 1 }}>{s.fin.telephone}</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1085, textAlign: 'center', fontFamily: LATIN, fontSize: 34, letterSpacing: 2, color: s.couleurs.creme,
        opacity: lisse(x, p1 + 10, p1 + 24, 0, 0.85) }}>{s.fin.site}</div>
      <div style={{ position: 'absolute', left: 60, right: 60, top: 1410, textAlign: 'center', direction: s.rtl ? 'rtl' : 'ltr', fontFamily: s.police, fontSize: 66, lineHeight: 1.4,
        color: s.couleurs.or, opacity: lisse(x, finVoix - 4, finVoix + 8, 0, 1) }}>{s.fin.appel}</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1650, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: lisse(x, finVoix + 4, finVoix + 18, 0, 0.8) }}>
        <Pouls largeur={130} trace={lisse(x, finVoix + 4, finVoix + 24, 0, 1)} />
        <div style={{ fontFamily: LATIN, fontStyle: 'italic', fontSize: 30, color: s.couleurs.creme }}>{s.signature}</div>
      </div>
      <Son src="ding" de={p1 - 4 + o} volume={0.45} />
    </>
  );
};

// Filigrane : le texte répété en diagonale sur toute l'image, très transparent
const Filigrane: React.FC<{ texte: string }> = ({ texte }) => (
  <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', left: -700, top: -600, width: 2500, height: 3100, transform: 'rotate(-28deg)', display: 'flex', flexDirection: 'column', gap: 120 }}>
      {Array.from({ length: 16 }, (_, r) => (
        <div key={r} style={{ display: 'flex', gap: 170, marginLeft: (r % 2) * 260, whiteSpace: 'nowrap' }}>
          {Array.from({ length: 7 }, (_, c) => (
            <span key={c} style={{ fontFamily: LATIN, fontStyle: 'italic', fontSize: 40, color: '#fff', opacity: 0.11, letterSpacing: 2 }}>{texte}</span>
          ))}
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

const SCENES = [SceneAccroche, SceneRituel, SceneResultat, SceneConfiance, SceneAvis, SceneInfos, SceneFin];

// Chaque scène commence T frames avant son début « officiel » pour que sa photo s'ouvre par-dessus la précédente
const Plan: React.FC<{ s: Spa; i: number }> = ({ s, i }) => {
  const f = useCurrentFrame();
  const sc = s.m.scenes[i];
  const o = i === 0 ? 0 : T;
  const x = f - o;
  const derniere = i === s.m.scenes.length - 1;
  const visible = derniere ? 1 : interpolate(x, [sc.duree - T, sc.duree], [1, 0], clamp);
  const C = SCENES[i];
  return (
    <AbsoluteFill>
      <C s={s} sc={sc} i={i} o={o} />
      <AbsoluteFill style={{ opacity: visible }}>
        <Entete s={s} texte={s.titres[i]} x={x} visible={1} />
        {!derniere && <Illustration s={s} visible={lisse(x, 0, 10, 0, 1)} />}
      </AbsoluteFill>
      <Phrases s={s} textes={s.phrases[i]} phrases={sc.phrases} x={x} />
      {i > 0 && <Son src="whoosh" de={0} volume={0.3} />}
    </AbsoluteFill>
  );
};

export const SpaPub: React.FC<{ s: Spa }> = ({ s }) => {
  const total = s.m.duree;
  return (
    <AbsoluteFill style={{ background: s.couleurs.fond }}>
      <Fond s={s} />
      {s.m.scenes.map((sc, i) => (
        <Sequence key={i} from={sc.de - (i === 0 ? 0 : T)} durationInFrames={sc.duree + (i === 0 ? 0 : T)}>
          <Plan s={s} i={i} />
        </Sequence>
      ))}
      <Sequence from={6}><Audio src={staticFile(s.m.voix)} /></Sequence>
      <Audio src={staticFile(s.musique)} volume={(f) => interpolate(f, [0, 15, total - 30, total], [0, 0.2, 0.2, 0], clamp)} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center', fontFamily: 'Cairo', fontWeight: 900, fontSize: 22, letterSpacing: 6,
        color: s.couleurs.creme, opacity: 0.35 }}>PULSE DIGITAL · @pulsedigit</div>
      {s.filigrane && <Filigrane texte={s.filigrane} />}
    </AbsoluteFill>
  );
};
