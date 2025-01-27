import React, { useMemo } from "react";
import { z } from "zod";

import { AbsoluteFill, Sequence, staticFile, useVideoConfig, Audio } from "remotion";
import { ImageSequence } from "../../lib/ImageSequence";
import { RotateImage } from "../../lib/RotateImage";
import { SpaceDust } from "../../lib/Particles/SpaceDust";
import ZoomInText from "../../lib/ZoomInText";
import BoxText from "../../lib/BoxText";

export const RelaxingVideoSchema = z.object({
  title: z.string(),
  subTitle: z.string(),
  images: z.array(z.string()),
  secondaryImage: z.string(),
  logo: z.string(),
  music: z.string(),
  imageSeconds: z.number(),
})

export type RelaxingVideoProps = z.infer<typeof RelaxingVideoSchema>;

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
  logo,
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
  const transitionDuration = Math.floor(imagesSequenceDuration / len / 2.5);

  return <AbsoluteFill
    style={{
      background: 'linear-gradient(110deg, rgb(144, 61, 2) 0%, rgb(255, 152, 35) 30%, rgb(158, 71, 42) 50%, rgb(73, 45, 3) 90%)'
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
      <RotateImage img={secondaryImage} animationDuration={PER_IMAGE_DURATION} filter="FireFilter"
        style={{
          width: '50em',
          height: '50em',
          maxWidth: 'none',
          opacity: '0.5'
        }} />
    </AbsoluteFill>}

    {/* Space Dust 1 */}
    <SpaceDust
      count={1000}
      color={'rgb(121, 229, 254)'}
      lightDistance={0}
      lightIntensity={1000}
      lightColor={'rgb(108, 186, 255)'}
      fov={100}
      aspect={0}
      near={0}
      far={30}
      smoothness={3}
      particleSize={0.5}
      opacity={0.15}
      minSpeed={2}
      maxSpeed={15}
    />


    {/* Title */}
    {title && <Sequence from={0} durationInFrames={8 * fps} style={
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
      <RotateImage img={logo} animationDuration={8 * fps} filter=""
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
