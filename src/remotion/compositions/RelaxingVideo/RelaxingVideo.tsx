import React, { useMemo } from "react";
import { z } from "zod";

import { AbsoluteFill, Sequence, staticFile, useVideoConfig, Audio } from "remotion";
import { ImageSequence } from "../../lib/ImageSequence";
import { RotateImage } from "../../lib/RotateImage";
import { SpaceDust } from "../../lib/Particles/SpaceDust";
import ZoomInText from "../../lib/ZoomInText";
import BoxText from "../../lib/BoxText";
import { zColor } from "@remotion/zod-types";

export const RelaxingVideoSchema = z.object({
  title: z.string(),
  subTitle: z.string(),
  images: z.array(z.string()),
  secondaryImage: z.string(),
  logo: z.string(),
  music: z.string(),
  imageSeconds: z.number(),
  // Extra props
  bgGradient: z.object({ color1: zColor(), color2: zColor(), color3: zColor(), color4: zColor() }),
  particles: z.object({
    count: z.number(),
    speed: z.object({ min: z.number(), max: z.number() }),
    opacity: z.number(),
    smoothness: z.number(),
    size: z.number(),
    color: zColor(),
    lightDistance: z.number(),
    lightIntensity: z.number(),
    lightColor: zColor(),
    cameraFov: z.number(),
    cameraNear: z.number(),
    cameraFar: z.number(),
    shininess: z.number()
  })
})

export type RelaxingVideoProps = z.infer<typeof RelaxingVideoSchema>;

export const RelaxingVideo: React.FC<RelaxingVideoProps> = ({
  title,
  subTitle,
  images,
  secondaryImage,
  logo,
  music,
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
  } = particles;

  const { width, height, fps, durationInFrames } = useVideoConfig();
  const PER_IMAGE_DURATION = imageSeconds * fps;

  const allImages = useMemo(() => {
    console.log('IMG MEMO');
    return fillImagesUptoFullDuration(images, PER_IMAGE_DURATION, durationInFrames);
  }, [images, PER_IMAGE_DURATION, durationInFrames]);

  const len = allImages.length;
  const imagesSequenceDuration = PER_IMAGE_DURATION * len;
  const transitionDuration = Math.floor(imagesSequenceDuration / len / 2.5);

  return <AbsoluteFill
    style={{
      background: `linear-gradient(110deg, ${bgGradient?.color1} 0%, ${bgGradient?.color2} 30%, ${bgGradient?.color3} 50%, ${bgGradient?.color4} 90%)`
    }}
  >
    <ImageSequence images={allImages} filter="" durationInFrames={imagesSequenceDuration} transitionDuration={transitionDuration} />

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
    {secondaryImage && <AbsoluteFill style={
      {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }
    }
    >
      <RotateImage img={secondaryImage} animationDuration={5 * fps} filter="FireFilter" loop={true}
        style={{
          maxWidth: 'none',
          opacity: '0.2'
        }} />
    </AbsoluteFill>}

    {/* Space Dust 1 */}
    <SpaceDust
      count={count}
      color={color}
      lightDistance={lightDistance}
      lightIntensity={lightIntensity}
      lightColor={lightColor}
      fov={cameraFov}
      aspect={0}
      near={cameraNear}
      far={cameraFar}
      smoothness={smoothness}
      particleSize={size}
      opacity={opacity}
      minSpeed={speed.min}
      maxSpeed={speed.max}
      shininess={shininess}
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
  const oLen = images.length;
  const imageCount = videoDuration / perImageDuration;
  const allImages: Array<string> = [];

  for (let i = 0; i < imageCount; i++) {
    allImages.push(images[i % oLen]);
  }

  return allImages;
}
