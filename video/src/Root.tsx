import React from "react";
import { Composition } from "remotion";
import { Moule } from "./Composition";

/*
  Le même clip, deux marchés. Seul le prix change.
  C'est ça qui fait qu'on rend 80 vidéos et pas 160.
*/
const HOOK = "60 balles pour du tissu de marché";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="France"
        component={Moule}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          hook: HOOK,
          prix: "39,89 €",
          showSafeZone: false,
        }}
      />
      <Composition
        id="Maroc"
        component={Moule}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          hook: HOOK,
          prix: "298 MAD",
          showSafeZone: false,
        }}
      />
      <Composition
        id="ZoneSure"
        component={Moule}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          hook: HOOK,
          prix: "39,89 €",
          showSafeZone: true,
        }}
      />
    </>
  );
};
