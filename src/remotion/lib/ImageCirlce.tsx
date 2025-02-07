import { Img, staticFile, useVideoConfig } from "remotion";

type ImageCircleProps = {
  img: string;
  style?: React.CSSProperties;
}

export const ImageCircle: React.FC<ImageCircleProps> = ({ img, style }) => {
  const { width } = useVideoConfig();

  return <div
    style={{
      width: width / 2,
      height: width / 2,
      overflow: 'hidden',
      borderRadius: '50%',
      ...style
    }}>
    <Img
      style={{
        width: `100%`,
        height: `auto`
      }}
      src={staticFile(img)} />
  </div>
}
