import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { getImageFilter, OverlayFilters } from "../filters";

type RotateImageProps = {
  img: string;
  filter: string;
  animationDuration: number;
  rotateDirection?: 'clockwise' | 'anticlockwise',
  style?: React.CSSProperties
}

export const RotateImage: React.FC<RotateImageProps> = ({ img, filter, animationDuration, rotateDirection, style }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const rotation = rotateDirection === 'clockwise' ? [0, 360] : [0, -360];
  const imgRotation = interpolate(frame, [0, animationDuration], rotation, { extrapolateRight: 'clamp' });
  // const zoom = rotateDirection === 'clockwise' ? [1.8, 1] : [1, 1.8];
  // const imgScale = interpolate(frame, [0, animationDuration], zoom, { extrapolateRight: 'clamp' });

  const OverlayFilter = OverlayFilters[filter || ''];

  return <><Img
    style={{
      width,
      height,
      transform: `rotate(${imgRotation}deg)`,
      filter: getImageFilter(filter),
      ...style
    }}
    src={staticFile(img)} />
    {OverlayFilter && <OverlayFilter />}
  </>
}
