import { BgGradient } from "../Services/Composition.interface";

export function formatDuration(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
