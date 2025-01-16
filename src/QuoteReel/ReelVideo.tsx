import { AbsoluteFill, CalculateMetadataFunction, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { parseMedia } from '@remotion/media-parser';
import { QuoteReelType } from "./QuoteReel";
import { useCallback, useRef } from "react";
import { getImageFilter } from "../filters";

type ReelVideoProps = {
  video: string;
  filter: string;
}

export const calculateMetadata: CalculateMetadataFunction<QuoteReelType> = async ({ props }) => {
  const fps = 30;

  if (props.video) {
    const { slowDurationInSeconds } = await parseMedia({
      src: staticFile(props.video),
      fields: {
        slowDurationInSeconds: true,
        dimensions: true,
      },
    });
    return {
      durationInFrames: Math.floor(slowDurationInSeconds * fps),
      fps
    };
  }

  return {};
}

export const ReelVideo: React.FC<ReelVideoProps> = ({ video, filter }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  const videoScale = interpolate(frame, [0, (durationInFrames / 2)], [1, 1.8], { extrapolateRight: 'clamp' });
  const videoMoveX = interpolate(frame, [durationInFrames / 2, durationInFrames], [0, 20], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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
          transform: `scale(${videoScale}) translateY(${videoMoveX}%)`
        }}
        src={staticFile(video)}
        playbackRate={1}
        muted
        onVideoFrame={onVideoFrame}
      />

      {/* </Loop> */}
    </AbsoluteFill>
    filter && <AbsoluteFill>
      <canvas ref={canvas} width={width} height={height} />
    </AbsoluteFill>
  </AbsoluteFill>
}
