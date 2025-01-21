import { AbsoluteFill, OffthreadVideo, staticFile, useVideoConfig } from "remotion";

import { useCallback, useRef } from "react";
import { getImageFilter, OverlayFilters } from "../filters";


export type VideoType = {
  src: string;
  duration: number;
}

type VideoProps = {
  video: VideoType;
  filter: string;
}


export const Video: React.FC<VideoProps> = ({ video, filter }) => {
  const { width, height } = useVideoConfig();
  const OverlayFilter = OverlayFilters[filter || ''];

  // Apply Filter
  const canvas = useRef<HTMLCanvasElement>(null);
  // process each frame
  const onVideoFrame = useCallback((vFrame: CanvasImageSource) => {
    if (!filter || !canvas.current) return;

    const context = canvas.current.getContext('2d');

    if (!context) return;
    console.log(filter);
    context.filter = getImageFilter(filter || '');
    context.drawImage(vFrame, 0, 0, width, height);
  }, [width, height]);

  return <AbsoluteFill>
    <AbsoluteFill>
      {/* <Loop durationInFrames={durationInFrames}> */}
      <OffthreadVideo
        style={{
          width,
          height,
          opacity: filter ? 0 : 1,
        }}
        src={staticFile(video.src)}
        playbackRate={1}
        muted
        onVideoFrame={onVideoFrame}
      />

      {/* </Loop> */}
    </AbsoluteFill>
    filter && <AbsoluteFill>
      <canvas ref={canvas} width={width} height={height} />
    </AbsoluteFill>
    {OverlayFilter && <OverlayFilter />}
  </AbsoluteFill>
}
