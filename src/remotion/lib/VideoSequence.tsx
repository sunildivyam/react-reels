import React from 'react';
import { linearTiming, /*springTiming, */ TransitionSeries } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { flip } from '@remotion/transitions/flip';
import { clockWipe } from '@remotion/transitions/clock-wipe';
import { Video, VideoType } from './Video';

const DEFAULT_TRANSITION = 'fade';

const transitions = {
  fade,
  wipe,
  clockWipe,
  flip,
  slide
};

interface VideoSequenceProps {
  videos: Array<VideoType>;
  filter?: string;
  transitionDuration: number;
  transitionType?: 'fade' | 'wipe' | 'clockWipe' | 'flip' | 'slide'
}

export const VideoSequence: React.FC<VideoSequenceProps> = ({ videos, filter, transitionDuration, transitionType }) => {
  transitionType = transitionType || DEFAULT_TRANSITION;
  const transition: any = transitions[transitionType] || transitions[DEFAULT_TRANSITION];

  function getVideoSequences() {
    // const transitionTiming = springTiming({ durationInFrames: transitionDuration, config: { damping: 200 } });
    const transitionTiming = linearTiming({ durationInFrames: transitionDuration });

    return videos.map((video, index) => <React.Fragment key={index}>
      <TransitionSeries.Sequence
        durationInFrames={video.duration + (transitionDuration / 2)}>
        {<Video video={video} filter={filter || ''} />}
      </TransitionSeries.Sequence >
      {index < (videos.length - 1) && <TransitionSeries.Transition
        timing={transitionTiming}
        presentation={transition()} />
      }
    </React.Fragment>)
  }

  return <TransitionSeries>
    {getVideoSequences()}
  </TransitionSeries>
}
