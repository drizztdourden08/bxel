/* @layer tests @kind helper */
import type { Box, RgbaImage } from '@bxel/formats';
import { pixelAt } from './pixel-at';

const uncoveredPixels = (image: RgbaImage, boxes: readonly Box[], extrude: number): number[][] => {
  const covered = new Set<number>();
  for (const box of boxes) {
    for (let y = box.y - extrude; y < box.y + box.height + extrude; y += 1) {
      for (let x = box.x - extrude; x < box.x + box.width + extrude; x += 1) {
        covered.add(y * image.width + x);
      }
    }
  }
  const rest: number[][] = [];
  for (let i = 0; i < image.width * image.height; i += 1) {
    if (!covered.has(i)) rest.push(pixelAt(image, i % image.width, Math.floor(i / image.width)));
  }
  return rest;
};

export { uncoveredPixels };
