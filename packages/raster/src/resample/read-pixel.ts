/* @layer core @kind logic */
import type { BorderRule, IndexImage } from './resample.type';

const readPixel = (image: IndexImage, x: number, y: number, border: BorderRule): number => {
  const { width, height, pixels } = image;
  if (border === 'clamp') return pixels[Math.max(0, Math.min(y, height - 1)) * width + Math.max(0, Math.min(x, width - 1))] ?? 0;
  if (x < 0 || y < 0 || x >= width || y >= height) return 0;
  return pixels[y * width + x] ?? 0;
};

export { readPixel };
