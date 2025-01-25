import './tailwind.css';
import { Composition } from "remotion";
import { MyAudio } from './MyAudio/MyAudio';
import { QuoteReel, calculateMetadataQuoteReel } from './QuoteReel';
import { RelaxingVideo } from './RelaxingVideo';


// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id='relaxingVideo'
        component={RelaxingVideo}
        durationInFrames={8 * 60 * 30}  // 3 minute
        fps={30}
        width={1920}
        height={1080}
        defaultProps={
          {
            "images": [
              "relaxing/images/Har har Gange (1).jpeg",
              "relaxing/images/Har har Gange (2).jpeg",
              "relaxing/images/Har har Gange (3).jpeg",
              "relaxing/images/Har har Gange (4).jpeg",
              "relaxing/images/Har har Gange (5).jpeg",
              "relaxing/images/Har har Gange (6).jpeg",
              "relaxing/images/Har har Gange (7).jpeg",
              "relaxing/images/Har har Gange (8).jpeg",
              "relaxing/images/Har har Gange (9).jpeg",
              "relaxing/images/Har har Gange (10).jpeg"
            ],
            "title": "महाकुंभ और माँ गंगा का संबंध",
            "subTitle": "Relaxing - Meditation - Peaceful",
            "secondaryImage": "",
            "logo": "relaxing/images/logo.png",
            "music": "",
            "imageSeconds": 40
          }
        }
      />

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
              "images/WhatsApp Image 2025-01-22 at 22.42.21_1f01af80.jpg",
              "images/WhatsApp Image 2025-01-22 at 22.42.21_07762208.jpg",
              "images/WhatsApp Image 2025-01-22 at 22.42.21_bc5c0487.jpg",
              "images/WhatsApp Image 2025-01-22 at 22.42.23_bd384b29.jpg"
            ],
            "music": "relaxing/music/Om Namah Shivay.mp3"
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
