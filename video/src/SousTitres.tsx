import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { SAFE, PLACE, NOIR, IVOIRE, AMBRE, fontFamily, Texte } from "./Composition";

/*
  Quatre façons d'écrire le même sous-titre.
  Une seule chose change d'un type à l'autre : la manière dont le texte
  arrive à l'écran. Le reste — la place, la couleur, la police — ne bouge pas.
*/

const PHRASE = "Le même ensemble ailleurs : 62 balles";
const MOTS = PHRASE.split(" ");

const Decor: React.FC = () => {
  const frame = useCurrentFrame();
  const derive = interpolate(frame, [0, 480], [0, 60]);
  return (
    <AbsoluteFill style={{ backgroundColor: NOIR }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 45% at 50% ${28 + derive / 30}%,
            rgba(224,164,88,0.30) 0%, rgba(224,164,88,0.08) 45%, rgba(11,11,12,0) 75%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${62 + derive / 40}%`,
          height: 2,
          background: "rgba(184,190,200,0.18)",
        }}
      />
    </AbsoluteFill>
  );
};

/* L'étiquette du type — elle n'existe que dans cette démo */
const Etiquette: React.FC<{ lettre: string; nom: string }> = ({ lettre, nom }) => (
  <div
    style={{
      position: "absolute",
      top: SAFE.top,
      left: SAFE.side,
      right: SAFE.side,
      display: "flex",
      alignItems: "baseline",
      gap: 22,
      fontFamily,
    }}
  >
    <span style={{ fontSize: 120, fontWeight: 700, color: AMBRE }}>{lettre}</span>
    <span
      style={{
        fontSize: 40,
        fontWeight: 700,
        color: "#B8BEC8",
        letterSpacing: 3,
      }}
    >
      {nom}
    </span>
  </div>
);

/* La place des sous-titres — la même pour les quatre */
const EnBas: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      bottom: PLACE.sousTitre.bottom,
      height: PLACE.sousTitre.height,
      left: SAFE.side,
      right: SAFE.side,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

/* A — LE FIGÉ : une ligne, blanche, contour noir. Elle arrive entière. */
const TypeA: React.FC = () => (
  <EnBas>
    <Texte size={64}>{PHRASE}</Texte>
  </EnBas>
);

/* B — LE BANDEAU : le même texte, posé sur un bandeau noir plein */
const TypeB: React.FC = () => (
  <EnBas>
    <div
      style={{
        backgroundColor: NOIR,
        padding: "22px 34px",
        fontFamily,
        fontSize: 64,
        fontWeight: 700,
        color: IVOIRE,
        textAlign: "center",
        lineHeight: 1.15,
        textWrap: "balance",
      }}
    >
      {PHRASE}
    </div>
  </EnBas>
);

/* C — MOT PAR MOT : les mots s'ajoutent un par un, comme sur TikTok */
const TypeC: React.FC = () => {
  const frame = useCurrentFrame();
  const visibles = Math.min(MOTS.length, Math.floor(frame / 6) + 1);
  return (
    <EnBas>
      <Texte size={64}>{MOTS.slice(0, visibles).join(" ")}</Texte>
    </EnBas>
  );
};

/* D — LE MOT CLÉ : un seul mot, très gros. Le chiffre, seul. */
const TypeD: React.FC = () => (
  <EnBas>
    <div style={{ textAlign: "center" }}>
      <Texte size={52}>Le même ensemble ailleurs</Texte>
      <div style={{ height: 14 }} />
      <Texte size={138} color={AMBRE}>
        62 balles
      </Texte>
    </div>
  </EnBas>
);

export const SousTitres: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NOIR }}>
    <Decor />

    <Sequence durationInFrames={120}>
      <Etiquette lettre="A" nom="LE FIGÉ" />
      <TypeA />
    </Sequence>

    <Sequence from={120} durationInFrames={120}>
      <Etiquette lettre="B" nom="LE BANDEAU" />
      <TypeB />
    </Sequence>

    <Sequence from={240} durationInFrames={120}>
      <Etiquette lettre="C" nom="MOT PAR MOT" />
      <TypeC />
    </Sequence>

    <Sequence from={360} durationInFrames={120}>
      <Etiquette lettre="D" nom="LE CHIFFRE SEUL" />
      <TypeD />
    </Sequence>
  </AbsoluteFill>
);
