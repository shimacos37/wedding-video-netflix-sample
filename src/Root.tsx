import React from "react";
import { Composition } from "remotion";

import { NetflixMovieSample } from "./videos/Composition";
import profileData from "./videos/data/profile.json";

interface VideoConfig {
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
}

const config = profileData.videoConfig as VideoConfig;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="V2-Netflix-Sample"
        component={NetflixMovieSample}
        durationInFrames={config.durationInFrames}
        fps={config.fps}
        width={config.width}
        height={config.height}
      />
    </>
  );
};
