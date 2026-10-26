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
    ['cairo-latin-700-normal.woff2', '700', 'U+0000-00FF, U+2000-206F'],
    ['cairo-latin-900-normal.woff2', '900', 'U+0000-00FF, U+2000-206F'],
  ].map(([fichier, poids, plage]) => {
    const ff = new FontFace('Cairo', `url(${staticFile('fonts/' + fichier)})`, { weight: poids, unicodeRange: plage });
    return ff.load().then((x) => document.fonts.add(x));
  })
).then(() => continueRender(attente));

// Découpage : début et durée de chaque scène (frames, 30 i/s)
const SCENES = [
  { de: 0, duree: 262 },
  { de: 262, duree: 342 },
  { de: 604, duree: 236 },
  { de: 840, duree: 200 },
  { de: 1040, duree: 250 },
];
export const DUREE = 1290;

const Fondu: React.FC<{ duree: number; children: React.ReactNode }> = ({ duree, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, duree - 8, duree], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

// ---------- Scène 1 : 23h, une cliente écrit, personne ne répond ----------
const Scene1: React.FC<{ cfg: Config }> = ({ cfg }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entree = pop(f, 0, fps, 14);
  const perdue = pop(f, 206, fps, 11);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', top: 120, width: '100%', textAlign: 'center', fontFamily: 'Inter', fontWeight: 800, fontSize: 150, color: OR,
        letterSpacing: 6, textShadow: '0 0 50px rgba(242,207,122,0.6)', opacity: lisse(f, 0, 14, 0, 1), transform: `scale(${1 + 0.03 * Math.sin(f / 12)})` }}>
        {cfg.heure}
      </div>
      <Telephone y={(1 - entree) * 700 + 70 + Math.sin(f / 25) * 10} s={1} rx={8} ry={lisse(f, 0, 262, -30, -14)} rz={-2}>
        <Chat cfg={cfg} t={{ question: 30, perdue: 206 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', opacity: lisse(f, 160, 190, 0, 1) }} />
      </Telephone>
      {f >= 160 && (
        <div style={{ position: 'absolute', top: 1260, width: '100%', display: 'flex', justifyContent: 'center', opacity: lisse(f, 160, 175, 0, 1) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, direction: 'rtl', fontFamily: cfg.police, fontWeight: 900, fontSize: 46, color: '#fff',
            background: 'rgba(30,30,50,0.85)', border: '2px solid rgba(255,255,255,0.25)', borderRadius: 40, padding: '8px 34px' }}>
            <IconeHorloge taille={46} couleur="#aaa" angle={(f - 160) * 12} />{cfg.scene1.sansReponse}
          </div>
        </div>
      )}
      {f >= 206 && (
        <div style={{ position: 'absolute', top: 360, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, direction: 'rtl', background: '#e5383b', color: '#fff', fontFamily: cfg.police,
            fontWeight: 900, fontSize: 50, borderRadius: 50, padding: '14px 40px', boxShadow: '0 20px 50px rgba(229,56,59,0.5)',
            transform: `scale(${perdue}) rotate(${(1 - perdue) * -8}deg)` }}>
            <IconeCroix taille={46} />{cfg.scene1.perdue}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- Scène 2 : l'IA répond en 5 s, WhatsApp + Instagram, temps gagné ----------
const Scene2: React.FC<{ cfg: Config }> = ({ cfg }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const glisse = lisse(f, 150, 185, 0, 1);
  const secondes = interpolate(f, [14, 46], [0, 5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const iconeWa = pop(f, 156, fps, 10);
  const iconeIg = pop(f, 168, fps, 10);
  const compteur = pop(f, 252, fps, 12);
  const minutes = Math.round(interpolate(f, [258, 310], [0, 120], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const hh = `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
  return (
    <AbsoluteFill>
      {f < 150 && (
        <div style={{ position: 'absolute', top: 150, width: '100%', display: 'flex', justifyContent: 'center', opacity: lisse(f, 10, 20, 0, 1) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(37,211,102,0.15)', border: `3px solid ${VERT}`, borderRadius: 60,
            padding: '12px 38px', direction: 'rtl' }}>
            <IconeHorloge taille={58} couleur={VERT} angle={secondes * 72} />
            <span style={{ fontFamily: cfg.police, fontWeight: 900, fontSize: 56, color: '#fff' }}>{cfg.scene2.chrono}</span>
            <span style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 64, color: VERT, direction: 'ltr' }}>{secondes.toFixed(1)} s</span>
          </div>
        </div>
      )}
      <Telephone x={-190 * glisse} y={70 - 30 * glisse + Math.sin(f / 25) * 10} s={1 - 0.2 * glisse} rx={6} ry={lisse(f, 0, 40, -14, 0) + 20 * glisse} rz={-2 + 2 * glisse}>
        <Chat cfg={cfg} t={{ question: -100, ecrit: [14, 46], reponse: 46, choix: 86, confirmation: 118 }} />
      </Telephone>
      <div style={{ position: 'absolute', left: 640, top: 520, perspective: 1200 }}>
        <div style={{ transform: `scale(${iconeWa}) rotateY(${Math.sin(f / 18) * 25}deg) translateY(${Math.sin(f / 15) * 12}px)`,
          filter: 'drop-shadow(0 20px 40px rgba(37,211,102,0.55))' }}><IconeWhatsApp taille={230} /></div>
      </div>
      <div style={{ position: 'absolute', left: 760, top: 830, perspective: 1200 }}>
        <div style={{ transform: `scale(${iconeIg}) rotateY(${Math.cos(f / 18) * 25}deg) translateY(${Math.cos(f / 15) * 12}px)`,
          filter: 'drop-shadow(0 20px 40px rgba(214,41,118,0.55))' }}><IconeInstagram taille={200} /></div>
      </div>
      {f >= 156 && (
        <div style={{ position: 'absolute', left: 650, top: 1090, fontFamily: 'Inter', fontWeight: 900, fontSize: 86, color: '#fff', opacity: iconeIg,
          textShadow: '0 0 30px rgba(255,255,255,0.35)' }}>{cfg.scene2.canaux}</div>
      )}
      {f >= 252 && (
        <div style={{ position: 'absolute', left: 570, right: 20, top: 1230, display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 26, background: 'linear-gradient(135deg,#2a2150,#3b1f4f)', border: `3px solid ${OR}`,
            borderRadius: 40, padding: '16px 30px', transform: `scale(${compteur})`, boxShadow: '0 25px 60px rgba(0,0,0,0.5)', direction: 'rtl' }}>
            <IconeHorloge taille={86} couleur={OR} angle={minutes * 6} />
            <div>
              <div style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 96, color: OR, lineHeight: 1, direction: 'ltr' }}>+{hh}</div>
              <div style={{ fontFamily: cfg.police, fontWeight: 700, fontSize: 36, color: '#fff' }}>{cfg.scene2.tempsLegende}</div>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- Scène 3 : vidéos virales dans 3 téléphones en carrousel 3D ----------
const Scene3: React.FC<{ cfg: Config }> = ({ cfg }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tourne = Math.sin(f / 50) * 6;
  const places = [
    { x: -345, ry: 32, s: 0.62, z: 0 },
    { x: 0, ry: 0, s: 0.78, z: 2 },
    { x: 345, ry: -32, s: 0.62, z: 1 },
  ];
  return (
    <AbsoluteFill>
      <Titre texte={cfg.scene3.titre} police={cfg.police} rtl={cfg.rtl} y={150} />
      {cfg.scene3.videos.map((v, i) => {
        const pl = places[i];
        const p = pop(f, 6 + i * 8, fps, 13);
        const vues = parseFloat(v.vues);
        const suffixe = v.vues.replace(/[0-9.]/g, '');
        const n = interpolate(f, [20 + i * 8, 90 + i * 8], [0, vues], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <div key={i} style={{ position: 'absolute', inset: 0, zIndex: pl.z }}>
            <Telephone x={pl.x} y={(1 - p) * 900 + 40 + Math.sin(f / 20 + i) * 8} s={pl.s} ry={pl.ry + tourne} rx={4}>
              <OffthreadVideo src={staticFile(v.fichier)} startFrom={v.debut} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Telephone>
            <div style={{ position: 'absolute', left: 540 + pl.x - 160, width: 320, top: 1440 + (1 - p) * 300, display: 'flex', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: i === 1 ? OR : 'rgba(255,255,255,0.12)', borderRadius: 40, padding: '8px 22px' }}>
                <IconeOeil taille={40} couleur={i === 1 ? '#1a1030' : '#fff'} />
                <span style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: i === 1 ? 52 : 42, color: i === 1 ? '#1a1030' : '#fff' }}>
                  {suffixe === 'M' ? n.toFixed(1) : Math.round(n)}{suffixe}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Scène 4 : le site, on défile, on clique sur « Réserver », réservation confirmée ----------
const Scene4: React.FC<{ cfg: Config }> = ({ cfg }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const largeur = 468; // largeur de l'écran du téléphone
  const k = largeur / 780;
  const defile = lisse(f, 14, 62, 0, -1700) + lisse(f, 70, 92, 0, 1700);
  const tap = interpolate(f, [100, 116], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const feuille = pop(f, 114, fps, 13);
  const coche = interpolate(f, [124, 140], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const by = cfg.scene4.boutonY * k;
  return (
    <AbsoluteFill>
      <Titre texte={cfg.scene4.titre} police={cfg.police} rtl={cfg.rtl} y={150} />
      <Telephone y={90 + Math.sin(f / 25) * 10} s={1} rx={5} ry={lisse(f, 0, 200, -16, 10)} rz={1}>
        <div style={{ position: 'absolute', inset: 0, background: '#fff' }}>
          <Img src={staticFile(cfg.scene4.site)} style={{ position: 'absolute', left: 0, top: 44, width: largeur, transform: `translateY(${defile}px)` }} />
        </div>
        {f >= 96 && f < 125 && (
          <div style={{ position: 'absolute', left: largeur / 2 - 45, top: 44 + by - 37, width: 90, height: 90, borderRadius: 45,
            border: '5px solid rgba(242,160,60,0.9)', background: 'rgba(242,160,60,0.25)', transform: `scale(${0.4 + tap * 1.2})`, opacity: 1 - tap * 0.7 }} />
        )}
        {f >= 114 && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 430, background: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40,
            boxShadow: '0 -20px 60px rgba(0,0,0,0.35)', transform: `translateY(${(1 - feuille) * 450}px)`, display: 'flex', flexDirection: 'column',
            alignItems: 'center', paddingTop: 50 }}>
            <div style={{ width: 130, height: 130, borderRadius: 65, background: VERT, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 15px 40px rgba(37,211,102,0.5)' }}>
              <IconeCoche taille={96} trace={coche} />
            </div>
            <div style={{ fontFamily: cfg.police, fontWeight: 900, fontSize: 40, color: '#1a1a2e', marginTop: 26, direction: 'rtl' }}>{cfg.scene4.confirme}</div>
            <div style={{ fontFamily: cfg.police, fontWeight: 700, fontSize: 32, color: '#666', marginTop: 4, direction: 'rtl' }}>{cfg.scene4.detail}</div>
          </div>
        )}
      </Telephone>
    </AbsoluteFill>
  );
};

// ---------- Scène 5 : logo, prix, « Répondez OUI » ----------
const Scene5: React.FC<{ cfg: Config }> = ({ cfg }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = pop(f, 0, fps, 14);
  const carte = pop(f, 8, fps, 11);
  const engagement = pop(f, 86, fps, 11);
  const cta = pop(f, 135, fps, 9);
  const pulse = f > 150 ? 1 + 0.05 * Math.sin((f - 150) / 5) : 1;
  const s = cfg.scene5;
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', top: 120, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: logo,
        transform: `scale(${0.8 + 0.2 * logo})` }}>
        <div style={{ position: 'relative', width: 140, height: 140 }}><Lune x={84} y={70} taille={110} /></div>
        <div style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 84, color: '#fff', letterSpacing: 10, marginTop: 10 }}>SAHIR DIGITAL</div>
        <div style={{ fontFamily: cfg.police, fontWeight: 700, fontSize: 40, color: OR, direction: 'rtl', marginTop: 4 }}>{s.slogan}</div>
      </div>
      <div style={{ position: 'absolute', top: 640, width: '100%', display: 'flex', justifyContent: 'center', perspective: 1600 }}>
        <div style={{ width: 760, borderRadius: 50, padding: '40px 0 46px', background: 'linear-gradient(145deg,#2b2156,#40205a 60%,#5a2a52)',
          border: `4px solid ${OR}`, boxShadow: '0 40px 90px rgba(0,0,0,0.55), 0 0 60px rgba(242,207,122,0.25)', textAlign: 'center',
          transform: `rotateY(${(1 - carte) * 75 + Math.sin(f / 30) * 6}deg) rotateX(${Math.cos(f / 35) * 4}deg)` }}>
          <div style={{ fontFamily: cfg.police, fontWeight: 700, fontSize: 44, color: '#ddd', direction: 'rtl' }}>ابتداءً من</div>
          <div style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 220, color: OR, lineHeight: 1, textShadow: '0 0 40px rgba(242,207,122,0.5)' }}>{s.prix}</div>
          <div style={{ fontFamily: cfg.police, fontWeight: 900, fontSize: 56, color: '#fff', direction: 'rtl' }}>{s.prixLegende}</div>
        </div>
      </div>
      {f >= 86 && (
        <div style={{ position: 'absolute', top: 1150, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, direction: 'rtl', background: 'rgba(255,255,255,0.1)', borderRadius: 40, padding: '10px 34px',
            transform: `scale(${engagement})` }}>
            <div style={{ width: 54, height: 54, borderRadius: 27, background: VERT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconeCoche taille={40} /></div>
            <span style={{ fontFamily: cfg.police, fontWeight: 900, fontSize: 52, color: '#fff' }}>{s.engagement}</span>
          </div>
        </div>
      )}
      {f >= 135 && (
        <div style={{ position: 'absolute', top: 1330, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, direction: 'rtl', background: VERT, borderRadius: 70, padding: '20px 50px',
            boxShadow: `0 0 ${40 + 20 * Math.sin(f / 5)}px rgba(37,211,102,0.75)`, transform: `scale(${cta * pulse})` }}>
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
  return (
    <AbsoluteFill style={{ backgroundColor: '#04071a' }}>
      <Fond lune={interpolate(f, [590, 610], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
      <Audio src={staticFile(cfg.musique)} volume={(f) => interpolate(f, [0, 15, durationInFrames - 45, durationInFrames], [0, 0.15, 0.15, 0], { extrapolateRight: 'clamp' })} />
      {SCENES.map((sc, i) => {
        const Comp = SCENE_COMPOSANTS[i];
        return (
          <Sequence key={i} from={sc.de} durationInFrames={sc.duree}>
            <Fondu duree={sc.duree}><Comp cfg={cfg} /></Fondu>
            <SousTitres liste={cfg.sousTitres[i]} police={cfg.police} rtl={cfg.rtl} />
            <Sequence from={6}><Audio src={staticFile(cfg.voix[i])} volume={1} /></Sequence>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
