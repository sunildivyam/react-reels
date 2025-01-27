import React from "react"
import { AbsoluteFill, Sequence, staticFile, useVideoConfig, Audio, CalculateMetadataFunction } from "remotion";

import { ImageSequence } from "../lib/ImageSequence";
import { VideoType } from "../lib/Video";
import { VideoSequence } from "../lib/VideoSequence";
import QuoteTextSequence from "./QuoteTextSequence";
import { parseMedia } from "@remotion/media-parser";

const FPS = 30;
export const VIDEO_TRANSITION_DURATION = (5 * FPS);
export const IMAGES_PER_REEL = 2;
export const VIDEOS_PER_REEL = 1;


export type QuoteReelType = {
  title: string;
  summary: string;
  translation: string;
  images?: Array<string>;
  music: string;
  videos?: Array<VideoType>;
  filter?: string;
  youTubeId?: string;
  tags?: Array<string>;
  hashTags?: Array<string>;
}


export const QuoteReel: React.FC<QuoteReelType> = ({ title, summary, translation, images, music, videos, filter, }) => {
  const { durationInFrames, fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(110deg, rgba(0, 132, 255, 1) 0%, rgba(12, 97, 255, 1) 8%, rgba(7, 196, 186, 1) 50%, rgba(27, 99, 255, 1) 98%)'
      }}
    >
      {/* Videos & Images */}
      {videos?.length ? <VideoSequence videos={videos} filter={filter || ''} transitionDuration={VIDEO_TRANSITION_DURATION} transitionType="flip" /> :
        images?.length ? <ImageSequence images={images} durationInFrames={durationInFrames} filter={filter} transitionDuration={10 * fps} /> :
          null}

      {/* Texts */}
      <QuoteTextSequence title={title} summary={summary} translation={translation} />
      {/* <ReelTitle title={title} summary={summary} translation={translation} /> */}

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
  );
}

export const calculateMetadataQuoteReel: CalculateMetadataFunction<QuoteReelType> = async ({ props }) => {
  const fps = FPS;
  let totalDuration = 0;

  if (props.videos?.length) {
    for (let video of props.videos) {
      const { slowDurationInSeconds } = await parseMedia({
        src: staticFile(video.src),
        fields: {
          slowDurationInSeconds: true,
          dimensions: true,
        },
      });

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
