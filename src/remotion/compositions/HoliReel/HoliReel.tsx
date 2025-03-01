import React from "react"
import { AbsoluteFill, Sequence, staticFile, useVideoConfig, Audio, CalculateMetadataFunction } from "remotion";

import { ImageSequence } from "../../lib/ImageSequence";
import { VideoSequence } from "../../lib/VideoSequence";
// import { parseMedia } from "@remotion/media-parser";
import { getVideoMetadata } from '@remotion/media-utils';
import { z } from "zod";
import BoxText from "../../lib/BoxText";
import { ImageCircle } from "../../lib/ImageCirlce";
import { CompositionPropsSchema } from "../../interfaces";
import { toGradientString } from "../../../client-core-lib/Core";

const FPS = 30;
export const VIDEO_TRANSITION_DURATION = (5 * FPS);

export const HoliReelSchema = CompositionPropsSchema;

export type HoliReelType = z.infer<typeof HoliReelSchema>;

export const HoliReel: React.FC<HoliReelType> = ({ name, title, summary, translation, categoryImage, images, music, videos, filter, isVideoType, bgGradient }) => {
  const { durationInFrames } = useVideoConfig();
  const background = toGradientString(bgGradient) || 'none';
  const imageTransitionDuration = images?.length ? Math.floor(10 / 100 * (durationInFrames / images?.length)) : 0;

  return (
    <AbsoluteFill
      style={{
        background
      }}
    >
      {/* Videos & Images */}
      {isVideoType === true && videos?.length ? <VideoSequence videos={videos} filter={filter || ''} transitionDuration={VIDEO_TRANSITION_DURATION} transitionType="flip" /> :
        images?.length ? <ImageSequence images={images} durationInFrames={durationInFrames} filter={filter} transitionDuration={imageTransitionDuration} /> :
          null}

      <div
        style={{
          zIndex: '0'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
          zIndex: '0'
        }}>
          {categoryImage && <div>
            <ImageCircle img={categoryImage} />
          </div>}
          {name && <div>
            <BoxText text={name} style={{
              fontSize: '5em',
              textShadow: 'none',
              background: '#c5000063',
              color: 'rgb(58 255 0)',
            }} />
          </div>}
        </div>
        <div>
          {/* Texts */}
          {summary && <BoxText text={summary} style={{
            fontSize: '5em',
            textShadow: 'none',
            background: '#c5000063',
            color: 'rgb(255,255,255)',
          }} />}

          {translation && <BoxText text={translation} style={{
            fontSize: '4em',
            textShadow: 'none',
            color: 'rgb(58 255 0)',
          }} />}
        </div>
      </div>

      {/* Music */}
      {music && <Sequence
        durationInFrames={durationInFrames}>
        <Audio
          loop
          src={staticFile(music)}
        />
      </Sequence>}
    </AbsoluteFill>
  );
}

export const calculateMetadataHoliReel: CalculateMetadataFunction<HoliReelType> = async ({ props }) => {
  const fps = FPS;
  let totalDuration = 0;

  if (props.isVideoType === true && props.videos?.length) {
    for (const video of props.videos) {
      /**
       * NOTE: parseMedia() started giving error of infinite loop. So till it resolves,
       * Let's use getVideoMetaData(); while remotion recommends to use parseMedia();
      */
      // const { slowDurationInSeconds } = await parseMedia({
      //   src: staticFile(video.src),
      //   fields: {
      //     slowDurationInSeconds: true,
      //   },
      // });

      const { durationInSeconds: slowDurationInSeconds } = await getVideoMetadata(staticFile(video.src));

      video.duration = slowDurationInSeconds * fps;
      totalDuration += slowDurationInSeconds;
    }

    return {
      durationInFrames: Math.floor(totalDuration * fps) - ((props.videos.length - 1) * (VIDEO_TRANSITION_DURATION / 2)),
      fps
    };
  }

  return {};
}
