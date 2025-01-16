import React from "react"
import { AbsoluteFill, Sequence, staticFile, useVideoConfig, Audio } from "remotion";
import { ReelImg } from "./ReelImg";
import ReelTitle from "./ReelTitle";
import { ReelVideo } from "./ReelVideo";
import { OverlayFilters } from "../filters";

export type DynamicReelType = {
  name: string;
  title: string;
  translation: string;
  img?: string;
  music: string;
  video?: string;
  filter?: string;
}


export const DynamicReel: React.FC<DynamicReelType> = ({ title, img, music, video, filter, translation }) => {
  const { durationInFrames } = useVideoConfig();
  const OverlayFilter = OverlayFilters[filter || ''];

  return (
    <AbsoluteFill>
      <Sequence
        from={0}
        durationInFrames={durationInFrames}>
        {img && <ReelImg img={img} filter={filter || ''} />}
        {video && <ReelVideo video={video} filter={filter || ''} />}
        {OverlayFilter && <OverlayFilter />}
      </Sequence>

      <ReelTitle title={title} translation={translation} />
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
