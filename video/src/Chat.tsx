import React from 'react';
import { interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
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

const Bulle: React.FC<{ texte: string; moi: boolean; de: number; police: string; heure: string; dir: 'rtl' | 'ltr'; lu?: boolean; ia?: boolean }> = ({ texte, moi, de, police, heure, dir, lu, ia }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < de) return null;
  const p = de < 0 ? 1 : pop(f, de, fps, 13);
  return (
    <div style={{ display: 'flex', justifyContent: moi ? 'flex-end' : 'flex-start', marginBottom: 14, opacity: p,
      transform: `translateY(${(1 - p) * 24}px) scale(${0.8 + 0.2 * p})`, transformOrigin: moi ? 'right bottom' : 'left bottom' }}>
      <div style={{ maxWidth: '86%', background: moi ? '#005c4b' : '#202c33', color: '#e9edef', borderRadius: 18,
        borderTopRightRadius: moi ? 4 : 18, borderTopLeftRadius: moi ? 18 : 4, padding: '10px 16px 6px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
        {ia && <div style={{ fontFamily: police, fontSize: 21, fontWeight: 700, color: '#f2cf7a', direction: dir }}>Pulse IA</div>}
        <div style={{ direction: dir, fontFamily: police, fontWeight: 700, fontSize: 33, lineHeight: 1.4 }}>{texte}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', fontFamily: 'Inter', fontSize: 18, color: '#8696a0', marginTop: 2 }}>
          {heure}{moi && <Coches lu={!!lu} />}
        </div>
      </div>
    </div>
  );
};

const Ecrit: React.FC<{ de: number; a: number; police: string; label: string; dir: 'rtl' | 'ltr' }> = ({ de, a, police, label, dir }) => {
  const f = useCurrentFrame();
  if (f < de || f >= a) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginBottom: 14 }}>
      <div style={{ fontFamily: police, fontSize: 22, fontWeight: 700, color: '#f2cf7a', marginBottom: 4, direction: dir }}>{label}</div>
      <div style={{ background: '#005c4b', borderRadius: 18, borderTopRightRadius: 4, padding: '16px 20px', display: 'flex', gap: 8 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: '#e9edef', opacity: 0.4 + 0.6 * Math.abs(Math.sin((f - de) / 5 - i * 0.7)),
            transform: `translateY(${-5 * Math.abs(Math.sin((f - de) / 5 - i * 0.7))}px)` }} />
        ))}
      </div>
    </div>
  );
};

// Fond et en-tête de la conversation
const Ecran: React.FC<{ cfg: Config; children: React.ReactNode }> = ({ cfg, children }) => {
  const c = cfg.chat;
  const P = cfg.police;
  const dir = cfg.rtl ? 'rtl' : 'ltr';
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0b141a' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.06,
        backgroundImage: 'radial-gradient(#fff 1.4px, transparent 1.4px)', backgroundSize: '26px 26px' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 150, background: '#1f2c34' }}>
        <div style={{ position: 'absolute', left: 34, top: 20, fontFamily: 'Inter', fontWeight: 600, fontSize: 24, color: '#fff' }}>{cfg.heure}</div>
        <div style={{ position: 'absolute', [cfg.rtl ? 'right' : 'left']: 26, top: 74, display: 'flex', alignItems: 'center', gap: 14, direction: dir }}>
          <div style={{ width: 62, height: 62, borderRadius: 31, background: 'linear-gradient(135deg,#ff8ec7,#b35cff)' }} />
          <div>
            <div style={{ fontFamily: P, fontWeight: 900, fontSize: 30, color: '#e9edef' }}>{c.contact}</div>
            <div style={{ fontFamily: P, fontWeight: 700, fontSize: 21, color: '#8696a0' }}>{c.enLigne}</div>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 18, right: 18, top: 176 }}>{children}</div>
    </div>
  );
};

export const Chat: React.FC<{ cfg: Config; t: Temps }> = ({ cfg, t }) => {
  const f = useCurrentFrame();
  const c = cfg.chat;
  const P = cfg.police;
  const perdue = t.perdue !== undefined && f >= t.perdue;
  const dir = cfg.rtl ? 'rtl' : 'ltr';
  return (
    <Ecran cfg={cfg}>
      <div style={{ opacity: perdue ? 0.35 : 1 }}>
        <Bulle texte={c.question} moi={false} de={t.question} police={P} heure={cfg.heure} dir={dir} />
      </div>
      {t.ecrit && <Ecrit de={t.ecrit[0]} a={t.ecrit[1]} police={P} label={c.ecrit} dir={dir} />}
      {t.reponse !== undefined && <Bulle texte={c.reponse} moi de={t.reponse} police={P} heure={cfg.heure} dir={dir} lu ia />}
      {t.choix !== undefined && <Bulle texte={c.choix} moi={false} de={t.choix} police={P} heure={cfg.heure} dir={dir} />}
      {t.confirmation !== undefined && <Bulle texte={c.confirmation} moi de={t.confirmation} police={P} heure={cfg.heure} dir={dir} lu ia />}
    </Ecran>
  );
};

// Message vocal reçu : l'onde se lit, puis la transcription de l'IA apparaît dessous
const Vocal: React.FC<{ cfg: Config; de: number; lecture: [number, number] }> = ({ cfg, de, lecture }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < de) return null;
  const p = pop(f, de, fps, 13);
  const lu = interpolate(f, lecture, [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const texte = interpolate(f, [lecture[1], lecture[1] + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const barres = 26;
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 14, opacity: p,
      transform: `translateY(${(1 - p) * 24}px) scale(${0.8 + 0.2 * p})`, transformOrigin: 'left bottom' }}>
      <div style={{ width: '86%', background: '#202c33', borderRadius: 18, borderTopLeftRadius: 4, padding: '14px 16px 8px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="40" height="40" viewBox="0 0 24 24">
            {f >= lecture[0] && f < lecture[1]
              ? <path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="#8696a0" />
              : <path d="M7 4.5v15l12-7.5z" fill="#8696a0" />}
          </svg>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, height: 50 }}>
            {Array.from({ length: barres }, (_, i) => {
              const h = 10 + random(`onde${i}`) * 34;
              const joue = i / barres < lu;
              const vibre = joue && f < lecture[1] ? 1 + 0.25 * Math.sin(f / 2 + i) : 1;
              return <div key={i} style={{ width: 5, height: h * vibre, borderRadius: 3, background: joue ? '#53bdeb' : '#8696a0' }} />;
            })}
          </div>
          <div style={{ width: 52, height: 52, borderRadius: 26, background: 'linear-gradient(135deg,#ff8ec7,#b35cff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="26" height="26" viewBox="0 0 24 24"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-2.1a7 7 0 0 0 6-6.9z" fill="#fff" /></svg>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter', fontSize: 18, color: '#8696a0', marginTop: 4 }}>
          <span>{cfg.vocal.duree}</span><span>{cfg.heure}</span>
        </div>
        {texte > 0 && (
          <div style={{ direction: cfg.rtl ? 'rtl' : 'ltr', fontFamily: cfg.police, fontWeight: 700, fontStyle: 'italic', fontSize: 27, color: '#d1d7db',
            borderTop: '1px solid rgba(255,255,255,0.12)', marginTop: 8, paddingTop: 8, opacity: texte }}>{cfg.vocal.transcription}</div>
        )}
      </div>
    </div>
  );
};

export const ChatVocal: React.FC<{ cfg: Config; t: { vocal: number; lecture: [number, number]; ecrit: [number, number]; reponse: number } }> = ({ cfg, t }) => {
  const dir = cfg.rtl ? 'rtl' : 'ltr';
  return (
    <Ecran cfg={cfg}>
      <Vocal cfg={cfg} de={t.vocal} lecture={t.lecture} />
      <Ecrit de={t.ecrit[0]} a={t.ecrit[1]} police={cfg.police} label={cfg.chat.ecrit} dir={dir} />
      <Bulle texte={cfg.vocal.reponse} moi de={t.reponse} police={cfg.police} heure={cfg.heure} dir={dir} lu ia />
    </Ecran>
  );
};
