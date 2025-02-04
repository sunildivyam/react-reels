import React from 'react';
import { linearTiming, TransitionSeries } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { ZoomImage } from './ZoomImage';

interface ImageSequenceProps {
  readonly images: string[];
  readonly filter?: string;
  readonly durationInFrames: number;
  readonly transitionDuration: number;
}

export const ImageSequence: React.FC<ImageSequenceProps> = ({ images, filter, durationInFrames, transitionDuration }) => {
  function getImageSequences() {
    const len = images.length;
    const imgDuration = (durationInFrames + (transitionDuration * len)) / len;
    // const transitionTiming = springTiming({ durationInFrames: transitionDuration, config: { damping: 200 } });
    const transitionTiming = linearTiming({ durationInFrames: transitionDuration });

    const imageSequences = images.map((imgSrc, index) => <React.Fragment key={index}>
      <TransitionSeries.Sequence
        durationInFrames={imgDuration}>
        {imgSrc && <ZoomImage img={imgSrc} filter={filter || ''} animationDuration={imgDuration} zoomMode="out" />}
        {/* {imgSrc && <PanImage img={imgSrc} filter={filter || ''} animationDuration={imgDuration} panDirection="bottom" />} */}
      </TransitionSeries.Sequence >
      {index < (images.length - 1) && <TransitionSeries.Transition
        timing={transitionTiming}
        presentation={fade()} />
      }
    </React.Fragment>);
    if (imageSequences?.length) {
      return <TransitionSeries>
        {imageSequences}
      </TransitionSeries>
    }

    return null;
  }


  return getImageSequences();
}
