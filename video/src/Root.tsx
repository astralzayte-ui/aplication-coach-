import React from 'react';
import { Composition } from 'remotion';
import { Pub, DUREE } from './Pub';
import { salonAr } from './config';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="PubSalonAr"
    component={Pub}
    durationInFrames={DUREE}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{ cfg: salonAr }}
  />
);
