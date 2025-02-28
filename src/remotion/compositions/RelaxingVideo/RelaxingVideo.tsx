import React, { useMemo } from "react";
import { z } from "zod";

import { AbsoluteFill, Sequence, staticFile, useVideoConfig, Audio } from "remotion";
import { ImageSequence } from "../../lib/ImageSequence";
import { RotateImage } from "../../lib/RotateImage";
import { SpaceDust } from "../../lib/Particles/SpaceDust";
import ZoomInText from "../../lib/ZoomInText";
import BoxText from "../../lib/BoxText";
import { CompositionPropsSchema } from "../../interfaces";
import { toGradientString } from "../../../client-core-lib/Core";

export const RelaxingVideoSchema = CompositionPropsSchema;

export type RelaxingVideoProps = z.infer<typeof RelaxingVideoSchema>;

export const RelaxingVideo: React.FC<RelaxingVideoProps> = ({
  name,
  title,
  subTitle,
  summary,
  translation,
  images,
  videos,
  music,
  categoryImage,
  logo,
  imageSeconds,
  bgGradient,
  particles }) => {
  const {
    count,
    speed,
    opacity,
    smoothness,
    size,
    color,
    lightDistance,
    lightIntensity,
    lightColor,
    cameraFov,
    cameraNear,
    cameraFar,
    shininess,
  } = particles || {};

  const { fps, durationInFrames } = useVideoConfig();
  const PER_IMAGE_DURATION = imageSeconds || 1 * fps;

  const allImages = useMemo(() => {
    return fillImagesUptoFullDuration(images || [], PER_IMAGE_DURATION, durationInFrames);
  }, [images, PER_IMAGE_DURATION, durationInFrames]);

  const len = allImages.length;
  const imagesSequenceDuration = PER_IMAGE_DURATION * len;
  const transitionDuration = Math.floor(imagesSequenceDuration / len / 2.5);
  const background = toGradientString(bgGradient) || 'none';
  return <AbsoluteFill
    style={{
      background,
    }}
  >
    {images?.length && <ImageSequence images={allImages} filter="" durationInFrames={imagesSequenceDuration} transitionDuration={transitionDuration} />}

    {/* <SpaceDust
      count={1000}
      color={'rgb(236, 146, 2)'}
      lightDistance={0}
      lightIntensity={1000}
      lightColor={'rgb(0, 133, 249)'}
      fov={100}
      aspect={0}
      near={0}
      far={30}
      smoothness={0}
      particleSize={0.2}
      opacity={1}
      minSpeed={8}
      maxSpeed={20}
      shininess={100}
    /> */}

    {/* Secondary Image */}
    {categoryImage && <AbsoluteFill style={
      {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }
    }
    >
      <RotateImage img={categoryImage} animationDuration={5 * fps} filter="FireFilter" loop={true}
        style={{
          maxWidth: 'none',
          opacity: '0.2'
        }} />
    </AbsoluteFill>}

    {/* Space Dust 1 */}
    <SpaceDust
      count={count ?? 1}
      color={color ?? 'white'}
      lightDistance={lightDistance ?? 100}
      lightIntensity={lightIntensity ?? 1000}
      lightColor={lightColor ?? 'white'}
      fov={cameraFov}
      aspect={0}
      near={cameraNear}
      far={cameraFar}
      smoothness={smoothness ?? 0}
      particleSize={size ?? 1}
      opacity={opacity ?? 1}
      minSpeed={speed?.min ?? 2}
      maxSpeed={speed?.max ?? 10}
      shininess={shininess ?? 100}
    />


    {/* Title */}
    {title && <Sequence durationInFrames={8 * fps} style={
      {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center'
      }
    }>
      <ZoomInText style={{ fontSize: '8em', fontWeight: 'bold' }} text={title} separator={' '} animationDuration={2 * fps} />
    </Sequence>}

    {/* SubTitle */}
    {subTitle && <Sequence from={2 * fps} durationInFrames={6 * fps} style={
      {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'end',
        alignItems: 'center'
      }
    } >
      <BoxText text={subTitle} style={{ fontSize: '4em', fontWeight: 'bold' }} />
    </Sequence>}

    {/* Logo Image */}
    {logo && <Sequence from={2 * fps} durationInFrames={6 * fps} style={
      {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'end',
        alignItems: 'end',
      }
    }
    >
      <RotateImage img={logo} animationDuration={8 * fps} filter="" loop={false}
        style={{
          width: '20em',
          height: '20em',
          maxWidth: 'none',
          opacity: '0.5',
          margin: '5em',
          borderRadius: '50%'
        }} />
    </Sequence>}


    {/* Music */}
    {music && <Sequence
      durationInFrames={durationInFrames}>
      <Audio
        loop
        src={staticFile(music)}
      />
    </Sequence>}
  </AbsoluteFill>
}


function fillImagesUptoFullDuration(images: Array<string>, perImageDuration: number, videoDuration: number) {
  if (!images?.length) return [];
  const oLen = images.length;
  const imageCount = videoDuration / perImageDuration;
  const allImages: Array<string> = [];

  for (let i = 0; i < imageCount; i++) {
    allImages.push(images[i % oLen]);
  }

  return allImages;
}
