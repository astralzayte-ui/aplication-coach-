import React from 'react';
import { Composition } from 'remotion';
import { Pub, dureeTotale } from './Pub';
import { pubs, salonAr, salonFr } from './config';
import { DUREE_A, DUREE_B, DUREE_C, RemakeAgence, RemakeBoite, RemakeEquipe } from './Remake';
import { VideoUgc, dureeUgc, ugcs } from './Ugc';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="PubSalonAr" component={Pub} durationInFrames={dureeTotale(salonAr)} fps={30} width={1080} height={1920} defaultProps={{ cfg: salonAr }} />
    <Composition id="PubSalonFr" component={Pub} durationInFrames={dureeTotale(salonFr)} fps={30} width={1080} height={1920} defaultProps={{ cfg: salonFr }} />
    {Object.entries(pubs).map(([id, cfg]) => (
      <React.Fragment key={id}>
        <Composition id={`Pub${id}`} component={Pub} durationInFrames={dureeTotale(cfg)} fps={30} width={1080} height={1920} defaultProps={{ cfg }} />
      </React.Fragment>
    ))}
    <Composition id="RemakeBoite" component={RemakeBoite} durationInFrames={DUREE_A} fps={30} width={1080} height={1920} />
    <Composition id="RemakeEquipe" component={RemakeEquipe} durationInFrames={DUREE_B} fps={30} width={1080} height={1920} />
    <Composition id="RemakeAgence" component={RemakeAgence} durationInFrames={DUREE_C} fps={30} width={1080} height={1920} />
    {Object.entries(ugcs).map(([id, u]) => (
      <React.Fragment key={id}>
        <Composition id={`Ugc${id}`} component={VideoUgc} durationInFrames={dureeUgc(u)} fps={30} width={1080} height={1920} defaultProps={{ u }} />
      </React.Fragment>
    ))}
  </>
);
