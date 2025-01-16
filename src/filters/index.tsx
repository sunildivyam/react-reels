import { AbsoluteFill } from "remotion";


/**
 * Keep Adding overlay filters here, and use filter name in the data of quoteReels
 */
export interface FilterType {
  [key: string]: React.FC
}

export const OverlayFilters: FilterType = {
  ForestFilter: () => <AbsoluteFill
    style={
      {
        background: 'linear-gradient(110deg, rgba(99, 255, 56, 0.1) 0%, rgba(215, 255, 35,0.1) 8%, rgba(35, 255, 2, 0.1) 50%, rgba(1, 160, 75, 0.1) 98%)'
      }
    }>
  </AbsoluteFill>,

  SkyFilter: () => <AbsoluteFill
    style={
      {
        background: 'linear-gradient(110deg, rgba(14, 163, 255, 0.1) 0%, rgba(0, 213, 255, 0.1) 8%, rgba(100, 198, 255, 0.1) 50%, rgba(21, 205, 247, 0.1) 98%)',
      }
    }>
  </AbsoluteFill>

}

const imageFilters: any = {
  ForestFilter: 'saturate(1.5)',
  SkyFilter: 'hue-rotate(30deg)'
}

export const getImageFilter = (name: string): string => {
  return imageFilters[name];
}
