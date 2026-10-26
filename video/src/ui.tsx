import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Sub } from './config';

export const OR = '#f2cf7a';
export const VERT = '#25d366';

export const pop = (f: number, de: number, fps: number, damping = 12) =>
  spring({ frame: f - de, fps, config: { damping, stiffness: 140, mass: 0.7 } });

// ---------- Fond : nuit étoilée + lune (Sahir = celui qui veille la nuit) ----------
export const Fond: React.FC<{ lune?: number }> = ({ lune = 1 }) => {
  const f = useCurrentFrame();
  const etoiles = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        x: random(`x${i}`) * 1080,
        y: random(`y${i}`) * 1920,
        t: 2 + random(`t${i}`) * 4,
        p: random(`p${i}`) * 6.28,
      })),
    []
  );
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg,#04071a 0%,#0c0a2c 50%,#1c0d31 100%)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 1100, height: 1100, borderRadius: '50%', left: -300 + Math.sin(f / 70) * 120, top: 200 + Math.cos(f / 90) * 140,
        background: 'radial-gradient(circle, rgba(140,80,255,0.30), transparent 62%)' }} />
      <div style={{ position: 'absolute', width: 1000, height: 1000, borderRadius: '50%', left: 400 + Math.cos(f / 80) * 140, top: 1000 + Math.sin(f / 60) * 120,
        background: 'radial-gradient(circle, rgba(242,207,122,0.20), transparent 62%)' }} />
      <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', left: 300 + Math.sin(f / 50) * 100, top: -350,
        background: 'radial-gradient(circle, rgba(255,95,170,0.16), transparent 60%)' }} />
      {etoiles.map((e, i) => (
        <div key={i} style={{ position: 'absolute', left: e.x, top: e.y, width: e.t, height: e.t, borderRadius: '50%', background: '#fff',
          opacity: 0.25 + 0.75 * Math.abs(Math.sin(f / 22 + e.p)) }} />
      ))}
      <div style={{ opacity: lune }}><Lune x={880} y={150} taille={120} /></div>
    </AbsoluteFill>
  );
};

export const Lune: React.FC<{ x: number; y: number; taille: number }> = ({ x, y, taille }) => (
  <div style={{ position: 'absolute', left: x - taille / 2, top: y - taille / 2, width: taille, height: taille, borderRadius: '50%',
    boxShadow: `${-taille * 0.22}px ${taille * 0.1}px 0 0 ${OR}`, filter: `drop-shadow(0 0 ${taille * 0.25}px rgba(242,207,122,0.7))` }} />
);

// ---------- Téléphone en 3D (épaisseur réelle grâce à des couches empilées en Z) ----------
const W = 500, H = 1050, R = 78;
export const Telephone: React.FC<{ x?: number; y?: number; s?: number; rx?: number; ry?: number; rz?: number; opacite?: number; children?: React.ReactNode }> = ({
  x = 0, y = 0, s = 1, rx = 0, ry = 0, rz = 0, opacite = 1, children,
}) => (
  <div style={{ position: 'absolute', left: 540 + x - W / 2, top: 960 + y - H / 2, width: W, height: H, perspective: 2400, opacity: opacite }}>
    <div style={{ position: 'absolute', left: 40, right: 40, bottom: -70, height: 60, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', filter: 'blur(26px)',
      transform: `scale(${s})` }} />
    <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `scale(${s}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} style={{ position: 'absolute', inset: 0, borderRadius: R, background: i === 11 ? '#0a0a10' : i % 2 ? '#2c2c38' : '#24242e',
          transform: `translateZ(${-(i + 1) * 2.2}px)` }} />
      ))}
      <div style={{ position: 'absolute', inset: 0, borderRadius: R, background: '#08080c', padding: 16,
        boxShadow: 'inset 0 0 0 3px #3b3b4a, 0 0 0 2px #5c5c72, 0 30px 80px rgba(0,0,0,0.5)' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: R - 16, overflow: 'hidden', background: '#000' }}>
          {children}
          <div style={{ position: 'absolute', top: 16, left: '50%', marginLeft: -72, width: 144, height: 40, borderRadius: 20, background: '#000' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0) 32%)', pointerEvents: 'none' }} />
        </div>
      </div>
    </div>
  </div>
);

// ---------- Sous-titres ----------
export const SousTitres: React.FC<{ liste: Sub[]; police: string; rtl: boolean }> = ({ liste, police, rtl }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = liste.find((x) => f >= x.de && f < x.a);
  if (!s) return null;
  const p = pop(f, s.de, fps, 14);
  return (
    <div style={{ position: 'absolute', left: 50, right: 50, top: 1590, display: 'flex', justifyContent: 'center' }}>
      <div style={{ direction: rtl ? 'rtl' : 'ltr', fontFamily: police, fontWeight: 900, fontSize: 62, lineHeight: 1.35, color: '#fff', textAlign: 'center',
        background: 'rgba(5,5,20,0.62)', border: '2px solid rgba(242,207,122,0.45)', borderRadius: 30, padding: '14px 34px',
        textShadow: '0 3px 10px rgba(0,0,0,0.6)', transform: `scale(${0.85 + 0.15 * p}) translateY(${(1 - p) * 30}px)`, opacity: p }}>
        {s.texte}
      </div>
    </div>
  );
};

export const Titre: React.FC<{ texte: string; police: string; rtl: boolean; de?: number; y?: number }> = ({ texte, police, rtl, de = 0, y = 150 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(f, de, fps, 15);
  return (
    <div style={{ position: 'absolute', left: 40, right: 40, top: y, textAlign: 'center', direction: rtl ? 'rtl' : 'ltr', fontFamily: police, fontWeight: 900,
      fontSize: 66, color: OR, textShadow: '0 0 30px rgba(242,207,122,0.45)', opacity: p, transform: `translateY(${(1 - p) * -40}px)` }}>
      {texte}
    </div>
  );
};

// ---------- Icônes ----------
export const IconeWhatsApp: React.FC<{ taille: number }> = ({ taille }) => (
  <svg width={taille} height={taille} viewBox="0 0 100 100">
    <rect width="100" height="100" rx="24" fill={VERT} />
    <path d="M50 20a29 29 0 0 0-25 44l-4 15 15-4A29 29 0 1 0 50 20z" fill="none" stroke="#fff" strokeWidth="5" />
    <path d="M39 37c1-2 3-2 4 0l3 6c0 2-2 3-2 4 2 4 5 7 9 9 1 0 2-2 4-2l6 3c2 1 2 3 0 4-3 3-7 4-11 2-8-4-14-10-17-18-1-4 0-6 4-8z" fill="#fff" />
  </svg>
);

export const IconeInstagram: React.FC<{ taille: number }> = ({ taille }) => (
  <svg width={taille} height={taille} viewBox="0 0 100 100">
    <defs>
      <linearGradient id="ig" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="#feda75" /><stop offset="0.35" stopColor="#fa7e1e" /><stop offset="0.65" stopColor="#d62976" /><stop offset="1" stopColor="#4f5bd5" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="24" fill="url(#ig)" />
    <rect x="22" y="22" width="56" height="56" rx="16" fill="none" stroke="#fff" strokeWidth="6" />
    <circle cx="50" cy="50" r="13" fill="none" stroke="#fff" strokeWidth="6" />
    <circle cx="67" cy="33" r="4" fill="#fff" />
  </svg>
);

export const IconeOeil: React.FC<{ taille: number; couleur?: string }> = ({ taille, couleur = '#fff' }) => (
  <svg width={taille} height={taille} viewBox="0 0 24 24"><path d="M12 5C6 5 2 12 2 12s4 7 10 7 10-7 10-7-4-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" fill={couleur} /></svg>
);

export const IconeCoche: React.FC<{ taille: number; couleur?: string; trace?: number }> = ({ taille, couleur = '#fff', trace = 1 }) => (
  <svg width={taille} height={taille} viewBox="0 0 24 24">
    <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={couleur} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray="22" strokeDashoffset={22 * (1 - trace)} />
  </svg>
);

export const IconeCroix: React.FC<{ taille: number; couleur?: string }> = ({ taille, couleur = '#fff' }) => (
  <svg width={taille} height={taille} viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke={couleur} strokeWidth="3.2" strokeLinecap="round" /></svg>
);

export const IconeHorloge: React.FC<{ taille: number; couleur?: string; angle?: number }> = ({ taille, couleur = '#fff', angle = 0 }) => (
  <svg width={taille} height={taille} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9.5" fill="none" stroke={couleur} strokeWidth="2.2" />
    <path d="M12 12V6.5" stroke={couleur} strokeWidth="2.2" strokeLinecap="round" transform={`rotate(${angle} 12 12)`} />
    <path d="M12 12l3.5 2" stroke={couleur} strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export const lisse = (f: number, a: number, b: number, de: number, vers: number) =>
  interpolate(f, [a, b], [de, vers], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) });
