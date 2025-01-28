import { MyAudio } from "./MyAudio/MyAudio";
import { calculateMetadataQuoteReel, QuoteReel, QuoteReelSchema } from "./QuoteReel";
import { RelaxingVideo, RelaxingVideoSchema } from "./RelaxingVideo";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const COMPOSITIONS: Array<any> = [
  {
    id: 'relaxingVideo',
    component: RelaxingVideo,
    durationInFrames: (8 * 60 * 30),  // 3 minute
    fps: 30,
    width: 1920,
    height: 1080,
    schema: RelaxingVideoSchema,
    defaultProps: {
      images: [
        "remotion-defaults/images/relaxingVideo-image (1).jpeg",
        "remotion-defaults/images/relaxingVideo-image (2).jpeg",
        "remotion-defaults/images/relaxingVideo-image (3).jpeg",
        "remotion-defaults/images/relaxingVideo-image (4).jpeg",
        "remotion-defaults/images/relaxingVideo-image (5).jpeg",
      ],
      title: "महाकुंभ और माँ गंगा",
      subTitle: "Relaxing - Meditation - Peaceful",
      secondaryImage: "remotion-defaults/images/relaxingVideo-sec-image.png",
      logo: "remotion-defaults/images/logo.png",
      music: "remotion-defaults/music/relaxingVideo.mp3",
      imageSeconds: 40
    }
  },
  {
    id: 'quoteReel',
    component: QuoteReel,
    durationInFrames: 10 * 30,
    fps: 30,
    width: 1080,
    height: 1920,
    calculateMetadata: calculateMetadataQuoteReel,
    schema: QuoteReelSchema,
    defaultProps:
    {
      title: "प्रयागराज में धूमधाम से शुरू हुआ महाकुंभ",
      summary: "लाखों श्रद्धालुओं ने पौष पूर्णिमा पर संगम में डुबकी लगाई, सुरक्षा व्यवस्था चाक-चौबंद.",
      translation: "Mahakumbh2025: Grand Beginning",
      filter: "ForestFilter",
      videos: [
        { src: "remotion-defaults/videos/quoteReel-1.mp4", duration: 0 },
        { src: "remotion-defaults/videos/quoteReel-2.mp4", duration: 0 }
      ],
      images: [
        "remotion-defaults/images/quoteReel-image (1).jpeg",
        "remotion-defaults/images/quoteReel-image (2).jpeg",
        "remotion-defaults/images/quoteReel-image (3).jpeg",
      ],
      music: "remotion-defaults/music/quoteReel.mp3",
      isVideoType: false,
    }
  },
  {
    id: "myVideo",
    component: MyAudio,
    durationInFrames: 9000,
    fps: 30,
    width: 1080,
    height: 1920,
  }
]
