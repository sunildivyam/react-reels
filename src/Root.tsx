import './tailwind.css';
import { Composition } from "remotion";
import { MyAudio } from './MyAudio/MyAudio';
import { QuoteReel, calculateMetadataQuoteReel } from './QuoteReel';


// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id='quoteReel'
        component={QuoteReel}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={calculateMetadataQuoteReel}
        defaultProps={
          {
            "title": "प्रयागराज में धूमधाम से शुरू हुआ महाकुंभ",
            "summary": "लाखों श्रद्धालुओं ने पौष पूर्णिमा पर संगम में डुबकी लगाई, सुरक्षा व्यवस्था चाक-चौबंद.",
            "translation": "Mahakumbh 2025: Grand Beginning",
            "filter": "ForestFilter",
            // "videos": [{ "src": "myvideo.mp4", "duration": 0 }, { "src": "reel1.mp4", "duration": 0 }],
            "images": [
              "images/0-184944813.jpg",
              "images/2-1572030577.jpg"
            ],
            "music": "music/Flutes - Stayloose.mp3"
          }
        }
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
    </>
  );
};
