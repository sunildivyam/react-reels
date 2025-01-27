import React from 'react';
import { linearTiming, /*springTiming, */ TransitionSeries } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { ZoomImage } from './ZoomImage';

interface ImageSequenceProps {
  images: string[];
  filter?: string;
  durationInFrames: number;
  transitionDuration: number;
}

export const ImageSequence: React.FC<ImageSequenceProps> = ({ images, filter, durationInFrames, transitionDuration }) => {
  function getImageSequences() {
    const len = images.length;
    const imgDuration = (durationInFrames + (transitionDuration * len)) / len;
    // const transitionTiming = springTiming({ durationInFrames: transitionDuration, config: { damping: 200 } });
    const transitionTiming = linearTiming({ durationInFrames: transitionDuration });

    return images.map((imgSrc, index) => <React.Fragment key={index}>
      <TransitionSeries.Sequence
        durationInFrames={imgDuration}>
        {imgSrc && <ZoomImage img={imgSrc} filter={filter || ''} animationDuration={imgDuration} zoomMode="out" />}
        {/* {imgSrc && <PanImage img={imgSrc} filter={filter || ''} animationDuration={imgDuration} panDirection="bottom" />} */}
      </TransitionSeries.Sequence >
      {index < (images.length - 1) && <TransitionSeries.Transition
        timing={transitionTiming}
        presentation={fade()} />
      }
    </React.Fragment>)
  }


  return <TransitionSeries>
    {getImageSequences()}
  </TransitionSeries>
}
