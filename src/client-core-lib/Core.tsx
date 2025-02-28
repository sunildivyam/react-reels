import { BgGradient } from "../remotion/interfaces";

export const runFetch = async (url: string) => {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const jsonData = JSON.parse(text);
    return jsonData;
  } catch (error) {
    // console.log(`Error fetching or parsing the file ${url}:, ${(error as any)?.message}`);
    return null;
  };

}

export const deepCopy = (obj: object): object => {
  return JSON.parse(JSON.stringify(obj));
}


export function toGradientString(gradient?: BgGradient): string {
  if (!gradient?.colors?.length) return '';

  const stopSize = Math.floor(100 / (gradient.colors.length - 1));
  const stops = gradient.colors.map((color, index) => {
    if (index === 0) return `${color} 0%`;
    if (index === gradient.colors.length - 1) return `${color} 100%`;
    return `${color} ${index * stopSize}%`;
  });

  return `linear-gradient(${gradient.angle || 45}deg, ${stops.join(', ')})`;
}
