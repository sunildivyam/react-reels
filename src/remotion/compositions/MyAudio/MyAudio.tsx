import { staticFile, Audio, AbsoluteFill } from "remotion"
import { useAudioData } from "@remotion/media-utils";
import AudioBars from "../../lib/AudioSpectrum/AudioBars";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

export const MyAudioSchema = z.object({
  minDb: z.number(),
  maxDb: z.number(),
  barsCount: z.number(),
  color: z.string(),
  music: z.string(),
  // Extra props
  bgGradient: z.object({ color1: zColor(), color2: zColor(), color3: zColor(), color4: zColor() }).optional(),
});

export type MyAudioType = z.infer<typeof MyAudioSchema>;

export const MyAudio: React.FC<MyAudioType> = ({ minDb, maxDb, barsCount, bgGradient, color, music }) => {
  const musicFile = staticFile(music);
  const audioData = useAudioData(musicFile);
  const background = bgGradient ? `linear-gradient(110deg, ${bgGradient?.color1} 0%, ${bgGradient?.color2} 30%, ${bgGradient?.color3} 50%, ${bgGradient?.color4} 90%)` : 'none';

  return <AbsoluteFill style={{
    background
  }}>
    <AudioBars minDb={minDb} maxDb={maxDb} audioData={audioData} barsCount={barsCount} color={color}></AudioBars>
    <Audio
      loop
      src={musicFile}
    />
  </AbsoluteFill>
}
