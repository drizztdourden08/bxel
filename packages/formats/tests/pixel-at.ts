/* @layer tests @kind helper */
import type { RgbaImage } from '@bxel/formats';

const pixelAt = (image: RgbaImage, x: number, y: number): number[] => {
  const from = (y * image.width + x) * 4;
  return Array.from(image.data.subarray(from, from + 4));
};

export { pixelAt };
