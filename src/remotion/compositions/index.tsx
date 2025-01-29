import { RelaxingVideo, RelaxingVideoSchema } from './RelaxingVideo';
import { QuoteReel, QuoteReelSchema, calculateMetadataQuoteReel } from './QuoteReel'
import { MyAudio } from './MyAudio/MyAudio';
import { ZodObject } from 'zod';
import { CalculateMetadataFunction } from 'remotion';



export const CompositionComponents: { [key: string]: React.FC<any> } = {
  RelaxingVideo,
  QuoteReel,
  MyAudio,
};

export const CompositionSchemas: { [key: string]: ZodObject<any> } = {
  RelaxingVideo: RelaxingVideoSchema,
  QuoteReel: QuoteReelSchema,
}

export const CompositionCalculateMetaDataFns: { [key: string]: CalculateMetadataFunction<any> } = {
  QuoteReel: calculateMetadataQuoteReel,
}
