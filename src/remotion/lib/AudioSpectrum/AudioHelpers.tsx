export interface RGBType {
  r: number;
  g: number;
  b: number;
}

export const getAmplitude = (value: number, minDb: number, maxDb: number) => {
  // convert to decibels (will be in the range `-Infinity` to `0`)
  const db = 20 * Math.log10(value);

  // scale to fit between min and max
  const scaled = (db - minDb) / (maxDb - minDb);

  return scaled;
}

export const getColorFromValue = (color: RGBType | null, value: number) => {
  if (!color) return '';
  const r = Math.round(color.r * value);
  const g = Math.round(color.g * value);
  const b = Math.round(color.b * value);

  return `rgb(${r}, ${g}, ${b})`;
}

export const stringToRGBType = (color: string): RGBType | null => {
  let r, g, b;

  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    } else {
      return null;
    }
  } else if (color.startsWith('rgb')) {
    const values = color.match(/\d+/g);
    if (values && values.length >= 3) {
      r = parseInt(values[0], 10);
      g = parseInt(values[1], 10);
      b = parseInt(values[2], 10);
    } else {
      return null;
    }
  } else {
    return null;
  }

  return { r, g, b };
}
