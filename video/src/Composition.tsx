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

/* Un passage du moule : le texte est centré dans la zone sûre */
const Passage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      paddingTop: SAFE.top,
      paddingBottom: SAFE.bottom,
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

      {/* 0 – 1 s : le hook */}
      <Sequence durationInFrames={30}>
        <Passage>
          <Texte size={92}>{hook}</Texte>
        </Passage>
      </Sequence>

      {/* 1 – 3 s : il enfile */}
      <Sequence from={30} durationInFrames={60}>
        <Passage>
          <Texte size={78}>Il l'enfile</Texte>
        </Passage>
      </Sequence>

      {/* 3 – 6 s : il marche */}
      <Sequence from={90} durationInFrames={90}>
        <Passage>
          <Texte size={78}>Il marche</Texte>
        </Passage>
      </Sequence>

      {/* 6 – 8 s : le prix, toujours à la même place */}
      <Sequence from={180} durationInFrames={60}>
        <Passage>
          <div style={{ textAlign: "center" }}>
            <Texte size={150} color={AMBRE}>
              {prix}
            </Texte>
            <div style={{ height: 24 }} />
            <Texte size={52}>livraison comprise dans le prix affiché</Texte>
          </div>
        </Passage>
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
