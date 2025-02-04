import React from 'react';
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { visualizeAudio, AudioData } from "@remotion/media-utils";
import { getAmplitude, getColorFromValue, stringToRGBType } from './AudioHelpers';

interface AudioBarType {
  color: string;
  width: number;
  height: number;
}

interface AudioBarsProps {
  minDb: number;
  maxDb: number;
  audioData: AudioData | null;
  barsCount: number;
  color: string;
  style?: React.CSSProperties;
}

const AudioBars: React.FC<AudioBarsProps> = ({ minDb, maxDb, audioData, barsCount, color, style }) => {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();

  let vSamples = audioData && visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: barsCount,
  }) || [];

  const bars = getBars(vSamples, minDb, maxDb, color);

  function getBars(frequencyData: Array<number>, minDb: number, maxDb: number, color: string) {
    const barCount = vSamples.length;

    const bars = frequencyData.map((value) => {
      const amp = getAmplitude(value, minDb, maxDb);
      const barColor = getColorFromValue(stringToRGBType(color), amp)
      const barHeight = amp * height;
      const barWidth = width / barCount;
      const bar: AudioBarType = { color: barColor, width: barWidth, height: barHeight }
      return bar;
    });

    return bars;
  }

  return (<AbsoluteFill style={{
    backgroundColor: 'rgb(0, 0, 0)',
    width: '100%',
    height: '100%',
    color: 'white',
    fontSize: '2em',
    ...style
  }}>
    {
      bars.map((bar, i) => <AbsoluteFill key={i}
        style={{
          color: 'white',
          transformOrigin: 'left bottom',
          background: `linear-gradient(to top, ${bar.color} 0%, ${bar.color} 80%, rgb(245, 237, 237) 99%`,
          width: `${bar.width}px`,
          bottom: '0px',
          height: `1px`,
          transform: `translate(${i * bar.width}px, ${height}px) scaleY(${bar.height})`
        }}
      />)
    }
  </AbsoluteFill >
  );
};

export default AudioBars;
