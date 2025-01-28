import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { getImageFilter, OverlayFilters } from "../filters";

type PanImageProps = {
  img: string;
  filter: string;
  animationDuration: number;
  panDirection?: 'left' | 'right' | 'top' | 'bottom'
}

export const PanImage: React.FC<PanImageProps> = ({ img, filter, animationDuration, panDirection }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const PAN_SIZE = 15;
  const panFactor = ['left', 'top'].includes(panDirection || '') ? [0, -PAN_SIZE] : [0, PAN_SIZE];
  const imgPan = interpolate(frame, [0, animationDuration], panFactor, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const translate = panDirection === 'left' || panDirection === 'right' ? `translateX(${imgPan}%)` : `translateY(${imgPan}%)`
  const OverlayFilter = OverlayFilters[filter || ''];

  return <AbsoluteFill>
    <Img
      style={{
        width,
        height,
        transform: `scale(${1 + (3 * PAN_SIZE / 100)}) ${translate}`,
        filter: getImageFilter(filter)
      }}
      src={staticFile(img)} />
    {OverlayFilter && <OverlayFilter />}
  </AbsoluteFill>
}
