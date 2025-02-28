import { BgGradient, CompositionInfo, CompositionProps } from "./Composition.interface";

export const DEFAULT_COMPSITION_PROPS: CompositionProps = {
  name: '',
  title: '',
  subTitle: '',
  summary: '',
  translation: '',
  isVideoType: false,
  filter: 'ForestFilter',
  categoryImage: '',
  logo: '',
  music: '',
  images: [],
  videos: [],
  imageSeconds: 10,
  bgGradient: {
    colors: [
      '#ffaacc',
      '#ffeecc',
      '#ffaaaa',
      '#ffaa11'],
    angle: 45
  } as BgGradient,
  particles: undefined
}


export const DEFAULT_COMPSITION_INFO: CompositionInfo = {
  id: "Quote",
  originalId: "Quote",
  fps: 30,
  width: 1080,
  height: 1920,
  durationInSeconds: 30,
  rangeInSeconds: [],
  transparent: false,
  defaultProps: { ...DEFAULT_COMPSITION_PROPS }
}
