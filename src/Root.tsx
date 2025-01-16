import './tailwind.css';
import { Composition } from "remotion";
import { reelSchema } from './Reel/Reel';
import { quotes } from './data/Quotes';
import { Video } from './Video/Video'
import { MyAudio } from './MyAudio/MyAudio';
import { TransitionVideo } from './TransitionVideo/TransitionVideo';
import { calculateMetadata, DynamicReel } from './DynamicReel';

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render src/index.ts <id> out/video.mp4
        id="reel"
        component={Video}
        durationInFrames={9000}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={reelSchema}
        defaultProps={{
          image: 'wallpaper.jpg',
          bgColor: 'rgba(0,255,0,1)',
          gradient: '',
          color: 'rgba(255,0,0,1)',
          texts: [...quotes].map(o => o.title)
        }}
      />
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render src/index.ts <id> out/video.mp4
        id="myVideo"
        component={MyAudio}
        durationInFrames={9000}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        // You can take the "id" to render a video:
        // npx remotion render src/index.ts <id> out/video.mp4
        id="transitionVideo"
        component={TransitionVideo}
        durationInFrames={9000}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id='dynamicReel'
        component={DynamicReel}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={calculateMetadata}
        defaultProps={
          {
            name: 'wallpaper',
            img: 'wallpaper.jpg',
            // video: 'reel2.mp4',
            music: 'bansuri.mp3',
            filter: 'ForestFilter',
            title: "जीवन का सफ़र कभी आसान नहीं होता, लेकिन उस सफ़र में मिलने वाले अनुभव ही हमें मजबूत बनाते हैं। जीवन के सफ़र में खुशियाँ भी मिलेंगी और दुख भी, लेकिन हमें हर परिस्थिति का सामना करते हुए आगे बढ़ना है।",
          }
        }
      />
    </>
  );
};
