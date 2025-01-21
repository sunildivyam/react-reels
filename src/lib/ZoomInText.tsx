import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';

interface ZoomInTextProps {
  text: string;
  separator?: string;
  animationDuration: number;
}


// const WORDS_DURATION_PART = 5;
const WORD_SCALE = 5;
const WORD_DURATION = 10;


const ZoomInText: React.FC<ZoomInTextProps> = ({ text, separator, animationDuration }) => {
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
    <AbsoluteFill>
      <p
        style={{
          // backgroundColor: 'rgba(60, 60, 60, 0.4)',
          color: 'rgba(255,255,255, 1)',
          textShadow: '3px -3px 1px rgb(255, 242, 0)',
          borderRadius: '0.5em',
          padding: '0.5em',
          margin: '0.5em',
          fontSize: '6em',
          textAlign: 'center',
          // transform: `scale(${titleScale}) translateY(${titleMoveY}%)`,
          // opacity: titleOpacity
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

    </AbsoluteFill>
  );
};

export default ZoomInText;
