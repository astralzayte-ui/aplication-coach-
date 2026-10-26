import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { Config } from './config';
import { pop } from './ui';

// Écran de conversation WhatsApp (mode sombre, la nuit).
// Les moments d'apparition sont en frames locales ; une valeur négative = déjà affiché.
export type Temps = { question: number; ecrit?: [number, number]; reponse?: number; choix?: number; confirmation?: number; perdue?: number };

const Coches: React.FC<{ lu: boolean }> = ({ lu }) => (
  <svg width="22" height="14" viewBox="0 0 22 14" style={{ marginInlineStart: 6 }}>
    <path d="M1 7l4 4 8-9" fill="none" stroke={lu ? '#53bdeb' : '#8696a0'} strokeWidth="2" />
    <path d="M8 11l1 1 8-10" fill="none" stroke={lu ? '#53bdeb' : '#8696a0'} strokeWidth="2" />
  </svg>
);

const Bulle: React.FC<{ texte: string; moi: boolean; de: number; police: string; heure: string; lu?: boolean; ia?: boolean }> = ({ texte, moi, de, police, heure, lu, ia }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < de) return null;
  const p = de < 0 ? 1 : pop(f, de, fps, 13);
  return (
    <div style={{ display: 'flex', justifyContent: moi ? 'flex-end' : 'flex-start', marginBottom: 14, opacity: p,
      transform: `translateY(${(1 - p) * 24}px) scale(${0.8 + 0.2 * p})`, transformOrigin: moi ? 'right bottom' : 'left bottom' }}>
      <div style={{ maxWidth: '86%', background: moi ? '#005c4b' : '#202c33', color: '#e9edef', borderRadius: 18,
        borderTopRightRadius: moi ? 4 : 18, borderTopLeftRadius: moi ? 18 : 4, padding: '10px 16px 6px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
        {ia && <div style={{ fontFamily: police, fontSize: 21, fontWeight: 700, color: '#f2cf7a', direction: 'rtl' }}>Sahir IA</div>}
        <div style={{ direction: 'rtl', fontFamily: police, fontWeight: 700, fontSize: 33, lineHeight: 1.4 }}>{texte}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', fontFamily: 'Inter', fontSize: 18, color: '#8696a0', marginTop: 2 }}>
          {heure}{moi && <Coches lu={!!lu} />}
        </div>
      </div>
    </div>
  );
};

const Ecrit: React.FC<{ de: number; a: number; police: string; label: string }> = ({ de, a, police, label }) => {
  const f = useCurrentFrame();
  if (f < de || f >= a) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginBottom: 14 }}>
      <div style={{ fontFamily: police, fontSize: 22, fontWeight: 700, color: '#f2cf7a', marginBottom: 4, direction: 'rtl' }}>{label}</div>
      <div style={{ background: '#005c4b', borderRadius: 18, borderTopRightRadius: 4, padding: '16px 20px', display: 'flex', gap: 8 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: '#e9edef', opacity: 0.4 + 0.6 * Math.abs(Math.sin((f - de) / 5 - i * 0.7)),
            transform: `translateY(${-5 * Math.abs(Math.sin((f - de) / 5 - i * 0.7))}px)` }} />
        ))}
      </div>
    </div>
  );
};

export const Chat: React.FC<{ cfg: Config; t: Temps }> = ({ cfg, t }) => {
  const f = useCurrentFrame();
  const c = cfg.chat;
  const P = cfg.police;
  const perdue = t.perdue !== undefined && f >= t.perdue;
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0b141a' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.06,
        backgroundImage: 'radial-gradient(#fff 1.4px, transparent 1.4px)', backgroundSize: '26px 26px' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 150, background: '#1f2c34' }}>
        <div style={{ position: 'absolute', left: 34, top: 20, fontFamily: 'Inter', fontWeight: 600, fontSize: 24, color: '#fff' }}>{cfg.heure}</div>
        <div style={{ position: 'absolute', right: 26, top: 74, display: 'flex', alignItems: 'center', gap: 14, direction: 'rtl' }}>
          <div style={{ width: 62, height: 62, borderRadius: 31, background: 'linear-gradient(135deg,#ff8ec7,#b35cff)' }} />
          <div>
            <div style={{ fontFamily: P, fontWeight: 900, fontSize: 30, color: '#e9edef' }}>{c.contact}</div>
            <div style={{ fontFamily: P, fontWeight: 700, fontSize: 21, color: '#8696a0' }}>{c.enLigne}</div>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 18, right: 18, top: 176 }}>
        <div style={{ opacity: perdue ? 0.35 : 1 }}>
          <Bulle texte={c.question} moi={false} de={t.question} police={P} heure={cfg.heure} />
        </div>
        {t.ecrit && <Ecrit de={t.ecrit[0]} a={t.ecrit[1]} police={P} label={c.ecrit} />}
        {t.reponse !== undefined && <Bulle texte={c.reponse} moi de={t.reponse} police={P} heure={cfg.heure} lu ia />}
        {t.choix !== undefined && <Bulle texte={c.choix} moi={false} de={t.choix} police={P} heure={cfg.heure} />}
        {t.confirmation !== undefined && <Bulle texte={c.confirmation} moi de={t.confirmation} police={P} heure={cfg.heure} lu ia />}
      </div>
    </div>
  );
};
