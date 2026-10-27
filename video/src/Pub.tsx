import React from 'react';
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import type { Config } from './config';
import { Chat } from './Chat';
import {
  Fond, IconeCoche, IconeCroix, IconeHorloge, IconeInstagram, IconeOeil, IconeWhatsApp, Lune, OR, SousTitres, Telephone, Titre, VERT, lisse, pop,
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
const Transition: React.FC<{ duree: number; children: React.ReactNode }> = ({ duree, children }) => {
  const f = useCurrentFrame();
  const entree = lisse(f, 0, 9, 0, 1);
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
  const heure = pop(f, 0, fps, 10);
  const entree = pop(f, 2, fps, 13);
  const vibre = f >= 10 && f < 24 ? Math.sin((f - 10) * 2.2) * (24 - f) * 0.35 : 0;
  const perdue = pop(f, st[3], fps, 9);
  const gris = lisse(f, st[3], st[3] + 12, 0, 1);
  return (
    <AbsoluteFill>
      <Son src="ding" de={10} volume={0.4} />
      <Son src="pop" de={st[2]} volume={0.35} />
      <Son src="pop" de={st[3]} volume={0.55} />
      <div style={{ position: 'absolute', top: 110, width: '100%', textAlign: 'center', fontFamily: 'Inter', fontWeight: 800, fontSize: 160, color: OR,
        letterSpacing: 6, textShadow: '0 0 50px rgba(242,207,122,0.6)', opacity: Math.min(1, heure * 2), transform: `scale(${2.2 - 1.2 * heure + 0.03 * Math.sin(f / 8)})` }}>
        {cfg.heure}
      </div>
      <AbsoluteFill style={{ filter: `grayscale(${gris}) brightness(${1 - 0.25 * gris})` }}>
        <Telephone y={(1 - entree) * 900 + 70 + Math.sin(f / 18) * 10} s={1 + 0.06 * lisse(f, 10, 40, 0, 1)} rx={8} ry={lisse(f, 0, duree, -32, -10)} rz={-2 + vibre}>
          <Chat cfg={cfg} t={{ question: 10, perdue: st[3] }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', opacity: lisse(f, st[2], st[2] + 20, 0, 1) }} />
        </Telephone>
      </AbsoluteFill>
      {f >= st[2] && (
        <div style={{ position: 'absolute', top: 1270, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, direction: dir, fontFamily: cfg.police, fontWeight: 900, fontSize: 48, color: '#fff',
            background: 'rgba(30,30,50,0.9)', border: '2px solid rgba(255,255,255,0.25)', borderRadius: 40, padding: '8px 34px',
            transform: `scale(${pop(f, st[2], fps, 10)})` }}>
            <IconeHorloge taille={48} couleur="#aaa" angle={(f - st[2]) * 18} />{cfg.scene1.sansReponse}
          </div>
        </div>
      )}
      {f >= st[3] && (
        <div style={{ position: 'absolute', top: 370, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, direction: dir, background: '#e5383b', color: '#fff', fontFamily: cfg.police,
            fontWeight: 900, fontSize: 54, borderRadius: 50, padding: '14px 40px', boxShadow: '0 20px 50px rgba(229,56,59,0.6)',
            transform: `scale(${perdue}) rotate(${(1 - perdue) * -14 + Math.sin(f / 3) * (f < st[3] + 14 ? 2 : 0)}deg)` }}>
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
  const glisse = lisse(f, st[2] - 4, st[2] + 18, 0, 1);
  const secondes = interpolate(f, [6, 22], [0, 5], clamp);
  const fini = pop(f, 22, fps, 8);
  const iconeWa = pop(f, st[2], fps, 9);
  const iconeIg = pop(f, st[2] + 8, fps, 9);
  const compteur = pop(f, st[3], fps, 10);
  const minutes = Math.round(interpolate(f, [st[3] + 4, st[3] + 40], [0, 120], clamp));
  const hh = `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
  return (
    <AbsoluteFill>
      <Son src="pop" de={t.reponse} />
      <Son src="pop" de={t.choix} volume={0.4} />
      <Son src="ding" de={t.confirmation} volume={0.35} />
      <Son src="pop" de={st[2]} />
      <Son src="pop" de={st[2] + 8} />
      <Son src="whoosh" de={st[3] - 4} volume={0.3} />
      {f < st[2] + 6 && (
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
      <div style={{ position: 'absolute', left: 760, top: 810, perspective: 1200 }}>
        <div style={{ transform: `scale(${iconeIg}) rotateY(${(1 - iconeIg) * -180 + Math.cos(f / 14) * 25}deg) translateY(${Math.cos(f / 11) * 14}px)`,
          filter: 'drop-shadow(0 20px 40px rgba(214,41,118,0.55))' }}><IconeInstagram taille={200} /></div>
      </div>
      {f >= st[2] && (
        <div style={{ position: 'absolute', left: 650, top: 1075, fontFamily: 'Inter', fontWeight: 900, fontSize: 92, color: '#fff', opacity: iconeIg,
          transform: `scale(${iconeIg})`, textShadow: '0 0 30px rgba(255,255,255,0.35)' }}>{cfg.scene2.canaux}</div>
      )}
      {f >= st[3] && (
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

// ---------- Scène 3 : vidéos virales dans 3 téléphones en carrousel 3D ----------
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

// ---------- Scène 4 : le site, on défile, on clique sur « Réserver », réservation confirmée ----------
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

// ---------- Scène 5 : logo, prix, « Répondez OUI » ----------
const Scene5: React.FC<Props> = ({ cfg, st }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dir = cfg.rtl ? 'rtl' : 'ltr';
  const logo = pop(f, 0, fps, 12);
  const carte = pop(f, 4, fps, 10);
  const prix = Math.round(interpolate(f, [6, 26], [0, Number(cfg.scene5.prix)], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) }));
  const reflet = interpolate(f, [26, 46], [-120, 220], clamp);
  const engagement = pop(f, st[1], fps, 10);
  const cta = pop(f, st[2], fps, 8);
  const pulse = f > st[2] + 12 ? 1 + 0.06 * Math.sin((f - st[2] - 12) / 4) : 1;
  const s = cfg.scene5;
  return (
    <AbsoluteFill>
      <Son src="pop" de={st[1]} volume={0.45} />
      <Son src="ding" de={st[2]} volume={0.45} />
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
      {f >= st[1] && (
        <div style={{ position: 'absolute', top: 1140, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, direction: dir, background: 'rgba(255,255,255,0.12)', borderRadius: 40, padding: '10px 34px',
            transform: `scale(${engagement})` }}>
            <div style={{ width: 54, height: 54, borderRadius: 27, background: VERT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconeCoche taille={40} /></div>
            <span style={{ fontFamily: cfg.police, fontWeight: 900, fontSize: 54, color: '#fff' }}>{s.engagement}</span>
          </div>
        </div>
      )}
      {f >= st[2] && (
        <div style={{ position: 'absolute', top: 1320, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, direction: dir, background: VERT, borderRadius: 70, padding: '20px 50px',
            boxShadow: `0 0 ${40 + 25 * Math.sin(f / 4)}px rgba(37,211,102,0.8)`, transform: `scale(${cta * pulse})` }}>
            <IconeWhatsApp taille={84} />
            <span style={{ fontFamily: cfg.police, fontWeight: 900, fontSize: 64, color: '#fff' }}>{s.cta}</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const SCENE_COMPOSANTS = [Scene1, Scene2, Scene3, Scene4, Scene5];

export const Pub: React.FC<{ cfg: Config }> = ({ cfg }) => {
  const { durationInFrames } = useVideoConfig();
  const f = useCurrentFrame();
  const debuts = cfg.durees.map((_, i) => cfg.durees.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <AbsoluteFill style={{ backgroundColor: '#04071a' }}>
      <Fond lune={interpolate(f, [debuts[2] - 10, debuts[2] + 4], [1, 0], clamp)} />
      <Audio src={staticFile(cfg.musique)} volume={(x) => interpolate(x, [0, 10, durationInFrames - 30, durationInFrames], [0, 0.2, 0.2, 0], clamp)} />
      {cfg.durees.map((duree, i) => {
        const Comp = SCENE_COMPOSANTS[i];
        const st = cfg.sousTitres[i].map((s) => s.de);
        return (
          <Sequence key={i} from={debuts[i]} durationInFrames={duree}>
            <Transition duree={duree}><Comp cfg={cfg} duree={duree} st={st} /></Transition>
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
