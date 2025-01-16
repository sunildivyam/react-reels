import { AbsoluteFill, interpolate, Loop, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  return <>
    <AbsoluteFill style={{
      width: width,
      height: height,
      borderRadius: '50%',
      overflow: 'hidden'
    }}>
      <AbsoluteFill>
        <Loop durationInFrames={Math.floor(fps * 10)}>
          <OffthreadVideo
            style={{
              transform: 'scale(1)'
            }}
            src={staticFile("videos/shri-laxmi-tree.mp4")}
            volume={(f) =>
              interpolate(f, [0, 240], [0, 1], { extrapolateLeft: "clamp" })
            }
            playbackRate={1}
          // muted
          />
        </Loop>
      </AbsoluteFill >
      <Sequence
        from={0}
        durationInFrames={10 * 60}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <h1
          style={{
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            color: 'white',
            padding: '20px',
          }}
        >This text appears on top of the video!</h1>
      </Sequence>
    </AbsoluteFill>
  </>
};
