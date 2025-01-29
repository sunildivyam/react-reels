import React from 'react';
import { AbsoluteFill, Composition } from 'remotion';
import { HD_VIDEO } from '../constants';

type TrialProps = {
  message: string
}

const Trial: React.FC<TrialProps> = ({ message }) => {
  return <Composition
    id="TrialExpired"
    durationInFrames={5 * HD_VIDEO.FPS}
    width={HD_VIDEO.width}
    height={HD_VIDEO.height}
    fps={HD_VIDEO.FPS}
    component={() => <AbsoluteFill style={{ fontSize: '5em' }}>
      {message}
    </AbsoluteFill>}
  />
}
export default Trial;
