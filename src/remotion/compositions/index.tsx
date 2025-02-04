import { RelaxingVideo, RelaxingVideoSchema } from './RelaxingVideo';
import { QuoteReel, QuoteReelSchema, calculateMetadataQuoteReel } from './QuoteReel'
import { MyAudio, MyAudioSchema } from './MyAudio/MyAudio';
import { ZodObject } from 'zod';
import { CalculateMetadataFunction } from 'remotion';
import { DustVideo, DustVideoSchema } from './DustVideo/DustVideo';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CompositionComponents: { [key: string]: React.FC<any> } = {
  RelaxingVideo,
  QuoteReel,
  MyAudio,
  DustVideo,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CompositionSchemas: { [key: string]: ZodObject<any> } = {
  RelaxingVideo: RelaxingVideoSchema,
  QuoteReel: QuoteReelSchema,
  MyAudio: MyAudioSchema,
  DustVideo: DustVideoSchema
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CompositionCalculateMetaDataFns: { [key: string]: CalculateMetadataFunction<any> } = {
  QuoteReel: calculateMetadataQuoteReel,
}
