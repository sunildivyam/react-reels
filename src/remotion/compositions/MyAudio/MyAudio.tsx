import { staticFile, Audio } from "remotion"
import { useAudioData } from "@remotion/media-utils";
import AudioBars from "../../lib/AudioSpectrum/AudioBars";


const music = staticFile('BeachSerenity.mp3');
const minDb = -100;
const maxDb = -10;

export const MyAudio: React.FC = () => {
  const audioData = useAudioData(music);

  return <>
    <AudioBars minDb={minDb} maxDb={maxDb} audioData={audioData} barsCount={128} color="rgb(211, 238, 2)"></AudioBars>
    <Audio
      loop
      src={music}
    />
  </>
}
