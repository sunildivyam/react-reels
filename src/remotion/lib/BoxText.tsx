import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface BoxTextProps {
  text: string;
  style?: React.CSSProperties;
}

const BoxText: React.FC<BoxTextProps> = ({ text, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, durationInFrames: 2 * fps, config: { damping: 10 } });

  return (
    <p
      style={{
        backgroundColor: 'rgba(60, 60, 60, 0.4)',
        color: 'rgba(255,255,255, 1)',
        textShadow: '3px -3px 1px rgba(255, 81, 0, 0.82)',
        borderRadius: '0.5em',
        padding: '0.5em',
        margin: '0.5em',
        fontSize: '6em',
        textAlign: 'center',
        transform: `scale(${scale})`,
        // opacity: titleOpacity
        ...style
      }}
    >
      {text}
    </p>
  );
};

export default BoxText;
