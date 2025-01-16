import React from 'react';
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

interface ReelTitleProps {
  title: string;
  translation: string;
}

const WORDS_DURATION_PART = 5;
const WORD_SCALE = 5;
const WORD_DURATION = 10;


const generatePhrases = (text: string, chars: Array<string>) => {
  let result: string[] = [text];
  chars.forEach(char => {
    result = result.flatMap(part => part.split(char));
  });
  return result.map(part => part.trim()).filter(part => part);
}

const ReelTitle: React.FC<ReelTitleProps> = ({ title, translation }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const phrases = generatePhrases(translation, ['। ', '. ', ', ']);
  const words = title.split(' ');

  const wordsEndFrame = durationInFrames / WORDS_DURATION_PART;
  const durationPerWord = wordsEndFrame / words.length;
  const currentWordIndex = Math.floor(frame / (durationPerWord));
  const displayedTitle = words.slice(0, currentWordIndex + 1).join(' ');

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

  const titleStartFrame = wordsEndFrame;
  const titleEndFrame = durationInFrames / 1.1;

  const titleOpacity = interpolate(
    frame,
    [titleEndFrame - fps,
      titleEndFrame],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.ease
    });

  const titleScale = interpolate(
    frame,
    [titleStartFrame,
      titleEndFrame],
    [1, 1.23],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bounce
    });

  const titleMoveY = interpolate(
    frame,
    [titleStartFrame,
      titleEndFrame],
    [0, 50],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.elastic(5)
    });

  return (<>
    <Sequence
      from={0}
      durationInFrames={titleEndFrame}
    >
      <AbsoluteFill>
        <p
          style={{
            backgroundColor: 'rgba(60, 60, 60, 0.4)',
            color: 'rgba(255,255,255, 1)',
            textShadow: '4px -5px 1px rgb(255, 242, 0)',
            borderRadius: '0.5em',
            padding: '0.5em',
            margin: '0.5em',
            fontSize: '6em',
            textAlign: 'center',
            transform: `scale(${titleScale}) translateY(${titleMoveY}%)`,
            opacity: titleOpacity
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
            {words[currentWordIndex + 1]}
          </span>
        </p>

      </AbsoluteFill>
    </Sequence>

    <Sequence
      from={(titleEndFrame - fps)}
      durationInFrames={durationInFrames - titleStartFrame}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
        {
          phrases.map(w => <p
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              color: 'rgb(225, 255, 0)',
              textShadow: '4px -12px 1px black',
              borderRadius: '0.5em',
              padding: '0.5em',
              margin: '0.2em',
              fontSize: '7em',
              textAlign: 'center'
            }}
          >{w}</p>)
        }
      </div>
    </Sequence>
  </>
  );
};

export default ReelTitle;
