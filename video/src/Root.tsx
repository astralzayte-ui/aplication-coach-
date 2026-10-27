import React from 'react';
import { Composition } from 'remotion';
import { Pub, dureeTotale } from './Pub';
import { salonAr, salonFr } from './config';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="PubSalonAr" component={Pub} durationInFrames={dureeTotale(salonAr)} fps={30} width={1080} height={1920} defaultProps={{ cfg: salonAr }} />
    <Composition id="PubSalonFr" component={Pub} durationInFrames={dureeTotale(salonFr)} fps={30} width={1080} height={1920} defaultProps={{ cfg: salonFr }} />
  </>
);
