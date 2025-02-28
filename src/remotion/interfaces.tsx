import { zColor } from "@remotion/zod-types";
import { z } from "zod";


export const SocialMediaSchema = z.object({
  tags: z.array(z.string()).optional(),
  hashTags: z.array(z.string()).optional(),
})

export const VideoInfoSchema = z.object({
  src: z.string(),
  duration: z.number().optional(),
})

export const BgGradientSchema = z.object({
  colors: z.array(zColor()),
  angle: z.number()
})

export const CompositionParticlesSchema = z.object({
  count: z.number(),
  speed: z.object({ min: z.number(), max: z.number() }),
  opacity: z.number(),
  smoothness: z.number(),
  size: z.number(),
  color: zColor(),
  lightDistance: z.number(),
  lightIntensity: z.number(),
  lightColor: zColor(),
  cameraFov: z.number(),
  cameraNear: z.number(),
  cameraFar: z.number(),
  shininess: z.number(),
})

export const YoutubeInfoSchema = z.object({
  channelId: z.string().optional(),
  videoId: z.string().optional(),
  uploadedOn: z.date().optional(),
  publishedAt: z.date().optional(),
  scheduleAfterHrs: z.number().optional(),
})


export const CompositionPropsSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  subTitle: z.string().optional(),
  summary: z.string().optional(),
  translation: z.string().optional(),
  isVideoType: z.boolean().optional(),
  filter: z.string().optional(),
  categoryImage: z.string().optional(),
  logo: z.string().optional(),
  music: z.string().optional(),
  images: z.array(z.string()).optional(),
  videos: z.array(VideoInfoSchema).optional(),
  imageSeconds: z.number().optional(),
  bgGradient: BgGradientSchema.optional(),
  particles: CompositionParticlesSchema.optional(),
})

export const CompositionInfoSchema = z.object({
  id: z.string(),
  originalId: z.string(),
  fps: z.number(),
  width: z.number(),
  height: z.number(),
  durationInSeconds: z.number(),
  rangeInSeconds: z.union([z.tuple([z.number(), z.number()]), z.array(z.never())]),
  transparent: z.boolean(),
  defaultProps: CompositionPropsSchema,
})

export const VideoRecordSchema = z.object({
  id: z.string(),
  compositionInfo: CompositionInfoSchema,
  outFileName: z.string(),
  socialMedia: SocialMediaSchema.optional(),
  youTube: YoutubeInfoSchema.optional(),
  instagram: z.object({}).optional(),
  renderedOn: z.date().optional(),
})

export type SocialMedia = z.infer<typeof SocialMediaSchema>;
export type VideoInfo = z.infer<typeof VideoInfoSchema>;
export type BgGradient = z.infer<typeof BgGradientSchema>;
export type CompositionParticles = z.infer<typeof CompositionParticlesSchema>;
export type YoutubeInfo = z.infer<typeof YoutubeInfoSchema>;
export type CompositionProps = z.infer<typeof CompositionPropsSchema>;
export type CompositionInfo = z.infer<typeof CompositionInfoSchema>;
export type VideoRecord = z.infer<typeof VideoRecordSchema>;
