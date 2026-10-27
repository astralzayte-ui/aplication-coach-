import React from 'react';
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import type { Config, TypeScene } from './config';
import { Chat, ChatVocal } from './Chat';
import {
  Fond, IconeCoche, IconeCroix, IconeHorloge, IconeInstagram, IconeMessage, IconeOeil, IconeWhatsApp, Lune, OR, SousTitres, Telephone, Titre, VERT, lisse, pop,
} from './ui';

// Polices (chargées avant le rendu)
const attente = delayRender('polices');
Promise.all(
  [
    ['cairo-arabic-700-normal.woff2', '700', 'U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF'],
    ['cairo-arabic-900-normal.woff2', '900', 'U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF'],
    ['cairo-latin-700-normal.woff2', '700', 'U+0000-00FF, U+0152-0153, U+2000-206F'],
    ['cairo-latin-900-normal.woff2', '900', 'U+0000-00FF, U+0152-0153, U+2000-206F'],
  ].map(([fichier, poids, plage]) => {
    const ff = new FontFace('Cairo', `url(${staticFile('fonts/' + fichier)})`, { weight: poids, unicodeRange: plage });
    return ff.load().then((x) => document.fonts.add(x));
  })
).then(() => continueRender(attente));

export const dureeTotale = (cfg: Config) => cfg.durees.reduce((a, b) => a + b, 0);

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// Bruitage joué à la frame `de` (frames locales)
const Son: React.FC<{ src: 'pop' | 'ding' | 'whoosh'; de: number; volume?: number }> = ({ src, de, volume = 0.5 }) => (
  <Sequence from={Math.max(0, Math.round(de))} durationInFrames={30} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

// Entrée en zoom avec flou, léger travelling avant, sortie rapide
const Transition: React.FC<{ duree: number; premiere: boolean; children: React.ReactNode }> = ({ duree, premiere, children }) => {
  const f = useCurrentFrame();
  const entree = premiere ? 1 : lisse(f, 0, 9, 0, 1);
  const sortie = interpolate(f, [duree - 6, duree], [0, 1], clamp);
  const echelle = 1.22 - 0.22 * entree + 0.04 * (f / duree) + 0.08 * sortie;
  return (
    <AbsoluteFill style={{ opacity: Math.min(entree * 1.6, 1 - sortie), transform: `scale(${echelle})`, filter: entree < 1 || sortie > 0 ? `blur(${(1 - entree) * 16 + sortie * 10}px)` : 'none' }}>
      {children}
    </AbsoluteFill>
  );
};

type Props = { cfg: Config; duree: number; st: number[] };

// ---------- Scène 1 : 23h, une cliente écrit, personne ne répond ----------
const Scene1: React.FC<Props> = ({ cfg, duree, st }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dir = cfg.rtl ? 'rtl' : 'ltr';
  const a = st[st.length - 2]; // « personne ne répond »
  const b = st[st.length - 1]; // « elle réserve ailleurs »
  const heure = pop(f, -8, fps, 10); // déjà presque en place dès la 1re image (l'accroche)
  const entree = pop(f, -6, fps, 13);
  const vibre = f >= 10 && f < 24 ? Math.sin((f - 10) * 2.2) * (24 - f) * 0.35 : 0;
  const perdue = pop(f, b, fps, 9);
  const gris = lisse(f, b, b + 12, 0, 1);
  return (
    <AbsoluteFill>
      <Son src="ding" de={10} volume={0.4} />
      <Son src="pop" de={a} volume={0.35} />
      <Son src="pop" de={b} volume={0.55} />
      <div style={{ position: 'absolute', top: 110, width: '100%', textAlign: 'center', fontFamily: 'Inter', fontWeight: 800, fontSize: 160, color: OR,
        letterSpacing: 6, textShadow: '0 0 50px rgba(242,207,122,0.6)', opacity: Math.min(1, heure * 2), transform: `scale(${2.2 - 1.2 * heure + 0.03 * Math.sin(f / 8)})` }}>
        {cfg.heure}
      </div>
      {cfg.scene1.accroche && f < b && (
        <div style={{ position: 'absolute', top: 300, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ fontFamily: cfg.police, fontWeight: 900, fontSize: 58, color: '#fff', background: '#e5383b', borderRadius: 40, padding: '6px 36px',
            direction: dir, boxShadow: '0 15px 40px rgba(229,56,59,0.5)', transform: `scale(${pop(f, 6, fps, 9)})` }}>{cfg.scene1.accroche}</div>
        </div>
      )}
      <AbsoluteFill style={{ filter: `grayscale(${gris}) brightness(${1 - 0.25 * gris})` }}>
        <Telephone y={(1 - entree) * 900 + 70 + Math.sin(f / 18) * 10} s={1 + 0.06 * lisse(f, 10, 40, 0, 1)} rx={8} ry={lisse(f, 0, duree, -32, -10)} rz={-2 + vibre}>
          <Chat cfg={cfg} t={{ question: 10, perdue: b }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', opacity: lisse(f, a, a + 20, 0, 1) }} />
        </Telephone>
      </AbsoluteFill>
      {f >= a && (
        <div style={{ position: 'absolute', top: 1270, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, direction: dir, fontFamily: cfg.police, fontWeight: 900, fontSize: 48, color: '#fff',
            background: 'rgba(30,30,50,0.9)', border: '2px solid rgba(255,255,255,0.25)', borderRadius: 40, padding: '8px 34px',
            transform: `scale(${pop(f, a, fps, 10)})` }}>
            <IconeHorloge taille={48} couleur="#aaa" angle={(f - a) * 18} />{cfg.scene1.sansReponse}
          </div>
        </div>
      )}
      {f >= b && (
        <div style={{ position: 'absolute', top: 370, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, direction: dir, background: '#e5383b', color: '#fff', fontFamily: cfg.police,
            fontWeight: 900, fontSize: 54, borderRadius: 50, padding: '14px 40px', boxShadow: '0 20px 50px rgba(229,56,59,0.6)',
            transform: `scale(${perdue}) rotate(${(1 - perdue) * -14 + Math.sin(f / 3) * (f < b + 14 ? 2 : 0)}deg)` }}>
            <IconeCroix taille={50} />{cfg.scene1.perdue}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- Scène 2 : l'IA répond en 5 s, WhatsApp + Instagram, temps gagné ----------
const Scene2: React.FC<Props> = ({ cfg, st }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dir = cfg.rtl ? 'rtl' : 'ltr';
  const t = { question: -100, ecrit: [6, 22] as [number, number], reponse: 22, choix: 44, confirmation: 64 };
  const k = st[Math.min(2, st.length - 1)]; // moment où le téléphone glisse et où les icônes arrivent
  const avecIg = cfg.ia?.instagram ?? true;
  const avecCompteur = (cfg.ia?.compteur ?? true) && st.length > 3;
  const c = avecCompteur ? st[3] : 99999;
  const glisse = lisse(f, k - 4, k + 18, 0, 1);
  const secondes = interpolate(f, [6, 22], [0, 5], clamp);
  const fini = pop(f, 22, fps, 8);
  const iconeWa = pop(f, k, fps, 9);
  const iconeIg = pop(f, k + 8, fps, 9);
  const compteur = pop(f, c, fps, 10);
  const minutes = Math.round(interpolate(f, [c + 4, c + 40], [0, 120], clamp));
  const hh = `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
  return (
    <AbsoluteFill>
      <Son src="pop" de={t.reponse} />
      <Son src="pop" de={t.choix} volume={0.4} />
      <Son src="ding" de={t.confirmation} volume={0.35} />
      <Son src="pop" de={k} />
      {avecIg && <Son src="pop" de={k + 8} />}
      {avecCompteur && <Son src="whoosh" de={c - 4} volume={0.3} />}
      {f < k + 6 && (
        <div style={{ position: 'absolute', top: 140, width: '100%', display: 'flex', justifyContent: 'center', opacity: 1 - glisse,
          transform: `scale(${pop(f, 2, fps, 10) * (1 + 0.12 * fini * Math.max(0, 1 - (f - 22) / 12))})` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(37,211,102,0.18)', border: `3px solid ${VERT}`, borderRadius: 60,
            padding: '12px 38px', direction: dir, boxShadow: `0 0 ${30 * fini}px rgba(37,211,102,0.6)` }}>
            <IconeHorloge taille={62} couleur={VERT} angle={secondes * 72} />
            <span style={{ fontFamily: cfg.police, fontWeight: 900, fontSize: 58, color: '#fff' }}>{cfg.scene2.chrono}</span>
            <span style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 68, color: VERT, direction: 'ltr' }}>{secondes.toFixed(1)} s</span>
          </div>
        </div>
      )}
      <Telephone x={-190 * glisse} y={60 - 20 * glisse + Math.sin(f / 18) * 10} s={1.04 - 0.24 * glisse} rx={6} ry={lisse(f, 0, 30, -20, 0) + 20 * glisse} rz={-2 + 2 * glisse}>
        <Chat cfg={cfg} t={t} />
      </Telephone>
      <div style={{ position: 'absolute', left: 640, top: 500, perspective: 1200 }}>
        <div style={{ transform: `scale(${iconeWa}) rotateY(${(1 - iconeWa) * 180 + Math.sin(f / 14) * 25}deg) translateY(${Math.sin(f / 11) * 14}px)`,
          filter: 'drop-shadow(0 20px 40px rgba(37,211,102,0.55))' }}><IconeWhatsApp taille={230} /></div>
      </div>
      {avecIg && <div style={{ position: 'absolute', left: 760, top: 810, perspective: 1200 }}>
        <div style={{ transform: `scale(${iconeIg}) rotateY(${(1 - iconeIg) * -180 + Math.cos(f / 14) * 25}deg) translateY(${Math.cos(f / 11) * 14}px)`,
          filter: 'drop-shadow(0 20px 40px rgba(214,41,118,0.55))' }}><IconeInstagram taille={200} /></div>
      </div>}
      {f >= k && (
        <div style={{ position: 'absolute', left: 650, top: avecIg ? 1075 : 800, fontFamily: 'Inter', fontWeight: 900, fontSize: 92, color: '#fff', opacity: avecIg ? iconeIg : iconeWa,
          transform: `scale(${avecIg ? iconeIg : iconeWa})`, textShadow: '0 0 30px rgba(255,255,255,0.35)' }}>{cfg.scene2.canaux}</div>
      )}
      {f >= c && (
        <div style={{ position: 'absolute', left: 540, right: 10, top: 1230, display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, background: 'linear-gradient(135deg,#2a2150,#3b1f4f)', border: `3px solid ${OR}`,
            borderRadius: 40, padding: '16px 24px', transform: `scale(${compteur * (minutes === 120 ? 1 + 0.04 * Math.sin(f / 4) : 1)})`,
            boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 ${minutes === 120 ? 40 : 0}px rgba(242,207,122,0.5)`, direction: dir }}>
            <IconeHorloge taille={86} couleur={OR} angle={minutes * 6} />
            <div>
              <div style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 96, color: OR, lineHeight: 1, direction: 'ltr' }}>+{hh}</div>
              <div style={{ fontFamily: cfg.police, fontWeight: 700, fontSize: 31, color: '#fff' }}>{cfg.scene2.tempsLegende}</div>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- Scène 3 : l'IA comprend les vocaux, et on installe tout à distance ----------
const SceneVocal: React.FC<Props> = ({ cfg, st }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dir = cfg.rtl ? 'rtl' : 'ltr';
  const v = cfg.vocal;
  const t = { vocal: 4, lecture: [8, 30] as [number, number], ecrit: [32, 44] as [number, number], reponse: 44 };
  const glisse = lisse(f, st[2] - 4, st[2] + 16, 0, 1);
  const carte = pop(f, st[2] + 2, fps, 11);
  const bulles = [{ left: 36, top: 400 }, { left: 800, top: 760 }, { left: 36, top: 1150 }];
  return (
    <AbsoluteFill>
      <Son src="ding" de={t.vocal} volume={0.4} />
      <Son src="pop" de={t.reponse} />
      {v.langues.map((_, i) => <Son key={i} src="pop" de={st[1] + i * 5} volume={0.35} />)}
      <Son src="whoosh" de={st[2] - 4} volume={0.3} />
      {v.etapes.map((_, i) => <Son key={`e${i}`} src="pop" de={st[2] + 10 + i * 7} volume={0.4} />)}
      <div style={{ opacity: 1 - glisse }}><Titre texte={v.titre} police={cfg.police} rtl={cfg.rtl} y={140} /></div>
      <Telephone x={-200 * glisse} y={60 - 20 * glisse + Math.sin(f / 18) * 10} s={1.02 - 0.24 * glisse} rx={6} ry={lisse(f, 0, 30, 20, 0) + 20 * glisse} rz={1 - glisse}>
        <ChatVocal cfg={cfg} t={t} />
      </Telephone>
      {f >= st[1] && v.langues.map((l, i) => {
        const q = pop(f, st[1] + i * 5, fps, 9);
        return (
          <div key={i} style={{ position: 'absolute', ...bulles[i], opacity: q * (1 - glisse), transform: `scale(${q}) translateY(${Math.sin(f / 10 + i * 2) * 8}px)`,
            fontFamily: cfg.police, fontWeight: 900, fontSize: 44, color: '#1a1030', background: OR, borderRadius: 40, padding: '8px 30px',
            boxShadow: '0 15px 40px rgba(242,207,122,0.45)' }}>{l}</div>
        );
      })}
      {f >= st[2] && (
        <div style={{ position: 'absolute', left: 560, width: 480, top: 600, perspective: 1400 }}>
          <div style={{ background: 'linear-gradient(145deg,#2a2150,#3b1f4f)', border: `3px solid ${OR}`, borderRadius: 40, padding: '30px 30px 20px',
            boxShadow: '0 30px 70px rgba(0,0,0,0.55)', transform: `rotateY(${(1 - carte) * (cfg.rtl ? 70 : -70) + Math.sin(f / 20) * 5}deg) scale(${0.6 + 0.4 * carte})`,
            opacity: Math.min(1, carte * 1.5), direction: dir }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
              <svg width="64" height="64" viewBox="0 0 24 24">
                {[0, 1, 2].map((k) => (
                  <path key={k} d={['M12 18.5h.01', 'M8.5 15a5 5 0 0 1 7 0', 'M5 11.5a10 10 0 0 1 14 0'][k]} fill="none" stroke={OR} strokeWidth="2.4" strokeLinecap="round"
                    opacity={0.35 + 0.65 * Math.max(0, Math.sin(f / 5 - k))} />
                ))}
                <path d="M1.5 8a15 15 0 0 1 21 0" fill="none" stroke={OR} strokeWidth="2.4" strokeLinecap="round" opacity={0.35 + 0.65 * Math.max(0, Math.sin(f / 5 - 3))} />
              </svg>
              <div style={{ fontFamily: cfg.police, fontWeight: 900, fontSize: 44, color: OR, lineHeight: 1.15 }}>{v.distance}</div>
            </div>
            {v.etapes.map((e, i) => {
              const de = st[2] + 10 + i * 7;
              const q = pop(f, de, fps, 10);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '12px 0', opacity: q, transform: `translateX(${(1 - q) * (cfg.rtl ? 40 : -40)}px)` }}>
                  <div style={{ width: 50, height: 50, borderRadius: 25, background: VERT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IconeCoche taille={36} trace={interpolate(f, [de + 2, de + 12], [0, 1], clamp)} />
                  </div>
                  <span style={{ fontFamily: cfg.police, fontWeight: 900, fontSize: 38, color: '#fff' }}>{e}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- Scène 4 : vidéos virales dans 3 téléphones en carrousel 3D ----------
const Scene3: React.FC<Props> = ({ cfg, duree, st }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tourne = Math.sin(f / 22) * 9;
  const zoom = 1 + 0.08 * lisse(f, st[1], st[1] + 30, 0, 1);
  const places = [
    { x: -345, ry: 32, s: 0.62, z: 0, de: -500 },
    { x: 0, ry: 0, s: 0.78, z: 2, de: 0 },
    { x: 345, ry: -32, s: 0.62, z: 1, de: 500 },
  ];
  return (
    <AbsoluteFill>
      {[0, 1, 2].map((i) => <Son key={i} src="pop" de={2 + i * 5} volume={0.4} />)}
      <Titre texte={cfg.scene3.titre} police={cfg.police} rtl={cfg.rtl} y={140} />
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {cfg.scene3.videos.map((v, i) => {
          const pl = places[i];
          const p = pop(f, 2 + i * 5, fps, 12);
          const vues = parseFloat(v.vues);
          const suffixe = v.vues.replace(/[0-9.]/g, '');
          const n = interpolate(f, [10 + i * 5, 50 + i * 5], [0, vues], clamp);
          const battement = f >= st[1] && f < st[1] + 16 ? 1 + 0.15 * Math.sin(((f - st[1]) / 16) * Math.PI) : 1;
          return (
            <div key={i} style={{ position: 'absolute', inset: 0, zIndex: pl.z }}>
              <Telephone x={pl.x + (1 - p) * pl.de} y={(1 - p) * 700 + 40 + Math.sin(f / 14 + i) * 10} s={pl.s} ry={pl.ry + tourne + (1 - p) * 90} rx={4} rz={(1 - p) * (i - 1) * 25}>
                <OffthreadVideo src={staticFile(v.fichier)} startFrom={v.debut} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Telephone>
              <div style={{ position: 'absolute', left: 540 + pl.x - 160, width: 320, top: 1420 + (1 - p) * 300, display: 'flex', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: i === 1 ? OR : 'rgba(255,255,255,0.14)', borderRadius: 40, padding: '8px 22px',
                  transform: `scale(${battement})` }}>
                  <IconeOeil taille={40} couleur={i === 1 ? '#1a1030' : '#fff'} />
                  <span style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: i === 1 ? 54 : 42, color: i === 1 ? '#1a1030' : '#fff' }}>
                    {suffixe === 'M' ? n.toFixed(1) : Math.round(n)}{suffixe}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Scène 5 : le site, on défile, on clique sur « Réserver », réservation confirmée ----------
const Scene4: React.FC<Props> = ({ cfg, duree, st }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dir = cfg.rtl ? 'rtl' : 'ltr';
  const largeur = 468; // largeur de l'écran du téléphone
  const k = largeur / 780;
  const T = Math.max(50, st[2] - 4); // moment du clic sur « Réserver »
  const defile = lisse(f, 6, T - 24, 0, -1900) + lisse(f, T - 20, T - 6, 0, 1900);
  const tap = interpolate(f, [T, T + 14], [0, 1], clamp);
  const feuille = pop(f, T + 10, fps, 12);
  const coche = interpolate(f, [T + 18, T + 32], [0, 1], clamp);
  const by = cfg.scene4.boutonY * k;
  return (
    <AbsoluteFill>
      <Son src="whoosh" de={6} volume={0.25} />
      <Son src="pop" de={T} volume={0.6} />
      <Son src="ding" de={T + 12} volume={0.4} />
      <Titre texte={cfg.scene4.titre} police={cfg.police} rtl={cfg.rtl} y={130} />
      <Telephone y={85 + Math.sin(f / 18) * 10} s={1.12 - 0.12 * lisse(f, 0, 30, 0, 1) + 0.05 * lisse(f, T - 6, T + 8, 0, 1)} rx={5} ry={lisse(f, 0, duree, -20, 12)} rz={1}>
        <div style={{ position: 'absolute', inset: 0, background: '#fff' }}>
          <Img src={staticFile(cfg.scene4.site)} style={{ position: 'absolute', left: 0, top: 44, width: largeur, transform: `translateY(${defile}px)` }} />
        </div>
        {f >= T - 4 && f < T + 14 && (
          <div style={{ position: 'absolute', left: largeur / 2 - 45, top: 44 + by - 37, width: 90, height: 90, borderRadius: 45,
            border: '5px solid rgba(242,160,60,0.9)', background: 'rgba(242,160,60,0.25)', transform: `scale(${0.4 + tap * 1.3})`, opacity: 1 - tap * 0.7 }} />
        )}
        {f >= T + 10 && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 430, background: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40,
            boxShadow: '0 -20px 60px rgba(0,0,0,0.35)', transform: `translateY(${(1 - feuille) * 450}px)`, display: 'flex', flexDirection: 'column',
            alignItems: 'center', paddingTop: 50 }}>
            <div style={{ width: 130, height: 130, borderRadius: 65, background: VERT, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 15px 40px rgba(37,211,102,0.5)', transform: `scale(${pop(f, T + 16, fps, 8)})` }}>
              <IconeCoche taille={96} trace={coche} />
            </div>
            <div style={{ fontFamily: cfg.police, fontWeight: 900, fontSize: 40, color: '#1a1a2e', marginTop: 26, direction: dir }}>{cfg.scene4.confirme}</div>
            <div style={{ fontFamily: cfg.police, fontWeight: 700, fontSize: 32, color: '#666', marginTop: 4, direction: dir }}>{cfg.scene4.detail}</div>
          </div>
        )}
      </Telephone>
    </AbsoluteFill>
  );
};

// ---------- Scène 6 : logo, prix, « Répondez OUI » ----------
const Scene5: React.FC<Props> = ({ cfg, st }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dir = cfg.rtl ? 'rtl' : 'ltr';
  const logo = pop(f, 0, fps, 12);
  const carte = pop(f, 4, fps, 10);
  const prix = Math.round(interpolate(f, [6, 26], [0, Number(cfg.scene5.prix)], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) }));
  const reflet = interpolate(f, [26, 46], [-120, 220], clamp);
  const e = st.length >= 3 ? st[1] : 26; // « sans engagement » : dit, ou affiché sans être dit
  const ap = st.length >= 2 ? st[st.length - 1] : 24; // appel à l'action
  const engagement = pop(f, e, fps, 10);
  const cta = pop(f, ap, fps, 8);
  const pulse = f > ap + 12 ? 1 + 0.06 * Math.sin((f - ap - 12) / 4) : 1;
  const s = cfg.scene5;
  return (
    <AbsoluteFill>
      <Son src="pop" de={e} volume={0.45} />
      <Son src="ding" de={ap} volume={0.45} />
      <div style={{ position: 'absolute', top: 110, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: Math.min(1, logo * 1.5),
        transform: `scale(${0.6 + 0.4 * logo})` }}>
        <div style={{ position: 'relative', width: 140, height: 140 }}><Lune x={84} y={70} taille={110} /></div>
        <div style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 84, color: '#fff', letterSpacing: 10, marginTop: 10 }}>SAHIR DIGITAL</div>
        <div style={{ fontFamily: cfg.police, fontWeight: 700, fontSize: 40, color: OR, direction: dir, marginTop: 4 }}>{s.slogan}</div>
      </div>
      <div style={{ position: 'absolute', top: 620, width: '100%', display: 'flex', justifyContent: 'center', perspective: 1600 }}>
        <div style={{ position: 'relative', overflow: 'hidden', width: 760, borderRadius: 50, padding: '40px 0 46px', background: 'linear-gradient(145deg,#2b2156,#40205a 60%,#5a2a52)',
          border: `4px solid ${OR}`, boxShadow: '0 40px 90px rgba(0,0,0,0.55), 0 0 60px rgba(242,207,122,0.25)', textAlign: 'center',
          transform: `rotateY(${(1 - carte) * 90 + Math.sin(f / 22) * 7}deg) rotateX(${Math.cos(f / 26) * 5}deg)` }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${reflet}%`, width: '35%', transform: 'skewX(-20deg)',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)' }} />
          <div style={{ fontFamily: cfg.police, fontWeight: 700, fontSize: 44, color: '#ddd', direction: dir }}>{s.aPartir}</div>
          <div style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 220, color: OR, lineHeight: 1, textShadow: '0 0 40px rgba(242,207,122,0.5)' }}>{prix}</div>
          <div style={{ fontFamily: cfg.police, fontWeight: 900, fontSize: 56, color: '#fff', direction: dir }}>{s.prixLegende}</div>
        </div>
      </div>
      {f >= e && (
        <div style={{ position: 'absolute', top: 1140, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, direction: dir, background: 'rgba(255,255,255,0.12)', borderRadius: 40, padding: '10px 34px',
            transform: `scale(${engagement})` }}>
            <div style={{ width: 54, height: 54, borderRadius: 27, background: VERT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconeCoche taille={40} /></div>
            <span style={{ fontFamily: cfg.police, fontWeight: 900, fontSize: 54, color: '#fff' }}>{s.engagement}</span>
          </div>
        </div>
      )}
      {f >= ap && (
        <div style={{ position: 'absolute', top: 1320, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, direction: dir, background: VERT, borderRadius: 70, padding: '20px 50px',
            boxShadow: `0 0 ${40 + 25 * Math.sin(f / 4)}px rgba(37,211,102,0.8)`, transform: `scale(${cta * pulse})` }}>
            {s.ctaMessage ? <IconeMessage taille={74} /> : <IconeWhatsApp taille={84} />}
            <span style={{ fontFamily: cfg.police, fontWeight: 900, fontSize: 64, color: '#fff' }}>{s.cta}</span>
          </div>
          <div style={{ position: 'absolute', top: 150, width: '100%', textAlign: 'center', fontFamily: cfg.police, fontWeight: 700, fontSize: 42, color: '#fff',
            direction: dir, opacity: cta }}>{s.ctaDetail}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- Notifications qui s'empilent pendant que la gérante travaille ----------
const IconeCiseaux: React.FC<{ taille: number }> = ({ taille }) => (
  <svg width={taille} height={taille} viewBox="0 0 24 24" fill="none" stroke={OR} strokeWidth="2" strokeLinecap="round">
    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12" />
  </svg>
);

const SceneNotifs: React.FC<Props> = ({ cfg, duree, st }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dir = cfg.rtl ? 'rtl' : 'ltr';
  const n = cfg.notifs!;
  const fin = st[st.length - 1]; // « qui va répondre ? »
  const total = n.liste.length;
  // les 3 premières tombent tout de suite (l'accroche), les autres jusqu'à la dernière phrase
  const arrivees = n.liste.map((_, i) => Math.round(i < 3 ? -8 + i * 7 : 16 + (fin - 22) * ((i - 2) / (total - 2))));
  const recues = arrivees.filter((x) => f >= x).length;
  const derniere = arrivees[Math.max(0, recues - 1)];
  const vibre = recues > 0 && f - derniere < 8 ? Math.sin((f - derniere) * 2.5) * (8 - (f - derniere)) * 0.6 : 0;
  const question = pop(f, fin, fps, 9);
  const H = 116; // hauteur d'une notification + espace
  return (
    <AbsoluteFill>
      {arrivees.map((x, i) => <Son key={i} src={i % 3 === 0 ? 'ding' : 'pop'} de={x} volume={0.3} />)}
      <div style={{ position: 'absolute', top: 140, width: '100%', textAlign: 'center', fontFamily: cfg.police, fontWeight: 900, fontSize: 76, color: OR,
        direction: dir, textShadow: '0 0 30px rgba(242,207,122,0.45)', transform: `scale(${1.3 - 0.3 * pop(f, -3, fps, 10)})` }}>{n.accroche}</div>
      <div style={{ position: 'absolute', top: 290, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, direction: dir, background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(242,207,122,0.4)',
          borderRadius: 40, padding: '6px 28px', transform: `scale(${pop(f, 8, fps, 10)})` }}>
          <IconeCiseaux taille={44} />
          <span style={{ fontFamily: cfg.police, fontWeight: 900, fontSize: 42, color: '#fff' }}>{n.occupee}</span>
        </div>
      </div>
      <Telephone y={90 + Math.sin(f / 18) * 8} s={0.98} rx={6} ry={lisse(f, 0, duree, -16, 8)} rz={vibre}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#4a2470,#1b1035 60%,#0d0a1f)' }}>
          <div style={{ position: 'absolute', top: 70, width: '100%', textAlign: 'center', fontFamily: cfg.police, fontWeight: 700, fontSize: 26, color: '#e0d6f0', direction: dir }}>{n.date}</div>
          <div style={{ position: 'absolute', top: 100, width: '100%', textAlign: 'center', fontFamily: 'Inter', fontWeight: 700, fontSize: 118, color: '#fff' }}>{n.heureEcran}</div>
          {n.liste.map((x, i) => {
            if (f < arrivees[i]) return null;
            const p = pop(f, arrivees[i], fps, 12);
            // chaque nouvelle notification pousse les anciennes vers le bas
            const y = arrivees.slice(i + 1).reduce((acc, a) => acc + pop(f, a, fps, 14) * H, 0);
            return (
              <div key={i} style={{ position: 'absolute', left: 14, right: 14, top: 270, height: H - 12, borderRadius: 26, background: 'rgba(255,255,255,0.17)',
                display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px', direction: dir,
                opacity: p * interpolate(y, [4 * H, 5.5 * H], [1, 0], clamp) * (1 - 0.5 * lisse(f, fin, fin + 10, 0, 1)),
                transform: `translateY(${y + (1 - p) * -80}px) scale(${0.85 + 0.15 * p})` }}>
                {x.app === 'wa' ? <IconeWhatsApp taille={52} /> : <IconeInstagram taille={52} />}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: cfg.police, fontWeight: 900, fontSize: 25, color: '#fff' }}>{x.nom}</span>
                    <span style={{ fontFamily: 'Inter', fontSize: 18, color: '#cfc6e0' }}>{cfg.rtl ? 'الآن' : 'maintenant'}</span>
                  </div>
                  <div style={{ fontFamily: cfg.police, fontWeight: 700, fontSize: 26, color: '#fff' }}>{x.texte}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Telephone>
      {recues > 0 && (
        <div style={{ position: 'absolute', left: 742, top: 520, width: 96, height: 96, borderRadius: 48, background: '#ff3b30', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 50, color: '#fff', boxShadow: '0 10px 30px rgba(255,59,48,0.6)',
          transform: `scale(${1 + 0.25 * Math.max(0, 1 - (f - derniere) / 8)})` }}>{recues}</div>
      )}
      {f >= fin && (
        <div style={{ position: 'absolute', right: 40, top: 760, fontFamily: 'Inter', fontWeight: 900, fontSize: 300, color: OR, lineHeight: 1,
          textShadow: '0 0 50px rgba(242,207,122,0.6)', transform: `scale(${question * (1 + 0.06 * Math.sin(f / 4))}) rotate(${(1 - question) * 30}deg)` }}>?</div>
      )}
    </AbsoluteFill>
  );
};

const SCENES: Record<TypeScene, React.FC<Props>> = { nuit: Scene1, ia: Scene2, vocal: SceneVocal, videos: Scene3, site: Scene4, prix: Scene5, notifs: SceneNotifs };

export const Pub: React.FC<{ cfg: Config }> = ({ cfg }) => {
  const { durationInFrames } = useVideoConfig();
  const f = useCurrentFrame();
  const debuts = cfg.durees.map((_, i) => cfg.durees.slice(0, i).reduce((a, b) => a + b, 0));
  // la lune du fond disparaît avant les scènes qui ont un titre ou un logo en haut
  const k = cfg.scenes.findIndex((t) => t === 'videos' || t === 'site' || t === 'prix');
  const finLune = k >= 0 ? debuts[k] : durationInFrames + 20;
  return (
    <AbsoluteFill style={{ backgroundColor: '#04071a' }}>
      <Fond lune={interpolate(f, [finLune - 10, finLune + 4], [1, 0], clamp)} />
      <Audio src={staticFile(cfg.musique)} volume={(x) => interpolate(x, [0, 10, durationInFrames - 30, durationInFrames], [0, 0.2, 0.2, 0], clamp)} />
      {cfg.durees.map((duree, i) => {
        const Comp = SCENES[cfg.scenes[i]];
        const st = cfg.sousTitres[i].map((s) => s.de);
        return (
          <Sequence key={i} from={debuts[i]} durationInFrames={duree}>
            <Transition duree={duree} premiere={i === 0}><Comp cfg={cfg} duree={duree} st={st} /></Transition>
            <SousTitres liste={cfg.sousTitres[i]} police={cfg.police} rtl={cfg.rtl} />
            <Sequence from={4} layout="none"><Audio src={staticFile(cfg.voix[i])} /></Sequence>
          </Sequence>
        );
      })}
      {debuts.slice(1).map((d, i) => <Sequence key={i} from={d - 6} durationInFrames={20} layout="none"><Audio src={staticFile('sfx/whoosh.wav')} volume={0.3} /></Sequence>)}
      {debuts.slice(1).map((d, i) => f >= d && f < d + 5 && (
        <AbsoluteFill key={i} style={{ background: '#fff', opacity: 0.22 * (1 - (f - d) / 5), pointerEvents: 'none' }} />
      ))}
    </AbsoluteFill>
  );
};
