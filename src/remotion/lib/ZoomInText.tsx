import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';

interface ZoomInTextProps {
  text: string;
  separator?: string;
  animationDuration: number;
  shadowColor?: string;
  color?: string;
  style?: React.CSSProperties;
}


// const WORDS_DURATION_PART = 5;
const WORD_SCALE = 5;
const WORD_DURATION = 10;
const DEFAULT_PROPS: ZoomInTextProps = {
  text: 'Sample Text',
  separator: '',
  animationDuration: 60,
  shadowColor: 'rgba(255,255,255, 1)',
  color: 'rgb(217, 255, 0)',
}

const ZoomInText: React.FC<ZoomInTextProps> = ({ text, separator, animationDuration, shadowColor, color, style }) => {
  text = text ?? DEFAULT_PROPS.text;
  separator = separator ?? DEFAULT_PROPS.separator;
  animationDuration = animationDuration ?? DEFAULT_PROPS.animationDuration;
  shadowColor = shadowColor ?? DEFAULT_PROPS.shadowColor;
  color = color ?? DEFAULT_PROPS.color;
  const frame = useCurrentFrame();

  const words = separator !== undefined ? text.split(separator) : [text];

  const durationPerWord = animationDuration / words.length;
  const currentWordIndex = Math.floor(frame / durationPerWord);

  const displayedTitle = words.slice(0, currentWordIndex).join(' ');

  const wordStartFrame = Math.floor(currentWordIndex * durationPerWord);

  const wordScale = interpolate(
    frame,
    [wordStartFrame,
      wordStartFrame + WORD_DURATION],
    [WORD_SCALE, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0, 0, 1, 1)
    });

  return (
    <p
      style={{
        backgroundColor: 'rgba(60, 60, 60, 0.4)',
        color: `${color}`,
        textShadow: `${shadowColor} 1px 8px 14px`,
        borderRadius: '0.5em',
        padding: '0.5em',
        margin: '0.5em',
        fontSize: '6em',
        textAlign: 'center',
        // transform: `scale(${titleScale}) translateY(${titleMoveY}%)`,
        // opacity: titleOpacity
        ...style
      }}
    >
      {displayedTitle}
      <span
        style={{
          display: 'inline-block',
          color: 'rgb(234, 255, 0)',
          paddingLeft: '0.1em',
          transform: `scale(${wordScale})`
        }}
      >
        {words[currentWordIndex]}
      </span>
    </p>
  );
};

export default ZoomInText;
