import { springTiming, TransitionSeries } from '@remotion/transitions';
import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import ZoomInText from '../lib/ZoomInText';
import { slide } from '@remotion/transitions/slide';
import BoxText from '../lib/BoxText';

interface QuoteTextSequenceProps {
  title: string;
  summary: string;
  translation: string;
}

const QuoteTextSequence: React.FC<QuoteTextSequenceProps> = ({ title, summary, translation }) => {
  const { fps, durationInFrames } = useVideoConfig();

  const texts = [title, summary, translation];
  const LASTSEQUENCE_RATIO = 20;  // All Texts Together
  const LASTSEQUENCE_DURATION = Math.floor(LASTSEQUENCE_RATIO / 100 * durationInFrames);
  const SEQUENCE_RATIOS = [20, 40, 20]; // Total of items should be (100 - LASTSEQUENCE_RATIO)

  const SEQUENCE_COUNT = texts.length;
  const TRANSITION_DURATION = 2 * fps;
  const ANIMATION_SPEED = 5;

  function textDuration(index: number) {
    const ratio = SEQUENCE_RATIOS[index];
    const duration = Math.floor(ratio / 100 * durationInFrames) + (index * ((SEQUENCE_COUNT - 1) * (TRANSITION_DURATION / 2)));
    return duration;
  }
  function textAnimationDuration(index: number) {
    const ratio = SEQUENCE_RATIOS[index];
    const duration = Math.floor(ratio / 100 * durationInFrames / ANIMATION_SPEED);
    return duration;
  }

  const transition = <TransitionSeries.Transition timing={springTiming({ durationInFrames: TRANSITION_DURATION, config: { damping: 200 } })} presentation={slide({ direction: "from-top" })} />

  return (<><TransitionSeries>
    {texts.map((text, i) => <>
      <TransitionSeries.Sequence durationInFrames={textDuration(i)}>
        <ZoomInText text={texts[i]} separator={' '} animationDuration={textAnimationDuration(i)} />
      </TransitionSeries.Sequence>
      {/* Last Sequence should not have Transition */}
      {i < (SEQUENCE_COUNT - 1) ? transition : null}
    </>)}
  </TransitionSeries>
    <Sequence from={durationInFrames - LASTSEQUENCE_DURATION} durationInFrames={LASTSEQUENCE_DURATION}>
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <BoxText text={title} style={{
          fontSize: '8em',
          background: 'linear-gradient(110deg, rgba(7, 5, 119, 0.5) 0%, rgba(0, 36, 155, 0.5) 8%, rgba(2, 74, 207, 0.5) 50%, rgba(2, 141, 255, 0.5) 98%)',
          color: 'rgb(255, 251, 0)'
        }} />
        <BoxText text={summary} style={{
          fontSize: '6em',
          background: 'linear-gradient(110deg, rgba(7, 5, 119, 0.9) 0%, rgba(0, 36, 155, 0.9) 8%, rgba(2, 74, 207, 0.9) 50%, rgba(2, 141, 255, 0.9) 98%)',
          color: 'rgb(255, 0, 0)'
        }} />
        {/* <BoxText text={translation} /> */}
      </AbsoluteFill>
    </Sequence>
  </>)
};

export default QuoteTextSequence;
