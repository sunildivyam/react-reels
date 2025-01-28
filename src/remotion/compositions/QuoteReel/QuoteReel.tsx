import React from "react"
import { AbsoluteFill, Sequence, staticFile, useVideoConfig, Audio, CalculateMetadataFunction } from "remotion";

import { ImageSequence } from "../../lib/ImageSequence";
import { VideoSchema } from "../../lib/Video";
import { VideoSequence } from "../../lib/VideoSequence";
import QuoteTextSequence from "./QuoteTextSequence";
// import { parseMedia } from "@remotion/media-parser";
import { getVideoMetadata } from '@remotion/media-utils';
import { z } from "zod";

const FPS = 30;
export const VIDEO_TRANSITION_DURATION = (5 * FPS);
export const IMAGES_PER_REEL = 2;
export const VIDEOS_PER_REEL = 1;

export const QuoteReelSchema = z.object({
  title: z.string(),
  summary: z.string(),
  translation: z.string(),
  images: z.array(z.string()),
  music: z.string(),
  videos: z.array(VideoSchema),
  filter: z.string(),
  youTubeId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  hashTags: z.array(z.string()).optional(),
  isVideoType: z.boolean().optional()
});

export type QuoteReelType = z.infer<typeof QuoteReelSchema>;

export const QuoteReel: React.FC<QuoteReelType> = ({ title, summary, translation, images, music, videos, filter, isVideoType }) => {
  const { durationInFrames, fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(110deg, rgba(0, 132, 255, 1) 0%, rgba(12, 97, 255, 1) 8%, rgba(7, 196, 186, 1) 50%, rgba(27, 99, 255, 1) 98%)'
      }}
    >
      {/* Videos & Images */}
      {isVideoType === true && videos?.length ? <VideoSequence videos={videos} filter={filter || ''} transitionDuration={VIDEO_TRANSITION_DURATION} transitionType="flip" /> :
        images?.length ? <ImageSequence images={images} durationInFrames={durationInFrames} filter={filter} transitionDuration={10 * fps} /> :
          null}

      {/* Texts */}
      <QuoteTextSequence title={title} summary={summary} translation={translation} />
      {/* <ReelTitle title={title} summary={summary} translation={translation} /> */}

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

export const calculateMetadataQuoteReel: CalculateMetadataFunction<QuoteReelType> = async ({ props }) => {
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
