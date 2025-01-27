import { staticFile, useCurrentFrame, useVideoConfig, Audio } from "remotion"
import { useAudioData, visualizeAudio } from "@remotion/media-utils";

const music = staticFile('BeachSerenity.mp3');
export const MyAudio: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();
  const audioData = useAudioData(music);

  if (!audioData) return null;

  const visualization = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: 64,
  });


  return <>
    <div>
      <Audio
        src={music}
      >
      </Audio>
      {
        visualization.map((v) => {
          return (
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 100, height: 1000 * v, backgroundColor: `rgba(${150 * v}, ${100 * v}, ${50 * v}, 1)` }}></div>
          );
        })
      }

    </div>
  </>
}
