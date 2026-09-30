import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  staticFile,
  continueRender,
  delayRender,
} from "remotion";

/*
  La police est servie depuis le projet, pas depuis internet.
  Le navigateur du rendu n'a pas le droit de sortir : une police
  qui ne charge pas, et tout le texte tombe en Times New Roman.
*/
const fontFamily = "Archivo";

const css = `
@font-face {
  font-family: 'Archivo';
  font-weight: 600;
  font-style: normal;
  src: url('${staticFile("fonts/archivo-600.ttf")}') format('truetype');
}
@font-face {
  font-family: 'Archivo';
  font-weight: 700;
  font-style: normal;
  src: url('${staticFile("fonts/archivo-700.ttf")}') format('truetype');
}`;

const handle = delayRender("chargement de la police");
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
  document.fonts.ready.then(() => continueRender(handle));
} else {
  continueRender(handle);
}

/* La palette SILENCE */
const NOIR = "#0B0B0C";
const IVOIRE = "#F4F2ED";
const AMBRE = "#E0A458";

/* La zone sûre : les applis recouvrent les bords, tout le texte tient dedans */
export const SAFE = { top: 220, bottom: 500, side: 180 };

/*
  🔴 LES EMPLACEMENTS — ils ne bougent JAMAIS.

  C'est ça qui rend la marque reconnaissable : au bout de dix vidéos,
  l'œil sait où regarder avant même d'avoir lu. Un élément qui change
  de place d'une vidéo à l'autre annule tout le travail de répétition.

      LE HOOK        en haut de la zone sûre
      LES SOUS-TITRES  en bas de la zone sûre
      LE PRIX        au centre exact
      LE LOGO        au centre exact, sur l'écran noir
*/
export const PLACE = {
  hook: { top: SAFE.top + 60, height: 520 },
  sousTitre: { bottom: SAFE.bottom + 60, height: 380 },
  prix: "centre",
} as const;

export type Props = {
  hook: string;
  prix: string;
  showSafeZone: boolean;
};

/* Texte blanc, contour noir épais, figé — jamais d'animation */
const Texte: React.FC<{
  children: React.ReactNode;
  size: number;
  color?: string;
}> = ({ children, size, color = IVOIRE }) => (
  <div
    style={{
      fontFamily,
      fontSize: size,
      fontWeight: 700,
      color,
      lineHeight: 1.15,
      textAlign: "center",
      textWrap: "balance",
      WebkitTextStroke: `${Math.round(size / 9)}px ${NOIR}`,
      paintOrder: "stroke fill",
    }}
  >
    {children}
  </div>
);

/* Le décor : la rue la nuit, un lampadaire. En attendant le vrai clip. */
const Decor: React.FC = () => {
  const frame = useCurrentFrame();
  const derive = interpolate(frame, [0, 300], [0, 60]);
  return (
    <AbsoluteFill style={{ backgroundColor: NOIR }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 45% at 50% ${28 + derive / 30}%,
            rgba(224,164,88,0.30) 0%,
            rgba(224,164,88,0.08) 45%,
            rgba(11,11,12,0) 75%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg,
            rgba(11,11,12,0.85) 0%,
            rgba(11,11,12,0.25) 35%,
            rgba(11,11,12,0.80) 100%)`,
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

/* Le repère de la zone sûre — pour vérifier, jamais dans la vidéo publiée */
const Repere: React.FC<{ top?: number; bottom?: number; h: number; nom: string }> = ({
  top,
  bottom,
  h,
  nom,
}) => (
  <div
    style={{
      position: "absolute",
      top,
      bottom,
      height: h,
      left: SAFE.side,
      right: SAFE.side,
      border: `3px solid rgba(184,190,200,0.55)`,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "flex-end",
    }}
  >
    <span
      style={{
        fontFamily,
        fontSize: 26,
        fontWeight: 700,
        color: "#B8BEC8",
        padding: "6px 10px",
        letterSpacing: 2,
      }}
    >
      {nom}
    </span>
  </div>
);

const ZoneSure: React.FC = () => (
  <AbsoluteFill>
    <div
      style={{
        position: "absolute",
        top: SAFE.top,
        bottom: SAFE.bottom,
        left: SAFE.side,
        right: SAFE.side,
        border: `4px dashed ${AMBRE}`,
      }}
    />
    <Repere top={PLACE.hook.top} h={PLACE.hook.height} nom="LE HOOK" />
    <Repere
      bottom={PLACE.sousTitre.bottom}
      h={PLACE.sousTitre.height}
      nom="LES SOUS-TITRES"
    />
    <div
      style={{
        position: "absolute",
        top: SAFE.top - 54,
        left: SAFE.side,
        fontFamily,
        fontSize: 30,
        fontWeight: 700,
        color: AMBRE,
        letterSpacing: 2,
      }}
    >
      ZONE SÛRE — 720 × 1200
    </div>
  </AbsoluteFill>
);

/* L'emplacement du hook — en haut, toujours */
const EnHaut: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      top: PLACE.hook.top,
      height: PLACE.hook.height,
      left: SAFE.side,
      right: SAFE.side,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

/* L'emplacement des sous-titres — en bas, toujours */
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

/* L'emplacement du prix et du logo — le centre exact, toujours */
const AuCentre: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      paddingLeft: SAFE.side,
      paddingRight: SAFE.side,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {children}
  </AbsoluteFill>
);

export const Moule: React.FC<Props> = ({ hook, prix, showSafeZone }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: NOIR }}>
      <Decor />

      {/* 0 – 1 s : le hook — EN HAUT, toujours */}
      <Sequence durationInFrames={30}>
        <EnHaut>
          <Texte size={84}>{hook}</Texte>
        </EnHaut>
      </Sequence>

      {/* 1 – 3 s : il enfile — EN BAS, toujours */}
      <Sequence from={30} durationInFrames={60}>
        <EnBas>
          <Texte size={70}>Il l'enfile</Texte>
        </EnBas>
      </Sequence>

      {/* 3 – 6 s : il marche — EN BAS, toujours, même place */}
      <Sequence from={90} durationInFrames={90}>
        <EnBas>
          <Texte size={70}>Il marche</Texte>
        </EnBas>
      </Sequence>

      {/* 6 – 8 s : le prix — AU CENTRE, toujours, même place */}
      <Sequence from={180} durationInFrames={60}>
        <AuCentre>
          <div style={{ textAlign: "center" }}>
            <Texte size={150} color={AMBRE}>
              {prix}
            </Texte>
            <div style={{ height: 24 }} />
            <Texte size={52}>livraison comprise</Texte>
          </div>
        </AuCentre>
      </Sequence>

      {/* 8 – 10 s : écran noir, le logo, zéro son */}
      <Sequence from={240} durationInFrames={60}>
        <AbsoluteFill
          style={{
            backgroundColor: NOIR,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 96,
              fontWeight: 600,
              color: IVOIRE,
              letterSpacing: "0.34em",
              textIndent: "0.34em",
            }}
          >
            SILENCE
          </div>
        </AbsoluteFill>
      </Sequence>

      {showSafeZone ? <ZoneSure /> : null}
    </AbsoluteFill>
  );
};
