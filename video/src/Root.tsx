import React from 'react';
import { Composition } from 'remotion';
import { Pub, dureeTotale } from './Pub';
import { pubs, salonAr, salonFr } from './config';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="PubSalonAr" component={Pub} durationInFrames={dureeTotale(salonAr)} fps={30} width={1080} height={1920} defaultProps={{ cfg: salonAr }} />
    <Composition id="PubSalonFr" component={Pub} durationInFrames={dureeTotale(salonFr)} fps={30} width={1080} height={1920} defaultProps={{ cfg: salonFr }} />
    {Object.entries(pubs).map(([id, cfg]) => (
      <React.Fragment key={id}>
        <Composition id={`Pub${id}`} component={Pub} durationInFrames={dureeTotale(cfg)} fps={30} width={1080} height={1920} defaultProps={{ cfg }} />
      </React.Fragment>
    ))}
  </>
);
