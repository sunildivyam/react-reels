import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { getImageFilter, OverlayFilters } from "../filters";

type ZoomImageProps = {
  img: string;
  filter: string;
  animationDuration: number;
  zoomMode?: 'in' | 'out'
}

export const ZoomImage: React.FC<ZoomImageProps> = ({ img, filter, animationDuration, zoomMode }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const zoom = zoomMode === 'in' ? [1.8, 1] : [1, 1.8];
  const imgScale = interpolate(frame, [0, animationDuration], zoom, { extrapolateRight: 'clamp' });
  const OverlayFilter = OverlayFilters[filter || ''];

  return <>
    <Img
      style={{
        width,
        height,
        transform: `scale(${imgScale})`,
        filter: getImageFilter(filter)
      }}
      src={staticFile(img)}></Img>
    {OverlayFilter && <OverlayFilter />}
  </>
}
