import { RelaxingVideo, RelaxingVideoSchema } from './RelaxingVideo';
import { QuoteReel, QuoteReelSchema, calculateMetadataQuoteReel } from './QuoteReel'
import { MyAudio, MyAudioSchema } from './MyAudio/MyAudio';
import { ZodObject } from 'zod';
import { CalculateMetadataFunction } from 'remotion';
import { DustVideo, DustVideoSchema } from './DustVideo/DustVideo';
import { calculateMetadataQuote, Quote, QuoteSchema } from './Quote/Quote';
import { calculateMetadataHoliReel, HoliReel, HoliReelSchema } from './HoliReel/HoliReel';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CompositionComponents: { [key: string]: React.FC<any> } = {
  RelaxingVideo,
  QuoteReel,
  MyAudio,
  DustVideo,
  Quote,
  HoliReel
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CompositionSchemas: { [key: string]: ZodObject<any> } = {
  RelaxingVideo: RelaxingVideoSchema,
  QuoteReel: QuoteReelSchema,
  MyAudio: MyAudioSchema,
  DustVideo: DustVideoSchema,
  Quote: QuoteSchema,
  HoliReel: HoliReelSchema,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CompositionCalculateMetaDataFns: { [key: string]: CalculateMetadataFunction<any> } = {
  QuoteReel: calculateMetadataQuoteReel,
  Quote: calculateMetadataQuote,
  HoliReel: calculateMetadataHoliReel,
}

export const compositionIds = Object.keys(CompositionComponents);
