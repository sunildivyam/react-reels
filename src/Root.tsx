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
        durationInFrames={1 * 60 * 30}  // 1 minute
        fps={30}
        width={1920}
        height={1080}
        defaultProps={
          {
            "images": [
              "relaxing/images/Jai Shiv Bhole Bhandari (1).jpeg",
              "relaxing/images/Jai Shiv Bhole Bhandari (2).jpeg",
              "relaxing/images/Jai Shiv Bhole Bhandari (3).jpeg",
              "relaxing/images/Jai Shiv Bhole Bhandari (2).jpeg",
              "relaxing/images/Jai Shiv Bhole Bhandari (4).jpeg",
              "relaxing/images/Jai Shiv Bhole Bhandari (2).jpeg",
              "relaxing/images/Jai Shiv Bhole Bhandari (1).jpeg"],
            "title": "ओम नमः शिवाय",
            "subTitle": "ओम नमः शिवाय, एक प्रसिद्ध हिंदू मंत्र है जो भगवान शिव की स्तुति के लिए प्रयोग किया जाता है। यह मंत्र शक्ति और शांति का प्रतीक है और इसे जाप करने से मन शांत होता है और आत्मिक उन्नति होती है। \"ओम\" शब्द ब्रह्मांड की सृष्टि का प्रतिनिधित्व करता है, जबकि \"नमः शिवाय\" का अर्थ है \"मैं शिव को नमन करता हूँ\"। इस मंत्र का जाप करने से व्यक्ति में सकारात्मक ऊर्जा का संचार होता है और वह मानसिक, शारीरिक और आध्यात्मिक रूप से स्वस्थ रहता है।",
            "secondaryImage": "relaxing/images/mandala-2341704_1920.png",
            "music": "relaxing/music/Om Namah Shivay.mp3",
            "imageSeconds": 20
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
