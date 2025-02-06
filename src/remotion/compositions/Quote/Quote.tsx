import React from "react"
import { AbsoluteFill, Sequence, staticFile, useVideoConfig, Audio, CalculateMetadataFunction, Img } from "remotion";

import { ImageSequence } from "../../lib/ImageSequence";
import { VideoSchema } from "../../lib/Video";
import { VideoSequence } from "../../lib/VideoSequence";
// import { parseMedia } from "@remotion/media-parser";
import { getVideoMetadata } from '@remotion/media-utils';
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import BoxText from "../../lib/BoxText";
import { ImageCircle } from "../../lib/ImageCirlce";

const FPS = 30;
export const VIDEO_TRANSITION_DURATION = (5 * FPS);

export const QuoteSchema = z.object({
  name: z.string(),
  title: z.string(),
  summary: z.string(),
  translation: z.string(),
  categoryImage: z.string(),
  images: z.array(z.string()),
  music: z.string(),
  videos: z.array(VideoSchema),
  filter: z.string(),
  youTubeId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  hashTags: z.array(z.string()).optional(),
  isVideoType: z.boolean().optional(),
  // Extra props
  bgGradient: z.object({ color1: zColor(), color2: zColor(), color3: zColor(), color4: zColor() }).optional(),
});

export type QuoteType = z.infer<typeof QuoteSchema>;

export const Quote: React.FC<QuoteType> = ({ name, title, summary, translation, categoryImage, images, music, videos, filter, isVideoType, bgGradient }) => {
  const { durationInFrames, fps } = useVideoConfig();
  const background = bgGradient ? `linear-gradient(110deg, ${bgGradient?.color1} 0%, ${bgGradient?.color2} 30%, ${bgGradient?.color3} 50%, ${bgGradient?.color4} 90%)` : 'none';

  return (
    <AbsoluteFill
      style={{
        background
      }}
    >
      {/* Videos & Images */}
      {isVideoType === true && videos?.length ? <VideoSequence videos={videos} filter={filter || ''} transitionDuration={VIDEO_TRANSITION_DURATION} transitionType="flip" /> :
        images?.length ? <ImageSequence images={images} durationInFrames={durationInFrames} filter={filter} transitionDuration={10 * fps} /> :
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
          <div>
            <ImageCircle img={categoryImage} />
          </div>
          <div>
            <BoxText text={name} style={{
              fontSize: '5em',
              textShadow: 'none',
              background: 'none',
              color: 'rgb(0, 0, 0)'
            }} />
          </div>
        </div>
        <div>
          {/* Texts */}
          <BoxText text={summary} style={{
            fontSize: '5em',
            textShadow: 'none',
            background: 'none',
            color: 'rgb(0,0,0)'
          }} />

          <BoxText text={translation} style={{
            fontSize: '4em',
            textShadow: 'none',
            background: 'none',
            color: 'rgb(0,0,0)'
          }} />
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

export const calculateMetadataQuote: CalculateMetadataFunction<QuoteType> = async ({ props }) => {
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
