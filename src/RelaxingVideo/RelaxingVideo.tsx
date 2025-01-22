import React from "react";

import { AbsoluteFill, useVideoConfig } from "remotion";
import { ImageSequence } from "../lib/ImageSequence";
import { RotateImage } from "../lib/RotateImage";

const images = [
  "relaxing/images/Jai Shiv Bhole Bhandari (1).jpeg",
  "relaxing/images/Jai Shiv Bhole Bhandari (2).jpeg",
  "relaxing/images/Jai Shiv Bhole Bhandari (3).jpeg",
  "relaxing/images/Jai Shiv Bhole Bhandari (2).jpeg",
  "relaxing/images/Jai Shiv Bhole Bhandari (4).jpeg",
  "relaxing/images/Jai Shiv Bhole Bhandari (2).jpeg",
  "relaxing/images/Jai Shiv Bhole Bhandari (1).jpeg"];

export const RelaxingVideo: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const len = images.length;
  const transitionDuration = Math.floor(durationInFrames / len / 1.5);

  return <AbsoluteFill
    style={{
      background: 'linear-gradient(110deg, rgb(144, 61, 2) 0%, rgb(255, 152, 35) 30%, rgb(158, 71, 42) 50%, rgb(73, 45, 3) 90%)'
    }}
  >
    <ImageSequence images={images} filter="" durationInFrames={durationInFrames} transitionDuration={transitionDuration} />
    <AbsoluteFill style={
      {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }
    }
    >
      <RotateImage img="relaxing/images/mandala-2341704_1920.png" animationDuration={durationInFrames} filter="FireFilter"
        style={{
          width: '300em',
          height: '300em',
          maxWidth: 'none',
          opacity: '0.05'
        }} />
    </AbsoluteFill>
  </AbsoluteFill>
}
