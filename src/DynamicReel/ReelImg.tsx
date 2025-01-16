import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { getImageFilter } from "../filters";

type ReelImgProps = {
  img: string;
  filter: string;
}

export const ReelImg: React.FC<ReelImgProps> = ({ img, filter }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const imgScale = interpolate(frame, [0, 15 * fps], [1, 1.8], { extrapolateRight: 'clamp' });
  const imgMoveX = interpolate(frame, [15 * fps, 30 * fps], [0, 20], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return <AbsoluteFill>
    <Img
      style={{
        width,
        height,
        transform: `scale(${imgScale}) translateY(${imgMoveX}%)`,
        filter: getImageFilter(filter)
      }}
      src={staticFile(img)}></Img>
  </AbsoluteFill>
}
