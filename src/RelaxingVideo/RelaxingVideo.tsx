import React, { useMemo } from "react";

import { AbsoluteFill, Sequence, staticFile, useVideoConfig, Audio } from "remotion";
import { ImageSequence } from "../lib/ImageSequence";
import { RotateImage } from "../lib/RotateImage";
import { SpaceDust } from "../lib/Particles/SpaceDust";
import ZoomInText from "../lib/ZoomInText";
import BoxText from "../lib/BoxText";


export type RelaxingVideoProps = {
  title: string;
  subTitle: string;
  images: Array<string>;
  secondaryImage: string;
  music: string;
  imageSeconds: number;
}

function fillImagesUptoFullDuration(images: Array<string>, perImageDuration: number, videoDuration: number) {
  const oLen = images.length;
  const imageCount = videoDuration / perImageDuration;
  const allImages: Array<string> = [];

  for (let i = 0; i < imageCount; i++) {
    allImages.push(images[i % oLen]);
  }

  return allImages;
}

export const RelaxingVideo: React.FC<RelaxingVideoProps> = ({
  title,
  subTitle,
  images,
  secondaryImage,
  music,
  imageSeconds }) => {

  const { fps, durationInFrames } = useVideoConfig();
  const PER_IMAGE_DURATION = imageSeconds * fps;

  const allImages = useMemo(() => {
    console.log('IMG MEMO');
    return fillImagesUptoFullDuration(images, PER_IMAGE_DURATION, durationInFrames);
  }, [images]);

  const len = allImages.length;
  const imagesSequenceDuration = PER_IMAGE_DURATION * len;
  const transitionDuration = Math.floor(imagesSequenceDuration / len / 1.5);

  return <AbsoluteFill
    style={{
      background: 'linear-gradient(110deg, rgb(144, 61, 2) 0%, rgb(255, 152, 35) 30%, rgb(158, 71, 42) 50%, rgb(73, 45, 3) 90%)'
    }}
  >
    <ImageSequence images={allImages} filter="" durationInFrames={imagesSequenceDuration} transitionDuration={transitionDuration} />

    <SpaceDust
      count={1000}
      color={'rgb(245, 0, 208)'}
      lightDistance={0}
      lightIntensity={1000}
      lightColor={'rgb(0, 133, 249)'}
      fov={100}
      aspect={0}
      near={0}
      far={30}
      smoothness={0}
      particleSize={0.1}
      opacity={1}
      minSpeed={8}
      maxSpeed={20}
    />
    <AbsoluteFill style={
      {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }
    }
    >
      <RotateImage img={secondaryImage} animationDuration={durationInFrames} filter="FireFilter"
        style={{
          width: '300em',
          height: '300em',
          maxWidth: 'none',
          opacity: '0.05'
        }} />
    </AbsoluteFill>
    <SpaceDust
      count={50}
      color={'rgb(229, 119, 0)'}
      lightDistance={0}
      lightIntensity={1000}
      lightColor={'rgb(253, 135, 0)'}
      fov={100}
      aspect={0}
      near={0}
      far={30}
      smoothness={5}
      particleSize={10}
      opacity={0.1}
      minSpeed={8}
      maxSpeed={10}
    />

    {/* Title */}
    <Sequence from={0} durationInFrames={8 * fps}>
      <ZoomInText text={title} separator={' '} animationDuration={2 * fps} />
    </Sequence>

    {/* SubTitle */}
    <Sequence from={3 * fps} durationInFrames={8 * fps} style={
      {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }
    }>
      <BoxText text={subTitle} style={{ fontSize: '3em' }} />
    </Sequence>

    {/* Music */}
    {music && <Sequence
      from={0}
      durationInFrames={durationInFrames}>
      <Audio
        loop={true}
        src={staticFile(music)}
      >
      </Audio>
    </Sequence>}
  </AbsoluteFill>
}
